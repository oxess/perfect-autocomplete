import type { VNode } from 'vue'

/**
 * Represents a single autocomplete item
 */
export interface AutocompleteItem {
  /** Unique identifier */
  id?: string | number
  /** Display label */
  label: string
  /** Value to be returned on selection */
  value: unknown
  /** Optional image URL */
  image?: string
  /** Optional description */
  description?: string
  /** Allow additional properties for custom templates */
  [key: string]: unknown
}

/**
 * Configuration options for the autocomplete component
 */
export interface AutocompleteConfig {
  // Connection
  /** ID of input element to connect to */
  for?: string

  // Data fetching
  /** API endpoint URL */
  url?: string
  /** Query parameter name (default: 'q') */
  queryParam?: string
  /** Minimum characters before fetch (default: 2) */
  minChars?: number
  /** Debounce delay in ms (default: 300) */
  debounce?: number

  // Behavior
  /** Maximum items to display (default: 10) */
  maxItems?: number
  /** Close dropdown on selection (default: true) */
  closeOnSelect?: boolean
  /** Auto-highlight first item (default: true) */
  highlightFirst?: boolean

  // Positioning
  /** Dropdown placement relative to input */
  placement?: Placement
  /** Offset from reference element in pixels (default: 4) */
  offset?: number
  /** Enable flip middleware (default: true) */
  flip?: boolean
  /** Enable shift middleware (default: true) */
  shift?: boolean
}

/**
 * Placement options for the dropdown
 */
export type Placement =
  | 'bottom'
  | 'top'
  | 'left'
  | 'right'
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end'

/**
 * Available themes for the autocomplete component
 */
export type Theme = 'classic' | 'basic' | 'modern' | 'bootstrap' | 'tailwind'

/**
 * Custom event map for the autocomplete component
 */
export interface AutocompleteEventMap {
  'pac:open': CustomEvent<void>
  'pac:close': CustomEvent<void>
  'pac:select': CustomEvent<{ item: AutocompleteItem; index: number }>
  'pac:error': CustomEvent<{ error: Error }>
  'pac:items-loaded': CustomEvent<{ items: AutocompleteItem[]; query: string }>
}

/**
 * htm template function type
 */
export type HtmlTemplateFunction = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => VNode | VNode[]

/**
 * Custom item renderer function
 */
export type RenderItemFunction = (
  item: AutocompleteItem,
  html: HtmlTemplateFunction,
  context: { highlighted: boolean; index: number }
) => VNode

/**
 * Fetch function for custom data sources
 */
export type FetchFunction = (query: string, signal: AbortSignal) => Promise<AutocompleteItem[]>

/**
 * Touch gesture direction
 */
export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

/**
 * Keyboard navigation actions
 */
export type KeyboardAction =
  | 'next'
  | 'previous'
  | 'first'
  | 'last'
  | 'select'
  | 'close'
  | 'none'
