import { useEffect } from "react"
import {
  CLIENT_SIDE,
  PAGE_SIZE,
  PAGINATION,
  SERVER_SIDE,
  VIRTUALIZATION
} from "../constants"
import type {
  ApiParams,
  ApiResponse,
  FetchingMode,
  RenderStrategy
} from "../types"

export interface UseTableEffectsProps<T> {
  // Core data
  finalApiData?: ApiResponse<T>

  // State setters
  setFetchedRows: (rows: T[] | ((prev: T[]) => T[])) => void
  setTotalRecords: (total: number) => void
  setOffset: (offset: number) => void

  // Search and filters
  search: string
  filters: Record<string, string>
  sort?: { column?: string; direction?: string }

  // Pagination
  offset: number
  paginationState: { pageIndex: number; pageSize: number }

  // Configuration
  fetchingMode: FetchingMode
  effectivePaginationMode: RenderStrategy

  // Callbacks
  onApiParamsChange: (params: ApiParams) => void
}

export const useTableEffects = <T>({
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
}: UseTableEffectsProps<T>) => {
  // Update API params when dependencies change (only for server-side mode)
  useEffect(() => {
    if (fetchingMode === SERVER_SIDE) {
      const params: ApiParams = {
        limit:
          effectivePaginationMode === PAGINATION
            ? paginationState.pageSize
            : PAGE_SIZE,
        offset:
          effectivePaginationMode === PAGINATION
            ? paginationState.pageIndex * paginationState.pageSize
            : offset * PAGE_SIZE,
        sort:
          sort && sort.column ? `${sort.column},${sort.direction}` : undefined,
        search: search || undefined,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      }
      onApiParamsChange(params)
    }
  }, [
    search,
    filters,
    sort,
    offset,
    onApiParamsChange,
    effectivePaginationMode,
    paginationState,
    fetchingMode
  ])

  // Reset data when query params change (only for server-side mode)
  useEffect(() => {
    if (
      fetchingMode === SERVER_SIDE &&
      effectivePaginationMode === VIRTUALIZATION
    ) {
      setFetchedRows([])
      setOffset(0)
    }
    // For pagination, the usePagination hook handles resets internally
    // For client-side mode, data is always fresh from the hook
  }, [
    search,
    sort,
    filters,
    effectivePaginationMode,
    fetchingMode,
    setFetchedRows,
    setOffset
  ])

  // Append API data (for virtualization) or replace (for pagination)
  useEffect(() => {
    if (!finalApiData) return
    setTotalRecords(finalApiData.total)

    if (fetchingMode === CLIENT_SIDE) {
      // For client-side mode, always replace the data completely
      setFetchedRows(finalApiData.data)
    } else if (effectivePaginationMode === VIRTUALIZATION) {
      // For server-side virtualization mode, append data
      setFetchedRows((prev) =>
        offset === 0 ? finalApiData.data : [...prev, ...finalApiData.data]
      )
    } else {
      // For server-side pagination, replace the data completely
      setFetchedRows(finalApiData.data)
    }
  }, [
    finalApiData,
    offset,
    effectivePaginationMode,
    fetchingMode,
    setFetchedRows,
    setTotalRecords
  ])
}
