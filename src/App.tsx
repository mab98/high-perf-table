import { useEffect, useState } from "react"
import { useEmployeeData } from "./hooks/useEmployeeData"
import { colDefs } from "./config/colDefs"
import { DEFAULT_PAGE_SIZE } from "./constants/table"
import useDebounce from "./hooks/useDebounce"
import "./App.css"
import Table from "./components/Table"
import Toast from "./components/Toast"
import type { ApiData } from "./types/api"

function App() {
  const [searchValue, setSearchValue] = useState("")
  const [currentSort, setCurrentSort] = useState<{
    field: string
    direction: "asc" | "desc"
  }>()
  const [currentPage, setCurrentPage] = useState(0)
  const [fetchedRows, setFetchedRows] = useState<ApiData[]>([])

  const debouncedSearchTerm = useDebounce(searchValue)

  const {
    data: apiData,
    isLoading,
    error,
  } = useEmployeeData({
    limit: DEFAULT_PAGE_SIZE,
    offset: currentPage * DEFAULT_PAGE_SIZE,
    sort: currentSort
      ? `${currentSort.field},${currentSort.direction}`
      : undefined,
    search: debouncedSearchTerm,
  })

  // Reset rows on search/sort change
  useEffect(() => {
    setFetchedRows([])
    setCurrentPage(0)
  }, [debouncedSearchTerm, currentSort])

  // Update rows when API data changes
  useEffect(() => {
    if (!apiData) return

    setFetchedRows((prev) =>
      currentPage === 0 ? apiData.data : [...prev, ...apiData.data]
    )
  }, [apiData, currentPage])

  const handleSort = (field: string, direction: "asc" | "desc") =>
    setCurrentSort({ field, direction })

  const handleSearch = (term: string) => setSearchValue(term)

  return (
    <div className="app">
      {error && <Toast message={error.message} />}

      <Table
        data={fetchedRows}
        totalRecords={apiData?.total || 0}
        colDefs={colDefs}
        loading={isLoading}
        searchValue={searchValue}
        onSearch={handleSearch}
        currentSort={currentSort}
        onSort={handleSort}
        currentPage={currentPage}
        pageSize={DEFAULT_PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default App
