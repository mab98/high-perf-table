import { useEffect, useState } from "react"
import { useEmployeeData } from "./hooks/useEmployeeData"
import { colDefs } from "./config/colDefs"
import { PAGE_SIZE } from "./constants"
import useDebounce from "./hooks/useDebounce"
import "./App.css"
import Table from "./components/Table"
import Toast from "./components/Toast"
import type { ApiData } from "./types/api"

function App() {
  const [searchValue, setSearchValue] = useState("")
  const [currentSort, setCurrentSort] = useState<{
    column: string
    direction: "asc" | "desc"
  }>()
  const [currentPage, setCurrentPage] = useState(0)
  const [fetchedRows, setFetchedRows] = useState<ApiData[]>([])
  const [totalRecords, setTotalRecords] = useState(0)

  const debouncedSearchTerm = useDebounce(searchValue)

  const apiParams = {
    limit: PAGE_SIZE,
    offset: currentPage * PAGE_SIZE,
    sort: currentSort
      ? `${currentSort.column},${currentSort.direction}`
      : undefined,
    search: debouncedSearchTerm,
  }

  const { data: apiData, isLoading, error } = useEmployeeData(apiParams)

  // Reset rows on search/sort change
  useEffect(() => {
    setFetchedRows([])
    setCurrentPage(0)
  }, [debouncedSearchTerm, currentSort])

  // Update rows and totalRecords when API data changes
  useEffect(() => {
    if (!apiData) return

    setTotalRecords(apiData.total)
    setFetchedRows((prev) =>
      currentPage === 0 ? apiData.data : [...prev, ...apiData.data]
    )
  }, [apiData, currentPage])

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

  const handleSort = (column: string, direction: "asc" | "desc") => {
    if (column === "") {
      // Clear sorting
      setCurrentSort(undefined)
    } else {
      setCurrentSort({ column, direction })
    }
  }

  const handleSearch = (term: string) => {
    setSearchValue(term)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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
        currentSort={currentSort}
        onSort={handleSort}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        tableWidth={1400}
        tableHeight={665}
      />
    </div>
  )
}

export default App
