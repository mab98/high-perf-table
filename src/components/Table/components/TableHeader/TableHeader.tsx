import "@/components/Table/components/TableHeader/TableHeader.css"
import { renderSortIcon } from "@/components/Table/components/TableHeader/utils"
import { CELL_MIN_WIDTH } from "@/constants"
import type { ColumnWidthInfo } from "@/hooks/useColumnWidths"
import type { Column, SortState } from "@/types/table"
import clsx from "clsx"
import { memo, useCallback, useMemo } from "react"

interface TableHeaderProps<T> {
  colDefs: Column<T>[]
  currentSort?: SortState | null
  onSort?: (params: SortState) => void
  onClearSort?: () => void
  columnWidths: ColumnWidthInfo[]
}

const TableHeader = <T,>({
  colDefs,
  currentSort,
  onSort,
  onClearSort,
  columnWidths
}: TableHeaderProps<T>) => {
  const handleSort = useCallback(
    (col: Column<T>) => {
      if (!col.sortable || !onSort) return

      const isCurrentColumn = currentSort?.column === col.key
      const direction = currentSort?.direction

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
    [currentSort, onSort, onClearSort]
  )

  const columnsMeta = useMemo(
    () =>
      colDefs.map((col, index) => {
        const widthInfo = columnWidths[index]
        const isActive = currentSort?.column === col.key
        const sortDirection = isActive ? currentSort.direction : null

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
    [colDefs, columnWidths, currentSort]
  )

  return (
    <div className="table-header-row">
      {columnsMeta.map(
        ({ key, title, col, style, isActive, sortDirection }) => (
          <div
            key={key}
            className={clsx("table-header", {
              sortable: col.sortable,
              active: isActive
            })}
            style={style}
            role={col.sortable ? "button" : undefined}
            tabIndex={col.sortable ? 0 : undefined}
            onClick={() => handleSort(col)}
          >
            <div className="header-content">
              <span className="header-title">{title}</span>
              {renderSortIcon(col, sortDirection)}
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default memo(TableHeader) as typeof TableHeader
