import LoadingFooter from "@/components/Table/components/LoadingFooter/LoadingFooter"
import TableActionsBar from "@/components/Table/components/TableActionsBar/TableActionsBar"
import "@/components/Table/components/TableContainer/TableContainer.css"
import TableContent from "@/components/Table/components/TableContent/TableContent"
import TableStatus from "@/components/Table/components/TableStatus/TableStatus"
import type { ColumnWidthInfo } from "@/hooks/useColumnWidths"
import type { Column, SortState } from "@/types/table"

interface TableContainerProps<T> {
  data: T[]
  totalRecords: number
  colDefs: Column<T>[]
  enhancedColDefs: Column<T>[]
  visibleColumns: string[]
  loading: boolean
  currentSort?: SortState | null
  onSort?: (params: SortState) => void
  onClearSort: () => void
  searchValue?: string
  onSearch?: (searchTerm: string) => void
  filters?: Record<string, string>
  onFilterChange?: (params: { key: string; value: string }) => void
  onClearAllFilters?: () => void
  onColumnVisibilityChange: (params: { key: string; visible: boolean }) => void
  onToggleAllColumns: (visible: boolean) => void
  columnWidths: ColumnWidthInfo[]
  onCellHover: (text: string, element: HTMLElement | null) => void
  onEndReached: () => void
  numberOfRows: number
  hasAnyFilters: boolean
  onClearAll?: () => void
  tableWidth: number
  tableHeight: number
}

const TableContainer = <T extends Record<string, unknown>>({
  data,
  totalRecords,
  colDefs,
  enhancedColDefs,
  visibleColumns,
  loading,
  currentSort,
  onSort,
  onClearSort,
  searchValue,
  onSearch,
  filters,
  onFilterChange,
  onClearAllFilters,
  onColumnVisibilityChange,
  onToggleAllColumns,
  columnWidths,
  onCellHover,
  onEndReached,
  numberOfRows,
  hasAnyFilters,
  onClearAll,
  tableWidth,
  tableHeight
}: TableContainerProps<T>) => {
  return (
    <div className="table-container" style={{ width: tableWidth }}>
      <TableActionsBar
        colDefs={colDefs}
        visibleColumns={visibleColumns}
        searchValue={searchValue}
        onSearch={onSearch}
        filters={filters}
        onFilterChange={onFilterChange}
        onClearAllFilters={onClearAllFilters}
        onColumnVisibilityChange={onColumnVisibilityChange}
        onToggleAllColumns={onToggleAllColumns}
        loading={loading}
      />

      <div className="table-content-wrapper" style={{ height: tableHeight }}>
        <TableContent
          data={data}
          colDefs={enhancedColDefs}
          loading={loading}
          currentSort={currentSort}
          onSort={onSort}
          onClearSort={onClearSort}
          columnWidths={columnWidths}
          onCellHover={onCellHover}
          onEndReached={onEndReached}
          numberOfRows={numberOfRows}
          hasAnyFilters={hasAnyFilters}
          onClearAll={onClearAll}
        />
        <LoadingFooter loading={loading} hasData={data.length > 0} />
      </div>

      <TableStatus
        loadedRecords={data.length}
        totalRecords={totalRecords}
        loading={loading}
      />
    </div>
  )
}

export default TableContainer
