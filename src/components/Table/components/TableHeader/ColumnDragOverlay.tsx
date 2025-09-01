import "@/components/Table/components/TableHeader/ColumnDragOverlay.css"
import type { Column } from "@/types/table"
import { DragOverlay } from "@dnd-kit/core"
import { memo } from "react"

interface ColumnDragOverlayProps<T> {
  activeColumn: string | null
  colDefs: Column<T>[]
}

const ColumnDragOverlay = <T,>({
  activeColumn,
  colDefs
}: ColumnDragOverlayProps<T>) => {
  if (!activeColumn) return null

  const col = colDefs.find((c) => c.key === activeColumn)
  if (!col) return null

  return (
    <DragOverlay>
      <div className="table-header column-drag-overlay">
        <div className="header-content">
          <span className="header-title">{col.title}</span>
        </div>
      </div>
    </DragOverlay>
  )
}

export default memo(ColumnDragOverlay) as typeof ColumnDragOverlay
