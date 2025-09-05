import { CLIENT_SIDE, SERVER_SIDE } from "@/components/Table/constants"
import type {
  ApiParams,
  ApiResponse,
  FetchingMode
} from "@/components/Table/types"
import { buildQueryString, defaultFetcher } from "@/utils/apiUtils"
import { useCallback, useMemo, useState } from "react"
import useSWR from "swr"

const API_URL = "/api/list"

interface UseApiDataParams {
  fetchingMode?: FetchingMode
}

interface UseApiDataReturn<T> {
  data: ApiResponse<T> | undefined
  isLoading: boolean
  error: Error | undefined
  onApiParamsChange: (params: ApiParams) => void
  apiParams: ApiParams
}

// Enhanced version for new usage
export const useApiData = <T>({
  fetchingMode = SERVER_SIDE
}: UseApiDataParams): UseApiDataReturn<T> => {
  // State for API params
  const [apiParams, setApiParams] = useState<ApiParams>({
    limit: 20,
    offset: 0
  })

  // For client-side mode, fetch all data; for server-side mode, use provided params
  const effectiveApiParams = useMemo(
    () =>
      fetchingMode === CLIENT_SIDE
        ? { limit: 20000, offset: 0 } // Fetch all data for client-side processing
        : apiParams,
    [fetchingMode, apiParams]
  )

  const queryString = buildQueryString(effectiveApiParams)
  const url = queryString ? `${API_URL}?${queryString}` : API_URL

  const { data, error, isLoading } = useSWR<ApiResponse<T>>(
    url,
    defaultFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true
    }
  )

  const onApiParamsChange = useCallback(
    (params: ApiParams) => {
      // Only update params for server-side mode
      if (fetchingMode === SERVER_SIDE) {
        setApiParams(params)
      }
    },
    [fetchingMode]
  )

  return {
    data,
    isLoading,
    error,
    onApiParamsChange,
    apiParams
  }
}
