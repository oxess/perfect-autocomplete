<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  type VNode
} from 'vue'
import { useDebounce } from '../composables/useDebounce'
import { useFloating } from '../composables/useFloating'
import { useKeyboardNavigation } from '../composables/useKeyboardNavigation'
import { useTouchGestures } from '../composables/useTouchGestures'
import { useAria } from '../composables/useAria'
import { useFetch } from '../composables/useFetch'
import { useCustomElementLifecycle } from '../composables/useCustomElementLifecycle'
import {
  html,
  defaultItemRenderer,
  defaultEmptyRenderer,
  defaultLoadingRenderer,
  defaultErrorRenderer
} from '../utils/htm-renderer'
import { emitOpen, emitClose, emitSelect, emitError, emitItemsLoaded } from '../utils/event-emitter'
import { injectStyles } from '../utils/style-injector'
import type { AutocompleteItem, RenderItemFunction, Placement, Theme, FetchFunction } from '../utils/types'

// Props with automatic type casting from attributes
const props = withDefaults(
  defineProps<{
    /** ID of input element to connect to */
    for?: string
    /** API endpoint URL */
    url?: string
    /** Query parameter name */
    queryParam?: string
    /** Minimum characters before fetch */
    minChars?: number
    /** Debounce delay in milliseconds */
    debounce?: number
    /** Maximum items to display */
    maxItems?: number
    /** Close dropdown on selection */
    closeOnSelect?: boolean
    /** Auto-highlight first item */
    highlightFirst?: boolean
    /** Dropdown placement */
    placement?: Placement
    /** Offset from reference element */
    offset?: number
    /** Enable flip middleware */
    flip?: boolean
    /** Enable shift middleware */
    shift?: boolean
    /** Visual theme */
    theme?: Theme
  }>(),
  {
    queryParam: 'q',
    minChars: 2,
    debounce: 300,
    maxItems: 10,
    closeOnSelect: true,
    highlightFirst: true,
    placement: 'bottom-start',
    offset: 4,
    flip: true,
    shift: true,
    theme: 'classic'
  }
)

// Component state
const inputElement = ref<HTMLInputElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const highlightedIndex = ref(-1)
const query = ref('')
const dropdownState = ref<'open' | 'closing' | 'closed'>('closed')

// Custom render function (can be set programmatically)
const customRenderItem = ref<RenderItemFunction | null>(null)

// Custom fetch function (can be set programmatically)
const customFetchFn = ref<FetchFunction | null>(null)

// Get host element for event emission
const { getHostElement, registerCleanup } = useCustomElementLifecycle()

// Debounce the query
const { debouncedValue: debouncedQuery } = useDebounce(() => query.value, {
  delay: props.debounce
})

// Fetch data
const fetchState = useFetch({
  url: () => props.url || '',
  queryParam: props.queryParam,
  minChars: props.minChars
})

// Limit items to maxItems
const displayedItems = computed(() => {
  return fetchState.items.value.slice(0, props.maxItems)
})

// Compute dropdown classes including theme
const dropdownClasses = computed(() => [
  'pac-dropdown',
  `pac-theme-${props.theme}`
])

// Floating positioning
const { floatingStyles, actualPlacement, updatePosition } = useFloating(
  inputElement,
  dropdownRef,
  {
    placement: props.placement,
    offset: props.offset,
    flip: props.flip,
    shift: props.shift
  }
)

// ARIA attributes
const aria = useAria({
  inputElement,
  isOpen,
  items: displayedItems,
  highlightedIndex,
  isLoading: fetchState.isLoading
})

// Keyboard navigation
const { handleKeyDown } = useKeyboardNavigation({
  items: displayedItems,
  highlightedIndex,
  isOpen,
  onSelect: handleSelect,
  onClose: close,
  onOpen: open
})

// Touch gestures
const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchGestures({
  onSwipeDown: close
})

/**
 * Open the dropdown
 */
function open() {
  if (isOpen.value) return

  isOpen.value = true
  dropdownState.value = 'open'

  if (props.highlightFirst && displayedItems.value.length > 0) {
    highlightedIndex.value = 0
  }

  const host = getHostElement()
  if (host) {
    emitOpen(host)
  }

  nextTick(() => {
    updatePosition()
  })
}

/**
 * Close the dropdown
 */
function close() {
  if (!isOpen.value) return

  dropdownState.value = 'closing'

  // Wait for animation to complete
  setTimeout(() => {
    isOpen.value = false
    dropdownState.value = 'closed'
    highlightedIndex.value = -1

    const host = getHostElement()
    if (host) {
      emitClose(host)
    }
  }, 150) // Match animation duration
}

/**
 * Handle item selection
 */
function handleSelect(item: unknown, index: number) {
  const autocompleteItem = item as AutocompleteItem

  // Update input value
  if (inputElement.value) {
    inputElement.value.value = autocompleteItem.label
  }

  // Emit select event
  const host = getHostElement()
  if (host) {
    emitSelect(host, autocompleteItem, index)
  }

  // Close if configured
  if (props.closeOnSelect) {
    close()
  }
}

