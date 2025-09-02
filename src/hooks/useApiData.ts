import { PAGE_SIZE } from "@/constants"
import type { ApiData, ApiResponse } from "@/types/api"
import type { TableQueryParams } from "@/types/table"
import { buildQueryString, defaultFetcher } from "@/utils/apiUtils"
import useSWR from "swr"

const API_URL = "/api/list"

interface UseApiDataReturn {
  data: ApiResponse<ApiData> | undefined
  isLoading: boolean
  error: Error | undefined
}

export const useApiData = (params: TableQueryParams = {}): UseApiDataReturn => {
  const queryParams: TableQueryParams = {
    limit: PAGE_SIZE,
    offset: 0,
    ...params
  }

  const queryString = buildQueryString(queryParams)
  const url = queryString ? `${API_URL}?${queryString}` : API_URL

  const { data, error, isLoading } = useSWR<ApiResponse<ApiData>>(
    url,
    defaultFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true
    }
  )

  return { data, isLoading, error }
}
