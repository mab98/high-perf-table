import {
  ColumnsButton,
  FiltersButton,
  TableSearch
} from "@/components/Table/components"
import type { Column } from "@/types/table"
import "./TableActionsBar.css"

interface TableActionsBarProps<T> {
  colDefs: Column<T>[]
  visibleColumns: string[]
  searchValue?: string
  onSearch?: (searchTerm: string) => void
  filters?: Record<string, string>
  onFilterChange?: (params: { key: string; value: string }) => void
  onClearAllFilters?: () => void
  onColumnVisibilityChange: (params: { key: string; visible: boolean }) => void
  onToggleAllColumns: (visible: boolean) => void
  loading?: boolean
}

const TableActionsBar = <T extends Record<string, unknown>>({
  colDefs,
  visibleColumns,
  searchValue = "",
  onSearch,
  filters = {},
  onFilterChange,
  onClearAllFilters,
  onColumnVisibilityChange,
  onToggleAllColumns,
  loading = false
}: TableActionsBarProps<T>) => {
  return (
    <div className="table-actions-bar">
      <div className="table-actions-left">
        {onSearch && (
          <TableSearch
            value={searchValue}
            onChange={onSearch}
            disabled={loading}
          />
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
          onColumnVisibilityChange={onColumnVisibilityChange}
          onToggleAllColumns={onToggleAllColumns}
        />
      </div>
    </div>
  )
}

export default TableActionsBar