/**
 * Handle input changes
 */
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  query.value = target.value

  if (query.value.length >= props.minChars) {
    open()
  } else {
    close()
  }
}

/**
 * Handle click outside
 */
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node

  // Check if click is outside input and dropdown
  const isOutsideInput = inputElement.value && !inputElement.value.contains(target)
  const isOutsideDropdown = dropdownRef.value && !dropdownRef.value.contains(target)

  if (isOutsideInput && isOutsideDropdown) {
    close()
  }
}

/**
 * Handle item click
 */
function handleItemClick(item: AutocompleteItem, index: number) {
  handleSelect(item, index)
}

/**
 * Handle item mouse enter
 */
function handleItemMouseEnter(index: number) {
  highlightedIndex.value = index
}

/**
 * Render an item
 */
function renderItem(item: AutocompleteItem, index: number): VNode {
  const renderer = customRenderItem.value || defaultItemRenderer
  return renderer(item, html, {
    highlighted: index === highlightedIndex.value,
    index
  })
}

/**
 * Connect to external input element
 */
function connectToInput() {
  if (!props.for) return

  const input = document.getElementById(props.for) as HTMLInputElement | null
  if (!input) {
    console.warn(`[PerfectAutocomplete] Input element with id "${props.for}" not found`)
    return
  }

  inputElement.value = input

  // Add event listeners
  input.addEventListener('input', handleInput)
  input.addEventListener('keydown', handleKeyDown)
  input.addEventListener('focus', () => {
    if (query.value.length >= props.minChars) {
      open()
    }
  })

  // Register cleanup
  registerCleanup(() => {
    input.removeEventListener('input', handleInput)
    input.removeEventListener('keydown', handleKeyDown)
  })
}

// Watch for debounced query changes
watch(debouncedQuery, async (newQuery) => {
  // Skip if no data source configured
  if (!props.url && !customFetchFn.value) return

  // Skip if query is too short
  if (newQuery.length < props.minChars) {
    fetchState.items.value = []
    return
  }

  try {
    // Use custom fetch function if available, otherwise use URL fetch
    if (customFetchFn.value) {
      const abortController = new AbortController()
      const items = await customFetchFn.value(newQuery, abortController.signal)
      fetchState.items.value = items
    } else {
      await fetchState.fetch(newQuery)
    }

    // Emit items-loaded event
    const host = getHostElement()
    if (host) {
      emitItemsLoaded(host, fetchState.items.value, newQuery)
    }

    // Highlight first item if configured
    if (props.highlightFirst && fetchState.items.value.length > 0) {
      highlightedIndex.value = 0
    } else {
      highlightedIndex.value = -1
    }
  } catch (err) {
    const host = getHostElement()
    if (host && err instanceof Error) {
      emitError(host, err)
    }
  }
})

// Watch for error
watch(
  () => fetchState.error.value,
  (error) => {
    if (error) {
      const host = getHostElement()
      if (host) {
        emitError(host, error)
      }
    }
  }
)

// Setup on mount
onMounted(() => {
  // Inject styles into document head (needed for teleported dropdown)
  injectStyles()
  connectToInput()
  document.addEventListener('click', handleClickOutside)
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  fetchState.abort()
})

// Expose public methods
defineExpose({
  /** Open the dropdown */
  open,
  /** Close the dropdown */
  close,
  /** Refresh data */
  refresh: () => fetchState.fetch(query.value),
  /** Set custom render function */
  setRenderItem(fn: RenderItemFunction) {
    customRenderItem.value = fn
  },
  /** Set custom fetch function (overrides URL) */
  setFetchFn(fn: FetchFunction) {
    customFetchFn.value = fn
  },
  /** Get current items */
  getItems() {
    return fetchState.items.value
  },
  /** Get loading state */
  getIsLoading() {
    return fetchState.isLoading.value
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen || dropdownState === 'closing'"
      ref="dropdownRef"
      :class="dropdownClasses"
      :style="floatingStyles"
      :data-state="dropdownState"
      :data-placement="actualPlacement"
      v-bind="aria.listboxAriaAttrs.value"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- Loading state -->
      <template v-if="fetchState.isLoading.value">
        <component :is="() => defaultLoadingRenderer()" />
      </template>

      <!-- Error state -->
      <template v-else-if="fetchState.error.value">
        <component :is="() => defaultErrorRenderer(fetchState.error.value!)" />
      </template>

      <!-- Empty state -->
      <template v-else-if="displayedItems.length === 0 && query.length >= minChars">
        <component :is="() => defaultEmptyRenderer(query)" />
      </template>

      <!-- Items list -->
      <template v-else>
        <ul class="pac-items">
          <li
            v-for="(item, index) in displayedItems"
            :key="item.id ?? index"
            v-bind="aria.getItemAriaAttrs(index)"
            @click="handleItemClick(item, index)"
            @mouseenter="handleItemMouseEnter(index)"
          >
            <component :is="() => renderItem(item, index)" />
          </li>
        </ul>
      </template>
    </div>
  </Teleport>
</template>

<style>
@import '../styles/base.css';
@import '../styles/themes.css';
</style>
