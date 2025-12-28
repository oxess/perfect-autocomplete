import { type Ref } from 'vue'
import type { KeyboardAction } from '@/utils/types'

export interface UseKeyboardNavigationOptions {
  /** List of items */
  items: Ref<unknown[]>
  /** Currently highlighted index */
  highlightedIndex: Ref<number>
  /** Whether dropdown is open */
  isOpen: Ref<boolean>
  /** Callback when item is selected */
  onSelect: (item: unknown, index: number) => void
  /** Callback when dropdown should close */
  onClose: () => void
  /** Callback when dropdown should open */
  onOpen?: () => void
  /** Whether to wrap around at edges */
  wrap?: boolean
}

export interface UseKeyboardNavigationReturn {
  /** Handle keydown event */
  handleKeyDown: (event: KeyboardEvent) => void
  /** Navigate to next item */
  navigateNext: () => void
  /** Navigate to previous item */
  navigatePrevious: () => void
  /** Navigate to first item */
  navigateFirst: () => void
  /** Navigate to last item */
  navigateLast: () => void
  /** Select current item */
  selectCurrent: () => void
  /** Get action for a key */
  getKeyAction: (key: string) => KeyboardAction
}

/**
 * Composable for handling keyboard navigation in dropdown
 */
export function useKeyboardNavigation(
  options: UseKeyboardNavigationOptions
): UseKeyboardNavigationReturn {
  const {
    items,
    highlightedIndex,
    isOpen,
    onSelect,
    onClose,
    onOpen,
    wrap = true
  } = options

  /**
   * Map keyboard key to action
   */
  function getKeyAction(key: string): KeyboardAction {
    switch (key) {
      case 'ArrowDown':
        return 'next'
      case 'ArrowUp':
        return 'previous'
      case 'Home':
        return 'first'
      case 'End':
        return 'last'
      case 'Enter':
        return 'select'
      case 'Escape':
        return 'close'
      default:
        return 'none'
    }
  }

  /**
   * Navigate to next item
   */
  function navigateNext() {
    if (items.value.length === 0) return

    if (highlightedIndex.value < items.value.length - 1) {
      highlightedIndex.value++
    } else if (wrap) {
      highlightedIndex.value = 0
    }
  }

  /**
   * Navigate to previous item
   */
  function navigatePrevious() {
    if (items.value.length === 0) return

    if (highlightedIndex.value > 0) {
      highlightedIndex.value--
    } else if (wrap) {
      highlightedIndex.value = items.value.length - 1
    }
  }

  /**
   * Navigate to first item
   */
  function navigateFirst() {
    if (items.value.length === 0) return
    highlightedIndex.value = 0
  }

  /**
   * Navigate to last item
   */
  function navigateLast() {
    if (items.value.length === 0) return
    highlightedIndex.value = items.value.length - 1
  }

  /**
   * Select currently highlighted item
   */
  function selectCurrent() {
    const index = highlightedIndex.value
    if (index >= 0 && index < items.value.length) {
      const item = items.value[index]
      if (item !== undefined) {
        onSelect(item, index)
      }
    }
  }

  /**
   * Handle keydown event
   */
  function handleKeyDown(event: KeyboardEvent) {
    const action = getKeyAction(event.key)

    // If dropdown is closed, only arrow down should open it
    if (!isOpen.value) {
      if (action === 'next' && onOpen) {
        event.preventDefault()
        onOpen()
      }
      return
    }

    switch (action) {
      case 'next':
        event.preventDefault()
        navigateNext()
        break

      case 'previous':
        event.preventDefault()
        navigatePrevious()
        break

      case 'first':
        event.preventDefault()
        navigateFirst()
        break

      case 'last':
        event.preventDefault()
        navigateLast()
        break

      case 'select':
        if (highlightedIndex.value >= 0) {
          event.preventDefault()
          selectCurrent()
        }
        break

      case 'close':
        event.preventDefault()
        onClose()
        break

      case 'none':
        // Tab key - allow natural focus movement but close dropdown
        if (event.key === 'Tab') {
          onClose()
        }
        break
    }
  }

  return {
    handleKeyDown,
    navigateNext,
    navigatePrevious,
    navigateFirst,
    navigateLast,
    selectCurrent,
    getKeyAction
  }
}
