import { http, HttpResponse } from 'msw'
import data from './data.json'
import { Item } from '../types/item'

export const handlers = [
  // Get all items
  http.get('/api/items', () => {
    const items = data.items as Item[]
    return HttpResponse.json(items)
  }),
]