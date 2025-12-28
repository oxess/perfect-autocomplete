import { ref, onUnmounted, type Ref, type MaybeRefOrGetter, toValue } from 'vue'
import type { AutocompleteItem, FetchFunction } from '@/utils/types'

export interface UseFetchOptions {
  /** API endpoint URL */
  url: MaybeRefOrGetter<string>
  /** Query parameter name */
  queryParam?: string
  /** Minimum characters before fetching */
  minChars?: number
  /** Maximum retry attempts */
  maxRetries?: number
  /** Cache TTL in milliseconds */
  cacheTtl?: number
  /** Custom fetch function (overrides url) */
  fetchFn?: FetchFunction
  /** Transform response data */
  transformResponse?: (data: unknown) => AutocompleteItem[]
}

export interface UseFetchReturn {
  /** Fetched items */
  items: Ref<AutocompleteItem[]>
  /** Loading state */
  isLoading: Ref<boolean>
  /** Error state */
  error: Ref<Error | null>
  /** Fetch data for a query */
  fetch: (query: string) => Promise<void>
  /** Abort current request */
  abort: () => void
  /** Clear cache */
  clearCache: () => void
}

interface CacheEntry {
  data: AutocompleteItem[]
  timestamp: number
}

/**
 * Composable for fetching autocomplete data with caching and retry
 */
export function useFetch(options: UseFetchOptions): UseFetchReturn {
  const {
    url,
    queryParam = 'q',
    minChars = 2,
    maxRetries = 3,
    cacheTtl = 5 * 60 * 1000, // 5 minutes
    fetchFn,
    transformResponse = (data) => data as AutocompleteItem[]
  } = options

  const items = ref<AutocompleteItem[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  let abortController: AbortController | null = null
  const cache = new Map<string, CacheEntry>()

  /**
   * Get cached data if still valid
   */
  function getCached(query: string): AutocompleteItem[] | null {
    const entry = cache.get(query)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > cacheTtl
    if (isExpired) {
      cache.delete(query)
      return null
    }

    return entry.data
  }

  /**
   * Set cache entry
   */
  function setCache(query: string, data: AutocompleteItem[]): void {
    cache.set(query, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * Clear all cached data
   */
  function clearCache(): void {
    cache.clear()
  }

  /**
   * Abort current request
   */
  function abort(): void {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  /**
   * Calculate exponential backoff delay
   */
  function getBackoffDelay(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 10000)
  }

  /**
   * Check if error is retryable
   */
  function isRetryable(err: unknown): boolean {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return false
    }
    if (err instanceof TypeError) {
      // Network error
      return true
    }
    return false
  }

  /**
   * Delay execution
   */
  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Fetch data for a query
   */
  async function fetchData(query: string): Promise<void> {
    // Check minimum characters
    if (query.length < minChars) {
      items.value = []
      return
    }

    // Check cache first
    const cached = getCached(query)
    if (cached) {
      items.value = cached
      return
    }

    // Abort previous request
    abort()

    // Create new abort controller
    abortController = new AbortController()
    const signal = abortController.signal

    isLoading.value = true
    error.value = null

    let attempt = 0

    while (attempt <= maxRetries) {
      try {
        let result: AutocompleteItem[]

        if (fetchFn) {
          // Use custom fetch function
          result = await fetchFn(query, signal)
        } else {
          // Build URL with query parameter
          const baseUrl = toValue(url)
          const urlObj = new URL(baseUrl, window.location.origin)
          urlObj.searchParams.set(queryParam, query)

          const response = await fetch(urlObj.toString(), {
            signal,
            headers: {
              'Accept': 'application/json'
            }
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const data = await response.json()
          result = transformResponse(data)
        }

        // Success - cache and update
        setCache(query, result)
        items.value = result
        error.value = null
        break

      } catch (err) {
        // Handle abort
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Request was aborted, don't update state
          return
        }

        // Handle retryable errors
        if (attempt < maxRetries && isRetryable(err)) {
          attempt++
          await delay(getBackoffDelay(attempt))
          continue
        }

        // Non-retryable or max retries reached
        error.value = err instanceof Error ? err : new Error(String(err))
        items.value = []
        break
      }
    }

    isLoading.value = false
  }

  // Cleanup on unmount
  onUnmounted(() => {
    abort()
  })

  return {
    items,
    isLoading,
    error,
    fetch: fetchData,
    abort,
    clearCache
  }
}

/**
 * Create a debounced fetch composable
 */
export function useDebouncedFetch(
  options: UseFetchOptions,
  debounceMs: number = 300
) {
  const fetchState = useFetch(options)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debouncedFetch = (query: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fetchState.fetch(query)
      timeoutId = null
    }, debounceMs)
  }

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    fetchState.abort()
  }

  onUnmounted(cancel)

  return {
    ...fetchState,
    debouncedFetch,
    cancel
  }
}
