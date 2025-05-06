import { http, HttpResponse } from 'msw'
import data from './data.json'
import { Item } from '../types/item'

export const handlers = [
  http.get('/api/items', () => {
    console.log('[MSW] Intercepted request to /api/items');
    const items = data.items as Item[]
    console.log('[MSW] All items from data.json:', items);
    return HttpResponse.json(items)
  }),
]