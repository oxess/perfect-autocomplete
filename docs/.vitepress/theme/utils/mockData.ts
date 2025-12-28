import type { AutocompleteItem } from '../../../../src/utils/types'

export interface MockUser extends AutocompleteItem {
  email: string
  role: string
  avatar?: string
}

export interface MockProduct extends AutocompleteItem {
  category: string
  price: number
  image?: string
}

export interface MockCity extends AutocompleteItem {
  country: string
  population: number
}

export const mockUsers: MockUser[] = [
  { id: 1, label: 'Alice Johnson', value: 'alice', email: 'alice@example.com', role: 'Developer' },
  { id: 2, label: 'Bob Smith', value: 'bob', email: 'bob@example.com', role: 'Designer' },
  { id: 3, label: 'Carol Williams', value: 'carol', email: 'carol@example.com', role: 'Manager' },
  { id: 4, label: 'David Brown', value: 'david', email: 'david@example.com', role: 'Developer' },
  { id: 5, label: 'Emma Davis', value: 'emma', email: 'emma@example.com', role: 'QA Engineer' },
  { id: 6, label: 'Frank Miller', value: 'frank', email: 'frank@example.com', role: 'DevOps' },
  { id: 7, label: 'Grace Wilson', value: 'grace', email: 'grace@example.com', role: 'Product Owner' },
  { id: 8, label: 'Henry Taylor', value: 'henry', email: 'henry@example.com', role: 'Developer' },
  { id: 9, label: 'Ivy Anderson', value: 'ivy', email: 'ivy@example.com', role: 'Designer' },
  { id: 10, label: 'Jack Thomas', value: 'jack', email: 'jack@example.com', role: 'Developer' },
  { id: 11, label: 'Karen Martinez', value: 'karen', email: 'karen@example.com', role: 'Architect' },
  { id: 12, label: 'Leo Garcia', value: 'leo', email: 'leo@example.com', role: 'Developer' },
]

export const mockProducts: MockProduct[] = [
  { id: 1, label: 'MacBook Pro 16"', value: 'macbook-pro', category: 'Laptops', price: 2499 },
  { id: 2, label: 'iPhone 15 Pro', value: 'iphone-15', category: 'Phones', price: 999 },
  { id: 3, label: 'iPad Air', value: 'ipad-air', category: 'Tablets', price: 599 },
  { id: 4, label: 'AirPods Pro', value: 'airpods-pro', category: 'Audio', price: 249 },
  { id: 5, label: 'Apple Watch Ultra', value: 'watch-ultra', category: 'Wearables', price: 799 },
  { id: 6, label: 'Magic Keyboard', value: 'magic-keyboard', category: 'Accessories', price: 299 },
  { id: 7, label: 'Studio Display', value: 'studio-display', category: 'Monitors', price: 1599 },
  { id: 8, label: 'Mac Mini M2', value: 'mac-mini', category: 'Desktops', price: 599 },
  { id: 9, label: 'HomePod Mini', value: 'homepod-mini', category: 'Audio', price: 99 },
  { id: 10, label: 'Apple TV 4K', value: 'apple-tv', category: 'Streaming', price: 129 },
]

export const mockCities: MockCity[] = [
  { id: 1, label: 'New York', value: 'new-york', country: 'United States', population: 8336817 },
  { id: 2, label: 'Los Angeles', value: 'los-angeles', country: 'United States', population: 3979576 },
  { id: 3, label: 'London', value: 'london', country: 'United Kingdom', population: 8982000 },
  { id: 4, label: 'Paris', value: 'paris', country: 'France', population: 2161000 },
  { id: 5, label: 'Tokyo', value: 'tokyo', country: 'Japan', population: 13960000 },
  { id: 6, label: 'Berlin', value: 'berlin', country: 'Germany', population: 3645000 },
  { id: 7, label: 'Sydney', value: 'sydney', country: 'Australia', population: 5312000 },
  { id: 8, label: 'Toronto', value: 'toronto', country: 'Canada', population: 2731571 },
  { id: 9, label: 'Barcelona', value: 'barcelona', country: 'Spain', population: 1620343 },
  { id: 10, label: 'Amsterdam', value: 'amsterdam', country: 'Netherlands', population: 872680 },
  { id: 11, label: 'Singapore', value: 'singapore', country: 'Singapore', population: 5454000 },
  { id: 12, label: 'Dubai', value: 'dubai', country: 'UAE', population: 3331420 },
]

/**
 * Filter items by query (case-insensitive label match)
 */
export function filterByQuery<T extends AutocompleteItem>(
  items: T[],
  query: string,
  maxItems = 10
): T[] {
  if (!query) return items.slice(0, maxItems)

  const lowerQuery = query.toLowerCase()
  return items
    .filter(item => item.label.toLowerCase().includes(lowerQuery))
    .slice(0, maxItems)
}

/**
 * Create a mock API handler URL using data: URL
 * This allows the component to fetch from a "URL" that returns mock data
 */
export function createMockHandler<T extends AutocompleteItem>(
  items: T[],
  delay = 200
): (query: string) => Promise<T[]> {
  return async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    return filterByQuery(items, query)
  }
}
