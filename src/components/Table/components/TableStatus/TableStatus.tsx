import "@/components/Table/components/TableStatus/TableStatus.css"

interface TableStatusProps {
  loadedRecords: number
  totalRecords: number
  loading: boolean
}

const TableStatus = ({
  loadedRecords,
  totalRecords,
  loading
}: TableStatusProps) => {
  const getStatusText = () => {
    if (!loading && totalRecords === 0) {
      return "No records found"
    }
    return `Showing ${loadedRecords.toLocaleString()} of ${totalRecords.toLocaleString()} records`
  }

  return (
    <div className="table-status">
      <div className="table-status-left">
        {/* Loading status removed as requested */}
      </div>
      <div className="table-status-right">
        <span className="status-highlight">{getStatusText()}</span>
      </div>
    </div>
  )
}

export default TableStatus
