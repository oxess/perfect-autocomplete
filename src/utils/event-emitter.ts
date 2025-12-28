import type { AutocompleteItem, AutocompleteEventMap } from './types'

/**
 * Emit a custom event that can cross shadow DOM boundaries
 */
export function emitEvent<K extends keyof AutocompleteEventMap>(
  element: HTMLElement,
  type: K,
  detail: AutocompleteEventMap[K] extends CustomEvent<infer D> ? D : never
): boolean {
  const event = new CustomEvent(type, {
    detail,
    bubbles: true,
    composed: true, // Cross shadow DOM boundary
    cancelable: true
  })
  return element.dispatchEvent(event)
}

/**
 * Emit open event
 */
export function emitOpen(element: HTMLElement): boolean {
  return emitEvent(element, 'pac:open', undefined as void)
}

/**
 * Emit close event
 */
export function emitClose(element: HTMLElement): boolean {
  return emitEvent(element, 'pac:close', undefined as void)
}

/**
 * Emit select event
 */
export function emitSelect(
  element: HTMLElement,
  item: AutocompleteItem,
  index: number
): boolean {
  return emitEvent(element, 'pac:select', { item, index })
}

/**
 * Emit error event
 */
export function emitError(element: HTMLElement, error: Error): boolean {
  return emitEvent(element, 'pac:error', { error })
}

/**
 * Emit items-loaded event
 */
export function emitItemsLoaded(
  element: HTMLElement,
  items: AutocompleteItem[],
  query: string
): boolean {
  return emitEvent(element, 'pac:items-loaded', { items, query })
}
