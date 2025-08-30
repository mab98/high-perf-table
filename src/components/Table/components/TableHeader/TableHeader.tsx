import "@/components/Table/components/TableHeader/TableHeader.css"
import { CELL_MIN_WIDTH } from "@/constants"
import type { Column } from "@/types/table"

interface ColumnWidthInfo {
  width: number
  minWidth: number
}

interface TableHeaderProps<T> {
  colDefs: Column<T>[]
  currentSort?: { column: string; direction: "asc" | "desc" } | null
  onSort?: (column: string, direction: "asc" | "desc") => void
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
  const handleSort = (col: Column<T>) => {
    if (!col.sortable || !onSort) return

    const isCurrentColumn = currentSort?.column === col.key
    const direction = currentSort?.direction

    if (!isCurrentColumn) {
      // First click → sort ascending
      onSort(col.key, "asc")
    } else if (direction === "asc") {
      // Second click → sort descending
      onSort(col.key, "desc")
    } else if (direction === "desc" && onClearSort) {
      // Third click → clear sorting
      onClearSort()
    }
  }

  return (
    <div className="table-header-row">
      {colDefs.map((col, index) => {
        const widthInfo = columnWidths[index]
        const isActive = currentSort?.column === col.key
        const sortDirection = isActive ? currentSort.direction : null

        return (
          <div
            key={col.key}
            className={`table-header ${col.sortable ? "sortable" : ""} ${
              isActive ? "active" : ""
            }`}
            style={{
              width: `${widthInfo?.width || CELL_MIN_WIDTH}px`,
              minWidth: `${widthInfo?.minWidth || CELL_MIN_WIDTH}px`
            }}
            onClick={() => handleSort(col)}
            role={col.sortable ? "button" : undefined}
            tabIndex={col.sortable ? 0 : undefined}
          >
            <div className="header-content">
              <span className="header-title">{col.title}</span>
              {col.sortable && (
                <span className={`sort-icon ${sortDirection || ""}`}>
                  {sortDirection === "asc"
                    ? "▲"
                    : sortDirection === "desc"
                      ? "▼"
                      : "⇅"}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TableHeader
