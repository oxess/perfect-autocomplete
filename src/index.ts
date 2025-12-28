import { defineCustomElement } from 'vue'
import PerfectAutocompleteVue from './components/PerfectAutocomplete.ce.vue'
import type { AutocompleteItem, AutocompleteConfig, AutocompleteEventMap, RenderItemFunction, Theme } from './utils/types'

// Create custom element constructor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PerfectAutocompleteElement = defineCustomElement(PerfectAutocompleteVue as any)

/**
 * Register the custom element with a custom tag name
 * @param tagName - Custom element tag name (default: 'perfect-autocomplete')
 */
export function register(tagName = 'perfect-autocomplete'): void {
  if (typeof window === 'undefined') {
    return
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, PerfectAutocompleteElement)
  }
}

// Auto-register if not in library mode
if (typeof window !== 'undefined' && !import.meta.env?.VITE_LIB_MODE) {
  register()
}

// Export component and types
export { PerfectAutocompleteElement, PerfectAutocompleteVue }
export type { AutocompleteItem, AutocompleteConfig, AutocompleteEventMap, RenderItemFunction, Theme }

// Export composables for advanced usage
export * from './composables'

// Export utilities
export { html } from './utils/htm-renderer'
export {
  defaultItemRenderer,
  defaultEmptyRenderer,
  defaultLoadingRenderer,
  defaultErrorRenderer
} from './utils/htm-renderer'

/**
 * Interface for the PerfectAutocomplete custom element
 */
export interface PerfectAutocompleteHTMLElement extends HTMLElement {
  // Props
  for: string
  url: string
  queryParam: string
  minChars: number
  debounce: number
  maxItems: number
  closeOnSelect: boolean
  highlightFirst: boolean
  placement: string
  offset: number
  flip: boolean
  shift: boolean
  theme: Theme

  // Methods
  open(): void
  close(): void
  refresh(): Promise<void>

  // Custom render function
  renderItem: RenderItemFunction

  // Read-only properties
  readonly items: AutocompleteItem[]
  readonly isLoading: boolean
}

// TypeScript augmentation for HTMLElementTagNameMap
declare global {
  interface HTMLElementTagNameMap {
    'perfect-autocomplete': PerfectAutocompleteHTMLElement
  }

  interface GlobalEventHandlersEventMap {
    'pac:open': CustomEvent<void>
    'pac:close': CustomEvent<void>
    'pac:select': CustomEvent<{ item: AutocompleteItem; index: number }>
    'pac:error': CustomEvent<{ error: Error }>
    'pac:items-loaded': CustomEvent<{ items: AutocompleteItem[]; query: string }>
  }
}
