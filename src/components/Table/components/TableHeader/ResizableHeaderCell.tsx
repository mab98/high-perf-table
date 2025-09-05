import "@/components/Table/components/TableHeader/ResizableHeader.css"
import { CELL_MIN_WIDTH } from "@/constants"
import type { Column } from "@/types/table"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import { memo, useMemo } from "react"

const renderSortIcon = <T,>(col: Column<T>, sortDirection: string | null) => {
  if (!col.sortable) return null

  const getSortIcon = (direction: string | null): string => {
    if (direction === "asc") return "▲"
    if (direction === "desc") return "▼"
    return "⇅"
  }

  return (
    <span className={clsx("sort-icon", sortDirection)}>
      {getSortIcon(sortDirection)}
    </span>
  )
}

interface ResizableHeaderCellProps<T> {
  col: Column<T>
  width: number
  isActive: boolean
  sortDirection: "asc" | "desc" | null
  onSort: (col: Column<T>) => void
  pinned?: "left" | "right" | null
}

const ResizableHeaderCell = <T,>({
  col,
  width,
  isActive,
  sortDirection,
  onSort,
  pinned
}: ResizableHeaderCellProps<T>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: col.key,
    data: { type: "column", column: col }
  })

  const dndStyle = useMemo<React.CSSProperties>(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      width: `${width}px`,
      minWidth: `${CELL_MIN_WIDTH}px`
    }),
    [transform, transition, width]
  )

  const handleClick = (event: React.MouseEvent) => {
    // Only handle click if we're not dragging and it's a left click
    if (!isDragging && event.button === 0) {
      onSort(col)
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={clsx("header-cell-container", {
        "pinned-left": pinned === "left",
        "pinned-right": pinned === "right"
      })}
      style={dndStyle}
    >
      <div
        className={clsx("table-header", "draggable-header", {
          sortable: col.sortable,
          active: isActive,
          dragging: isDragging,
          "pinned-left": pinned === "left",
          "pinned-right": pinned === "right"
        })}
        onClick={handleClick}
        title={`Drag to reorder • Click to sort by ${col.title}`}
        {...attributes}
        {...listeners}
      >
        <div className="header-content">
          <div className="header-left">
            <span className="header-title">{col.title}</span>
            {renderSortIcon(col, sortDirection)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ResizableHeaderCell) as typeof ResizableHeaderCell
