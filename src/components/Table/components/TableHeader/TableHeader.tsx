import type { Column } from "../../../../types/table"
import "./TableHeader.css"

interface ColumnWidthInfo {
  width: number
  minWidth: number
}

interface TableHeaderProps<T> {
  colDefs: Column<T>[]
  currentSort?: { field: string; direction: "asc" | "desc" } | null
  onSort?: (field: string, direction: "asc" | "desc") => void
  columnWidths: ColumnWidthInfo[]
}

const TableHeader = <T,>({
  colDefs,
  currentSort,
  onSort,
  columnWidths,
}: TableHeaderProps<T>) => {
  const handleSort = (col: Column<T>) => {
    if (col.sortable && onSort) {
      const newDirection =
        currentSort?.field === col.key && currentSort.direction === "asc"
          ? "desc"
          : "asc"
      onSort(col.key, newDirection)
    }
  }

  return (
    <div className="table-header-row">
      {colDefs.map((col, index) => {
        const widthInfo = columnWidths[index]
        const isActive = currentSort?.field === col.key
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
                    : ""}
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
