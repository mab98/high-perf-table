import { TableVirtuoso } from "react-virtuoso"
import { DEFAULT_PAGE_SIZE } from "../../constants/table"
import type { Column } from "../../types/table"
import { TableHeader, TableRow, TableSearch, TableStatus } from "./components"
import "./Table.css"

interface TableProps<T> {
  data: T[]
  totalRecords: number
  colDefs: Column<T>[]
  loading?: boolean
  currentSort?: { field: string; direction: "asc" | "desc" } | null
  onSort?: (field: string, direction: "asc" | "desc") => void
  searchValue?: string
  onSearch?: (searchTerm: string) => void
  currentPage?: number
  pageSize?: number
  onPageChange?: (offset: number) => void
}

const Table = <T extends Record<string, unknown> & { id?: string | number }>({
  data,
  totalRecords,
  colDefs,
  loading = false,
  currentSort,
  onSort,
  searchValue = "",
  onSearch,
  currentPage = 0,
  onPageChange,
}: TableProps<T>) => {
  return (
    <div className="table-container">
      {onSearch && (
        <TableSearch
          value={searchValue}
          onChange={onSearch}
          disabled={loading}
        />
      )}

      <div
        className="table-wrapper"
        style={{ height: `${DEFAULT_PAGE_SIZE * 36}px` }}
      >
        <TableVirtuoso
          data={data}
          fixedHeaderContent={() => (
            <TableHeader
              colDefs={colDefs}
              currentSort={currentSort}
              onSort={onSort}
            />
          )}
          itemContent={(index, row) => (
            <TableRow row={row} colDefs={colDefs} index={index} />
          )}
          rangeChanged={({ endIndex }) => {
            const buffer = Math.floor(DEFAULT_PAGE_SIZE / 2)
            const hasMoreData = data.length < totalRecords

            if (!loading && hasMoreData && endIndex >= data.length - buffer) {
              onPageChange?.(currentPage + 1)
            }
          }}
        />
      </div>

      <TableStatus
        loadedRecords={data.length}
        totalRecords={totalRecords}
        loading={loading}
      />
    </div>
  )
}

export default Table
