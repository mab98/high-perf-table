import ClearEditsButton from "@/components/Table/components/ClearEditsButton/ClearEditsButton"
import Columns from "@/components/Table/components/Columns/Columns"
import Filters from "@/components/Table/components/Filters/Filters"
import "@/components/Table/components/TableActionsBar/TableActionsBar.css"
import TableSearch from "@/components/Table/components/TableSearch/TableSearch"
import type { Column, ColumnVisibility } from "../../types/table"

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
  hasEdits?: boolean
  onClearAllEdits?: () => void
  hasCustomSettings?: boolean
  onResetColumnSettings?: () => void
  tableTitle?: string
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
  loading = false,
  hasEdits = false,
  onClearAllEdits,
  hasCustomSettings = false,
  onResetColumnSettings,
  tableTitle
}: TableActionsBarProps<T>) => {
  return (
    <div className="table-actions-bar">
      <div className="table-actions-left">
        {tableTitle && <h2 className="table-title">{tableTitle}</h2>}
      </div>
      <div className="table-actions-right">
        {setSearch && (
          <TableSearch value={search} onChange={setSearch} disabled={loading} />
        )}
        {hasEdits && onClearAllEdits && (
          <ClearEditsButton
            onClearAllEdits={onClearAllEdits}
            disabled={loading}
          />
        )}
        {onFilterChange && onClearAllFilters && (
          <Filters
            colDefs={colDefs}
            visibleColumns={visibleColumns}
            filters={filters}
            onFilterChange={onFilterChange}
            onClearAllFilters={onClearAllFilters}
          />
        )}
        <Columns
          colDefs={colDefs}
          visibleColumns={visibleColumns}
          onColumnVisibility={onColumnVisibility}
          hasCustomSettings={hasCustomSettings}
          onResetColumnSettings={onResetColumnSettings}
        />
      </div>
    </div>
  )
}

export default TableActionsBar
