import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useKeyboardNavigation } from '@/composables/useKeyboardNavigation'

describe('useKeyboardNavigation', () => {
  function createMockOptions(overrides = {}) {
    return {
      items: ref(['item1', 'item2', 'item3']),
      highlightedIndex: ref(-1),
      isOpen: ref(true),
      onSelect: vi.fn(),
      onClose: vi.fn(),
      onOpen: vi.fn(),
      ...overrides
    }
  }

  function createKeyboardEvent(key: string): KeyboardEvent {
    return new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  }

  describe('getKeyAction', () => {
    it('should return correct actions for keys', () => {
      const options = createMockOptions()
      const { getKeyAction } = useKeyboardNavigation(options)

      expect(getKeyAction('ArrowDown')).toBe('next')
      expect(getKeyAction('ArrowUp')).toBe('previous')
      expect(getKeyAction('Home')).toBe('first')
      expect(getKeyAction('End')).toBe('last')
      expect(getKeyAction('Enter')).toBe('select')
      expect(getKeyAction('Escape')).toBe('close')
      expect(getKeyAction('a')).toBe('none')
    })
  })

  describe('navigation', () => {
    it('should navigate to next item', () => {
      const options = createMockOptions()
      options.highlightedIndex.value = 0
      const { navigateNext } = useKeyboardNavigation(options)

      navigateNext()
      expect(options.highlightedIndex.value).toBe(1)
    })

    it('should navigate to previous item', () => {
      const options = createMockOptions()
      options.highlightedIndex.value = 2
      const { navigatePrevious } = useKeyboardNavigation(options)

      navigatePrevious()
      expect(options.highlightedIndex.value).toBe(1)
    })

    it('should wrap to first item when at end', () => {
      const options = createMockOptions()
      options.highlightedIndex.value = 2
      const { navigateNext } = useKeyboardNavigation(options)

      navigateNext()
      expect(options.highlightedIndex.value).toBe(0)
    })

    it('should wrap to last item when at beginning', () => {
      const options = createMockOptions()
      options.highlightedIndex.value = 0
      const { navigatePrevious } = useKeyboardNavigation(options)

      navigatePrevious()
      expect(options.highlightedIndex.value).toBe(2)
    })

    it('should not wrap when wrap is false', () => {
      const options = createMockOptions()
      options.highlightedIndex.value = 2
      const { navigateNext } = useKeyboardNavigation({ ...options, wrap: false })

      navigateNext()
      expect(options.highlightedIndex.value).toBe(2)
    })

    it('should navigate to first item', () => {
      const options = createMockOptions()
      options.highlightedIndex.value = 2
      const { navigateFirst } = useKeyboardNavigation(options)

      navigateFirst()
      expect(options.highlightedIndex.value).toBe(0)
    })

    it('should navigate to last item', () => {
      const options = createMockOptions()
      options.highlightedIndex.value = 0
      const { navigateLast } = useKeyboardNavigation(options)

      navigateLast()
      expect(options.highlightedIndex.value).toBe(2)
    })
  })

  describe('selection', () => {
    it('should select current item', () => {
      const options = createMockOptions()
      options.highlightedIndex.value = 1
      const { selectCurrent } = useKeyboardNavigation(options)

      selectCurrent()
      expect(options.onSelect).toHaveBeenCalledWith('item2', 1)
    })

    it('should not select if no item is highlighted', () => {
      const options = createMockOptions()
      options.highlightedIndex.value = -1
      const { selectCurrent } = useKeyboardNavigation(options)

      selectCurrent()
      expect(options.onSelect).not.toHaveBeenCalled()
    })
  })

  describe('handleKeyDown', () => {
    it('should handle ArrowDown', () => {
      const options = createMockOptions()
      options.highlightedIndex.value = 0
      const { handleKeyDown } = useKeyboardNavigation(options)

      const event = createKeyboardEvent('ArrowDown')
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      handleKeyDown(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
      expect(options.highlightedIndex.value).toBe(1)
    })

    it('should handle Enter to select', () => {
      const options = createMockOptions()
      options.highlightedIndex.value = 1
      const { handleKeyDown } = useKeyboardNavigation(options)

      const event = createKeyboardEvent('Enter')
      handleKeyDown(event)

      expect(options.onSelect).toHaveBeenCalledWith('item2', 1)
    })

    it('should handle Escape to close', () => {
      const options = createMockOptions()
      const { handleKeyDown } = useKeyboardNavigation(options)

      const event = createKeyboardEvent('Escape')
      handleKeyDown(event)

      expect(options.onClose).toHaveBeenCalled()
    })

    it('should close on Tab', () => {
      const options = createMockOptions()
      const { handleKeyDown } = useKeyboardNavigation(options)

      const event = createKeyboardEvent('Tab')
      handleKeyDown(event)

      expect(options.onClose).toHaveBeenCalled()
    })

    it('should open dropdown on ArrowDown when closed', () => {
      const options = createMockOptions()
      options.isOpen.value = false
      const { handleKeyDown } = useKeyboardNavigation(options)

      const event = createKeyboardEvent('ArrowDown')
      handleKeyDown(event)

      expect(options.onOpen).toHaveBeenCalled()
    })

    it('should not navigate when dropdown is closed', () => {
      const options = createMockOptions()
      options.isOpen.value = false
      options.highlightedIndex.value = 0
      const { handleKeyDown } = useKeyboardNavigation(options)

      const event = createKeyboardEvent('ArrowUp')
      handleKeyDown(event)

      expect(options.highlightedIndex.value).toBe(0)
    })
  })
})
