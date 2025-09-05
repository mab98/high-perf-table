import PaginationControls from "@/components/Table/components/PaginationControls/PaginationControls"
import "@/components/Table/components/TableStatus/TableStatus.css"
import type { PaginationState } from "@/types/table"

interface TableStatusProps {
  loadedRecords: number
  totalRecords: number
  loading: boolean
  // Optional pagination props - only provided in pagination mode
  paginationState?: PaginationState
  pageSizeOptions?: number[]
  onPaginationChange?: (state: PaginationState) => void
}

const getStatusText = (
  loadedRecords: number,
  totalRecords: number,
  loading: boolean,
  isPaginationMode: boolean,
  paginationState?: PaginationState
): string => {
  if (loading) {
    return "Loading..."
  }

  if (!loading && totalRecords === 0) {
    return "No records found"
  }

  if (isPaginationMode && paginationState) {
    const startRecord = paginationState.pageIndex * paginationState.pageSize + 1
    const endRecord = Math.min(
      (paginationState.pageIndex + 1) * paginationState.pageSize,
      totalRecords
    )
    return `Showing ${startRecord.toLocaleString()} to ${endRecord.toLocaleString()} of ${totalRecords.toLocaleString()} records`
  }

  return `Showing ${loadedRecords.toLocaleString()} of ${totalRecords.toLocaleString()} records`
}

const TableStatus = ({
  loadedRecords,
  totalRecords,
  loading,
  paginationState,
  pageSizeOptions,
  onPaginationChange
}: TableStatusProps) => {
  const isPaginationMode = !!paginationState && !!onPaginationChange

  return (
    <div className="table-status">
      <span className="status-highlight">
        {getStatusText(
          loadedRecords,
          totalRecords,
          loading,
          isPaginationMode,
          paginationState
        )}
      </span>

      {isPaginationMode &&
        paginationState &&
        onPaginationChange &&
        pageSizeOptions && (
          <PaginationControls
            pageIndex={paginationState.pageIndex}
            pageSize={paginationState.pageSize}
            totalRecords={totalRecords}
            pageSizeOptions={pageSizeOptions}
            onPaginationStateChange={onPaginationChange}
            loading={loading}
          />
        )}
    </div>
  )
}

export default TableStatus
