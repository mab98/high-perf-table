import type { Column } from "../../types/table"
import {
  TableSearch,
  TableHeader,
  TableBody,
  TablePagination,
} from "./components"
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
  blankSlateText?: string
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
  pageSize = 10,
  onPageChange,
  blankSlateText = "No records found",
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

      <div className="table-wrapper">
        <table className="table-main">
          <TableHeader
            colDefs={colDefs}
            currentSort={currentSort}
            onSort={onSort}
          />
          <TableBody
            data={data}
            colDefs={colDefs}
            loading={loading}
            pageSize={pageSize}
            blankSlateText={blankSlateText}
          />
        </table>
      </div>

      {onPageChange && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalRecords={totalRecords}
          loading={loading}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}

export default Table
