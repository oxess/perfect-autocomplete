/**
 * Test helpers for Custom Element testing
 */

import { register } from '@/index'

/**
 * Render a custom element in the DOM for testing
 */
export async function renderCustomElement(
  tagName: string,
  attributes: Record<string, string> = {}
): Promise<{ element: HTMLElement; cleanup: () => void }> {
  // Ensure element is registered
  register(tagName)

  // Build attributes string
  const attrs = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

  // Create container
  const container = document.createElement('div')
  container.innerHTML = `<${tagName} ${attrs}></${tagName}>`
  document.body.appendChild(container)

  // Wait for custom element to be defined and upgraded
  await customElements.whenDefined(tagName)

  // Wait for next tick
  await new Promise((resolve) => setTimeout(resolve, 0))

  const element = container.querySelector(tagName) as HTMLElement

  return {
    element,
    cleanup: () => {
      container.remove()
    }
  }
}

/**
 * Create a mock input element for testing
 */
export function createMockInput(id: string): {
  input: HTMLInputElement
  cleanup: () => void
} {
  const input = document.createElement('input')
  input.id = id
  input.type = 'search'
  document.body.appendChild(input)

  return {
    input,
    cleanup: () => {
      input.remove()
    }
  }
}

/**
 * Wait for a custom event to be dispatched
 */
export function waitForEvent<T = unknown>(
  element: HTMLElement,
  eventName: string,
  timeout = 5000
): Promise<CustomEvent<T>> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event: ${eventName}`))
    }, timeout)

    element.addEventListener(
      eventName,
      (event) => {
        clearTimeout(timer)
        resolve(event as CustomEvent<T>)
      },
      { once: true }
    )
  })
}

/**
 * Simulate typing in an input element
 */
export async function typeInInput(
  input: HTMLInputElement,
  text: string,
  delay = 50
): Promise<void> {
  input.focus()

  for (const char of text) {
    input.value += char
    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: char }))
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}

/**
 * Simulate keyboard event on element
 */
export function pressKey(
  element: HTMLElement,
  key: string,
  options: Partial<KeyboardEventInit> = {}
): void {
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...options
    })
  )
}
