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
import { useSearchAndFilters } from "@/hooks/useSearchAndFilters"
import type { ApiData, ApiResponse } from "@/types/api"
import type { Column, ColumnVisibility, Sort, Tooltip } from "@/types/table"
import { useCallback, useEffect, useMemo, useState } from "react"
import TableTooltip from "./components/TableTooltip/TableTooltip"
import "./Table.css"

interface TableProps {
  colDefs: Column<ApiData>[]
  data: ApiResponse<ApiData> | undefined
  loading: boolean
  onSearchChange: (search: string) => void
  onFiltersChange: (filters: Record<string, string>) => void
  sort: Sort | undefined
  setSort: (sort: Sort | undefined) => void
  offset: number
  setOffset: (offset: number) => void
  tableWidth?: number
  tableHeight?: number
  numberOfRows?: number
}

const Table = ({
  colDefs,
  data,
  loading,
  onSearchChange,
  onFiltersChange,
  sort,
  setSort,
  offset,
  setOffset,
  tableWidth = DEFAULT_TABLE_WIDTH,
  tableHeight = DEFAULT_TABLE_HEIGHT,
  numberOfRows = PAGE_SIZE
}: TableProps) => {
  // Internal states for search and filters
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})

  const [fetchedRows, setFetchedRows] = useState<ApiData[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() =>
    colDefs.map((col) => col.key)
  )
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)

  // Notify parent when search and filters change (now handled by DebouncedInput)
  useEffect(() => {
    onSearchChange(search)
  }, [search, onSearchChange])

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  // Reset data on search/sort/filter changes
  useEffect(() => {
    setFetchedRows([])
    setOffset(0)
  }, [search, sort, filters, setOffset])

  // Update data when API response changes
  useEffect(() => {
    if (!data) return

    const isFirstPage = offset === 0

    const updateData = (
      newData: ApiData[],
      total: number,
      isFirstPage: boolean
    ) => {
      setTotalRecords(total)
      setFetchedRows((prevRows) =>
        isFirstPage ? newData : [...prevRows, ...newData]
      )
    }

    updateData(data.data, data.total, isFirstPage)
  }, [data, offset])

  // Table handlers that update parent state
  const handleSort = useCallback(
    (params: Sort) => {
      if (!params.column) {
        setSort(undefined)
      } else {
        setSort(params)
      }
      setOffset(0)
    },
    [setSort, setOffset]
  )

  const handleFilterChange = useCallback(
    (params: { key: string; value: string }) => {
      const { key, value } = params
      const updatedFilters = { ...filters, [key]: value }
      setFilters(updatedFilters)
      setOffset(0)
    },
    [filters, setOffset]
  )

  const handleClearAllFilters = useCallback(() => {
    setFilters({})
    setOffset(0)
  }, [setOffset])

  const { orderedColDefs, handleColumnReorder } = useColumnOrder(colDefs)
  const {
    customWidths,
    isResizing,
    resizingColumn,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd
  } = useColumnResize()

  // Inline editing functionality - memoize callbacks for stability
  const handleSave = useCallback(
    async (rowId: string | number, columnKey: string, value: string) => {
      // Update the local data optimistically
      setFetchedRows((prevRows) =>
        prevRows.map((row) =>
          row.id === rowId ? { ...row, [columnKey]: value } : row
        )
      )

      // Here you would typically make an API call to save the data
      // await saveDataToAPI(rowId, columnKey, value)
    },
    []
  )

  const handleCancel = useCallback(() => {
    // Edit operation cancelled - no action needed
  }, [])

  const handleValidate = useCallback(
    (columnKey: string, value: string) => {
      // Find the column definition for this key
      const colDef = orderedColDefs.find((col) => col.key === columnKey)

      // If column has validation function, use it
      if (
        colDef?.editable &&
        typeof colDef.editable === "object" &&
        colDef.editable.validation
      ) {
        return colDef.editable.validation(value)
      }

      return null // No validation error
    },
    [orderedColDefs]
  )

  const {
    editState,
    startEdit,
    cancelEdit,
    saveEdit,
    updateEditValue,
    isEditing
  } = useInlineEdit({
    onSave: handleSave,
    onCancel: handleCancel,
    onValidate: handleValidate
  })

  const { hasSearchOrFilters, createClearHandler } = useSearchAndFilters({
    search,
    filters
  })

  const visibleColDefs = useMemo(
    () => orderedColDefs.filter((col) => visibleColumns.includes(col.key)),
    [orderedColDefs, visibleColumns]
  )

  const hasNoVisibleColumns = visibleColDefs.length === 0

  const columnWidths = useColumnWidths({
    colDefs: visibleColDefs,
    tableWidth,
    customWidths
  })

  const enhancedColDefs = useMemo(
    () =>
      visibleColDefs.map((col, index) => ({
        ...col,
        width: columnWidths[index]?.width ?? col.width
      })),
    [visibleColDefs, columnWidths]
  )

  const handleColumnVisibility = useCallback(
    (params: ColumnVisibility) => {
      const { visible } = params

      if ("all" in params) {
        setVisibleColumns(visible ? orderedColDefs.map((c) => c.key) : [])
      } else if ("key" in params) {
        const { key } = params
        setVisibleColumns((prev) =>
          visible ? [...prev, key] : prev.filter((id) => id !== key)
        )
      }
    },
    [orderedColDefs]
  )

  const handleCellHover = useCallback(
    (text: string, element: HTMLElement | null) => {
      if (!element || !text) return setTooltip(null)
      const rect = element.getBoundingClientRect()
      setTooltip({
        text,
        position: {
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top - 5 + window.scrollY
        }
      })
    },
    []
  )

  const handleEndReached = useCallback(() => {
    if (!loading && fetchedRows.length < totalRecords) {
      setOffset(offset + 1)
    }
  }, [fetchedRows.length, totalRecords, loading, offset, setOffset])

  const handleClearAll = createClearHandler(setSearch, handleClearAllFilters)

  const handleClearSort = useCallback(() => {
    handleSort({ column: "", direction: "asc" })
  }, [handleSort])

  return (
    <>
      <div className="table-container" style={{ width: tableWidth }}>
        <TableActionsBar
          colDefs={orderedColDefs}
          visibleColumns={visibleColumns}
          search={search}
          setSearch={setSearch}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAllFilters={handleClearAllFilters}
          onColumnVisibility={handleColumnVisibility}
          loading={loading}
        />

        <div className="table-content-wrapper" style={{ height: tableHeight }}>
          <TableContent
            data={fetchedRows}
            colDefs={enhancedColDefs}
            loading={loading}
            sort={sort}
            onSort={handleSort}
            onClearSort={handleClearSort}
            columnWidths={columnWidths}
            onCellHover={handleCellHover}
            onEndReached={handleEndReached}
            numberOfRows={numberOfRows}
            hasSearchOrFilters={hasSearchOrFilters}
            onClearAll={handleClearAll}
            onColumnReorder={handleColumnReorder}
            tableWidth={tableWidth}
            hasNoVisibleColumns={hasNoVisibleColumns}
            isResizing={isResizing}
            resizingColumn={resizingColumn}
            onResizeStart={handleResizeStart}
            onResizeMove={handleResizeMove}
            onResizeEnd={handleResizeEnd}
            isEditing={isEditing}
            editValue={editState?.value}
            editError={editState?.error}
            onStartEdit={startEdit}
            onCancelEdit={cancelEdit}
            onSaveEdit={saveEdit}
            onEditValueChange={updateEditValue}
            getRowId={(row) => row.id as string | number}
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
