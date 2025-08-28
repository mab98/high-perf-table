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
  loading
}) => {
  return (
    <div className="table-status">
      <strong>
        {!loading && totalRecords === 0
          ? "No records found."
          : `Loaded ${loadedRecords.toLocaleString()} of ${totalRecords.toLocaleString()} records`}
      </strong>
    </div>
  )
}

export default TableStatus
