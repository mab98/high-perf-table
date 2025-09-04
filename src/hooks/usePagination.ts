import { PAGE_SIZE } from "@/constants"
import type { PaginationConfig, PaginationState } from "@/types/table"
import { useCallback, useEffect, useState } from "react"

interface UsePaginationProps {
  pagination?: PaginationConfig
  totalRecords: number
  defaultPageSize?: number
}

export const usePagination = ({
  pagination,
  totalRecords,
  defaultPageSize = PAGE_SIZE
}: UsePaginationProps) => {
  const mode = pagination?.mode || "virtualized"
  const pageSizeOptions = pagination?.pageSizeOptions || [20, 50, 100]

  // Default pagination state
  const defaultState: PaginationState = {
    pageIndex: 0,
    pageSize: pagination?.state?.pageSize || defaultPageSize
  }

  // Use controlled state if provided, otherwise use internal state
  const [internalState, setInternalState] = useState<PaginationState>(
    pagination?.state || defaultState
  )

  const currentState = pagination?.state || internalState
  const isControlled = Boolean(pagination?.state && pagination?.onStateChange)

  // Update internal state when external state changes (only for controlled mode)
  useEffect(() => {
    if (pagination?.state && !isControlled) {
      setInternalState(pagination.state)
    }
  }, [pagination?.state, isControlled])

  const handleStateChange = useCallback(
    (newState: PaginationState) => {
      if (isControlled && pagination?.onStateChange) {
        pagination.onStateChange(newState)
      } else {
        setInternalState(newState)
      }
    },
    [isControlled, pagination]
  )

  // Reset to first page when total records change significantly
  // Use a separate effect that doesn't depend on currentState to avoid loops
  const [prevTotalRecords, setPrevTotalRecords] = useState(totalRecords)
  useEffect(() => {
    if (totalRecords !== prevTotalRecords) {
      setPrevTotalRecords(totalRecords)

      if (totalRecords > 0) {
        const maxPage = Math.ceil(totalRecords / currentState.pageSize) - 1
        if (currentState.pageIndex > maxPage && maxPage >= 0) {
          const newState = {
            pageIndex: Math.max(0, maxPage),
            pageSize: currentState.pageSize
          }
          handleStateChange(newState)
        }
      }
    }
  }, [
    totalRecords,
    prevTotalRecords,
    currentState.pageSize,
    currentState.pageIndex,
    handleStateChange
  ])

  return {
    mode,
    state: currentState,
    onStateChange: handleStateChange,
    pageSizeOptions
  }
}
