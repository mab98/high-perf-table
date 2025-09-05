export type ApiResponse<T> = {
  data: T[]
  total: number
  limit: number
  offset: number
}

export type ApiParams = {
  limit: number
  offset: number
  sort?: string
  search?: string
  filters?: Record<string, string>
}
