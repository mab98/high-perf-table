import "@/App.css"
import ErrorToast from "@/components/ErrorToast/ErrorToast"
import Table from "@/components/Table/Table"
import { colDefs } from "@/config/colDefs"
import { PAGE_SIZE } from "@/constants"
import { useApiData } from "@/hooks/useApiData"
import useDebounce from "@/hooks/useDebounce"
import { useTableState } from "@/hooks/useTableState"
import type { ApiData } from "@/types/api"
import { useEffect, useState } from "react"

function App() {
  const [fetchedRows, setFetchedRows] = useState<ApiData[]>([])
  const [totalRecords, setTotalRecords] = useState(0)

  const {
    searchValue,
    setSearchValue,
    filters,
    sort,
    offset,
    setOffset,
    resetOffset,
    handleSort,
    handleFilterChange,
    handleClearAllFilters
  } = useTableState()

  const debouncedSearch = useDebounce(searchValue)
  const debouncedFilters = useDebounce(filters)

  const apiParams = {
    limit: PAGE_SIZE,
    offset: offset * PAGE_SIZE,
    sort: sort && sort.column ? `${sort.column},${sort.direction}` : undefined,
    search: debouncedSearch,
    filters: debouncedFilters
  }

  const { data: apiData, isLoading, error } = useApiData(apiParams)

  // Reset on search/sort/filter changes
  useEffect(() => {
    setFetchedRows([])
    resetOffset()
  }, [debouncedSearch, sort, debouncedFilters, resetOffset])

  // Update data when API response changes
  useEffect(() => {
    if (!apiData) return

    const isFirstPage = offset === 0

    const updateData = (
      newData: ApiData[],
      total: number,
      isFirstPage: boolean
    ) => {
      setTotalRecords(total)
      setFetchedRows((prevRows) =>
        isFirstPage ? newData : [...prevRows, ...newData]
      )
    }

    updateData(apiData.data, apiData.total, isFirstPage)
  }, [apiData, offset])

  const renderError = () => {
    if (!error) return null
    return <ErrorToast message={error.message} />
  }

  return (
    <div className="app">
      {renderError()}

      <Table
        data={fetchedRows}
        totalRecords={totalRecords}
        colDefs={colDefs}
        loading={isLoading}
        searchValue={searchValue}
        onSearch={setSearchValue}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
        sort={sort}
        onSort={handleSort}
        offset={offset}
        onOffsetChange={setOffset}
      />
    </div>
  )
}

export default App
