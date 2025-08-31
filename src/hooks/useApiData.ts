import { useDataFetch } from "@/hooks/useDataFetch"
import type { ApiData } from "@/types/api"
import type { TableQueryParams } from "@/types/table"

const API_BASE_URL = "/api"

const API_ENDPOINTS = {
  EMPLOYEE_LIST: "/list"
} as const

export const useApiData = (params: TableQueryParams = {}) =>
  useDataFetch<ApiData>({
    endpoint: `${API_BASE_URL}${API_ENDPOINTS.EMPLOYEE_LIST}`,
    ...params
  })
