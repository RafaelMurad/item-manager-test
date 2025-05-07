import { http, HttpResponse, type HttpHandler } from 'msw'
import data from './data.json'
import { Item } from '../types/item'
import type { ApiResponse, ApiErrorResponse } from '../types/api'

// Utility functions for better separation of concerns
const DEFAULT_LIMIT = 5
const MAX_LIMIT = 100
const DEFAULT_PAGE = 1

const parseNumericParam = (value: string | null, defaultValue: number, min: number, max: number): number => {
  const numericValue = Number(value || defaultValue)
  return Math.min(Math.max(numericValue, min), max)
}

const extractPriceValue = (price: string): number => {
  const numericString = price.replace(/[^\d.-]/g, '')
  const value = parseFloat(numericString)
  return isFinite(value) ? value : 0
}

interface PriceFilter {
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq'
  value: number
  originalTerm: string
}

interface SearchQuery {
  textTerms: string[]
  priceFilters: PriceFilter[]
}

const parseSearchQuery = (query: string): SearchQuery => {
  const textTerms: string[] = []
  const priceFilters: PriceFilter[] = []

  const terms = query.split(/\s+/).filter(term => term.length > 0)

  terms.forEach(term => {
    const pricePattern = /^(>=|<=|>|<|=)?(\d+\.?\d*)$/
    const match = term.match(pricePattern)

    if (match) {
      const [, operator, value] = match
      const numericValue = parseFloat(value)

      if (!isNaN(numericValue)) {
        const opMap: Record<string, PriceFilter['operator']> = {
          '>': 'gt',
          '<': 'lt',
          '>=': 'gte',
          '<=': 'lte',
          '=': 'eq',
          '': 'eq' // Default to equals if no operator
        }

        priceFilters.push({
          operator: opMap[operator || ''],
          value: numericValue,
          originalTerm: term
        })
        return
      }
    }

    textTerms.push(term.toLowerCase())
  })

  return { textTerms, priceFilters }
}

const matchesTextSearch = (item: Item, terms: string[]): boolean => {
  if (terms.length === 0) return true

  const searchableText = [
    item.title.toLowerCase(),
    item.description.toLowerCase(),
    item.email.toLowerCase()
  ].join(' ')

  return terms.every(term => searchableText.includes(term))
}

const matchesPriceFilters = (item: Item, filters: PriceFilter[]): boolean => {
  if (filters.length === 0) return true

  const itemPrice = extractPriceValue(item.price)

  return filters.every(filter => {
    switch (filter.operator) {
      case 'gt': return itemPrice > filter.value
      case 'lt': return itemPrice < filter.value
      case 'gte': return itemPrice >= filter.value
      case 'lte': return itemPrice <= filter.value
      case 'eq': return Math.abs(itemPrice - filter.value) < 0.01
      default: return false // Invalid operators fail the filter
    }
  })
}

export const handlers: HttpHandler[] = [
  http.get('*/api/items', ({ request }) => {
    try {
      const url = new URL(request.url)

      // Validate and parse parameters
      const query = url.searchParams.get('query')?.trim().toLowerCase() || ''
      const page = parseNumericParam(url.searchParams.get('page'), DEFAULT_PAGE, 1, Infinity)
      const limit = parseNumericParam(url.searchParams.get('limit'), DEFAULT_LIMIT, 1, MAX_LIMIT)

      // Parse search components
      const { textTerms, priceFilters } = parseSearchQuery(query)

      // Filter items
      const filteredItems = (data.items as Item[]).filter(item =>
        matchesTextSearch(item, textTerms) &&
        matchesPriceFilters(item, priceFilters)
      )

      // Pagination calculations
      const totalItems = filteredItems.length
      const totalPages = Math.ceil(totalItems / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedItems = filteredItems.slice(startIndex, endIndex)

      // Build response
      const response: ApiResponse = {
        items: paginatedItems,
        meta: {
          total: totalItems,
          page,
          limit,
          totalPages,
          hasMore: endIndex < totalItems
        }
      }

      return HttpResponse.json(response)
    } catch (error) {
      const errorResponse: ApiErrorResponse = {
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to process request',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      }
      return HttpResponse.json(errorResponse, { status: 500 })
    }
  })
]