import "@/components/Table/components/TableStatus/TableStatus.css"

interface TableStatusProps {
  loadedRecords: number
  totalRecords: number
  loading: boolean
}

const getStatusText = (
  loadedRecords: number,
  totalRecords: number,
  loading: boolean
): string => {
  if (!loading && totalRecords === 0) {
    return "No records found"
  }
  return `Showing ${loadedRecords.toLocaleString()} of ${totalRecords.toLocaleString()} records`
}

const TableStatus = ({
  loadedRecords,
  totalRecords,
  loading
}: TableStatusProps) => {
  return (
    <div className="table-status">
      <span className="status-highlight">
        {getStatusText(loadedRecords, totalRecords, loading)}
      </span>
    </div>
  )
}

export default TableStatus
