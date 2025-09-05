import { useState, type Dispatch, type SetStateAction } from "react"
import type { Sort, Tooltip, ValidationError } from "../types"

export interface UseTableStateReturn<T> {
  // Search and filters
  localSearch: string
  setLocalSearch: Dispatch<SetStateAction<string>>
  localFilters: Record<string, string>
  setLocalFilters: Dispatch<SetStateAction<Record<string, string>>>

  // Sorting
  sort: Sort | undefined
  setSort: (sort: Sort | undefined) => void

  // Pagination/data
  offset: number
  setOffset: (offset: number) => void
  fetchedRows: T[]
  setFetchedRows: (rows: T[] | ((prev: T[]) => T[])) => void
  totalRecords: number
  setTotalRecords: (total: number) => void

  // UI state
  tooltip: Tooltip | null
  setTooltip: (tooltip: Tooltip | null) => void
  validationError: ValidationError | null
  setValidationError: (error: ValidationError | null) => void
}

export const useTableState = <T>(): UseTableStateReturn<T> => {
  const [localSearch, setLocalSearch] = useState("")
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({})
  const [sort, setSort] = useState<Sort | undefined>()
  const [offset, setOffset] = useState(0)
  const [fetchedRows, setFetchedRows] = useState<T[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null)

  return {
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
  }
}
