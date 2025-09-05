import { useCallback, useMemo } from "react"
import type { Column, ValidationError } from "../types"

export interface UseTableComputedValuesProps<T> {
  localSearch: string
  localFilters: Record<string, string>
  orderedColDefs: Column<T>[]
  visibleColumns: string[]
  fetchedRows: T[]
  applyEditsToData: (data: T[]) => T[]
  visibleColDefs: Column<T>[]
  columnWidths: Array<{ width: number }>
  tableWidth: number
}

export interface UseTableComputedValuesReturn<T> {
  isSearchOrFilterActive: boolean
  visibleColDefs: Column<T>[]
  enhancedColDefs: Column<T>[]
  dataWithEdits: T[]
  getRowId: (index: number) => string | number
  setValidationErrorCallback: (
    text: string,
    element: HTMLElement | null
  ) => void
}

export const useTableComputedValues = <
  T extends Record<string, unknown> & { id: string | number }
>({
  localSearch,
  localFilters,
  orderedColDefs,
  visibleColumns,
  fetchedRows,
  applyEditsToData,
  columnWidths,
  setValidationError
}: Omit<UseTableComputedValuesProps<T>, "visibleColDefs"> & {
  setValidationError: (error: ValidationError | null) => void
}): UseTableComputedValuesReturn<T> => {
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

  const enhancedColDefs = useMemo(
    () =>
      visibleColDefs.map((col, i) => ({
        ...col,
        width: columnWidths[i]?.width ?? col.width
      })),
    [visibleColDefs, columnWidths]
  )

  const dataWithEdits = useMemo(() => {
    return applyEditsToData(fetchedRows)
  }, [fetchedRows, applyEditsToData])

  const getRowId = useCallback(
    (index: number): string | number => {
      const row = fetchedRows[index]
      return row?.id ?? index
    },
    [fetchedRows]
  )

  const setValidationErrorCallback = useCallback(
    (text: string, element: HTMLElement | null) => {
      if (!text.trim() || !element) {
        setValidationError(null)
        return
      }

      const rect = element.getBoundingClientRect()
      setValidationError({
        text,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.bottom + 8 // Position below the input with a small gap
        }
      })
    },
    [setValidationError]
  )

  return {
    isSearchOrFilterActive,
    visibleColDefs,
    enhancedColDefs,
    dataWithEdits,
    getRowId,
    setValidationErrorCallback
  }
}
