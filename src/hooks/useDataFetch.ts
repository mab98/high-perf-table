import { PAGE_SIZE } from "@/constants"
import { buildQueryString, defaultFetcher } from "@/hooks/utils"
import type { ApiResponse } from "@/types/api"
import type { TableQueryParams } from "@/types/table"
import useSWR from "swr"

interface UseDataFetchParams<T> extends TableQueryParams {
  endpoint: string
  fetcher?: (url: string) => Promise<ApiResponse<T>>
}

interface UseDataFetchReturn<T> {
  data: ApiResponse<T> | undefined
  isLoading: boolean
  error: Error | undefined
}

export const useDataFetch = <T>({
  endpoint,
  fetcher = defaultFetcher,
  ...params
}: UseDataFetchParams<T>): UseDataFetchReturn<T> => {
  const queryParams: TableQueryParams = {
    limit: PAGE_SIZE,
    offset: 0,
    ...params
  }

  const queryString = buildQueryString(queryParams)
  const url = queryString ? `${endpoint}?${queryString}` : endpoint

  const { data, error, isLoading } = useSWR<ApiResponse<T>>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true
  })

  return { data, isLoading, error }
}
