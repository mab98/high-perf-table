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

  const [paginationMode, setPaginationMode] = useState<
    "virtualized" | "manual"
  >("virtualized")

  const { data, isLoading, error } = useApiData(apiParams)

  const renderError = () => {
    if (!error) return null
    return <ErrorToast message={error.message} />
  }

  return (
    <div className="app">
      {renderError()}

      <div
        style={{
          padding: "20px",
          background: "#f5f5f5",
          marginBottom: "20px",
          borderRadius: "8px"
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <label style={{ fontWeight: "bold", color: "#555" }}>
            Pagination Mode:
          </label>
          <button
            onClick={() => setPaginationMode("virtualized")}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              background: paginationMode === "virtualized" ? "#007bff" : "#fff",
              color: paginationMode === "virtualized" ? "#fff" : "#333",
              cursor: "pointer",
              fontWeight: paginationMode === "virtualized" ? "bold" : "normal"
            }}
          >
            Virtualized (Infinite Scroll)
          </button>
          <button
            onClick={() => setPaginationMode("manual")}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              background: paginationMode === "manual" ? "#007bff" : "#fff",
              color: paginationMode === "manual" ? "#fff" : "#333",
              cursor: "pointer",
              fontWeight: paginationMode === "manual" ? "bold" : "normal"
            }}
          >
            Manual Pagination
          </button>
        </div>
      </div>

      <Table
        colDefs={colDefs}
        apiData={data}
        loading={isLoading}
        onApiParamsChange={setApiParams}
        paginationMode={paginationMode}
      />
    </div>
  )
}

export default App
