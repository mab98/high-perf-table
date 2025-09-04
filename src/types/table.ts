import type { ReactNode } from "react"

export type EditableConfig = {
  validation?: (value: string) => string | null
}

export type Column<T> = {
  key: Extract<keyof T, string>
  title: string
  width?: number
  editable?: boolean | EditableConfig
  sortable?: boolean
  filterable?: boolean
  resizable?: boolean
  tooltip?: boolean
  alwaysVisible?: boolean // When true, column is always visible and excluded from columns menu
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

export type PaginationMode = "virtualized" | "manual"

export type PaginationState = {
  pageIndex: number
  pageSize: number
}

export type PaginationConfig = {
  mode: PaginationMode
  state?: PaginationState
  onStateChange?: (state: PaginationState) => void
  pageSizeOptions?: number[]
}
