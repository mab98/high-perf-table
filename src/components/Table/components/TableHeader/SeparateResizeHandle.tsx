import "@/components/Table/components/TableHeader/ResizableHeader.css"
import { memo, useCallback, useEffect, useRef, useState } from "react"
import { CELL_MAX_WIDTH, CELL_MIN_WIDTH } from "../../constants"

interface SeparateResizeHandleProps {
  columnKey: string
  currentWidth: number
  onResize: (width: number) => void
  onResizeStart?: (width: number) => void
  onResizeEnd?: (width: number) => void
  position: number
  isLast?: boolean
}

const SeparateResizeHandle = ({
  currentWidth,
  onResize,
  onResizeStart,
  onResizeEnd,
  position,
  isLast = false
}: SeparateResizeHandleProps) => {
  const [isResizing, setIsResizing] = useState(false)
  const [tempWidth, setTempWidth] = useState(currentWidth)
  const [dragPosition, setDragPosition] = useState(position)
  const startXRef = useRef<number>(0)
  const startWidthRef = useRef<number>(0)
  const startPositionRef = useRef<number>(0)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setIsResizing(true)
      startXRef.current = e.clientX
      startWidthRef.current = currentWidth
      startPositionRef.current = position
      setTempWidth(currentWidth)
      setDragPosition(position)

      // Call onResizeStart if provided
      if (onResizeStart) {
        onResizeStart(currentWidth)
      }

      document.body.style.userSelect = "none"
      document.body.style.cursor = "col-resize"
    },
    [currentWidth, position, onResizeStart]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      e.preventDefault()
      const deltaX = e.clientX - startXRef.current
      const newWidth = Math.max(
        CELL_MIN_WIDTH,
        Math.min(CELL_MAX_WIDTH, startWidthRef.current + deltaX)
      )

      setTempWidth(newWidth)

      // Calculate the constrained delta based on the actual width change
      const constrainedDeltaX = newWidth - startWidthRef.current
      // Update the visual position of the handle during drag with constrained delta
      setDragPosition(startPositionRef.current + constrainedDeltaX)

      // Call onResize in real-time for live column resizing
      onResize(newWidth)
    },
    [isResizing, onResize]
  )

  const handleMouseUp = useCallback(() => {
    if (!isResizing) return

    setIsResizing(false)
    setDragPosition(position) // Reset to actual position

    // Call onResizeEnd if provided
    if (onResizeEnd) {
      onResizeEnd(tempWidth)
    }

    document.body.style.userSelect = ""
    document.body.style.cursor = ""
  }, [isResizing, tempWidth, onResizeEnd, position])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove, {
        passive: false
      })
      document.addEventListener("mouseup", handleMouseUp, { passive: true })

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  // Sync drag position with actual position when not resizing
  useEffect(() => {
    if (!isResizing) {
      setDragPosition(position)
    }
  }, [position, isResizing])

  return (
    <div
      className={`separate-resize-handle ${isLast ? "last-column-resize" : ""} ${
        isResizing ? "resizing" : ""
      }`}
      style={{ left: `${isResizing ? dragPosition : position}px` }}
      onMouseDown={handleMouseDown}
      title="Resize column"
    />
  )
}

export default memo(SeparateResizeHandle)
