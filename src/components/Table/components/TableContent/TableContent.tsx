import BlankSlate from "@/components/Table/components/BlankSlate/BlankSlate"
import SkeletonRow from "@/components/Table/components/SkeletonRow/SkeletonRow"
import "@/components/Table/components/TableContent/TableContent.css"
import TableHeader from "@/components/Table/components/TableHeader/TableHeader"
import TableRow from "@/components/Table/components/TableRow/TableRow"
import type { ColumnWidthInfo } from "@/hooks/useColumnWidths"
import type { Column, Sort } from "@/types/table"
import { useCallback, useMemo } from "react"
import { TableVirtuoso } from "react-virtuoso"

interface TableContentProps<T> {
  data: T[]
  colDefs: Column<T>[]
  loading: boolean
  sort?: Sort | null
  onSort?: (params: Sort) => void
  onClearSort: () => void
  columnWidths: ColumnWidthInfo[]
  onCellHover: (text: string, element: HTMLElement | null) => void
  onEndReached: () => void
  numberOfRows: number
  hasSearchOrFilters: boolean
  onClearAll?: () => void
  onColumnReorder?: (activeId: string, overId: string) => void
  tableWidth?: number
}

const TableContent = <T extends Record<string, unknown>>({
  data,
  colDefs,
  loading,
  sort,
  onSort,
  onClearSort,
  columnWidths,
  onCellHover,
  onEndReached,
  numberOfRows,
  hasSearchOrFilters,
  onClearAll,
  onColumnReorder,
  tableWidth
}: TableContentProps<T>) => {
  const renderHeader = useCallback(
    () => (
      <TableHeader
        colDefs={colDefs}
        sort={sort}
        onSort={onSort}
        onClearSort={onClearSort}
        columnWidths={columnWidths}
        onColumnReorder={onColumnReorder}
        tableWidth={tableWidth}
      />
    ),
    [
      colDefs,
      sort,
      onSort,
      onClearSort,
      columnWidths,
      onColumnReorder,
      tableWidth
    ]
  )

  const renderRow = useCallback(
    (index: number, row: T) => (
      <TableRow
        row={row}
        colDefs={colDefs}
        index={index}
        columnWidths={columnWidths}
        onCellHover={onCellHover}
      />
    ),
    [colDefs, columnWidths, onCellHover]
  )

  const skeletonContent = useMemo(
    () => (
      <div className="skeleton-container">
        {renderHeader()}
        {Array.from({ length: numberOfRows }, (_, idx) => (
          <SkeletonRow key={idx} colDefs={colDefs} />
        ))}
      </div>
    ),
    [numberOfRows, colDefs, renderHeader]
  )

  const emptyState = useMemo(
    () => (
      <div className="empty-state-container">
        {renderHeader()}
        <BlankSlate
          text="No records found."
          onClearAll={hasSearchOrFilters ? onClearAll : undefined}
          hasSearchOrFilters={hasSearchOrFilters}
        />
      </div>
    ),
    [hasSearchOrFilters, onClearAll, renderHeader]
  )

  if (loading && data.length === 0) return skeletonContent
  if (data.length === 0) return emptyState

  return (
    <TableVirtuoso
      data={data}
      fixedHeaderContent={renderHeader}
      itemContent={renderRow}
      endReached={onEndReached}
    />
  )
}

export default TableContent
