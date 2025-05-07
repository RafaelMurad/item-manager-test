import { Item } from './item'

interface PaginationMeta {
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
}

export interface ApiResponse {
    items: Item[]
    meta: PaginationMeta
}

export interface ApiErrorResponse {
    error: {
        code: string
        message: string
        details?: string
    }
}