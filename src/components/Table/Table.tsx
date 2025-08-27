import React from "react"
import { TableVirtuoso } from "react-virtuoso"
import { PAGE_SIZE, ROW_HEIGHT } from "../../constants"
import type { Column } from "../../types/table"
import { useColumnWidths } from "../../hooks/useColumnWidths"
import {
  BlankSlate,
  SkeletonRow,
  TableHeader,
  TableRow,
  TableSearch,
  TableStatus,
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
  onPageChange?: (offset: number) => void
  tableWidth?: number
  tableHeight?: number
  numberOfRows?: number
  rowHeight?: number
}

type TableData<T> = T & { id?: string | number }

const Table = <T extends Record<string, unknown>>({
  data,
  totalRecords,
  colDefs,
  loading = false,
  currentSort,
  onSort,
  searchValue = "",
  onSearch,
  currentPage = 0,
  onPageChange,
  tableWidth,
  tableHeight,
  numberOfRows = PAGE_SIZE,
  rowHeight = ROW_HEIGHT,
}: TableProps<TableData<T>>) => {
  const columnWidths = useColumnWidths({ colDefs, tableWidth })

  const enhancedColDefs = colDefs.map((col, index) => ({
    ...col,
    width: columnWidths[index]?.width || col.width,
  }))

  const headerHeight = rowHeight + 5
  const bodyHeight = numberOfRows * rowHeight
  const defaultTableHeight = headerHeight + bodyHeight

  const containerStyle = {
    width: tableWidth ? `${tableWidth}px` : undefined,
    "--row-height": `${rowHeight}px`,
    "--header-height": `${headerHeight}px`,
  } as React.CSSProperties

  const tableWrapperStyle: React.CSSProperties = {
    height: tableHeight ? `${tableHeight}px` : `${defaultTableHeight}px`,
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
      columnWidths={columnWidths}
    />
  )

  const renderItemContent = (index: number, row: TableData<T>) => (
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
          <TableHeader
            colDefs={enhancedColDefs}
            currentSort={currentSort}
            onSort={onSort}
            columnWidths={columnWidths}
          />
          {Array.from({ length: numberOfRows }, (_, index) => (
            <SkeletonRow key={index} colDefs={enhancedColDefs} />
          ))}
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="empty-state-container">
          <TableHeader
            colDefs={enhancedColDefs}
            currentSort={currentSort}
            onSort={onSort}
            columnWidths={columnWidths}
          />
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
      {onSearch && (
        <div className="table-actions-bar">
          <TableSearch
            value={searchValue}
            onChange={onSearch}
            disabled={loading}
          />
        </div>
      )}

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
