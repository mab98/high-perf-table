import {
  BlankSlate,
  ColumnsButton,
  FiltersButton,
  SkeletonRow,
  TableHeader,
  TableRow,
  TableSearch,
  TableStatus
} from "@/components/Table/components"
import "@/components/Table/Table.css"
import {
  DEFAULT_TABLE_HEIGHT,
  DEFAULT_TABLE_WIDTH,
  PAGE_SIZE
} from "@/constants"
import { useColumnWidths } from "@/hooks/useColumnWidths"
import type { Column, SortState } from "@/types/table"
import { useCallback, useEffect, useMemo, useState } from "react"
import { TableVirtuoso } from "react-virtuoso"
import TableTooltip from "./components/TableTooltip"

interface TableProps<T> {
  data: T[]
  totalRecords: number
  colDefs: Column<T>[]
  loading?: boolean
  currentSort?: SortState | null
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
  currentSort,
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

  // Clear tooltip when data, search, or loading changes
  useEffect(() => {
    setTooltip(null)
  }, [data, searchValue, loading])

  const visibleColDefs = useMemo(
    () => colDefs.filter((col) => visibleColumns.includes(col.key)),
    [colDefs, visibleColumns]
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
      setVisibleColumns(visible ? colDefs.map((c) => c.key) : [])
    },
    [colDefs]
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

  const hasActiveSearch = searchValue.trim() !== ""
  const hasActiveFilters = Object.values(filters).some((v) => v.trim() !== "")
  const hasAnyFilters = hasActiveSearch || hasActiveFilters

  const handleClearAll = useCallback(() => {
    if (onSearch && hasActiveSearch) onSearch("")
    if (onClearAllFilters && hasActiveFilters) onClearAllFilters()
  }, [onSearch, onClearAllFilters, hasActiveSearch, hasActiveFilters])

  const handleClearSort = useCallback(() => {
    onSort?.({ column: "", direction: "asc" })
  }, [onSort])

  const renderHeader = useCallback(
    () => (
      <TableHeader
        colDefs={enhancedColDefs}
        currentSort={currentSort}
        onSort={onSort}
        onClearSort={handleClearSort}
        columnWidths={columnWidths}
      />
    ),
    [enhancedColDefs, currentSort, onSort, columnWidths, handleClearSort]
  )

  const renderRow = useCallback(
    (index: number, row: T) => (
      <TableRow
        row={row}
        colDefs={enhancedColDefs}
        index={index}
        columnWidths={columnWidths}
        onCellHover={handleCellHover}
      />
    ),
    [enhancedColDefs, columnWidths, handleCellHover]
  )

  const renderLoadingFooter = () => {
    if (!loading || data.length === 0) return null
    return (
      <div className="loading-container">
        <div className="loading-indicator">
          <div className="loading-spinner" />
          <strong>Loading more data...</strong>
        </div>
      </div>
    )
  }

  const skeletonContent = useMemo(
    () => (
      <div className="skeleton-container">
        {renderHeader()}
        {Array.from({ length: numberOfRows }, (_, idx) => (
          <SkeletonRow key={idx} colDefs={enhancedColDefs} />
        ))}
      </div>
    ),
    [numberOfRows, enhancedColDefs, renderHeader]
  )

  const emptyState = useMemo(
    () => (
      <div className="empty-state-container">
        {renderHeader()}
        <div className="blankslate-wrapper">
          <BlankSlate
            text="No records found."
            onClearAll={hasAnyFilters ? handleClearAll : undefined}
            hasActiveFilters={hasAnyFilters}
          />
        </div>
      </div>
    ),
    [renderHeader, hasAnyFilters, handleClearAll]
  )

  const renderTableContent = useMemo(() => {
    if (loading && data.length === 0) return skeletonContent
    if (data.length === 0) return emptyState

    return (
      <TableVirtuoso
        data={data}
        fixedHeaderContent={renderHeader}
        itemContent={renderRow}
        endReached={handleEndReached}
      />
    )
  }, [
    data,
    loading,
    skeletonContent,
    emptyState,
    renderHeader,
    renderRow,
    handleEndReached
  ])

  return (
    <div className="table-container" style={{ width: tableWidth }}>
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
            onColumnVisibilityChange={handleColumnVisibilityChange}
            onToggleAllColumns={handleToggleAllColumns}
          />
        </div>
      </div>

      <div style={{ height: tableHeight, position: "relative" }}>
        {renderTableContent}
        {renderLoadingFooter()}
      </div>

      {tooltip && (
        <TableTooltip
          text={tooltip.text}
          position={{ x: tooltip.x, y: tooltip.y }}
        />
      )}

      <TableStatus
        loadedRecords={data.length}
        totalRecords={totalRecords}
        loading={loading}
      />
    </div>
  )
}

export default Table
