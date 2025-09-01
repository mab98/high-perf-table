import "@/components/Table/components/TableHeader/TableHeader.css"
import { renderSortIcon } from "@/components/Table/components/TableHeader/utils"
import type { Column } from "@/types/table"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import { memo, useMemo } from "react"

interface DraggableHeaderCellProps<T> {
  col: Column<T>
  style: React.CSSProperties
  isActive: boolean
  sortDirection: "asc" | "desc" | null
  onSort: (col: Column<T>) => void
}

const DraggableHeaderCell = <T,>({
  col,
  style,
  isActive,
  sortDirection,
  onSort
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
    if (!isDragging && event.button === 0) onSort(col)
  }

  return (
    <div
      ref={setNodeRef}
      className={clsx("table-header", "draggable-header", {
        sortable: col.sortable,
        active: isActive,
        dragging: isDragging
      })}
      style={dndStyle}
      onClick={handleClick}
      title={`Drag to reorder • Click to sort by ${col.title}`}
      {...attributes}
      {...listeners}
    >
      <div className="header-content">
        <span className="header-title">{col.title}</span>
        {renderSortIcon(col, sortDirection)}
      </div>
    </div>
  )
}

export default memo(DraggableHeaderCell) as typeof DraggableHeaderCell
