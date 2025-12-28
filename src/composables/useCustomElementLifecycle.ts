import { onMounted, onUnmounted, getCurrentInstance } from 'vue'

export interface UseCustomElementLifecycleOptions {
  /** Callback when element is connected to DOM */
  onConnected?: () => void
  /** Callback when element is disconnected from DOM */
  onDisconnected?: () => void
  /** Callback when element is moved to new document */
  onAdopted?: () => void
  /** Callback when attribute changes */
  onAttributeChanged?: (name: string, oldValue: string | null, newValue: string | null) => void
}

export interface UseCustomElementLifecycleReturn {
  /** Whether the element is connected to DOM */
  isConnected: () => boolean
  /** Get the host custom element */
  getHostElement: () => HTMLElement | null
  /** Register a cleanup function */
  registerCleanup: (cleanup: () => void) => void
}

/**
 * Composable to bridge Vue and Custom Element lifecycles
 *
 * Vue's lifecycle (onMounted, onUnmounted) and Custom Element lifecycle
 * (connectedCallback, disconnectedCallback) can have subtle differences.
 * This composable provides a unified interface.
 */
export function useCustomElementLifecycle(
  options: UseCustomElementLifecycleOptions = {}
): UseCustomElementLifecycleReturn {
  const { onConnected, onDisconnected, onAdopted, onAttributeChanged } = options

  const instance = getCurrentInstance()
  const cleanupFunctions: Array<() => void> = []

  /**
   * Check if element is connected to DOM
   */
  function isConnected(): boolean {
    const el = getHostElement()
    return el?.isConnected ?? false
  }

  /**
   * Get the host custom element
   */
  function getHostElement(): HTMLElement | null {
    if (!instance) return null

    // In Vue custom element, the component is mounted in shadow root
    // We need to get the host element
    const el = instance.vnode.el as HTMLElement | null
    if (!el) return null

    // If we're in shadow DOM, get the host
    const root = el.getRootNode()
    if (root instanceof ShadowRoot) {
      return root.host as HTMLElement
    }

    // Otherwise, try to find the custom element ancestor
    let current: HTMLElement | null = el
    while (current) {
      if (current.tagName?.includes('-')) {
        return current
      }
      current = current.parentElement
    }

    return el
  }

  /**
   * Register a cleanup function to be called on disconnect
   */
  function registerCleanup(cleanup: () => void): void {
    cleanupFunctions.push(cleanup)
  }

  /**
   * Run all cleanup functions
   */
  function runCleanups(): void {
    cleanupFunctions.forEach((fn) => {
      try {
        fn()
      } catch (err) {
        console.error('[useCustomElementLifecycle] Cleanup error:', err)
      }
    })
    cleanupFunctions.length = 0
  }

  // Handle Vue's mounted lifecycle
  onMounted(() => {
    onConnected?.()

    // Set up MutationObserver for attribute changes if needed
    if (onAttributeChanged) {
      const host = getHostElement()
      if (host) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName) {
              const newValue = host.getAttribute(mutation.attributeName)
              onAttributeChanged(
                mutation.attributeName,
                mutation.oldValue,
                newValue
              )
            }
          })
        })

        observer.observe(host, {
          attributes: true,
          attributeOldValue: true
        })

        registerCleanup(() => observer.disconnect())
      }
    }
  })

  // Handle Vue's unmounted lifecycle
  onUnmounted(() => {
    runCleanups()
    onDisconnected?.()
  })

  // Note: adoptedCallback is not directly supported in Vue custom elements
  // It would need to be handled at the custom element class level
  if (onAdopted) {
    console.warn(
      '[useCustomElementLifecycle] onAdopted callback is not directly supported. ' +
      'Handle adoptedCallback in the custom element class definition.'
    )
  }

  return {
    isConnected,
    getHostElement,
    registerCleanup
  }
}

/**
 * Composable for observing the host element's resize
 */
export function useHostResize(callback: (entry: ResizeObserverEntry) => void) {
  const lifecycle = useCustomElementLifecycle()

  onMounted(() => {
    const host = lifecycle.getHostElement()
    if (!host) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        callback(entry)
      }
    })

    observer.observe(host)
    lifecycle.registerCleanup(() => observer.disconnect())
  })

  return lifecycle
}
