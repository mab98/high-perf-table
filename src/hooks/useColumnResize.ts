import { CELL_MAX_WIDTH, CELL_MIN_WIDTH } from "@/constants"
import { useCallback, useState } from "react"

export interface UseColumnResizeReturn {
  customWidths: Record<string, number>
  isResizing: boolean
  resizingColumn: string | null
  currentResizeWidth: number | null
  onResizeStart: (
    columnKey: string,
    startX: number,
    currentWidth: number,
    clickedElement?: HTMLElement
  ) => void
  onResizeMove: (clientX: number) => void
  onResizeEnd: () => void
  resetColumnWidth: (columnKey: string) => void
  resetAllWidths: () => void
}

export const useColumnResize = (): UseColumnResizeReturn => {
  const [customWidths, setCustomWidths] = useState<Record<string, number>>({})
  const [isResizing, setIsResizing] = useState(false)
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [currentResizeWidth, setCurrentResizeWidth] = useState<number | null>(
    null
  )
  const [resizeState, setResizeState] = useState<{
    startX: number
    startWidth: number
    columnKey: string
  } | null>(null)

  /** --- Helpers --- */
  const constrainWidth = (width: number) =>
    Math.min(CELL_MAX_WIDTH, Math.max(CELL_MIN_WIDTH, width))

  const getHeaderContainers = () =>
    document.querySelectorAll<HTMLElement>(".header-cell-container")

  const getResizeHandles = () =>
    document.querySelectorAll<HTMLElement>(".separated-resize-handle")

  const getCells = (columnKey: string) =>
    document.querySelectorAll<HTMLElement>(`[data-cell-key="${columnKey}"]`)

  const cleanupHandles = useCallback(() => {
    getResizeHandles().forEach((handle) => {
      // Temporarily disable transitions to prevent blink
      handle.style.transition = "none"
      handle.style.transform = ""

      // Only restore visibility for handles that were dragging
      if (handle.dataset.isDragging === "true") {
        handle.style.visibility = "visible"

        // Re-enable transitions after cleanup
        setTimeout(() => {
          handle.style.transition = ""
        }, 10)
      }

      delete handle.dataset.isDragging
      delete handle.dataset.originalLeft
    })
  }, []) /** --- Core Logic --- */
  const updateResizeHandlesPosition = useCallback(
    (columnKey: string, newWidth: number) => {
      const headers = getHeaderContainers()
      const handles = getResizeHandles()

      const resizedIndex = Array.from(headers).findIndex(
        (c) => c.dataset.columnKey === columnKey
      )
      if (resizedIndex === -1) return

      // Store visibility state before hiding dragging handles
      const visibilityState = new Map<HTMLElement, string>()
      handles.forEach((h) => {
        visibilityState.set(h, h.style.visibility || "visible")
        if (h.dataset.isDragging === "true") h.style.visibility = "hidden"
        // Temporarily disable transitions during position updates
        h.style.transition = "none"
      })

      // Recalculate cumulative widths
      for (let i = resizedIndex; i < handles.length; i++) {
        let cumulative = 0
        for (let j = 0; j <= i; j++) {
          const width =
            j === resizedIndex
              ? newWidth
              : parseInt(headers[j].style.width) || headers[j].offsetWidth
          cumulative += width
        }

        const handle = handles[i]
        if (!handle) continue
        handle.style.left = `${cumulative}px`
        handle.style.transform = ""

        // Only restore visibility if it wasn't the dragging handle
        if (handle.dataset.isDragging !== "true") {
          const originalVisibility = visibilityState.get(handle) || "visible"
          handle.style.visibility = originalVisibility
        }
      }
    },
    []
  )

  const onResizeStart = useCallback(
    (
      columnKey: string,
      startX: number,
      currentWidth: number,
      clickedElement?: HTMLElement
    ) => {
      setIsResizing(true)
      setResizingColumn(columnKey)
      setCurrentResizeWidth(currentWidth)
      setResizeState({ startX, startWidth: currentWidth, columnKey })

      cleanupHandles()

      if (clickedElement) {
        // Just mark as dragging for internal tracking
        clickedElement.dataset.originalLeft =
          clickedElement.style.left || getComputedStyle(clickedElement).left
        clickedElement.dataset.isDragging = "true"
      }

      document.body.style.userSelect = "none"
      document.body.style.cursor = "col-resize"
    },
    [cleanupHandles]
  )

  const onResizeMove = useCallback(
    (clientX: number) => {
      if (!resizeState) return
      const { startX, startWidth, columnKey } = resizeState
      const constrained = constrainWidth(startWidth + (clientX - startX))
      const finalWidth = Math.round(constrained)

      getHeaderContainers().forEach((c) => {
        if (c.dataset.columnKey === columnKey) c.style.width = `${finalWidth}px`
      })
      getCells(columnKey).forEach((cell) => {
        cell.style.width = `${finalWidth}px`
      })

      updateResizeHandlesPosition(columnKey, finalWidth)
      setCurrentResizeWidth(finalWidth)
    },
    [resizeState, updateResizeHandlesPosition]
  )

  const onResizeEnd = useCallback(() => {
    // Keep resizing state active during cleanup to maintain disabled transitions
    cleanupHandles()

    if (resizeState && currentResizeWidth !== null) {
      setCustomWidths((prev) => ({
        ...prev,
        [resizeState.columnKey]: currentResizeWidth
      }))
    }

    // Use requestAnimationFrame to ensure DOM updates are complete before re-enabling transitions
    requestAnimationFrame(() => {
      setIsResizing(false)
      setResizingColumn(null)
      setCurrentResizeWidth(null)
      setResizeState(null)

      // Re-enable transitions after state updates
      setTimeout(() => {
        getResizeHandles().forEach((handle) => {
          handle.style.transition = ""
        })
      }, 10)
    })

    document.body.style.userSelect = ""
    document.body.style.cursor = ""
  }, [resizeState, currentResizeWidth, cleanupHandles])

  const resetColumnWidth = useCallback((columnKey: string) => {
    setCustomWidths((prev) => {
      const newWidths = { ...prev }
      delete newWidths[columnKey]
      return newWidths
    })
  }, [])

  return {
    customWidths,
    isResizing,
    resizingColumn,
    currentResizeWidth,
    onResizeStart,
    onResizeMove,
    onResizeEnd,
    resetColumnWidth,
    resetAllWidths: () => setCustomWidths({})
  }
}
