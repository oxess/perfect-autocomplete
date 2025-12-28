import { ref, watch, onUnmounted, type Ref, type MaybeRefOrGetter, toValue } from 'vue'

export interface UseDebounceOptions {
  /** Delay in milliseconds */
  delay: number
  /** Immediate execution on first call */
  immediate?: boolean
}

export interface UseDebounceReturn<T> {
  /** Debounced value */
  debouncedValue: Ref<T>
  /** Cancel pending debounce */
  cancel: () => void
  /** Flush immediately */
  flush: () => void
  /** Whether a debounce is pending */
  isPending: Ref<boolean>
}

/**
 * Debounce a reactive value
 */
export function useDebounce<T>(
  source: MaybeRefOrGetter<T>,
  options: UseDebounceOptions
): UseDebounceReturn<T> {
  const { delay, immediate = false } = options

  const initialValue = toValue(source)
  const debouncedValue = ref<T>(initialValue) as Ref<T>
  const isPending = ref(false)
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let latestValue: T = initialValue
  let isFirstChange = true
  let previousValue: T = initialValue

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
      isPending.value = false
    }
  }

  const flush = () => {
    cancel()
    debouncedValue.value = latestValue
  }

  watch(
    () => toValue(source),
    (newValue) => {
      // Skip if value hasn't actually changed
      if (newValue === previousValue) {
        return
      }

      previousValue = newValue
      latestValue = newValue
      cancel()

      // Immediate execution on first actual change if option is set
      if (immediate && isFirstChange) {
        isFirstChange = false
        debouncedValue.value = newValue
        return
      }

      isFirstChange = false
      isPending.value = true

      timeoutId = setTimeout(() => {
        debouncedValue.value = latestValue
        isPending.value = false
        timeoutId = null
      }, delay)
    },
    { immediate: true }
  )

  onUnmounted(cancel)

  return {
    debouncedValue,
    cancel,
    flush,
    isPending
  }
}

/**
 * Create a debounced function
 */
export function useDebounceFn<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): { debouncedFn: (...args: Parameters<T>) => void; cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const debouncedFn = (...args: Parameters<T>) => {
    cancel()
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }

  onUnmounted(cancel)

  return { debouncedFn, cancel }
}
