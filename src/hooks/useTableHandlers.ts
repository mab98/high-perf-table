import type { ApiData } from "@/types/api"
import type { Column, ColumnVisibility, Sort, Tooltip } from "@/types/table"
import { useCallback } from "react"

export interface UseTableHandlersProps<T> {
  setSort: (sort?: Sort) => void
  setOffset: (offset: number) => void
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>
  setFetchedRows: React.Dispatch<React.SetStateAction<ApiData[]>>
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>
  setTooltip: (tooltip: Tooltip | null) => void
  setSearch: React.Dispatch<React.SetStateAction<string>>
  orderedColDefs: Column<T>[]
  loading: boolean
  fetchedRows: ApiData[]
  totalRecords: number
  offset: number
}

export interface UseTableHandlersReturn {
  onSort: (params: Sort) => void
  onFilterChange: (params: { key: string; value: string }) => void
  onClearAllFilters: () => void
  onSave: (
    rowId: string | number,
    columnKey: string,
    value: string
  ) => Promise<void>
  onColumnVisibility: (params: ColumnVisibility) => void
  onCellHover: (text: string, element: HTMLElement | null) => void
  onEndReached: () => void
  onClearSort: () => void
  onClearAll: () => void
}

export const useTableHandlers = <T>({
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
}: UseTableHandlersProps<T>): UseTableHandlersReturn => {
  const onSort = useCallback(
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

  const onFilterChange = useCallback(
    (params: { key: string; value: string }) => {
      const { key, value } = params
      setFilters((prev: Record<string, string>) => ({
        ...prev,
        [key]: value
      }))
      setOffset(0)
    },
    [setFilters, setOffset]
  )

  const onClearAllFilters = useCallback(() => {
    setFilters({})
    setOffset(0)
  }, [setFilters, setOffset])

  const onSave = useCallback(
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
    [setFetchedRows]
  )

  const onColumnVisibility = useCallback(
    (params: ColumnVisibility) => {
      const { visible } = params

      // Always include columns that should stay visible
      const keepVisibleKeys = orderedColDefs
        .filter((col) => col.alwaysVisible)
        .map((col) => col.key)

      if ("all" in params) {
        if (visible) {
          // Show all columns
          setVisibleColumns(orderedColDefs.map((c) => c.key))
        } else {
          // Hide all toggleable columns but keep the alwaysVisible ones
          setVisibleColumns(keepVisibleKeys)

          // Remove filters for all hidden columns
          const hiddenColumns = orderedColDefs
            .filter((col) => !col.alwaysVisible)
            .map((col) => col.key)

          setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters }
            const removedFilters: string[] = []
            hiddenColumns.forEach((columnKey) => {
              if (updatedFilters[columnKey]) {
                removedFilters.push(columnKey)
                delete updatedFilters[columnKey]
              }
            })
            if (removedFilters.length > 0) {
              console.log(
                `Removing filters for hidden columns: ${removedFilters.join(", ")}`
              )
            }
            return updatedFilters
          })
        }
      } else if ("key" in params) {
        const { key } = params
        setVisibleColumns((prev) => {
          if (visible) {
            return [...prev, key]
          } else {
            // Don't allow hiding alwaysVisible columns
            const col = orderedColDefs.find((c) => c.key === key)
            if (col?.alwaysVisible) {
              return prev // Don't hide alwaysVisible columns
            }

            // Remove filter for this specific column when hiding it
            setFilters((prevFilters) => {
              const updatedFilters = { ...prevFilters }
              if (updatedFilters[key]) {
                console.log(`Removing filter for hidden column: ${key}`)
                delete updatedFilters[key]
              }
              return updatedFilters
            })

            return prev.filter((id) => id !== key)
          }
        })
      }
    },
    [orderedColDefs, setVisibleColumns, setFilters]
  )

  const onCellHover = useCallback(
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
    [setTooltip]
  )

  const onEndReached = useCallback(() => {
    if (!loading && fetchedRows.length < totalRecords) {
      setOffset(offset + 1)
    }
  }, [loading, fetchedRows.length, totalRecords, offset, setOffset])

  const onClearSort = useCallback(() => {
    onSort({ column: "", direction: "asc" })
  }, [onSort])

  const onClearAll = useCallback(() => {
    setSearch("")
    onClearAllFilters()
  }, [setSearch, onClearAllFilters])

  return {
    onSort,
    onFilterChange,
    onClearAllFilters,
    onSave,
    onColumnVisibility,
    onCellHover,
    onEndReached,
    onClearSort,
    onClearAll
  }
}
