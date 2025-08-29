import { useEffect, useState } from "react"
import "./App.css"
import Table from "./components/Table"
import Toast from "./components/Toast"
import { colDefs } from "./config/colDefs"
import { PAGE_SIZE } from "./constants"
import { useApiData } from "./hooks/useApiData"
import useDebounce from "./hooks/useDebounce"
import type { ApiData } from "./types/api"

function App() {
  const [searchValue, setSearchValue] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sorting, setSorting] = useState<{
    column: string
    direction: "asc" | "desc"
  }>()
  const [pagination, setPagination] = useState({ page: 0 })
  const [fetchedRows, setFetchedRows] = useState<ApiData[]>([])
  const [totalRecords, setTotalRecords] = useState(0)

  const debouncedSearch = useDebounce(searchValue)
  const debouncedFilters = useDebounce(filters)

  const apiParams = {
    limit: PAGE_SIZE,
    offset: pagination.page * PAGE_SIZE,
    sort: sorting ? `${sorting.column},${sorting.direction}` : undefined,
    search: debouncedSearch,
    filters: debouncedFilters
  }

  const { data: apiData, isLoading, error } = useApiData(apiParams)

  // Reset rows on search/sort/filter change
  useEffect(() => {
    setFetchedRows([])
    setPagination({ page: 0 })
  }, [debouncedSearch, sorting, debouncedFilters])

  // Update rows & total count on data change
  useEffect(() => {
    if (!apiData) return
    setTotalRecords(apiData.total)
    setFetchedRows((prev) =>
      pagination.page === 0 ? apiData.data : [...prev, ...apiData.data]
    )
  }, [apiData, pagination.page])

  // Handlers
  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSorting(column ? { column, direction } : undefined)
  }

  const handleSearch = (term: string) => {
    setSearchValue(term)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearAllFilters = () => {
    setFilters({})
  }

  const handlePageChange = (page: number) => {
    setPagination({ page })
  }

  return (
    <div className="app">
      {error && <Toast message={error.message} />}

      <Table
        data={fetchedRows}
        totalRecords={totalRecords}
        colDefs={colDefs}
        loading={isLoading}
        searchValue={searchValue}
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
        currentSort={sorting}
        onSort={handleSort}
        currentPage={pagination.page}
        onPageChange={handlePageChange}
        tableWidth={1400}
        tableHeight={665}
      />
    </div>
  )
}

export default App
