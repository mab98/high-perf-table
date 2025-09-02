import { CELL_MIN_WIDTH } from "@/constants"
import { useCallback, useRef, useState } from "react"

const CELL_MAX_WIDTH = 500 // Maximum column width
const RESIZE_SNAP_INCREMENT = 5 // Snap to 5px increments

export interface UseColumnResizeReturn {
  customWidths: Record<string, number>
  isResizing: boolean
  resizingColumn: string | null
  currentResizeWidth: number | null
  handleResizeStart: (
    columnKey: string,
    startX: number,
    currentWidth: number
  ) => void
  handleResizeMove: (clientX: number) => void
  handleResizeEnd: () => void
  handleDoubleClickResize: (columnKey: string) => void
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

  const throttleRef = useRef<number | null>(null)

  // Utility function to snap width to increments
  const snapToIncrement = (width: number): number => {
    return Math.round(width / RESIZE_SNAP_INCREMENT) * RESIZE_SNAP_INCREMENT
  }

  // Utility function to constrain width within min/max bounds
  const constrainWidth = (width: number): number => {
    return Math.min(CELL_MAX_WIDTH, Math.max(CELL_MIN_WIDTH, width))
  }

  const handleResizeStart = useCallback(
    (columnKey: string, startX: number, currentWidth: number) => {
      setIsResizing(true)
      setResizingColumn(columnKey)
      setCurrentResizeWidth(currentWidth)
      setResizeState({ startX, startWidth: currentWidth, columnKey })

      // Prevent text selection during resize
      document.body.style.userSelect = "none"
      document.body.style.cursor = "col-resize"
    },
    []
  )

  const handleResizeMove = useCallback(
    (clientX: number) => {
      if (!resizeState) return

      // Throttle updates for better performance
      if (throttleRef.current) {
        cancelAnimationFrame(throttleRef.current)
      }

      throttleRef.current = requestAnimationFrame(() => {
        const { startX, startWidth, columnKey } = resizeState
        const deltaX = clientX - startX
        const rawWidth = startWidth + deltaX
        const constrainedWidth = constrainWidth(rawWidth)
        const snappedWidth = snapToIncrement(constrainedWidth)

        setCurrentResizeWidth(snappedWidth)
        setCustomWidths((prev) => ({
          ...prev,
          [columnKey]: snappedWidth
        }))
      })
    },
    [resizeState]
  )

  const handleResizeEnd = useCallback(() => {
    if (throttleRef.current) {
      cancelAnimationFrame(throttleRef.current)
      throttleRef.current = null
    }

    setIsResizing(false)
    setResizingColumn(null)
    setCurrentResizeWidth(null)
    setResizeState(null)

    // Restore default cursor and text selection
    document.body.style.userSelect = ""
    document.body.style.cursor = ""
  }, [])

  // Double-click to auto-resize (reset to original width and redistribute space)
  const handleDoubleClickResize = useCallback((columnKey: string) => {
    setCustomWidths((prev) => {
      const newWidths = { ...prev }
      delete newWidths[columnKey]
      return newWidths
    })
  }, [])

  // Reset individual column width
  const resetColumnWidth = useCallback((columnKey: string) => {
    setCustomWidths((prev) => {
      const newWidths = { ...prev }
      delete newWidths[columnKey]
      return newWidths
    })
  }, [])

  // Reset all custom widths (will trigger space redistribution)
  const resetAllWidths = useCallback(() => {
    setCustomWidths({})
  }, [])

  return {
    customWidths,
    isResizing,
    resizingColumn,
    currentResizeWidth,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
    handleDoubleClickResize,
    resetColumnWidth,
    resetAllWidths
  }
}
