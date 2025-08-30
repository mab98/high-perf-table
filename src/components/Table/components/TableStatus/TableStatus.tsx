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
    return `Loaded ${loadedRecords.toLocaleString()} of ${totalRecords.toLocaleString()} records`
  }

  return (
    <div className="table-status">
      <span>{getStatusText()}</span>
    </div>
  )
}

export default TableStatus
