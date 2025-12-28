import { computed, watch, onMounted, onUnmounted, type Ref } from 'vue'

export interface UseAriaOptions {
  /** Input element reference */
  inputElement: Ref<HTMLInputElement | null>
  /** Whether dropdown is open */
  isOpen: Ref<boolean>
  /** List of items */
  items: Ref<unknown[]>
  /** Currently highlighted index */
  highlightedIndex: Ref<number>
  /** Whether loading */
  isLoading: Ref<boolean>
  /** Custom listbox ID */
  listboxId?: string
}

export interface UseAriaReturn {
  /** ID for the listbox element */
  listboxId: string
  /** ID for the live region */
  liveRegionId: string
  /** Get ARIA attributes for input */
  inputAriaAttrs: Ref<Record<string, string>>
  /** Get ARIA attributes for listbox */
  listboxAriaAttrs: Ref<Record<string, string>>
  /** Get ARIA attributes for an item */
  getItemAriaAttrs: (index: number) => Record<string, string>
  /** Generate unique item ID */
  getItemId: (index: number) => string
  /** Announce message to screen readers */
  announce: (message: string, priority?: 'polite' | 'assertive') => void
  /** Create live region element */
  createLiveRegion: () => HTMLElement
  /** Remove live region element */
  removeLiveRegion: () => void
}

/**
 * Composable for managing ARIA attributes for accessible autocomplete
 * Implements WAI-ARIA Combobox pattern
 */
export function useAria(options: UseAriaOptions): UseAriaReturn {
  const {
    inputElement,
    isOpen,
    items,
    highlightedIndex,
    isLoading,
    listboxId: customListboxId
  } = options

  // Generate unique IDs
  const uniqueId = Math.random().toString(36).slice(2, 9)
  const listboxId = customListboxId || `pac-listbox-${uniqueId}`
  const liveRegionId = `pac-live-${uniqueId}`

  let liveRegion: HTMLElement | null = null

  /**
   * Get unique ID for an item
   */
  function getItemId(index: number): string {
    return `${listboxId}-option-${index}`
  }

  /**
   * Computed ARIA attributes for input element
   */
  const inputAriaAttrs = computed(() => {
    const attrs: Record<string, string> = {
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-haspopup': 'listbox',
      'aria-expanded': String(isOpen.value),
      'aria-controls': listboxId
    }

    // Set aria-activedescendant when an item is highlighted
    if (isOpen.value && highlightedIndex.value >= 0) {
      attrs['aria-activedescendant'] = getItemId(highlightedIndex.value)
    }

    // Add busy state during loading
    if (isLoading.value) {
      attrs['aria-busy'] = 'true'
    }

    return attrs
  })

  /**
   * Computed ARIA attributes for listbox element
   */
  const listboxAriaAttrs = computed(() => ({
    role: 'listbox',
    id: listboxId,
    'aria-label': 'Suggestions'
  }))

  /**
   * Get ARIA attributes for an individual item
   */
  function getItemAriaAttrs(index: number): Record<string, string> {
    return {
      role: 'option',
      id: getItemId(index),
      'aria-selected': String(index === highlightedIndex.value)
    }
  }

  /**
   * Create a live region for screen reader announcements
   */
  function createLiveRegion(): HTMLElement {
    if (liveRegion) return liveRegion

    liveRegion = document.createElement('div')
    liveRegion.id = liveRegionId
    liveRegion.setAttribute('role', 'status')
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'pac-sr-only'

    // Visually hidden but accessible to screen readers
    Object.assign(liveRegion.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0'
    })

    document.body.appendChild(liveRegion)
    return liveRegion
  }

  /**
   * Remove the live region from DOM
   */
  function removeLiveRegion(): void {
    if (liveRegion) {
      liveRegion.remove()
      liveRegion = null
    }
  }

  /**
   * Announce a message to screen readers
   */
  function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const region = liveRegion || createLiveRegion()
    region.setAttribute('aria-live', priority)

    // Clear and set message (needed for some screen readers to re-announce)
    region.textContent = ''
    requestAnimationFrame(() => {
      region.textContent = message
    })
  }

  /**
   * Apply ARIA attributes to input element
   */
  function updateInputAria(): void {
    if (!inputElement.value) return

    const attrs = inputAriaAttrs.value
    Object.entries(attrs).forEach(([key, value]) => {
      inputElement.value?.setAttribute(key, value)
    })
  }

  // Watch for changes and update input ARIA attributes
  watch(
    [inputAriaAttrs, inputElement],
    () => {
      updateInputAria()
    },
    { immediate: true }
  )

  // Announce results when items change
  watch(
    [items, isLoading],
    ([newItems, loading]) => {
      if (loading) {
        announce('Loading suggestions...')
        return
      }

      const count = newItems.length
      if (count === 0) {
        announce('No suggestions available')
      } else {
        announce(`${count} suggestion${count !== 1 ? 's' : ''} available. Use arrow keys to navigate.`)
      }
    }
  )

  onMounted(() => {
    createLiveRegion()
    updateInputAria()
  })

  onUnmounted(() => {
    removeLiveRegion()
  })

  return {
    listboxId,
    liveRegionId,
    inputAriaAttrs,
    listboxAriaAttrs,
    getItemAriaAttrs,
    getItemId,
    announce,
    createLiveRegion,
    removeLiveRegion
  }
}
