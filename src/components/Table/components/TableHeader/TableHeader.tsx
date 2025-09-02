import ColumnDragOverlay from "@/components/Table/components/TableHeader/ColumnDragOverlay"
import DraggableHeaderCell from "@/components/Table/components/TableHeader/DraggableHeaderCell"
import "@/components/Table/components/TableHeader/TableHeader.css"
import { CELL_MIN_WIDTH } from "@/constants"
import type { ColumnWidthInfo } from "@/hooks/useColumnWidths"
import type { Column, Sort } from "@/types/table"
import {
  DndContext,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type Modifier
} from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable"
import { memo, useCallback, useMemo, useRef, useState } from "react"

interface TableHeaderProps<T> {
  colDefs: Column<T>[]
  sort?: Sort | null
  onSort?: (params: Sort) => void
  onClearSort?: () => void
  columnWidths: ColumnWidthInfo[]
  onColumnReorder?: (activeId: string, overId: string) => void
  tableWidth?: number
}

const TableHeader = <T,>({
  colDefs,
  sort,
  onSort,
  onClearSort,
  columnWidths,
  onColumnReorder,
  tableWidth
}: TableHeaderProps<T>) => {
  const [activeColumn, setActiveColumn] = useState<string | null>(null)
  const tableHeaderRef = useRef<HTMLDivElement>(null)

  /* Constrain drag horizontally within table bounds */
  const constrainedHorizontalModifier: Modifier = ({
    transform,
    draggingNodeRect
  }) => {
    if (!draggingNodeRect || !tableWidth || !tableHeaderRef.current) {
      return { x: transform.x, y: 0, scaleX: 1, scaleY: 1 }
    }

    const headerRect = tableHeaderRef.current.getBoundingClientRect()
    const dragNodeWidth = draggingNodeRect.width

    const leftBoundary = headerRect.left
    const rightBoundary = headerRect.left + tableWidth

    const currentLeft = draggingNodeRect.left + transform.x
    const currentRight = currentLeft + dragNodeWidth

    let constrainedX = transform.x
    if (currentLeft < leftBoundary) {
      constrainedX = leftBoundary - draggingNodeRect.left
    }
    if (currentRight > rightBoundary) {
      constrainedX = rightBoundary - dragNodeWidth - draggingNodeRect.left
    }

    return { x: constrainedX, y: 0, scaleX: 1, scaleY: 1 }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } })
  )

  const handleSort = useCallback(
    (col: Column<T>) => {
      if (!col.sortable || !onSort) return

      const isCurrentColumn = sort?.column === col.key
      const direction = sort?.direction

      if (!isCurrentColumn) {
        // First click → sort ascending
        onSort({ column: col.key, direction: "asc" })
      } else if (direction === "asc") {
        // Second click → sort descending
        onSort({ column: col.key, direction: "desc" })
      } else if (direction === "desc" && onClearSort) {
        // Third click → clear sort
        onClearSort()
      }
    },
    [sort, onSort, onClearSort]
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveColumn(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id && onColumnReorder) {
        onColumnReorder(active.id as string, over.id as string)
      }

      setActiveColumn(null)
    },
    [onColumnReorder]
  )

  const columnsMeta = useMemo(
    () =>
      colDefs.map((col, index) => {
        const widthInfo = columnWidths[index]
        const isActive = sort?.column === col.key
        const sortDirection = isActive ? sort.direction : null

        return {
          key: col.key,
          title: col.title,
          col,
          style: {
            width: `${widthInfo?.width || CELL_MIN_WIDTH}px`,
            minWidth: `${widthInfo?.minWidth || CELL_MIN_WIDTH}px`
          },
          isActive,
          sortDirection
        }
      }),
    [colDefs, columnWidths, sort]
  )

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      autoScroll={false}
      modifiers={[constrainedHorizontalModifier]}
    >
      <div className="table-header-row" ref={tableHeaderRef}>
        <SortableContext
          items={columnsMeta.map((c) => c.key)}
          strategy={horizontalListSortingStrategy}
        >
          {columnsMeta.map(({ key, col, style, isActive, sortDirection }) => (
            <DraggableHeaderCell
              key={key}
              col={col}
              style={style}
              isActive={isActive}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          ))}
        </SortableContext>
      </div>
      <ColumnDragOverlay activeColumn={activeColumn} colDefs={colDefs} />
    </DndContext>
  )
}

export default memo(TableHeader) as typeof TableHeader
