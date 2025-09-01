import type { SortState } from "@/types/table"
import { useCallback, useState } from "react"

interface UseTableStateReturn {
  searchValue: string
  setSearchValue: (value: string) => void
  filters: Record<string, string>
  sort?: SortState
  offset: number
  handleSort: (params: SortState) => void
  handleFilterChange: (params: { key: string; value: string }) => void
  handleClearAllFilters: () => void
  setOffset: (offset: number) => void
  resetOffset: () => void
}

export const useTableState = (): UseTableStateReturn => {
  const [searchValue, setSearchValue] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sort, setSort] = useState<SortState>()
  const [offset, setOffset] = useState(0)

  const resetOffset = useCallback(() => {
    setOffset(0)
  }, [])

  const handleSort = (params: SortState) => {
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
    searchValue,
    setSearchValue,
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
