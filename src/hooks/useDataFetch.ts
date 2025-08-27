import useSWR from "swr"
import type { TableQueryParams } from "../types/table"
import type { ApiResponse } from "../types/api"
import { PAGE_SIZE } from "../constants"

interface UseDataFetchParams<T> extends TableQueryParams {
  endpoint: string
  fetcher?: (url: string) => Promise<ApiResponse<T>>
}

interface UseDataFetchReturn<T> {
  data: ApiResponse<T> | undefined
  isLoading: boolean
  error: Error | undefined
}

// Default fetcher function
const defaultFetcher = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await fetch(url, {
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Build query string from parameters
const buildQueryString = (params: TableQueryParams): string => {
  const searchParams = new URLSearchParams()

  if (params.limit !== undefined) {
    searchParams.append("limit", params.limit.toString())
  }

  if (params.offset !== undefined) {
    searchParams.append("offset", params.offset.toString())
  }

  if (params.sort) {
    searchParams.append("sort", params.sort)
  }

  if (params.search) {
    searchParams.append("search", params.search)
  }

  if (params.filters && Object.keys(params.filters).length > 0) {
    searchParams.append("filters", JSON.stringify(params.filters))
  }

  return searchParams.toString()
}

/**
 * Generic data fetching hook for any data type
 * Can be used with any API endpoint and data structure
 */
export const useDataFetch = <T>({
  endpoint,
  fetcher = defaultFetcher,
  ...params
}: UseDataFetchParams<T>): UseDataFetchReturn<T> => {
  // Set default values using central constants
  const queryParams: TableQueryParams = {
    limit: PAGE_SIZE,
    offset: 0,
    ...params,
  }

  const queryString = buildQueryString(queryParams)
  const url = queryString ? `${endpoint}?${queryString}` : endpoint

  const { data, error, isLoading } = useSWR<ApiResponse<T>>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  return {
    data,
    isLoading,
    error,
  }
}
