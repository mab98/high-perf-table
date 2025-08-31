import type { ApiResponse } from "@/types/api"
import type { TableQueryParams } from "@/types/table"

export const buildQueryString = (params: TableQueryParams): string => {
  const searchParams = new URLSearchParams()

  if (params.limit && params.limit > 0) {
    searchParams.append("limit", params.limit.toString())
  }

  if (params.offset && params.offset >= 0) {
    searchParams.append("offset", params.offset.toString())
  }

  if (params.sort?.trim()) {
    searchParams.append("sort", params.sort.trim())
  }

  if (params.search?.trim()) {
    searchParams.append("search", params.search.trim())
  }

  if (params.filters && Object.keys(params.filters).length > 0) {
    const validFilters = Object.fromEntries(
      Object.entries(params.filters).filter(([, value]) => value?.trim())
    )

    if (Object.keys(validFilters).length > 0) {
      searchParams.append("filters", JSON.stringify(validFilters))
    }
  }

  return searchParams.toString()
}

export const defaultFetcher = async <T>(
  url: string
): Promise<ApiResponse<T>> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}
