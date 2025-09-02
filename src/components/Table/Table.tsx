import LoadingFooter from "@/components/Table/components/LoadingFooter/LoadingFooter"
import TableActionsBar from "@/components/Table/components/TableActionsBar/TableActionsBar"
import TableContent from "@/components/Table/components/TableContent/TableContent"
import TableStatus from "@/components/Table/components/TableStatus/TableStatus"
import {
  DEFAULT_TABLE_HEIGHT,
  DEFAULT_TABLE_WIDTH,
  PAGE_SIZE
} from "@/constants"
import { useColumnOrder } from "@/hooks/useColumnOrder"
import { useColumnWidths } from "@/hooks/useColumnWidths"
import { useSearchAndFilters } from "@/hooks/useSearchAndFilters"
import type { Column, ColumnVisibility, Sort, Tooltip } from "@/types/table"
import { useCallback, useMemo, useState } from "react"
import TableTooltip from "./components/TableTooltip/TableTooltip"
import "./Table.css"

interface TableProps<T> {
  data: T[]
  totalRecords: number
  colDefs: Column<T>[]
  loading?: boolean
  sort?: Sort | null
  onSort?: (params: Sort) => void
  search?: string
  setSearch?: (term: string) => void
  filters?: Record<string, string>
  onFilterChange?: (params: { key: string; value: string }) => void
  onClearAllFilters?: () => void
  offset?: number
  onOffsetChange?: (offset: number) => void
  tableWidth?: number
  tableHeight?: number
  numberOfRows?: number
}

const Table = <T extends Record<string, unknown>>({
  data,
  totalRecords,
  colDefs,
  loading = false,
  sort,
  onSort,
  search = "",
  setSearch,
  filters = {},
  onFilterChange,
  onClearAllFilters,
  offset = 0,
  onOffsetChange,
  tableWidth = DEFAULT_TABLE_WIDTH,
  tableHeight = DEFAULT_TABLE_HEIGHT,
  numberOfRows = PAGE_SIZE
}: TableProps<T>) => {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
    colDefs.map((col) => col.key)
  )
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)

  const { orderedColDefs, handleColumnReorder } = useColumnOrder(colDefs)
  const { hasSearchOrFilters, createClearHandler } = useSearchAndFilters({
    search,
    filters
  })

  const visibleColDefs = useMemo(
    () => orderedColDefs.filter((col) => visibleColumns.includes(col.key)),
    [orderedColDefs, visibleColumns]
  )

  const columnWidths = useColumnWidths({ colDefs: visibleColDefs, tableWidth })

  const enhancedColDefs = useMemo(
    () =>
      visibleColDefs.map((col, index) => ({
        ...col,
        width: columnWidths[index]?.width ?? col.width
      })),
    [visibleColDefs, columnWidths]
  )

  const handleColumnVisibility = useCallback(
    (params: ColumnVisibility) => {
      const { visible } = params

      if ("all" in params) {
        setVisibleColumns(visible ? orderedColDefs.map((c) => c.key) : [])
      } else if ("key" in params) {
        const { key } = params
        setVisibleColumns((prev) =>
          visible ? [...prev, key] : prev.filter((id) => id !== key)
        )
      }
    },
    [orderedColDefs]
  )

  const handleCellHover = useCallback(
    (text: string, element: HTMLElement | null) => {
      if (!element || !text) return setTooltip(null)
      const rect = element.getBoundingClientRect()
      setTooltip({
        text,
        position: {
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top - 5 + window.scrollY
        }
      })
    },
    []
  )

  const handleEndReached = useCallback(() => {
    if (!loading && data.length < totalRecords && onOffsetChange) {
      onOffsetChange(offset + 1)
    }
  }, [data.length, totalRecords, loading, onOffsetChange, offset])

  const handleClearAll = createClearHandler(setSearch, onClearAllFilters)

  const handleClearSort = useCallback(() => {
    onSort?.({ column: "", direction: "asc" })
  }, [onSort])

  return (
    <>
      <div className="table-container" style={{ width: tableWidth }}>
        <TableActionsBar
          colDefs={orderedColDefs}
          visibleColumns={visibleColumns}
          search={search}
          setSearch={setSearch}
          filters={filters}
          onFilterChange={onFilterChange}
          onClearAllFilters={onClearAllFilters}
          onColumnVisibility={handleColumnVisibility}
          loading={loading}
        />

        <div className="table-content-wrapper" style={{ height: tableHeight }}>
          <TableContent
            data={data}
            colDefs={enhancedColDefs}
            loading={loading}
            sort={sort}
            onSort={onSort}
            onClearSort={handleClearSort}
            columnWidths={columnWidths}
            onCellHover={handleCellHover}
            onEndReached={handleEndReached}
            numberOfRows={numberOfRows}
            hasSearchOrFilters={hasSearchOrFilters}
            onClearAll={handleClearAll}
            onColumnReorder={handleColumnReorder}
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

      {tooltip && <TableTooltip {...tooltip} />}
    </>
  )
}

export default Table
