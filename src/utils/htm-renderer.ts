import htm from 'htm'
import { h, type VNode } from 'vue'
import type { AutocompleteItem, HtmlTemplateFunction } from './types'

/**
 * htm bound to Vue's h function for JSX-like templating
 */
export const html = htm.bind(h) as HtmlTemplateFunction

/**
 * Default item template with support for image and description
 */
export function defaultItemRenderer(
  item: AutocompleteItem,
  _html: HtmlTemplateFunction,
  context: { highlighted: boolean; index: number }
): VNode {
  const classes = ['pac-item']
  if (context.highlighted) {
    classes.push('pac-item--highlighted')
  }

  return html`
    <div class=${classes.join(' ')} data-index=${context.index}>
      ${item.image && html`
        <img
          class="pac-item__image"
          src=${item.image}
          alt=""
          loading="lazy"
        />
      `}
      <div class="pac-item__content">
        <span class="pac-item__label">${item.label}</span>
        ${item.description && html`
          <span class="pac-item__description">${item.description}</span>
        `}
      </div>
    </div>
  ` as VNode
}

/**
 * Empty state template
 */
export function defaultEmptyRenderer(query: string): VNode {
  return html`
    <div class="pac-empty">
      <span>No results found for "${query}"</span>
    </div>
  ` as VNode
}

/**
 * Loading state template
 */
export function defaultLoadingRenderer(): VNode {
  return html`
    <div class="pac-loading">
      <span class="pac-loading__spinner" aria-hidden="true"></span>
      <span>Loading...</span>
    </div>
  ` as VNode
}

/**
 * Error state template
 */
export function defaultErrorRenderer(error: Error): VNode {
  return html`
    <div class="pac-error" role="alert">
      <span>Error: ${error.message}</span>
    </div>
  ` as VNode
}
