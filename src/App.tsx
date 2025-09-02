import "@/App.css"
import ErrorToast from "@/components/ErrorToast/ErrorToast"
import Table from "@/components/Table/Table"
import { colDefs } from "@/config/colDefs"
import { PAGE_SIZE } from "@/constants"
import { useApiData } from "@/hooks/useApiData"
import { useState } from "react"
import type { Sort } from "./types/table"

function App() {
  // API-related states
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sort, setSort] = useState<Sort | undefined>()
  const [offset, setOffset] = useState(0)

  const apiParams = {
    limit: PAGE_SIZE,
    offset: offset * PAGE_SIZE,
    sort: sort && sort.column ? `${sort.column},${sort.direction}` : undefined,
    search,
    filters
  }

  const { data, isLoading, error } = useApiData(apiParams)

  const renderError = () => {
    if (!error) return null
    return <ErrorToast message={error.message} />
  }

  return (
    <div className="app">
      {renderError()}

      <Table
        colDefs={colDefs}
        data={data}
        loading={isLoading}
        onSearchChange={setSearch}
        onFiltersChange={setFilters}
        sort={sort}
        setSort={setSort}
        offset={offset}
        setOffset={setOffset}
      />
    </div>
  )
}

export default App
