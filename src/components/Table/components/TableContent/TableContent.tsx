import BlankSlate from "@/components/Table/components/BlankSlate/BlankSlate"
import SkeletonRow from "@/components/Table/components/SkeletonRow/SkeletonRow"
import "@/components/Table/components/TableContent/TableContent.css"
import TableHeader from "@/components/Table/components/TableHeader/TableHeader"
import TableRow from "@/components/Table/components/TableRow/TableRow"
import type { ColumnWidthInfo } from "@/hooks/useColumnWidths"
import type { Column, SortState } from "@/types/table"
import { useCallback, useMemo } from "react"
import { TableVirtuoso } from "react-virtuoso"

interface TableContentProps<T> {
  data: T[]
  colDefs: Column<T>[]
  loading: boolean
  currentSort?: SortState | null
  onSort?: (params: SortState) => void
  onClearSort: () => void
  columnWidths: ColumnWidthInfo[]
  onCellHover: (text: string, element: HTMLElement | null) => void
  onEndReached: () => void
  numberOfRows: number
  hasAnyFilters: boolean
  onClearAll?: () => void
}

const TableContent = <T extends Record<string, unknown>>({
  data,
  colDefs,
  loading,
  currentSort,
  onSort,
  onClearSort,
  columnWidths,
  onCellHover,
  onEndReached,
  numberOfRows,
  hasAnyFilters,
  onClearAll
}: TableContentProps<T>) => {
  const renderHeader = useCallback(
    () => (
      <TableHeader
        colDefs={colDefs}
        currentSort={currentSort}
        onSort={onSort}
        onClearSort={onClearSort}
        columnWidths={columnWidths}
      />
    ),
    [colDefs, currentSort, onSort, onClearSort, columnWidths]
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
          onClearAll={hasAnyFilters ? onClearAll : undefined}
          hasActiveFilters={hasAnyFilters}
        />
      </div>
    ),
    [hasAnyFilters, onClearAll, renderHeader]
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
