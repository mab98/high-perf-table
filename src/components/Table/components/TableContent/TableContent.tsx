import BlankSlate from "@/components/Table/components/BlankSlate/BlankSlate"
import SkeletonRow from "@/components/Table/components/SkeletonRow/SkeletonRow"
import PaginatedTable from "@/components/Table/components/TableContent/PaginatedTable"
import "@/components/Table/components/TableContent/TableContent.css"
import ResizableTableHeader from "@/components/Table/components/TableHeader/ResizableTableHeader"
import TableRow from "@/components/Table/components/TableRow/TableRow"
import type { ColumnWidthInfo } from "@/components/Table/hooks/useColumnWidths"
import {
  ColumnsIcon,
  ErrorIcon,
  SearchIcon
} from "@/components/Table/Icons/Icons"
import { useCallback, useMemo } from "react"
import { TableVirtuoso } from "react-virtuoso"
import { PAGINATION, VIRTUALIZATION } from "../../constants"
import type { ApiData } from "../../types"
import type { Column, RenderStrategy, Sort } from "../../types/table"

interface SortingProps {
  sort?: Sort | null
  onSort?: (params: Sort) => void
  onClearSort: () => void
}

interface ColumnManagementProps {
  columnWidths: ColumnWidthInfo[]
  onColumnReorder?: (activeId: string, overId: string) => void
  canReorder?: (activeId: string, overId: string) => boolean
  setColumnWidth?: (columnKey: string, width: number) => void
}

interface EditingProps {
  isEditing?: (rowId: string | number, columnKey: string) => boolean
  editValue?: string
  editError?: string
  onStartEdit?: (
    rowId: string | number,
    columnKey: string,
    currentValue: string
  ) => void
  onCancelEdit?: () => void
  onSaveEdit?: () => void
  onEditValueChange?: (value: string) => void
}

interface InteractionProps {
  onCellHover: (text: string, element: HTMLElement | null) => void
  onValidationError: (text: string, element: HTMLElement | null) => void
  onEndReached?: () => void
  isSearchOrFilterActive: boolean
  onClearAll?: () => void
  getRowId: (index: number) => string | number // Simplified to only take index
}

interface TableContentProps {
  // Core data props
  data: ApiData[]
  colDefs: Column<ApiData>[]
  loading: boolean
  error?: Error | null
  numberOfRows: number
  tableWidth?: number
  hasNoVisibleColumns?: boolean

  // Pagination mode
  renderStrategy?: RenderStrategy

  // Grouped props
  sorting: SortingProps
  columnManagement: ColumnManagementProps
  editing: EditingProps
  interactions: InteractionProps
}

const TableContent = ({
  data,
  colDefs,
  loading,
  error,
  numberOfRows,
  tableWidth,
  hasNoVisibleColumns = false,
  renderStrategy = VIRTUALIZATION,
  sorting,
  columnManagement,
  editing,
  interactions
}: TableContentProps) => {
  const { sort, onSort, onClearSort } = sorting

  const { columnWidths, onColumnReorder, canReorder, setColumnWidth } =
    columnManagement

  const {
    isEditing,
    editValue,
    editError,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onEditValueChange
  } = editing

  const {
    onCellHover,
    onValidationError,
    onEndReached,
    isSearchOrFilterActive,
    onClearAll,
    getRowId
  } = interactions

  const renderHeader = useCallback(
    () => (
      <ResizableTableHeader
        colDefs={colDefs}
        sort={sort}
        onSort={onSort}
        onClearSort={onClearSort}
        columnWidths={columnWidths}
        onColumnReorder={onColumnReorder}
        canReorder={canReorder}
        tableWidth={tableWidth}
        setColumnWidth={setColumnWidth}
      />
    ),
    [
      colDefs,
      sort,
      onSort,
      onClearSort,
      columnWidths,
      onColumnReorder,
      canReorder,
      tableWidth,
      setColumnWidth
    ]
  )

  const renderRow = useCallback(
    (index: number, row: ApiData) => (
      <TableRow
        row={row}
        colDefs={colDefs}
        index={index}
        columnWidths={columnWidths}
        onCellHover={onCellHover}
        onValidationError={onValidationError}
        isEditing={isEditing}
        editValue={editValue}
        editError={editError}
        onStartEdit={onStartEdit}
        onCancelEdit={onCancelEdit}
        onSaveEdit={onSaveEdit}
        onEditValueChange={onEditValueChange}
        getRowId={() => getRowId(index)}
      />
    ),
    [
      colDefs,
      columnWidths,
      onCellHover,
      onValidationError,
      isEditing,
      editValue,
      editError,
      onStartEdit,
      onCancelEdit,
      onSaveEdit,
      onEditValueChange,
      getRowId
    ]
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
          title="No records found."
          icon={<SearchIcon size="48" />}
          subtitle={
            isSearchOrFilterActive
              ? "Try adjusting your search or filter criteria"
              : undefined
          }
          actionButton={
            isSearchOrFilterActive && onClearAll
              ? {
                  text: "Clear All Filters",
                  onClick: onClearAll
                }
              : undefined
          }
        />
      </div>
    ),
    [isSearchOrFilterActive, onClearAll, renderHeader]
  )

  const noColumnsState = useMemo(
    () => (
      <div className="no-columns-container">
        <BlankSlate
          title="No columns visible."
          icon={<ColumnsIcon size="48" />}
          subtitle="Try enabling them using the 'Columns' button."
        />
      </div>
    ),
    []
  )

  const errorState = useMemo(
    () => (
      <div className="error-state-container">
        {renderHeader()}
        <BlankSlate
          title="Failed to load data"
          icon={<ErrorIcon size="48" />}
          subtitle={
            error?.message ||
            "An unexpected error occurred while loading the data."
          }
          actionButton={{
            text: "Try Again",
            onClick: () => window.location.reload()
          }}
        />
      </div>
    ),
    [error, renderHeader]
  )

  if (error) return errorState
  if (hasNoVisibleColumns) return noColumnsState
  if (loading && data.length === 0) return skeletonContent
  if (data.length === 0) return emptyState

  // Switch between pagination modes
  if (renderStrategy === PAGINATION) {
    return (
      <PaginatedTable
        data={data}
        colDefs={colDefs}
        loading={loading}
        numberOfRows={numberOfRows}
        tableWidth={tableWidth}
        hasNoVisibleColumns={hasNoVisibleColumns}
        sorting={sorting}
        columnManagement={columnManagement}
        editing={editing}
        interactions={interactions}
      />
    )
  }

  // Default virtualization mode
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
