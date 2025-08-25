import { useDataFetch } from "./useDataFetch"
import type { TableQueryParams } from "../types/table"
import type { ApiData } from "../types/api"

const API_BASE_URL = "/api"

const API_ENDPOINTS = {
  EMPLOYEE_LIST: "/list",
} as const

export const useEmployeeData = (params: TableQueryParams = {}) => {
  return useDataFetch<ApiData>({
    endpoint: `${API_BASE_URL}${API_ENDPOINTS.EMPLOYEE_LIST}`,
    ...params,
  })
}
