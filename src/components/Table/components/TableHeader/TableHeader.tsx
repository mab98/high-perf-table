import type { Column } from "../../../../types/table"
import "./TableHeader.css"

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
  columnWidths,
}: TableHeaderProps<T>) => {
  const handleSort = (col: Column<T>) => {
    if (col.sortable && onSort) {
      const currentColumn = currentSort?.column
      const currentDirection = currentSort?.direction

      if (currentColumn === col.key) {
        if (currentDirection === "asc") {
          onSort(col.key, "desc")
        } else if (currentDirection === "desc") {
          // Third click - clear sorting
          if (onClearSort) {
            onClearSort()
          }
        }
      } else {
        // First click on a new column - sort ascending
        onSort(col.key, "asc")
      }
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
              width: `${widthInfo?.width || col.width}px`,
              minWidth: `${widthInfo?.minWidth || col.width}px`,
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
