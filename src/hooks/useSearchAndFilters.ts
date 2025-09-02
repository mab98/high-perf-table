import { useCallback, useMemo } from "react"

interface UseSearchAndFilters {
  search: string
  filters: Record<string, string>
}

export const useSearchAndFilters = ({
  search,
  filters
}: UseSearchAndFilters) => {
  const hasFilters = useMemo(() => {
    return Object.values(filters).some((value) => value.trim() !== "")
  }, [filters])

  const hasSearch = useMemo(() => {
    return search.trim() !== ""
  }, [search])

  const hasSearchOrFilters = useMemo(() => {
    return hasSearch || hasFilters
  }, [hasSearch, hasFilters])

  const createClearHandler = useCallback(
    (setSearch?: (value: string) => void, onClearFilters?: () => void) => {
      return () => {
        if (setSearch && hasSearch) setSearch("")
        if (onClearFilters && hasFilters) onClearFilters()
      }
    },
    [hasSearch, hasFilters]
  )

  return {
    hasFilters,
    hasSearch,
    hasSearchOrFilters,
    createClearHandler
  }
}
