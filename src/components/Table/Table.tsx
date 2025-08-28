import React, { useMemo, useState } from "react"
import { TableVirtuoso } from "react-virtuoso"
import { PAGE_SIZE } from "../../constants"
import { useColumnWidths } from "../../hooks/useColumnWidths"
import type { Column } from "../../types/table"
import {
  BlankSlate,
  ColumnsButton,
  FiltersButton,
  SkeletonRow,
  TableHeader,
  TableRow,
  TableSearch,
  TableStatus
} from "./components"
import "./Table.css"

interface TableProps<T> {
  data: T[]
  totalRecords: number
  colDefs: Column<T>[]
  loading?: boolean
  currentSort?: { column: string; direction: "asc" | "desc" } | null
  onSort?: (column: string, direction: "asc" | "desc") => void
  searchValue?: string
  onSearch?: (searchTerm: string) => void
  filters?: Record<string, string>
  onFilterChange?: (columnKey: string, value: string) => void
  onClearAllFilters?: () => void
  currentPage?: number
  onPageChange?: (offset: number) => void
  tableWidth?: number
  tableHeight?: number
  numberOfRows?: number
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
  currentPage = 0,
  onPageChange,
  tableWidth,
  tableHeight,
  numberOfRows = PAGE_SIZE
}: TableProps<T>) => {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
    colDefs.map((col) => col.key)
  )

  const visibleColDefs = useMemo(() => {
    return colDefs.filter((col) => visibleColumns.includes(col.key))
  }, [colDefs, visibleColumns])

  const columnWidths = useColumnWidths({ colDefs: visibleColDefs, tableWidth })

  const enhancedColDefs = visibleColDefs.map((col, index) => ({
    ...col,
    width: columnWidths[index]?.width || col.width
  }))

  const containerStyle = {
    width: tableWidth ? `${tableWidth}px` : undefined
  } as React.CSSProperties

  const tableWrapperStyle: React.CSSProperties = {
    height: tableHeight
  }

  const handleColumnVisibilityChange = (
    columnKey: string,
    visible: boolean
  ) => {
    setVisibleColumns((prev) =>
      visible ? [...prev, columnKey] : prev.filter((id) => id !== columnKey)
    )
  }

  const handleToggleAllColumns = (visible: boolean) => {
    setVisibleColumns(visible ? colDefs.map((c) => c.key) : [])
  }

  const handleEndReached = () => {
    const hasMoreData = data.length < totalRecords
    if (!loading && hasMoreData && onPageChange) {
      onPageChange(currentPage + 1)
    }
  }

  const renderFixedHeader = () => (
    <TableHeader
      colDefs={enhancedColDefs}
      currentSort={currentSort}
      onSort={onSort}
      onClearSort={() => onSort?.("", "asc")}
      columnWidths={columnWidths}
    />
  )

  const renderItemContent = (index: number, row: T) => (
    <TableRow
      row={row}
      colDefs={enhancedColDefs}
      index={index}
      columnWidths={columnWidths}
    />
  )

  const renderFixedFooter = () => {
    if (!loading) return null

    return (
      <div className="loading-container">
        <div className="loading-indicator">
          <div className="loading-spinner" />
          <strong>Loading more data...</strong>
        </div>
      </div>
    )
  }

  const renderTableContent = () => {
    if (loading && data.length === 0) {
      return (
        <div className="skeleton-container">
          {renderFixedHeader()}
          {Array.from({ length: numberOfRows }, (_, index) => (
            <SkeletonRow key={index} colDefs={enhancedColDefs} />
          ))}
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="empty-state-container">
          {renderFixedHeader()}
          <div className="blankslate-wrapper">
            <BlankSlate text="No records found." />
          </div>
        </div>
      )
    }

    return (
      <TableVirtuoso
        data={data}
        fixedHeaderContent={renderFixedHeader}
        itemContent={renderItemContent}
        fixedFooterContent={renderFixedFooter}
        endReached={handleEndReached}
      />
    )
  }

  return (
    <div className="table-container" style={containerStyle}>
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

      <div className="table-wrapper" style={tableWrapperStyle}>
        {renderTableContent()}
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
