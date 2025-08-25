import React from "react"
import "./TableStatus.css"

interface TableStatusProps {
  loadedRecords: number
  totalRecords: number
  loading: boolean
}

const TableStatus: React.FC<TableStatusProps> = ({
  loadedRecords,
  totalRecords,
  loading,
}) => {
  const hasMoreData = loadedRecords < totalRecords

  return (
    <div className="table-status">
      {loading ? (
        "Loading more records..."
      ) : totalRecords === 0 ? (
        "No records found"
      ) : hasMoreData ? (
        <>
          Loaded {loadedRecords.toLocaleString()} of{" "}
          {totalRecords.toLocaleString()} records
        </>
      ) : (
        <>All {totalRecords.toLocaleString()} records loaded</>
      )}
    </div>
  )
}

export default TableStatus
