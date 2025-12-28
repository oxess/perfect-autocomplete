import { ref, onUnmounted } from 'vue'
import type { SwipeDirection } from '@/utils/types'

export interface UseTouchGesturesOptions {
  /** Callback when swiped down */
  onSwipeDown?: () => void
  /** Callback when swiped up */
  onSwipeUp?: () => void
  /** Callback when swiped left */
  onSwipeLeft?: () => void
  /** Callback when swiped right */
  onSwipeRight?: () => void
  /** Minimum distance for swipe detection in pixels */
  threshold?: number
  /** Maximum time for swipe in milliseconds */
  maxTime?: number
}

export interface UseTouchGesturesReturn {
  /** Handle touch start */
  handleTouchStart: (event: TouchEvent) => void
  /** Handle touch move */
  handleTouchMove: (event: TouchEvent) => void
  /** Handle touch end */
  handleTouchEnd: (event: TouchEvent) => void
  /** Whether user is currently touching */
  isTouching: typeof isTouching
  /** Current swipe direction (if any) */
  currentDirection: typeof currentDirection
}

const isTouching = ref(false)
const currentDirection = ref<SwipeDirection | null>(null)

/**
 * Composable for handling touch gestures
 */
export function useTouchGestures(
  options: UseTouchGesturesOptions = {}
): UseTouchGesturesReturn {
  const {
    onSwipeDown,
    onSwipeUp,
    onSwipeLeft,
    onSwipeRight,
    threshold = 50,
    maxTime = 300
  } = options

  let startX = 0
  let startY = 0
  let startTime = 0

  /**
   * Calculate swipe direction based on delta
   */
  function getSwipeDirection(deltaX: number, deltaY: number): SwipeDirection | null {
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    // Determine primary direction
    if (absX > absY) {
      if (absX >= threshold) {
        return deltaX > 0 ? 'right' : 'left'
      }
    } else {
      if (absY >= threshold) {
        return deltaY > 0 ? 'down' : 'up'
      }
    }

    return null
  }

  /**
   * Handle touch start event
   */
  function handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0]
    if (!touch) return

    startX = touch.clientX
    startY = touch.clientY
    startTime = Date.now()
    isTouching.value = true
    currentDirection.value = null
  }

  /**
   * Handle touch move event
   */
  function handleTouchMove(event: TouchEvent) {
    if (!isTouching.value) return

    const touch = event.touches[0]
    if (!touch) return

    const deltaX = touch.clientX - startX
    const deltaY = touch.clientY - startY

    // Update current direction for visual feedback
    currentDirection.value = getSwipeDirection(deltaX, deltaY)

    // Prevent scrolling if we're swiping in a handled direction
    if (currentDirection.value) {
      const hasHandler =
        (currentDirection.value === 'down' && onSwipeDown) ||
        (currentDirection.value === 'up' && onSwipeUp) ||
        (currentDirection.value === 'left' && onSwipeLeft) ||
        (currentDirection.value === 'right' && onSwipeRight)

      if (hasHandler && event.cancelable) {
        event.preventDefault()
      }
    }
  }

  /**
   * Handle touch end event
   */
  function handleTouchEnd(event: TouchEvent) {
    if (!isTouching.value) return

    isTouching.value = false

    const touch = event.changedTouches[0]
    if (!touch) return

    const deltaX = touch.clientX - startX
    const deltaY = touch.clientY - startY
    const deltaTime = Date.now() - startTime

    // Only trigger if gesture was quick enough
    if (deltaTime > maxTime) {
      currentDirection.value = null
      return
    }

    const direction = getSwipeDirection(deltaX, deltaY)
    currentDirection.value = null

    switch (direction) {
      case 'down':
        onSwipeDown?.()
        break
      case 'up':
        onSwipeUp?.()
        break
      case 'left':
        onSwipeLeft?.()
        break
      case 'right':
        onSwipeRight?.()
        break
    }
  }

  onUnmounted(() => {
    isTouching.value = false
    currentDirection.value = null
  })

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isTouching,
    currentDirection
  }
}
