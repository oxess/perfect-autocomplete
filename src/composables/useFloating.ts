import { ref, computed, watch, onMounted, onUnmounted, type Ref, type CSSProperties } from 'vue'
import {
  computePosition,
  autoUpdate,
  offset as offsetMiddleware,
  flip as flipMiddleware,
  shift as shiftMiddleware,
  size as sizeMiddleware,
  type Placement,
  type Middleware
} from '@floating-ui/vue'

export interface UseFloatingOptions {
  /** Placement of floating element */
  placement?: Placement
  /** Offset from reference element in pixels */
  offset?: number
  /** Enable flip middleware */
  flip?: boolean
  /** Enable shift middleware */
  shift?: boolean
  /** Padding for shift middleware */
  shiftPadding?: number
  /** Match reference element width */
  matchWidth?: boolean
}

export interface UseFloatingReturn {
  /** Computed floating styles */
  floatingStyles: Ref<CSSProperties>
  /** Actual placement after middleware */
  actualPlacement: Ref<Placement>
  /** Update position manually */
  updatePosition: () => Promise<void>
  /** Whether position has been calculated */
  isPositioned: Ref<boolean>
  /** X coordinate */
  x: Ref<number>
  /** Y coordinate */
  y: Ref<number>
}

/**
 * Composable for positioning floating elements using Floating UI
 */
export function useFloating(
  referenceEl: Ref<HTMLElement | null>,
  floatingEl: Ref<HTMLElement | null>,
  options: UseFloatingOptions = {}
): UseFloatingReturn {
  const {
    placement = 'bottom-start',
    offset = 4,
    flip = true,
    shift = true,
    shiftPadding = 8,
    matchWidth = true
  } = options

  const x = ref(0)
  const y = ref(0)
  const actualPlacement = ref<Placement>(placement)
  const isPositioned = ref(false)
  let cleanup: (() => void) | null = null

  const floatingStyles = computed<CSSProperties>(() => ({
    position: 'absolute',
    left: `${x.value}px`,
    top: `${y.value}px`,
    ...(matchWidth && referenceEl.value
      ? { minWidth: `${referenceEl.value.offsetWidth}px` }
      : {})
  }))

  async function updatePosition() {
    if (!referenceEl.value || !floatingEl.value) {
      return
    }

    const middleware: Middleware[] = []

    // Order matters: offset first
    middleware.push(offsetMiddleware(offset))

    if (flip) {
      middleware.push(flipMiddleware({
        fallbackPlacements: ['top-start', 'top-end', 'bottom-end']
      }))
    }

    if (shift) {
      middleware.push(shiftMiddleware({ padding: shiftPadding }))
    }

    if (matchWidth) {
      middleware.push(sizeMiddleware({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`
          })
        }
      }))
    }

    try {
      const result = await computePosition(referenceEl.value, floatingEl.value, {
        placement,
        middleware
      })

      x.value = result.x
      y.value = result.y
      actualPlacement.value = result.placement
      isPositioned.value = true
    } catch (error) {
      console.error('[useFloating] Position calculation failed:', error)
    }
  }

  // Start auto-update when both elements are available
  watch(
    [referenceEl, floatingEl],
    ([reference, floating]) => {
      // Cleanup previous auto-update
      if (cleanup) {
        cleanup()
        cleanup = null
      }

      if (reference && floating) {
        cleanup = autoUpdate(reference, floating, updatePosition, {
          ancestorScroll: true,
          ancestorResize: true,
          elementResize: true,
          layoutShift: true
        })
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    if (referenceEl.value && floatingEl.value) {
      updatePosition()
    }
  })

  onUnmounted(() => {
    if (cleanup) {
      cleanup()
      cleanup = null
    }
  })

  return {
    floatingStyles,
    actualPlacement,
    updatePosition,
    isPositioned,
    x,
    y
  }
}
