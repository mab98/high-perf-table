import { useCallback, useMemo } from "react"

interface UseOptimizedTableParams {
  searchValue: string
  filters: Record<string, string>
}

export const useOptimizedTable = ({
  searchValue,
  filters
}: UseOptimizedTableParams) => {
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some((value) => value.trim() !== "")
  }, [filters])

  const hasActiveSearch = useMemo(() => {
    return searchValue.trim() !== ""
  }, [searchValue])

  const hasAnyFilters = useMemo(() => {
    return hasActiveSearch || hasActiveFilters
  }, [hasActiveSearch, hasActiveFilters])

  const createClearHandler = useCallback(
    (onSearch?: (value: string) => void, onClearFilters?: () => void) => {
      return () => {
        if (onSearch && hasActiveSearch) onSearch("")
        if (onClearFilters && hasActiveFilters) onClearFilters()
      }
    },
    [hasActiveSearch, hasActiveFilters]
  )

  return {
    hasActiveFilters,
    hasActiveSearch,
    hasAnyFilters,
    createClearHandler
  }
}
