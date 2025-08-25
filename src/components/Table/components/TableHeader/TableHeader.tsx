import { TABLE_CELL_MIN_WIDTH } from "../../../../constants/table"
import type { Column } from "../../../../types/table"
import "./TableHeader.css"

interface TableHeaderProps<T> {
  colDefs: Column<T>[]
  currentSort?: { field: string; direction: "asc" | "desc" } | null
  onSort?: (field: string, direction: "asc" | "desc") => void
}

const TableHeader = <T,>({
  colDefs,
  currentSort,
  onSort,
}: TableHeaderProps<T>) => {
  return (
    <thead>
      <tr>
        {colDefs.map((col) => (
          <th
            key={col.key}
            className={`table-header ${col.sortable ? "sortable" : ""}`}
            style={{
              width: col.width ? `${col.width}px` : undefined,
              minWidth: col.width
                ? `${col.width}px`
                : `${TABLE_CELL_MIN_WIDTH}px`,
            }}
            onClick={() => {
              if (col.sortable && onSort) {
                const newDirection =
                  currentSort?.field === col.key &&
                  currentSort.direction === "asc"
                    ? "desc"
                    : "asc"
                onSort(col.key, newDirection)
              }
            }}
          >
            <div className="header-content">
              <span>{col.title}</span>
              {col.sortable && (
                <span className="sort-icon">
                  {currentSort?.field === col.key
                    ? currentSort.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "⇅"}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default TableHeader
