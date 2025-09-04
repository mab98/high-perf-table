import "@/App.css"
import ErrorToast from "@/components/ErrorToast/ErrorToast"
import Table from "@/components/Table/Table"
import { colDefs } from "@/config/colDefs"
import { PAGE_SIZE } from "@/constants"
import { useApiData } from "@/hooks/useApiData"
import { useState } from "react"
import type { ApiParams } from "./types/api"

function App() {
  const [apiParams, setApiParams] = useState<ApiParams>({
    limit: PAGE_SIZE,
    offset: 0
  })

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
        apiData={data}
        loading={isLoading}
        onApiParamsChange={setApiParams}
        paginationMode="manual"
      />
    </div>
  )
}

export default App
