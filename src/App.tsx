import { useState } from "react"
import { useEmployeeData } from "./hooks/useEmployeeData"
import { colDefs } from "./config/colDefs"
import { DEFAULT_PAGE_SIZE } from "./constants/table"
import useDebounce from "./hooks/useDebounce"
import "./App.css"
import Table from "./components/Table"
import Toast from "./components/Toast"

function App() {
  const [searchValue, setSearchValue] = useState("")
  const [currentSort, setCurrentSort] = useState<{
    field: string
    direction: "asc" | "desc"
  }>()
  const [currentPage, setCurrentPage] = useState(0)

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

  const handleSort = (field: string, direction: "asc" | "desc") => {
    setCurrentSort({ field, direction })
    setCurrentPage(0)
  }

  const handleSearch = (term: string) => {
    setSearchValue(term)
    setCurrentPage(0)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="app">
      {error && <Toast message={error.message} />}

      <Table
        data={apiData?.data || []}
        totalRecords={apiData?.total || 0}
        colDefs={colDefs}
        loading={isLoading}
        searchValue={searchValue}
        onSearch={handleSearch}
        currentSort={currentSort}
        onSort={handleSort}
        currentPage={currentPage}
        pageSize={DEFAULT_PAGE_SIZE}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default App
