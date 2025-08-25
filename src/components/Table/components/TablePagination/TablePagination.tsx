import React from "react"
import Button from "../Button/Button"
import "./TablePagination.css"

interface TablePaginationProps {
  currentPage: number
  pageSize: number
  totalRecords: number
  loading: boolean
  onPageChange: (page: number) => void
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  pageSize,
  totalRecords,
  loading,
  onPageChange,
}) => {
  const startRecord = totalRecords === 0 ? 0 : currentPage * pageSize + 1
  const endRecord = Math.min((currentPage + 1) * pageSize, totalRecords)
  const totalPages = Math.ceil(totalRecords / pageSize)
  const hasNextPage = currentPage < totalPages - 1
  const hasPrevPage = currentPage > 0

  const handlePrevious = () => {
    if (hasPrevPage && !loading) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (hasNextPage && !loading) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        {loading ? (
          "Loading..."
        ) : totalRecords === 0 ? (
          "No records found"
        ) : (
          <>
            Showing {startRecord.toLocaleString()} to{" "}
            {endRecord.toLocaleString()} of {totalRecords.toLocaleString()}{" "}
            records
          </>
        )}
      </div>
      <div className="pagination-controls">
        <Button onClick={handlePrevious} disabled={!hasPrevPage || loading}>
          Previous
        </Button>
        <span className="page-info">
          {loading
            ? "..."
            : totalPages
            ? `Page ${(
                currentPage + 1
              ).toLocaleString()} of ${totalPages.toLocaleString()}`
            : "No pages"}
        </span>
        <Button onClick={handleNext} disabled={!hasNextPage || loading}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default TablePagination
