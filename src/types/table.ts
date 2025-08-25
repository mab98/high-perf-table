import type { ReactNode } from "react"

export type Column<T> = {
  key: Extract<keyof T, string>
  title: string
  width?: number
  editable?: boolean
  sortable?: boolean
  filterable?: boolean
  renderer?: (rowData: T) => ReactNode
}

export type TableQueryParams = {
  limit?: number
  offset?: number
  sort?: string
  search?: string
  filters?: Record<string, unknown>
}
