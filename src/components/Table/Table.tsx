import LoadingFooter from "@/components/Table/components/LoadingFooter/LoadingFooter"
import TableActionsBar from "@/components/Table/components/TableActionsBar/TableActionsBar"
import TableContent from "@/components/Table/components/TableContent/TableContent"
import TableStatus from "@/components/Table/components/TableStatus/TableStatus"
import {
  CLIENT_SIDE,
  DEFAULT_TABLE_HEIGHT,
  DEFAULT_TABLE_WIDTH,
  PAGE_SIZE,
  PAGINATION_STRING,
  SERVER_SIDE,
  VIRTUALIZATION_STRING
} from "@/constants"
import { useClientSideData } from "@/hooks/useClientSideData"
import { useColumnOrder } from "@/hooks/useColumnOrder"
import { useColumnResize } from "@/hooks/useColumnResize"
import { useColumnSettings } from "@/hooks/useColumnSettings"
import { useColumnWidths } from "@/hooks/useColumnWidths"
import { useDebounce } from "@/hooks/useDebounce"
import { useInlineEdit } from "@/hooks/useInlineEdit"
import { useLocalStorageEdits } from "@/hooks/useLocalStorageEdits"
import { usePagination } from "@/hooks/usePagination"
import { useTableHandlers } from "@/hooks/useTableHandlers"
import type { ApiData, ApiParams, ApiResponse } from "@/types/api"
import type {
  Column,
  FetchingMode,
  RenderStrategy,
  Sort,
  Tooltip
} from "@/types/table"
import { useCallback, useEffect, useMemo, useState } from "react"
import TableTooltip from "./components/TableTooltip/TableTooltip"
import "./Table.css"

interface TableProps {
  colDefs: Column<ApiData>[]
  apiData?: ApiResponse<ApiData>
  loading: boolean
  error?: Error | null
  onApiParamsChange: (params: ApiParams) => void
  tableWidth?: number
  tableHeight?: number
  numberOfRows?: number
  renderStrategy?: RenderStrategy
  fetchingMode?: FetchingMode
  tableTitle?: string
}

const Table = ({
  colDefs,
  apiData,
  loading,
  error,
  onApiParamsChange,
  tableWidth = DEFAULT_TABLE_WIDTH,
  tableHeight = DEFAULT_TABLE_HEIGHT,
  numberOfRows = PAGE_SIZE,
  renderStrategy = VIRTUALIZATION_STRING,
  fetchingMode = SERVER_SIDE,
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

  /** Client-side data fetching */
  const clientSideData = useClientSideData({
    data: fetchingMode === CLIENT_SIDE ? apiData : undefined,
    search,
    filters,
    sort,
    pageIndex: 0,
    pageSize: PAGE_SIZE,
    isVirtualized: renderStrategy === VIRTUALIZATION_STRING
  })

  const effectiveApiData =
    fetchingMode === CLIENT_SIDE ? clientSideData.data : apiData

  const effectiveLoading = loading

  /** Pagination Logic */
  const {
    mode: paginationModeFromHook,
    state: paginationState,
    onStateChange: onPaginationStateChange,
    pageSizeOptions
  } = usePagination({
    pagination: { mode: renderStrategy },
    totalRecords: effectiveApiData?.total || 0,
    defaultPageSize: PAGE_SIZE
  })

  // Use the provided mode or fall back to the hook's mode
  const effectivePaginationMode = renderStrategy || paginationModeFromHook

  /** Client-side data with pagination state (for manual pagination only) */
  const clientSideDataWithPagination = useClientSideData({
    data:
      fetchingMode === CLIENT_SIDE && renderStrategy === PAGINATION_STRING
        ? apiData
        : undefined,
    search,
    filters,
    sort,
    pageIndex: paginationState.pageIndex,
    pageSize: paginationState.pageSize,
    isVirtualized: false
  })

  // Final data selection
  const finalApiData =
    fetchingMode === CLIENT_SIDE && renderStrategy === PAGINATION_STRING
      ? clientSideDataWithPagination.data
      : effectiveApiData

  /** Effects */
  // Update API params when dependencies change (only for server-side mode)
  useEffect(() => {
    if (fetchingMode === SERVER_SIDE) {
      const params: ApiParams = {
        limit:
          effectivePaginationMode === PAGINATION_STRING
            ? paginationState.pageSize
            : PAGE_SIZE,
        offset:
          effectivePaginationMode === PAGINATION_STRING
            ? paginationState.pageIndex * paginationState.pageSize
            : offset * PAGE_SIZE,
        sort:
          sort && sort.column ? `${sort.column},${sort.direction}` : undefined,
        search: search || undefined,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      }
      onApiParamsChange(params)
    }
  }, [
    search,
    filters,
    sort,
    offset,
    onApiParamsChange,
    effectivePaginationMode,
    paginationState,
    fetchingMode
  ])

  // Reset data when query params change (only for server-side mode)
  useEffect(() => {
    if (
      fetchingMode === SERVER_SIDE &&
      effectivePaginationMode === VIRTUALIZATION_STRING
    ) {
      setFetchedRows([])
      setOffset(0)
    }
    // For manual pagination, the usePagination hook handles resets internally
    // For client-side mode, data is always fresh from the hook
  }, [search, sort, filters, effectivePaginationMode, fetchingMode])

  // Append API data (for virtualized) or replace (for manual)
  useEffect(() => {
    if (!finalApiData) return
    setTotalRecords(finalApiData.total)

    if (fetchingMode === CLIENT_SIDE) {
      // For client-side mode, always replace the data completely
      setFetchedRows(finalApiData.data)
    } else if (effectivePaginationMode === VIRTUALIZATION_STRING) {
      // For server-side virtualized mode, append data
      setFetchedRows((prev) =>
        offset === 0 ? finalApiData.data : [...prev, ...finalApiData.data]
      )
    } else {
      // For server-side manual pagination, replace the data completely
      setFetchedRows(finalApiData.data)
    }
  }, [finalApiData, offset, effectivePaginationMode, fetchingMode])

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
    loading: effectiveLoading,
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
          loading={effectiveLoading}
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
            loading={effectiveLoading}
            error={error}
            numberOfRows={
              effectivePaginationMode === PAGINATION_STRING
                ? paginationState.pageSize
                : numberOfRows
            }
            tableWidth={tableWidth}
            hasNoVisibleColumns={visibleColDefs.length === 0}
            renderStrategy={effectivePaginationMode}
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
                effectivePaginationMode === VIRTUALIZATION_STRING
                  ? virtualizedOnEndReached
                  : undefined,
              isSearchOrFilterActive,
              onClearAll,
              getRowId
            }}
          />

          {effectivePaginationMode === VIRTUALIZATION_STRING && (
            <LoadingFooter
              loading={effectiveLoading}
              hasData={dataWithEdits.length > 0}
            />
          )}
        </div>

        <TableStatus
          loadedRecords={dataWithEdits.length}
          totalRecords={totalRecords}
          loading={effectiveLoading}
          paginationState={
            renderStrategy === PAGINATION_STRING ? paginationState : undefined
          }
          pageSizeOptions={
            renderStrategy === PAGINATION_STRING ? pageSizeOptions : undefined
          }
          onPaginationChange={
            renderStrategy === PAGINATION_STRING
              ? onPaginationStateChange
              : undefined
          }
        />
      </div>

      {tooltip && <TableTooltip {...tooltip} />}
    </>
  )
}

export default Table
