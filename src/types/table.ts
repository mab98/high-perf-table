import type { ReactNode } from "react"

export type Column<T> = {
  key: Extract<keyof T, string>
  title: string
  width?: number
  editable?: boolean
  sortable?: boolean
  filterable?: boolean
  resizable?: boolean
  renderer?: (rowData: T) => ReactNode
}

export type Sort = {
  column: string
  direction: "asc" | "desc"
}

export type ColumnVisibility = {
  visible: boolean
} & ({ key: string } | { all: boolean })

export type TableQueryParams = {
  limit?: number
  offset?: number
  sort?: string
  search?: string
  filters?: Record<string, string>
}

export type Tooltip = {
  text: string
  position: { x: number; y: number }
}
