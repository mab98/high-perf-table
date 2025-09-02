import ColumnsButton from "@/components/Table/components/ColumnsButton/ColumnsButton"
import FiltersButton from "@/components/Table/components/FiltersButton/FiltersButton"
import "@/components/Table/components/TableActionsBar/TableActionsBar.css"
import TableSearch from "@/components/Table/components/TableSearch/TableSearch"
import type { Column, ColumnVisibility } from "@/types/table"

interface TableActionsBarProps<T> {
  colDefs: Column<T>[]
  visibleColumns: string[]
  search?: string
  setSearch?: (term: string) => void
  filters?: Record<string, string>
  onFilterChange?: (params: { key: string; value: string }) => void
  onClearAllFilters?: () => void
  onColumnVisibility: (params: ColumnVisibility) => void
  loading?: boolean
}

const TableActionsBar = <T extends Record<string, unknown>>({
  colDefs,
  visibleColumns,
  search = "",
  setSearch,
  filters = {},
  onFilterChange,
  onClearAllFilters,
  onColumnVisibility,
  loading = false
}: TableActionsBarProps<T>) => {
  return (
    <div className="table-actions-bar">
      <div className="table-actions-left">
        {setSearch && (
          <TableSearch value={search} onChange={setSearch} disabled={loading} />
        )}
      </div>
      <div className="table-actions-right">
        {onFilterChange && onClearAllFilters && (
          <FiltersButton
            colDefs={colDefs}
            filters={filters}
            onFilterChange={onFilterChange}
            onClearAllFilters={onClearAllFilters}
          />
        )}
        <ColumnsButton
          colDefs={colDefs}
          visibleColumns={visibleColumns}
          onColumnVisibility={onColumnVisibility}
        />
      </div>
    </div>
  )
}

export default TableActionsBar
