import { useCallback, useMemo } from "react"
import type { Column } from "../types/table"

export interface UseFiltersReturn<T> {
  filterableColumns: Column<T>[]
  activeFilterCount: number
  hasFilters: boolean
  filterLabel: string
  onInputChange: (key: string, value: string) => void
}

export interface UseFiltersOptions<T> {
  colDefs: Column<T>[]
  visibleColumns: string[]
  filters: Record<string, string>
  onFilterChange: (params: { key: string; value: string }) => void
}

export const useFilters = <T>({
  colDefs,
  visibleColumns,
  filters,
  onFilterChange
}: UseFiltersOptions<T>): UseFiltersReturn<T> => {
  const filterableColumns = useMemo(
    () =>
      colDefs.filter(
        (col) => col.filterable && visibleColumns.includes(col.key)
      ),
    [colDefs, visibleColumns]
  )

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((value) => value.trim() !== "").length
  }, [filters])

  const hasFilters = activeFilterCount > 0

  const filterLabel = useMemo(
    () => (hasFilters ? `Filters (${activeFilterCount})` : "Filters"),
    [hasFilters, activeFilterCount]
  )

  const onInputChange = useCallback(
    (key: string, value: string) => onFilterChange({ key, value }),
    [onFilterChange]
  )

  return {
    filterableColumns,
    activeFilterCount,
    hasFilters,
    filterLabel,
    onInputChange
  }
}
