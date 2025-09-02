import TableContainer from "@/components/Table/components/TableContainer/TableContainer"
import TableTooltip from "@/components/Table/components/TableTooltip/TableTooltip"
import {
  DEFAULT_TABLE_HEIGHT,
  DEFAULT_TABLE_WIDTH,
  PAGE_SIZE
} from "@/constants"
import { useColumnOrder } from "@/hooks/useColumnOrder"
import { useColumnWidths } from "@/hooks/useColumnWidths"
import { useOptimizedTable } from "@/hooks/useOptimizedTable"
import type { Column, SortState } from "@/types/table"
import { useCallback, useMemo, useState } from "react"

interface TableProps<T> {
  data: T[]
  totalRecords: number
  colDefs: Column<T>[]
  loading?: boolean
  sort?: SortState | null
  onSort?: (params: SortState) => void
  searchValue?: string
  onSearch?: (searchTerm: string) => void
  filters?: Record<string, string>
  onFilterChange?: (params: { key: string; value: string }) => void
  onClearAllFilters?: () => void
  offset?: number
  onOffsetChange?: (offset: number) => void
  tableWidth?: number
  tableHeight?: number
  numberOfRows?: number
}

interface TooltipState {
  text: string
  x: number
  y: number
}

const Table = <T extends Record<string, unknown>>({
  data,
  totalRecords,
  colDefs,
  loading = false,
  sort,
  onSort,
  searchValue = "",
  onSearch,
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
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const { orderedColDefs, handleColumnReorder } = useColumnOrder(colDefs)
  const { hasAnyFilters, createClearHandler } = useOptimizedTable({
    searchValue,
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

  const handleColumnVisibilityChange = (params: {
    key: string
    visible: boolean
  }) => {
    const { key, visible } = params
    setVisibleColumns((prev) =>
      visible ? [...prev, key] : prev.filter((id) => id !== key)
    )
  }

  const handleToggleAllColumns = useCallback(
    (visible: boolean) => {
      setVisibleColumns(visible ? orderedColDefs.map((c) => c.key) : [])
    },
    [orderedColDefs]
  )

  const handleCellHover = useCallback(
    (text: string, element: HTMLElement | null) => {
      if (!element || !text) return setTooltip(null)
      const rect = element.getBoundingClientRect()
      setTooltip({
        text,
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top - 5 + window.scrollY
      })
    },
    []
  )

  const handleEndReached = useCallback(() => {
    if (!loading && data.length < totalRecords && onOffsetChange) {
      onOffsetChange(offset + 1)
    }
  }, [data.length, totalRecords, loading, onOffsetChange, offset])

  const handleClearAll = createClearHandler(onSearch, onClearAllFilters)

  const handleClearSort = useCallback(() => {
    onSort?.({ column: "", direction: "asc" })
  }, [onSort])

  return (
    <>
      <TableContainer
        data={data}
        totalRecords={totalRecords}
        colDefs={orderedColDefs}
        enhancedColDefs={enhancedColDefs}
        visibleColumns={visibleColumns}
        loading={loading}
        sort={sort}
        onSort={onSort}
        onClearSort={handleClearSort}
        searchValue={searchValue}
        onSearch={onSearch}
        filters={filters}
        onFilterChange={onFilterChange}
        onClearAllFilters={onClearAllFilters}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        onToggleAllColumns={handleToggleAllColumns}
        columnWidths={columnWidths}
        onCellHover={handleCellHover}
        onEndReached={handleEndReached}
        numberOfRows={numberOfRows}
        hasAnyFilters={hasAnyFilters}
        onClearAll={handleClearAll}
        tableWidth={tableWidth}
        tableHeight={tableHeight}
        onColumnReorder={handleColumnReorder}
      />

      {tooltip && (
        <TableTooltip
          text={tooltip.text}
          position={{ x: tooltip.x, y: tooltip.y }}
        />
      )}
    </>
  )
}

export default Table
