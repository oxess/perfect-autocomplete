import { describe, it, expect } from 'vitest'
import { isVNode } from 'vue'
import {
  html,
  defaultItemRenderer,
  defaultEmptyRenderer,
  defaultLoadingRenderer,
  defaultErrorRenderer
} from '@/utils/htm-renderer'
import type { AutocompleteItem } from '@/utils/types'

describe('htm-renderer', () => {
  describe('html tagged template', () => {
    it('should create VNode from template', () => {
      const result = html`<div class="test">Hello</div>`
      expect(isVNode(result)).toBe(true)
    })

    it('should interpolate values', () => {
      const name = 'World'
      const result = html`<div>Hello ${name}</div>`
      expect(isVNode(result)).toBe(true)
    })

    it('should handle nested elements', () => {
      const result = html`
        <div class="parent">
          <span class="child">Nested</span>
        </div>
      `
      expect(isVNode(result)).toBe(true)
    })
  })

  describe('defaultItemRenderer', () => {
    it('should render basic item', () => {
      const item: AutocompleteItem = {
        label: 'Test Item',
        value: 'test'
      }

      const result = defaultItemRenderer(item, html, {
        highlighted: false,
        index: 0
      })

      expect(isVNode(result)).toBe(true)
    })

    it('should add highlighted class when highlighted', () => {
      const item: AutocompleteItem = {
        label: 'Test Item',
        value: 'test'
      }

      const result = defaultItemRenderer(item, html, {
        highlighted: true,
        index: 0
      })

      expect(isVNode(result)).toBe(true)
      // Check the class includes highlighted
      expect(result.props?.class).toContain('highlighted')
    })

    it('should render item with image', () => {
      const item: AutocompleteItem = {
        label: 'Test Item',
        value: 'test',
        image: 'https://example.com/image.jpg'
      }

      const result = defaultItemRenderer(item, html, {
        highlighted: false,
        index: 0
      })

      expect(isVNode(result)).toBe(true)
    })

    it('should render item with description', () => {
      const item: AutocompleteItem = {
        label: 'Test Item',
        value: 'test',
        description: 'A test description'
      }

      const result = defaultItemRenderer(item, html, {
        highlighted: false,
        index: 0
      })

      expect(isVNode(result)).toBe(true)
    })
  })

  describe('defaultEmptyRenderer', () => {
    it('should render empty state with query', () => {
      const result = defaultEmptyRenderer('search term')
      expect(isVNode(result)).toBe(true)
    })
  })

  describe('defaultLoadingRenderer', () => {
    it('should render loading state', () => {
      const result = defaultLoadingRenderer()
      expect(isVNode(result)).toBe(true)
    })
  })

  describe('defaultErrorRenderer', () => {
    it('should render error state', () => {
      const error = new Error('Something went wrong')
      const result = defaultErrorRenderer(error)
      expect(isVNode(result)).toBe(true)
    })
  })
})
