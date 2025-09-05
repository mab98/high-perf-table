import ColumnDragOverlay from "@/components/Table/components/TableHeader/ColumnDragOverlay"
import ResizableHeaderCell from "@/components/Table/components/TableHeader/ResizableHeaderCell"
import SeparateResizeHandle from "@/components/Table/components/TableHeader/SeparateResizeHandle"
import "@/components/Table/components/TableHeader/TableHeader.css"
import { CELL_MIN_WIDTH } from "@/components/Table/constants"
import type { ColumnWidthInfo } from "@/components/Table/hooks/useColumnWidths"
import { useTableHeaderDrag } from "@/components/Table/hooks/useTableHeaderDrag"
import type { Column, Sort } from "@/components/Table/types/table"
import { DndContext } from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable"
import clsx from "clsx"
import { memo, useCallback, useMemo } from "react"

interface ResizableTableHeaderProps<T> {
  colDefs: Column<T>[]
  sort?: Sort | null
  onSort?: (params: Sort) => void
  onClearSort?: () => void
  columnWidths: ColumnWidthInfo[]
  onColumnReorder?: (activeId: string, overId: string) => void
  canReorder?: (activeId: string, overId: string) => boolean
  tableWidth?: number
  setColumnWidth?: (columnKey: string, width: number) => void
}

const ResizableTableHeader = <T,>({
  colDefs,
  sort,
  onSort,
  onClearSort,
  columnWidths,
  onColumnReorder,
  canReorder,
  tableWidth,
  setColumnWidth
}: ResizableTableHeaderProps<T>) => {
  const {
    activeColumn,
    tableHeaderRef,
    constrainedHorizontalModifier,
    sensors,
    handleDragStart,
    handleDragEnd
  } = useTableHeaderDrag({
    tableWidth,
    onColumnReorder: (activeId, overId) => {
      // Check if reordering is allowed (for pinned columns)
      if (onColumnReorder && (!canReorder || canReorder(activeId, overId))) {
        onColumnReorder(activeId, overId)
      }
    }
  })

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

  const handleResize = useCallback(
    (columnKey: string, width: number) => {
      if (setColumnWidth) {
        setColumnWidth(columnKey, width)
      }
    },
    [setColumnWidth]
  )

  const columnsMeta = useMemo(() => {
    let leftPinnedOffset = 0
    let rightPinnedOffset = 0

    // Calculate offsets for right-pinned columns (in reverse order)
    const rightPinnedWidths: number[] = []
    for (let i = colDefs.length - 1; i >= 0; i--) {
      const col = colDefs[i]
      if (col.pinned === "right") {
        const widthInfo = columnWidths[i]
        const colWidth = widthInfo?.width || CELL_MIN_WIDTH
        rightPinnedWidths.unshift(rightPinnedOffset)
        rightPinnedOffset += colWidth
      }
    }

    let rightPinnedIndex = 0

    return colDefs.map((col, index) => {
      const widthInfo = columnWidths[index]
      const isActive = sort?.column === col.key
      const sortDirection = isActive ? sort.direction : null
      const colWidth = widthInfo?.width || CELL_MIN_WIDTH

      const style: React.CSSProperties = {
        minWidth: `${widthInfo?.minWidth || CELL_MIN_WIDTH}px`
      }

      // Apply positioning for pinned columns
      if (col.pinned === "left") {
        style.left = `${leftPinnedOffset}px`
        leftPinnedOffset += colWidth
      } else if (col.pinned === "right") {
        style.right = `${rightPinnedWidths[rightPinnedIndex]}px`
        rightPinnedIndex++
      }

      return {
        key: col.key,
        title: col.title,
        col,
        style,
        isActive,
        sortDirection,
        width: colWidth
      }
    })
  }, [colDefs, columnWidths, sort])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      autoScroll={false}
      modifiers={[constrainedHorizontalModifier]}
    >
      <div className={clsx("table-header-row")} ref={tableHeaderRef}>
        <SortableContext
          items={columnsMeta.map((c) => c.key)}
          strategy={horizontalListSortingStrategy}
        >
          {columnsMeta.map(
            ({ key, col, style, isActive, sortDirection, width }) => (
              <ResizableHeaderCell
                key={key}
                col={col}
                width={width}
                style={style}
                isActive={isActive}
                sortDirection={sortDirection}
                onSort={handleSort}
                pinned={col.pinned || null}
              />
            )
          )}
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
              .reduce((sum, { width }) => sum + width, 0)

            return (
              <SeparateResizeHandle
                key={`resize-${index}`}
                columnKey={columnMeta.key}
                currentWidth={columnMeta.width}
                onResize={(newWidth) => handleResize(columnMeta.key, newWidth)}
                position={cumulativeWidth}
              />
            )
          })}

          {/* Special resize handle for the last column */}
          {columnsMeta.length > 0 &&
            columnsMeta[columnsMeta.length - 1].col.resizable && (
              <SeparateResizeHandle
                key="resize-last"
                columnKey={columnsMeta[columnsMeta.length - 1].key}
                currentWidth={columnsMeta[columnsMeta.length - 1].width}
                onResize={(newWidth) =>
                  handleResize(
                    columnsMeta[columnsMeta.length - 1].key,
                    newWidth
                  )
                }
                position={columnsMeta.reduce(
                  (sum, { width }) => sum + width,
                  0
                )}
                isLast={true}
              />
            )}
        </div>
      </div>
      <ColumnDragOverlay activeColumn={activeColumn} colDefs={colDefs} />
    </DndContext>
  )
}

export default memo(ResizableTableHeader) as typeof ResizableTableHeader
