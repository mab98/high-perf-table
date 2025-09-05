import "@/components/Table/components/TableHeader/ResizableHeader.css"
import { useColumnResize } from "@/components/Table/hooks/useColumnResize"
import { memo } from "react"

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
  const { isResizing, dragPosition, handleMouseDown } = useColumnResize({
    currentWidth,
    position,
    onResize,
    onResizeStart,
    onResizeEnd
  })

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
