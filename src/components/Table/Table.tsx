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
import { useColumnSettings } from "@/hooks/useColumnSettings"
import { useColumnWidths } from "@/hooks/useColumnWidths"
import useDebounce from "@/hooks/useDebounce"
import { useInlineEdit } from "@/hooks/useInlineEdit"
import { useLocalStorageEdits } from "@/hooks/useLocalStorageEdits"
import { usePagination } from "@/hooks/usePagination"
import { useTableHandlers } from "@/hooks/useTableHandlers"
import type { ApiData, ApiParams, ApiResponse } from "@/types/api"
import type { Column, PaginationMode, Sort, Tooltip } from "@/types/table"
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
  paginationMode?: PaginationMode
  tableTitle?: string
}

const Table = ({
  colDefs,
  apiData,
  loading,
  onApiParamsChange,
  tableWidth = DEFAULT_TABLE_WIDTH,
  tableHeight = DEFAULT_TABLE_HEIGHT,
  numberOfRows = PAGE_SIZE,
  paginationMode = "virtualized",
  tableTitle
}: TableProps) => {
  /** Local State */
  const [localSearch, setLocalSearch] = useState("")
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({})
  const [sort, setSort] = useState<Sort | undefined>()
  const [offset, setOffset] = useState(0)
  const [fetchedRows, setFetchedRows] = useState<ApiData[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)

  /** Debounced values */
  const search = useDebounce(localSearch, 500)
  const filters = useDebounce(localFilters, 500)

  /** Column Settings from localStorage */
  const {
    visibleColumns,
    columnOrder,
    columnWidths: customColumnWidths,
    setVisibleColumns,
    setColumnOrder,
    setColumnWidth,
    resetAllSettings,
    hasCustomSettings
  } = useColumnSettings(colDefs)

  /** Local Storage Edits */
  const { saveEdit, applyEditsToData, clearAllEdits, hasEdits, getStoredEdit } =
    useLocalStorageEdits()

  /** Pagination Logic */
  const {
    mode: paginationModeFromHook,
    state: paginationState,
    onStateChange: onPaginationStateChange,
    pageSizeOptions
  } = usePagination({
    pagination: { mode: paginationMode },
    totalRecords: apiData?.total || 0,
    defaultPageSize: PAGE_SIZE
  })

  // Use the provided mode or fall back to the hook's mode
  const effectivePaginationMode = paginationMode || paginationModeFromHook

  /** Effects */
  // Update API params when dependencies change
  useEffect(() => {
    const params: ApiParams = {
      limit:
        effectivePaginationMode === "manual"
          ? paginationState.pageSize
          : PAGE_SIZE,
      offset:
        effectivePaginationMode === "manual"
          ? paginationState.pageIndex * paginationState.pageSize
          : offset * PAGE_SIZE,
      sort:
        sort && sort.column ? `${sort.column},${sort.direction}` : undefined,
      search: search || undefined,
      filters: Object.keys(filters).length > 0 ? filters : undefined
    }
    onApiParamsChange(params)
  }, [
    search,
    filters,
    sort,
    offset,
    onApiParamsChange,
    effectivePaginationMode,
    paginationState
  ])

  // Reset data when query params change
  useEffect(() => {
    if (effectivePaginationMode === "virtualized") {
      setFetchedRows([])
      setOffset(0)
    }
    // For manual pagination, the usePagination hook handles resets internally
  }, [search, sort, filters, effectivePaginationMode])

  // Append API data (for virtualized) or replace (for manual)
  useEffect(() => {
    if (!apiData) return
    setTotalRecords(apiData.total)

    if (effectivePaginationMode === "virtualized") {
      setFetchedRows((prev) =>
        offset === 0 ? apiData.data : [...prev, ...apiData.data]
      )
    } else {
      // For manual pagination, replace the data completely
      setFetchedRows(apiData.data)
    }
  }, [apiData, offset, effectivePaginationMode])

  /** Column Order & Resize */
  const { orderedColDefs, onColumnReorder } = useColumnOrder({
    colDefs,
    columnOrder,
    setColumnOrder
  })

  const {
    isResizing,
    resizingColumn,
    onResizeStart,
    onResizeMove,
    onResizeEnd
  } = useColumnResize({
    columnWidths: customColumnWidths,
    setColumnWidth
  })

  /** Handlers (sorting, filters, etc.) */
  const {
    onSort,
    onFilterChange,
    onClearAllFilters,
    onSave: originalOnSave,
    onColumnVisibility,
    onCellHover,
    onEndReached: virtualizedOnEndReached,
    onClearSort,
    onClearAll
  } = useTableHandlers({
    setSort,
    setOffset,
    setFilters: setLocalFilters,
    setFetchedRows,
    setVisibleColumns: (columns) => {
      if (typeof columns === "function") {
        setVisibleColumns(columns(visibleColumns))
      } else {
        setVisibleColumns(columns)
      }
    },
    setTooltip,
    setSearch: setLocalSearch,
    orderedColDefs,
    loading,
    fetchedRows,
    totalRecords,
    offset
  })

  /** Enhanced save function with local storage */
  const onSave = useCallback(
    async (rowId: string | number, columnKey: string, value: string) => {
      // Get the actual original value from stored edits if it exists, otherwise from current data
      const existingEdit = getStoredEdit(rowId, columnKey)

      let actualValue: string
      if (existingEdit) {
        // Use the original value from the existing edit
        actualValue = existingEdit.actualValue
      } else {
        // Find the original value from the current data
        const row = fetchedRows.find((r) => r.id === rowId)
        actualValue = row
          ? String(row[columnKey as keyof typeof row] || "")
          : ""
      }

      // Save the edit locally first
      saveEdit(rowId, columnKey, value, actualValue)

      // Then call the original save function to update the table data
      await originalOnSave(rowId, columnKey, value)
    },
    [saveEdit, originalOnSave, fetchedRows, getStoredEdit]
  )

  /** Row ID Handler - Use actual row ID for persistence */
  const getRowId = useCallback(
    (index: number): string | number => {
      const row = fetchedRows[index]
      return row?.id ?? index
    },
    [fetchedRows]
  )

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
      localSearch.trim() !== "" ||
      Object.values(localFilters).some((v) => v.trim() !== ""),
    [localSearch, localFilters]
  )

  const visibleColDefs = useMemo(
    () => orderedColDefs.filter((col) => visibleColumns.includes(col.key)),
    [orderedColDefs, visibleColumns]
  )

  const columnWidths = useColumnWidths({
    colDefs: visibleColDefs,
    tableWidth,
    customWidths: customColumnWidths
  })

  const enhancedColDefs = useMemo(
    () =>
      visibleColDefs.map((col, i) => ({
        ...col,
        width: columnWidths[i]?.width ?? col.width
      })),
    [visibleColDefs, columnWidths]
  )

  /** Apply stored edits to the fetched data */
  const dataWithEdits = useMemo(() => {
    const result = applyEditsToData(fetchedRows)
    return result
  }, [fetchedRows, applyEditsToData])

  return (
    <>
      <div className="table-container" style={{ width: tableWidth }}>
        <TableActionsBar
          colDefs={orderedColDefs}
          visibleColumns={visibleColumns}
          search={localSearch}
          setSearch={setLocalSearch}
          filters={localFilters}
          onFilterChange={onFilterChange}
          onClearAllFilters={onClearAllFilters}
          onColumnVisibility={onColumnVisibility}
          loading={loading}
          hasEdits={hasEdits}
          onClearAllEdits={clearAllEdits}
          hasCustomSettings={hasCustomSettings}
          onResetColumnSettings={resetAllSettings}
          tableTitle={tableTitle}
        />

        <div className="table-content-wrapper" style={{ height: tableHeight }}>
          <TableContent
            // Core data props
            data={dataWithEdits}
            colDefs={enhancedColDefs}
            loading={loading}
            numberOfRows={
              effectivePaginationMode === "manual"
                ? paginationState.pageSize
                : numberOfRows
            }
            tableWidth={tableWidth}
            hasNoVisibleColumns={visibleColDefs.length === 0}
            paginationMode={effectivePaginationMode}
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
              onEndReached:
                effectivePaginationMode === "virtualized"
                  ? virtualizedOnEndReached
                  : undefined,
              isSearchOrFilterActive,
              onClearAll,
              getRowId
            }}
          />

          {effectivePaginationMode === "virtualized" && (
            <LoadingFooter
              loading={loading}
              hasData={dataWithEdits.length > 0}
            />
          )}
        </div>

        <TableStatus
          loadedRecords={dataWithEdits.length}
          totalRecords={totalRecords}
          loading={loading}
          paginationState={
            paginationMode === "manual" ? paginationState : undefined
          }
          pageSizeOptions={
            paginationMode === "manual" ? pageSizeOptions : undefined
          }
          onPaginationChange={
            paginationMode === "manual" ? onPaginationStateChange : undefined
          }
        />
      </div>

      {tooltip && <TableTooltip {...tooltip} />}
    </>
  )
}

export default Table
