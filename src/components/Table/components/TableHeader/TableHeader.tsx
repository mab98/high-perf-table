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
import clsx from "clsx"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"

interface TableHeaderProps<T> {
  colDefs: Column<T>[]
  sort?: Sort | null
  onSort?: (params: Sort) => void
  onClearSort?: () => void
  columnWidths: ColumnWidthInfo[]
  onColumnReorder?: (activeId: string, overId: string) => void
  tableWidth?: number
  isResizing?: boolean
  resizingColumn?: string | null
  onResizeStart?: (
    columnKey: string,
    startX: number,
    currentWidth: number,
    clickedElement?: HTMLElement
  ) => void
  onResizeMove?: (clientX: number) => void
  onResizeEnd?: () => void
}

const TableHeader = <T,>({
  colDefs,
  sort,
  onSort,
  onClearSort,
  columnWidths,
  onColumnReorder,
  tableWidth,
  isResizing,
  resizingColumn,
  onResizeStart,
  onResizeMove,
  onResizeEnd
}: TableHeaderProps<T>) => {
  const [activeColumn, setActiveColumn] = useState<string | null>(null)
  const tableHeaderRef = useRef<HTMLDivElement>(null)

  // Handle global mouse events for resizing
  useEffect(() => {
    if (!isResizing || !onResizeMove || !onResizeEnd) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      onResizeMove(e.clientX)
    }

    const handleMouseUp = () => {
      onResizeEnd()
    }

    // Use passive: false for preventDefault to work, but optimize where possible
    document.addEventListener("mousemove", handleMouseMove, { passive: false })
    document.addEventListener("mouseup", handleMouseUp, { passive: true })

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, onResizeMove, onResizeEnd])

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, columnKey: string, currentWidth: number) => {
      e.preventDefault()
      e.stopPropagation()

      if (!onResizeStart) return

      // Prevent text selection during resize
      document.body.style.userSelect = "none"
      document.body.style.cursor = "col-resize"

      // Pass the clicked element to the resize start handler
      const clickedElement = e.currentTarget as HTMLElement
      onResizeStart(columnKey, e.clientX, currentWidth, clickedElement)
    },
    [onResizeStart]
  )

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
      <div
        className={clsx("table-header-row", { resizing: isResizing })}
        ref={tableHeaderRef}
      >
        <SortableContext
          items={columnsMeta.map((c) => c.key)}
          strategy={horizontalListSortingStrategy}
        >
          {columnsMeta.map(({ key, col, style, isActive, sortDirection }) => (
            <div
              key={key}
              data-column-key={col.key}
              className={clsx("header-cell-container", {
                resizing: isResizing && resizingColumn === col.key
              })}
              style={style}
            >
              <DraggableHeaderCell
                col={col}
                style={{ width: "100%", minWidth: "inherit" }}
                isActive={isActive}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            </div>
          ))}
        </SortableContext>

        {/* Separate layer for resize handles positioned between columns */}
        <div className="resize-handles-layer">
          {columnsMeta.map((columnMeta, index) => {
            // Only show resize handle if the current column is resizable
            if (!columnMeta.col.resizable) {
              return null
            }

            // Skip the last column for now - we'll handle it separately below
            if (index === columnsMeta.length - 1) {
              return null
            }

            const cumulativeWidth = columnsMeta
              .slice(0, index + 1)
              .reduce(
                (sum, { style }) =>
                  sum + (parseInt(style.width as string, 10) || 100),
                0
              )

            return (
              <div
                key={`resize-${index}`}
                className="separated-resize-handle"
                style={{ left: `${cumulativeWidth}px` }}
                onMouseDown={(e) =>
                  handleResizeMouseDown(
                    e,
                    columnMeta.key,
                    parseInt(columnMeta.style.width as string, 10) || 100
                  )
                }
                title="Resize column"
              />
            )
          })}

          {/* Special resize handle for the last column */}
          {columnsMeta.length > 0 &&
            columnsMeta[columnsMeta.length - 1].col.resizable && (
              <div
                key="resize-last"
                className="separated-resize-handle last-column-resize"
                style={{
                  left: `${columnsMeta.reduce(
                    (sum, { style }) =>
                      sum + (parseInt(style.width as string, 10) || 100),
                    0
                  )}px`
                }}
                onMouseDown={(e) =>
                  handleResizeMouseDown(
                    e,
                    columnsMeta[columnsMeta.length - 1].key,
                    parseInt(
                      columnsMeta[columnsMeta.length - 1].style.width as string,
                      10
                    ) || 100
                  )
                }
                title="Resize last column"
              />
            )}
        </div>
      </div>
      <ColumnDragOverlay activeColumn={activeColumn} colDefs={colDefs} />
    </DndContext>
  )
}

export default memo(TableHeader) as typeof TableHeader
