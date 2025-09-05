import LoadingFooter from "@/components/Table/components/LoadingFooter/LoadingFooter"
import TableActionsBar from "@/components/Table/components/TableActionsBar/TableActionsBar"
import TableContent from "@/components/Table/components/TableContent/TableContent"
import TableStatus from "@/components/Table/components/TableStatus/TableStatus"
import TableTooltip from "@/components/Table/components/TableTooltip/TableTooltip"
import ValidationErrorTooltip from "@/components/Table/components/ValidationError/ValidationError"
import {
  CLIENT_SIDE,
  DEFAULT_TABLE_HEIGHT,
  DEFAULT_TABLE_WIDTH,
  PAGE_SIZE,
  PAGINATION,
  SERVER_SIDE,
  VIRTUALIZATION
} from "@/components/Table/constants"
import { useClientSideData } from "@/components/Table/hooks/useClientSideData"
import { useColumnOrder } from "@/components/Table/hooks/useColumnOrder"
import { useColumnSettings } from "@/components/Table/hooks/useColumnSettings"
import { useColumnWidths } from "@/components/Table/hooks/useColumnWidths"
import { useDebounce } from "@/components/Table/hooks/useDebounce"
import { useInlineEdit } from "@/components/Table/hooks/useInlineEdit"
import { useLocalStorageEdits } from "@/components/Table/hooks/useLocalStorageEdits"
import { usePagination } from "@/components/Table/hooks/usePagination"
import { useTableComputedValues } from "@/components/Table/hooks/useTableComputedValues"
import { useTableEffects } from "@/components/Table/hooks/useTableEffects"
import { useTableHandlers } from "@/components/Table/hooks/useTableHandlers"
import { useTableSaveLogic } from "@/components/Table/hooks/useTableSaveLogic"
import { useTableState } from "@/components/Table/hooks/useTableState"
import "@/components/Table/Table.css"
import type {
  ApiParams,
  ApiResponse,
  Column,
  FetchingMode,
  RenderStrategy
} from "@/components/Table/types"
import { useMemo } from "react"

interface TableProps<T> {
  colDefs: Column<T>[]
  apiData?: ApiResponse<T>
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

const Table = <T extends Record<string, unknown> & { id: string | number }>({
  colDefs,
  apiData,
  loading,
  error,
  onApiParamsChange,
  tableWidth = DEFAULT_TABLE_WIDTH,
  tableHeight = DEFAULT_TABLE_HEIGHT,
  numberOfRows = PAGE_SIZE,
  renderStrategy = VIRTUALIZATION,
  fetchingMode = SERVER_SIDE,
  tableTitle
}: TableProps<T>) => {
  /** Table State Management */
  const {
    localSearch,
    setLocalSearch,
    localFilters,
    setLocalFilters,
    sort,
    setSort,
    offset,
    setOffset,
    fetchedRows,
    setFetchedRows,
    totalRecords,
    setTotalRecords,
    tooltip,
    setTooltip,
    validationError,
    setValidationError
  } = useTableState<T>()

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
    isVirtualized: renderStrategy === VIRTUALIZATION
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

  const effectivePaginationMode = renderStrategy || paginationModeFromHook

  const clientSideDataWithPagination = useClientSideData({
    data:
      fetchingMode === CLIENT_SIDE && renderStrategy === PAGINATION
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
    fetchingMode === CLIENT_SIDE && renderStrategy === PAGINATION
      ? clientSideDataWithPagination.data
      : effectiveApiData

  /** Effects - Handle data fetching and updates */
  useTableEffects({
    finalApiData,
    setFetchedRows,
    setTotalRecords,
    setOffset,
    search,
    filters,
    sort,
    offset,
    paginationState,
    fetchingMode,
    effectivePaginationMode,
    onApiParamsChange
  })

  /** Column Order & Resize */
  const { orderedColDefs, onColumnReorder, canReorder } = useColumnOrder({
    colDefs,
    columnOrder,
    setColumnOrder
  })

  /** Computed Values */
  const visibleColDefs = useMemo(
    () => orderedColDefs.filter((col) => visibleColumns.includes(col.key)),
    [orderedColDefs, visibleColumns]
  )

  const columnWidths = useColumnWidths({
    colDefs: visibleColDefs,
    tableWidth,
    customWidths: customColumnWidths
  })

  const {
    isSearchOrFilterActive,
    enhancedColDefs,
    dataWithEdits,
    getRowId,
    setValidationErrorCallback
  } = useTableComputedValues<T>({
    localSearch,
    localFilters,
    orderedColDefs,
    visibleColumns,
    fetchedRows,
    applyEditsToData: applyEditsToData as (data: T[]) => T[],
    columnWidths,
    tableWidth,
    setValidationError
  })

  /** Handlers (sorting, filters, etc.) */
  const {
    onSort,
    onFilterChange,
    onClearAllFilters,
    onSave: originalOnSave,
    onColumnVisibility,
    onCellHover,
    onValidationError,
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
    setValidationError: setValidationErrorCallback,
    setSearch: setLocalSearch,
    orderedColDefs,
    loading: effectiveLoading,
    fetchedRows,
    totalRecords,
    offset
  })

  /** Enhanced save function with local storage */
  const { onSave } = useTableSaveLogic({
    getStoredEdit,
    saveEdit,
    fetchedRows,
    originalOnSave
  })

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
          <TableContent<T>
            // Core data props
            data={dataWithEdits as T[]}
            colDefs={enhancedColDefs}
            loading={effectiveLoading}
            error={error}
            numberOfRows={
              effectivePaginationMode === PAGINATION
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
              canReorder,
              setColumnWidth
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
              onValidationError,
              onEndReached:
                effectivePaginationMode === VIRTUALIZATION
                  ? virtualizedOnEndReached
                  : undefined,
              isSearchOrFilterActive,
              onClearAll,
              getRowId
            }}
          />

          {effectivePaginationMode === VIRTUALIZATION && (
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
            renderStrategy === PAGINATION ? paginationState : undefined
          }
          pageSizeOptions={
            renderStrategy === PAGINATION ? pageSizeOptions : undefined
          }
          onPaginationChange={
            renderStrategy === PAGINATION ? onPaginationStateChange : undefined
          }
        />
      </div>

      {tooltip && <TableTooltip {...tooltip} />}
      {validationError && <ValidationErrorTooltip {...validationError} />}
    </>
  )
}

export default Table
