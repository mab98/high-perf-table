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
import { useColumnResize } from "@/hooks/useColumnResize"
import { useColumnWidths } from "@/hooks/useColumnWidths"
import { useInlineEdit } from "@/hooks/useInlineEdit"
import { useTableHandlers } from "@/hooks/useTableHandlers"
import type { ApiData, ApiParams, ApiResponse } from "@/types/api"
import type { Column, Sort, Tooltip } from "@/types/table"
import { useCallback, useEffect, useMemo, useState } from "react"
import TableTooltip from "./components/TableTooltip/TableTooltip"
import "./Table.css"

interface TableProps {
  colDefs: Column<ApiData>[]
  apiData?: ApiResponse<ApiData>
  loading: boolean
  onApiParamsChange: (params: ApiParams) => void
  tableWidth?: number
  tableHeight?: number
  numberOfRows?: number
}

const Table = ({
  colDefs,
  apiData,
  loading,
  onApiParamsChange,
  tableWidth = DEFAULT_TABLE_WIDTH,
  tableHeight = DEFAULT_TABLE_HEIGHT,
  numberOfRows = PAGE_SIZE
}: TableProps) => {
  /** Local State */
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sort, setSort] = useState<Sort | undefined>()
  const [offset, setOffset] = useState(0)
  const [fetchedRows, setFetchedRows] = useState<ApiData[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
    colDefs.map((col) => col.key)
  )
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)

  /** Effects */
  // Update API params when dependencies change
  useEffect(() => {
    const params: ApiParams = {
      limit: PAGE_SIZE,
      offset: offset * PAGE_SIZE,
      sort:
        sort && sort.column ? `${sort.column},${sort.direction}` : undefined,
      search: search || undefined,
      filters: Object.keys(filters).length > 0 ? filters : undefined
    }
    onApiParamsChange(params)
  }, [search, filters, sort, offset, onApiParamsChange])

  // Reset data when query params change
  useEffect(() => {
    setFetchedRows([])
    setOffset(0)
  }, [search, sort, filters])

  // Append API data
  useEffect(() => {
    if (!apiData) return
    setTotalRecords(apiData.total)
    setFetchedRows((prev) =>
      offset === 0 ? apiData.data : [...prev, ...apiData.data]
    )
  }, [apiData, offset])

  /** Column Order & Resize */
  const { orderedColDefs, onColumnReorder } = useColumnOrder(colDefs)
  const {
    customWidths,
    isResizing,
    resizingColumn,
    onResizeStart,
    onResizeMove,
    onResizeEnd
  } = useColumnResize()

  /** Handlers (sorting, filters, etc.) */
  const {
    onSort,
    onFilterChange,
    onClearAllFilters,
    onSave,
    onColumnVisibility,
    onCellHover,
    onEndReached,
    onClearSort,
    onClearAll
  } = useTableHandlers({
    setSort,
    setOffset,
    setFilters,
    setFetchedRows,
    setVisibleColumns,
    setTooltip,
    setSearch,
    orderedColDefs,
    loading,
    fetchedRows,
    totalRecords,
    offset
  })

  /** Row ID Handler - Use index-based identification */
  const getRowId = useCallback((index: number): string | number => {
    return index
  }, [])

  /** Inline Edit */
  const {
    editState,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onEditValueChange,
    isEditing
  } = useInlineEdit({
    onSave,
    onCancel: () => {},
    onValidate: (columnKey, value) => {
      const colDef = orderedColDefs.find((c) => c.key === columnKey)
      return colDef?.editable &&
        typeof colDef.editable === "object" &&
        colDef.editable.validation
        ? colDef.editable.validation(value)
        : null
    }
  })

  /** Derived Values */
  const isSearchOrFilterActive = useMemo(
    () =>
      search.trim() !== "" ||
      Object.values(filters).some((v) => v.trim() !== ""),
    [search, filters]
  )

  const visibleColDefs = useMemo(
    () => orderedColDefs.filter((col) => visibleColumns.includes(col.key)),
    [orderedColDefs, visibleColumns]
  )

  const columnWidths = useColumnWidths({
    colDefs: visibleColDefs,
    tableWidth,
    customWidths
  })

  const enhancedColDefs = useMemo(
    () =>
      visibleColDefs.map((col, i) => ({
        ...col,
        width: columnWidths[i]?.width ?? col.width
      })),
    [visibleColDefs, columnWidths]
  )

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
          onColumnVisibility={onColumnVisibility}
          loading={loading}
        />

        <div className="table-content-wrapper" style={{ height: tableHeight }}>
          <TableContent
            // Core data props
            data={fetchedRows}
            colDefs={enhancedColDefs}
            loading={loading}
            numberOfRows={numberOfRows}
            tableWidth={tableWidth}
            hasNoVisibleColumns={visibleColDefs.length === 0}
            // Sorting props
            sorting={{
              sort,
              onSort,
              onClearSort
            }}
            // Column management props
            columnManagement={{
              columnWidths,
              onColumnReorder,
              isResizing,
              resizingColumn,
              onResizeStart,
              onResizeMove,
              onResizeEnd
            }}
            // Editing props
            editing={{
              isEditing,
              editValue: editState?.value,
              editError: editState?.error,
              onStartEdit,
              onCancelEdit,
              onSaveEdit,
              onEditValueChange
            }}
            // Interaction props
            interactions={{
              onCellHover,
              onEndReached,
              isSearchOrFilterActive,
              onClearAll,
              getRowId
            }}
          />

          <LoadingFooter loading={loading} hasData={fetchedRows.length > 0} />
        </div>

        <TableStatus
          loadedRecords={fetchedRows.length}
          totalRecords={totalRecords}
          loading={loading}
        />
      </div>

      {tooltip && <TableTooltip {...tooltip} />}
    </>
  )
}

export default Table
