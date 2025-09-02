import LoadingFooter from "@/components/Table/components/LoadingFooter/LoadingFooter"
import TableActionsBar from "@/components/Table/components/TableActionsBar/TableActionsBar"
import "@/components/Table/components/TableContainer/TableContainer.css"
import TableContent from "@/components/Table/components/TableContent/TableContent"
import TableStatus from "@/components/Table/components/TableStatus/TableStatus"
import type { ColumnWidthInfo } from "@/hooks/useColumnWidths"
import type { Column, ColumnVisibility, Sort } from "@/types/table"

interface TableContainerProps<T> {
  data: T[]
  totalRecords: number
  colDefs: Column<T>[]
  enhancedColDefs: Column<T>[]
  visibleColumns: string[]
  loading: boolean
  sort?: Sort | null
  onSort?: (params: Sort) => void
  onClearSort: () => void
  search?: string
  setSearch?: (term: string) => void
  filters?: Record<string, string>
  onFilterChange?: (params: { key: string; value: string }) => void
  onClearAllFilters?: () => void
  onColumnVisibility: (params: ColumnVisibility) => void
  columnWidths: ColumnWidthInfo[]
  onCellHover: (text: string, element: HTMLElement | null) => void
  onEndReached: () => void
  numberOfRows: number
  hasSearchOrFilters: boolean
  onClearAll?: () => void
  tableWidth: number
  tableHeight: number
  onColumnReorder: (activeId: string, overId: string) => void
}

const TableContainer = <T extends Record<string, unknown>>({
  data,
  totalRecords,
  colDefs,
  enhancedColDefs,
  visibleColumns,
  loading,
  sort,
  onSort,
  onClearSort,
  search,
  setSearch,
  filters,
  onFilterChange,
  onClearAllFilters,
  onColumnVisibility,
  columnWidths,
  onCellHover,
  onEndReached,
  numberOfRows,
  hasSearchOrFilters,
  onClearAll,
  tableWidth,
  tableHeight,
  onColumnReorder
}: TableContainerProps<T>) => {
  return (
    <div className="table-container" style={{ width: tableWidth }}>
      <TableActionsBar
        colDefs={colDefs}
        visibleColumns={visibleColumns}
        search={search}
        setSearch={setSearch}
        filters={filters}
        onFilterChange={onFilterChange}
        onClearAllFilters={onClearAllFilters}
        onColumnVisibility={onColumnVisibility}
        loading={loading}
      />

      <div className="table-content-wrapper" style={{ height: tableHeight }}>
        <TableContent
          data={data}
          colDefs={enhancedColDefs}
          loading={loading}
          sort={sort}
          onSort={onSort}
          onClearSort={onClearSort}
          columnWidths={columnWidths}
          onCellHover={onCellHover}
          onEndReached={onEndReached}
          numberOfRows={numberOfRows}
          hasSearchOrFilters={hasSearchOrFilters}
          onClearAll={onClearAll}
          onColumnReorder={onColumnReorder}
          tableWidth={tableWidth}
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
