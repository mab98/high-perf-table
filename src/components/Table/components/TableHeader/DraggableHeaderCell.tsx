import "@/components/Table/components/TableHeader/TableHeader.css"
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

interface DraggableHeaderCellProps<T> {
  col: Column<T>
  style: React.CSSProperties
  isActive: boolean
  sortDirection: "asc" | "desc" | null
  onSort: (col: Column<T>) => void
  pinned?: "left" | "right" | null
}

const DraggableHeaderCell = <T,>({
  col,
  style,
  isActive,
  sortDirection,
  onSort,
  pinned
}: DraggableHeaderCellProps<T>) => {
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
      ...style
    }),
    [transform, transition, style]
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
      className={clsx("table-header", "draggable-header", {
        sortable: col.sortable,
        active: isActive,
        dragging: isDragging,
        "pinned-left": pinned === "left",
        "pinned-right": pinned === "right"
      })}
      style={dndStyle}
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
  )
}

export default memo(DraggableHeaderCell) as typeof DraggableHeaderCell
