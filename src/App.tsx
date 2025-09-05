import "@/App.css"
import Table from "@/components/Table/Table"
import { colDefs } from "@/config/colDefs"
import { CLIENT_SIDE, VIRTUALIZATION } from "@/constants"
import { useApiData } from "@/hooks/useApiData"
import type { FetchingMode, RenderStrategy } from "@/types/table"

function App() {
  const fetchingMode: FetchingMode = CLIENT_SIDE
  const renderStrategy: RenderStrategy = VIRTUALIZATION

  const { data, isLoading, error, onApiParamsChange } = useApiData({
    fetchingMode
  })

  return (
    <div className="app">
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
