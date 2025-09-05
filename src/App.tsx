import "@/App.css"
import Table from "@/components/Table/Table"
import { CLIENT_SIDE, VIRTUALIZATION } from "@/components/Table/constants"
import type { FetchingMode, RenderStrategy } from "@/components/Table/types"
import { colDefs } from "@/config/colDefs"
import { useApiData } from "@/hooks/useApiData"

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
