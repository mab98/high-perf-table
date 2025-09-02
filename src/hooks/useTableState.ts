import type { Sort } from "@/types/table"
import { useCallback, useState } from "react"

interface UseTableState {
  search: string
  setSearch: (value: string) => void
  filters: Record<string, string>
  sort?: Sort
  offset: number
  handleSort: (params: Sort) => void
  handleFilterChange: (params: { key: string; value: string }) => void
  handleClearAllFilters: () => void
  setOffset: (offset: number) => void
  resetOffset: () => void
}

export const useTableState = (): UseTableState => {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sort, setSort] = useState<Sort>()
  const [offset, setOffset] = useState(0)

  const resetOffset = useCallback(() => {
    setOffset(0)
  }, [])

  const handleSort = (params: Sort) => {
    if (!params.column) {
      setSort(undefined)
    } else {
      setSort(params)
    }
    resetOffset()
  }

  const handleFilterChange = (params: { key: string; value: string }) => {
    const { key, value } = params
    setFilters((prev) => ({ ...prev, [key]: value }))
    resetOffset()
  }

  const handleClearAllFilters = () => {
    setFilters({})
    resetOffset()
  }

  return {
    search,
    setSearch,
    filters,
    sort,
    offset,
    setOffset,
    resetOffset,
    handleSort,
    handleFilterChange,
    handleClearAllFilters
  }
}
