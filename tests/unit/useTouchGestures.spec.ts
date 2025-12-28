import { describe, it, expect, vi } from 'vitest'
import { useTouchGestures } from '@/composables/useTouchGestures'

describe('useTouchGestures', () => {
  function createTouchEvent(
    type: 'touchstart' | 'touchmove' | 'touchend',
    clientX: number,
    clientY: number
  ): TouchEvent {
    const touch = {
      clientX,
      clientY,
      identifier: 0,
      target: document.body,
      screenX: clientX,
      screenY: clientY,
      pageX: clientX,
      pageY: clientY,
      radiusX: 0,
      radiusY: 0,
      rotationAngle: 0,
      force: 0
    } as Touch

    return {
      type,
      touches: type === 'touchend' ? [] : [touch],
      changedTouches: [touch],
      targetTouches: type === 'touchend' ? [] : [touch],
      cancelable: true,
      preventDefault: vi.fn()
    } as unknown as TouchEvent
  }

  describe('swipe detection', () => {
    it('should detect swipe down', () => {
      const onSwipeDown = vi.fn()
      const { handleTouchStart, handleTouchEnd } = useTouchGestures({
        onSwipeDown,
        threshold: 50,
        maxTime: 500
      })

      const startEvent = createTouchEvent('touchstart', 100, 100)
      handleTouchStart(startEvent)

      // Simulate quick swipe (within maxTime)
      const endEvent = createTouchEvent('touchend', 100, 200)
      handleTouchEnd(endEvent)

      expect(onSwipeDown).toHaveBeenCalled()
    })

    it('should detect swipe up', () => {
      const onSwipeUp = vi.fn()
      const { handleTouchStart, handleTouchEnd } = useTouchGestures({
        onSwipeUp,
        threshold: 50,
        maxTime: 500
      })

      const startEvent = createTouchEvent('touchstart', 100, 200)
      handleTouchStart(startEvent)

      const endEvent = createTouchEvent('touchend', 100, 100)
      handleTouchEnd(endEvent)

      expect(onSwipeUp).toHaveBeenCalled()
    })

    it('should detect swipe left', () => {
      const onSwipeLeft = vi.fn()
      const { handleTouchStart, handleTouchEnd } = useTouchGestures({
        onSwipeLeft,
        threshold: 50,
        maxTime: 500
      })

      const startEvent = createTouchEvent('touchstart', 200, 100)
      handleTouchStart(startEvent)

      const endEvent = createTouchEvent('touchend', 100, 100)
      handleTouchEnd(endEvent)

      expect(onSwipeLeft).toHaveBeenCalled()
    })

    it('should detect swipe right', () => {
      const onSwipeRight = vi.fn()
      const { handleTouchStart, handleTouchEnd } = useTouchGestures({
        onSwipeRight,
        threshold: 50,
        maxTime: 500
      })

      const startEvent = createTouchEvent('touchstart', 100, 100)
      handleTouchStart(startEvent)

      const endEvent = createTouchEvent('touchend', 200, 100)
      handleTouchEnd(endEvent)

      expect(onSwipeRight).toHaveBeenCalled()
    })

    it('should not trigger swipe if distance is below threshold', () => {
      const onSwipeDown = vi.fn()
      const { handleTouchStart, handleTouchEnd } = useTouchGestures({
        onSwipeDown,
        threshold: 50,
        maxTime: 500
      })

      const startEvent = createTouchEvent('touchstart', 100, 100)
      handleTouchStart(startEvent)

      // Move only 30px (below threshold)
      const endEvent = createTouchEvent('touchend', 100, 130)
      handleTouchEnd(endEvent)

      expect(onSwipeDown).not.toHaveBeenCalled()
    })

    it('should not trigger swipe if time exceeds maxTime', async () => {
      vi.useFakeTimers()

      const onSwipeDown = vi.fn()
      const { handleTouchStart, handleTouchEnd } = useTouchGestures({
        onSwipeDown,
        threshold: 50,
        maxTime: 300
      })

      const startEvent = createTouchEvent('touchstart', 100, 100)
      handleTouchStart(startEvent)

      // Wait longer than maxTime
      vi.advanceTimersByTime(400)

      const endEvent = createTouchEvent('touchend', 100, 200)
      handleTouchEnd(endEvent)

      expect(onSwipeDown).not.toHaveBeenCalled()

      vi.useRealTimers()
    })
  })

  describe('touch state', () => {
    it('should track isTouching state', () => {
      const { handleTouchStart, handleTouchEnd, isTouching } = useTouchGestures({})

      expect(isTouching.value).toBe(false)

      const startEvent = createTouchEvent('touchstart', 100, 100)
      handleTouchStart(startEvent)
      expect(isTouching.value).toBe(true)

      const endEvent = createTouchEvent('touchend', 100, 100)
      handleTouchEnd(endEvent)
      expect(isTouching.value).toBe(false)
    })
  })
})
