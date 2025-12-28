import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useDebounce, useDebounceFn } from '@/composables/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with the source value', () => {
    const source = ref('initial')
    const { debouncedValue } = useDebounce(() => source.value, { delay: 300 })

    expect(debouncedValue.value).toBe('initial')
  })

  it('should debounce value changes', async () => {
    const source = ref('initial')
    const { debouncedValue } = useDebounce(() => source.value, { delay: 300 })

    source.value = 'updated'
    await nextTick()

    // Value should not have changed yet
    expect(debouncedValue.value).toBe('initial')

    // Advance time partially
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(debouncedValue.value).toBe('initial')

    // Advance time to complete debounce
    vi.advanceTimersByTime(100)
    await nextTick()
    expect(debouncedValue.value).toBe('updated')
  })

  it('should reset timer on rapid changes', async () => {
    const source = ref('a')
    const { debouncedValue } = useDebounce(() => source.value, { delay: 300 })

    source.value = 'b'
    await nextTick()
    vi.advanceTimersByTime(200)

    source.value = 'c'
    await nextTick()
    vi.advanceTimersByTime(200)

    source.value = 'd'
    await nextTick()
    vi.advanceTimersByTime(300)

    await nextTick()
    expect(debouncedValue.value).toBe('d')
  })

  it('should track pending state', async () => {
    const source = ref('initial')
    const { isPending } = useDebounce(() => source.value, { delay: 300 })

    expect(isPending.value).toBe(false)

    source.value = 'updated'
    await nextTick()
    expect(isPending.value).toBe(true)

    vi.advanceTimersByTime(300)
    await nextTick()
    expect(isPending.value).toBe(false)
  })

  it('should cancel pending debounce', async () => {
    const source = ref('initial')
    const { debouncedValue, cancel, isPending } = useDebounce(() => source.value, { delay: 300 })

    source.value = 'updated'
    await nextTick()
    expect(isPending.value).toBe(true)

    cancel()
    expect(isPending.value).toBe(false)

    vi.advanceTimersByTime(300)
    await nextTick()
    // Value should remain 'initial' because we cancelled
    expect(debouncedValue.value).toBe('initial')
  })

  it('should flush immediately', async () => {
    const source = ref('initial')
    const { debouncedValue, flush } = useDebounce(() => source.value, { delay: 300 })

    source.value = 'updated'
    await nextTick()

    flush()
    expect(debouncedValue.value).toBe('updated')
  })

  it('should execute immediately on first call when immediate option is true', async () => {
    const source = ref('initial')
    const { debouncedValue } = useDebounce(() => source.value, {
      delay: 300,
      immediate: true
    })

    expect(debouncedValue.value).toBe('initial')

    source.value = 'updated'
    await nextTick()

    // Should update immediately on first change
    expect(debouncedValue.value).toBe('updated')

    // Subsequent changes should be debounced
    source.value = 'third'
    await nextTick()
    expect(debouncedValue.value).toBe('updated')

    vi.advanceTimersByTime(300)
    await nextTick()
    expect(debouncedValue.value).toBe('third')
  })
})

describe('useDebounceFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should debounce function calls', () => {
    const fn = vi.fn()
    const { debouncedFn } = useDebounceFn(fn, 300)

    debouncedFn('arg1')
    debouncedFn('arg2')
    debouncedFn('arg3')

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('arg3')
  })

  it('should cancel pending function call', () => {
    const fn = vi.fn()
    const { debouncedFn, cancel } = useDebounceFn(fn, 300)

    debouncedFn('arg')
    cancel()

    vi.advanceTimersByTime(300)

    expect(fn).not.toHaveBeenCalled()
  })
})
