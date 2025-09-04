export type ApiData = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  designation: string
  city: string
  country: string
  joinDate: string
  salary: number
}

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
