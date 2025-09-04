import "@/App.css"
import ErrorToast from "@/components/ErrorToast/ErrorToast"
import Table from "@/components/Table/Table"
import { colDefs } from "@/config/colDefs"
import { useApiData } from "@/hooks/useApiData"
import type { FetchingMode, RenderStrategy } from "./types/table"

function App() {
  const fetchingMode: FetchingMode = "clientSide"
  const renderStrategy: RenderStrategy = "virtualized"

  const { data, isLoading, error, onApiParamsChange } = useApiData({
    fetchingMode
  })

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
        error={error}
        onApiParamsChange={onApiParamsChange}
        renderStrategy={renderStrategy}
        fetchingMode={fetchingMode}
        tableTitle={`High Performance Table (${fetchingMode} + ${renderStrategy})`}
      />
    </div>
  )
}

export default App
