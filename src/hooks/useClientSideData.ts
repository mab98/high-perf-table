import type { ApiData, ApiResponse } from "@/types/api"
import type { Sort } from "@/types/table"
import { useMemo } from "react"

interface UseClientSideDataParams {
  data: ApiResponse<ApiData> | undefined
  search?: string
  filters?: Record<string, string>
  sort?: Sort
  pageIndex?: number
  pageSize?: number
  isVirtualized?: boolean
}

interface UseClientSideDataReturn {
  data: ApiResponse<ApiData> | undefined
  allData: ApiData[] | undefined
  processedCount: number
}

export const useClientSideData = (
  params: UseClientSideDataParams
): UseClientSideDataReturn => {
  const {
    data: rawData,
    search = "",
    filters = {},
    sort,
    pageIndex = 0,
    pageSize = 20,
    isVirtualized = false
  } = params

  // Process data client-side
  const processedData = useMemo(() => {
    if (!rawData?.data) return undefined

    let filteredData = [...rawData.data]

    // Apply search
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchLower)
        )
      )
    }

    // Apply filters
    if (Object.keys(filters).length > 0) {
      filteredData = filteredData.filter((item) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value.trim()) return true
          const itemValue = String(item[key as keyof typeof item] || "")
          return itemValue.toLowerCase().includes(value.toLowerCase())
        })
      )
    }

    // Apply sorting
    if (sort?.column) {
      filteredData.sort((a, b) => {
        const aValue = a[sort.column as keyof typeof a]
        const bValue = b[sort.column as keyof typeof b]

        let comparison = 0

        // Handle different data types
        if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue
        } else {
          // String comparison for all other types
          const aStr = String(aValue || "").toLowerCase()
          const bStr = String(bValue || "").toLowerCase()
          comparison = aStr.localeCompare(bStr)
        }

        return sort.direction === "desc" ? -comparison : comparison
      })
    }

    // Apply pagination - but for virtualized mode, return all filtered data
    let paginatedData: ApiData[]
    let responseTotal: number
    let responseOffset: number

    if (isVirtualized) {
      // For virtualized mode, return all filtered data
      paginatedData = filteredData
      responseTotal = filteredData.length
      responseOffset = 0
    } else {
      // For manual pagination, apply pagination
      const startIndex = pageIndex * pageSize
      const endIndex = startIndex + pageSize
      paginatedData = filteredData.slice(startIndex, endIndex)
      responseTotal = filteredData.length
      responseOffset = startIndex
    }

    return {
      data: paginatedData,
      total: responseTotal,
      limit: isVirtualized ? filteredData.length : pageSize,
      offset: responseOffset,
      allFilteredData: filteredData
    }
  }, [rawData, search, filters, sort, pageIndex, pageSize, isVirtualized])

  const result: UseClientSideDataReturn = {
    data: processedData
      ? {
          data: processedData.data,
          total: processedData.total,
          limit: processedData.limit,
          offset: processedData.offset
        }
      : undefined,
    allData: rawData?.data,
    processedCount: processedData?.total || 0
  }

  return result
}
