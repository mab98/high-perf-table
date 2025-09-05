import BlankSlate from "@/components/Table/components/BlankSlate/BlankSlate"
import SkeletonRow from "@/components/Table/components/SkeletonRow/SkeletonRow"
import ResizableTableHeader from "@/components/Table/components/TableHeader/ResizableTableHeader"
import TableRow from "@/components/Table/components/TableRow/TableRow"
import type { ColumnWidthInfo } from "@/components/Table/hooks/useColumnWidths"
import { ColumnsIcon, SearchIcon } from "@/components/Table/Icons/Icons"
import type { ApiData } from "@/types/api"
import type { Column, Sort } from "@/types/table"
import { useCallback, useMemo } from "react"
import "./TableContent.css"

interface SortingProps {
  sort?: Sort | null
  onSort?: (params: Sort) => void
  onClearSort: () => void
}

interface ColumnManagementProps {
  columnWidths: ColumnWidthInfo[]
  onColumnReorder?: (activeId: string, overId: string) => void
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
  isSearchOrFilterActive: boolean
  onClearAll?: () => void
  getRowId: (index: number) => string | number
}

interface PaginatedTableProps {
  data: ApiData[]
  colDefs: Column<ApiData>[]
  loading: boolean
  numberOfRows: number
  tableWidth?: number
  hasNoVisibleColumns?: boolean
  sorting: SortingProps
  columnManagement: ColumnManagementProps
  editing: EditingProps
  interactions: InteractionProps
}

const PaginatedTable = ({
  data,
  colDefs,
  loading,
  numberOfRows,
  tableWidth,
  hasNoVisibleColumns = false,
  sorting,
  columnManagement,
  editing,
  interactions
}: PaginatedTableProps) => {
  const { sort, onSort, onClearSort } = sorting

  const { columnWidths, onColumnReorder, setColumnWidth } = columnManagement

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
      tableWidth,
      setColumnWidth
    ]
  )

  const renderRow = useCallback(
    (index: number, row: ApiData) => (
      <TableRow
        key={row.id || index}
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

  const emptyState = useMemo(
    () => (
      <div className="paginated-table-container">
        {renderHeader()}
        <div className="paginated-table-body">
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
      </div>
    ),
    [isSearchOrFilterActive, onClearAll, renderHeader]
  )

  const skeletonContent = useMemo(
    () => (
      <div className="paginated-table-container">
        {renderHeader()}
        <div className="paginated-table-body">
          {Array.from({ length: numberOfRows }, (_, idx) => (
            <SkeletonRow key={idx} colDefs={colDefs} />
          ))}
        </div>
      </div>
    ),
    [renderHeader, numberOfRows, colDefs]
  )

  if (hasNoVisibleColumns) {
    return (
      <div className="paginated-table-container">
        {renderHeader()}
        <div className="paginated-table-body">
          <BlankSlate
            title="No columns visible."
            icon={<ColumnsIcon size="48" />}
            subtitle="Try enabling them using the 'Columns' button."
          />
        </div>
      </div>
    )
  }

  if (data.length === 0 && !loading) return emptyState

  if (loading) return skeletonContent

  return (
    <div className="paginated-table-container">
      {renderHeader()}
      <div className="paginated-table-body">
        {data.map((row, index) => renderRow(index, row))}
      </div>
    </div>
  )
}

export default PaginatedTable
