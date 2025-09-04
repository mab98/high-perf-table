import type { PaginationState } from "@/types/table"
import "./PaginationControls.css"

interface PaginationControlsProps {
  pageIndex: number
  pageSize: number
  totalRecords: number
  pageSizeOptions: number[]
  onPaginationStateChange: (state: PaginationState) => void
  loading?: boolean
}

const PaginationControls = ({
  pageIndex,
  pageSize,
  totalRecords,
  pageSizeOptions,
  onPaginationStateChange,
  loading = false
}: PaginationControlsProps) => {
  const totalPages = Math.ceil(totalRecords / pageSize)

  const handlePageSizeChange = (newPageSize: number) => {
    const newPageIndex = Math.floor((pageIndex * pageSize) / newPageSize)
    onPaginationStateChange({
      pageIndex: newPageIndex,
      pageSize: newPageSize
    })
  }

  const handlePageChange = (newPageIndex: number) => {
    onPaginationStateChange({
      pageIndex: newPageIndex,
      pageSize
    })
  }

  const getVisiblePageNumbers = (): (number | string)[] => {
    if (totalPages <= 1) return [1]
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const delta = 2
    const rangeWithDots: (number | string)[] = []
    const currentPage = pageIndex + 1

    // Always show first page
    rangeWithDots.push(1)

    // Calculate start and end of middle range
    const start = Math.max(2, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)

    // Add dots if there's a gap after first page
    if (start > 2) {
      rangeWithDots.push("...")
    }

    // Add middle range
    for (let i = start; i <= end; i++) {
      rangeWithDots.push(i)
    }

    // Add dots if there's a gap before last page
    if (end < totalPages - 1) {
      rangeWithDots.push("...")
    }

    // Always show last page (if it's not already included)
    if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    // Remove duplicates while preserving order
    const uniquePages: (number | string)[] = []
    for (const page of rangeWithDots) {
      if (page === "..." || !uniquePages.includes(page)) {
        uniquePages.push(page)
      }
    }

    return uniquePages
  }

  if (totalRecords === 0) return null

  return (
    <div className="pagination-controls">
      <div className="pagination-actions">
        <div className="page-size-selector">
          <label htmlFor="page-size">Rows per page:</label>
          <div className="select-wrapper">
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              disabled={loading}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="page-navigation">
          <button
            onClick={() => handlePageChange(0)}
            disabled={pageIndex === 0 || loading}
            title="First page"
            aria-label="Go to first page"
            className="nav-button"
          >
            ⟪
          </button>
          <button
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={pageIndex === 0 || loading}
            title="Previous page"
            aria-label="Go to previous page"
            className="nav-button"
          >
            ⟨
          </button>

          <div
            className="page-numbers"
            role="navigation"
            aria-label="Pagination"
          >
            {getVisiblePageNumbers().map((page, index) => (
              <span key={index}>
                {page === "..." ? (
                  <span className="page-ellipsis" aria-hidden="true">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => handlePageChange((page as number) - 1)}
                    className={
                      pageIndex === (page as number) - 1 ? "active" : ""
                    }
                    disabled={loading}
                    title={`Go to page ${page}`}
                    aria-label={`Go to page ${page}`}
                    aria-current={
                      pageIndex === (page as number) - 1 ? "page" : undefined
                    }
                  >
                    {page}
                  </button>
                )}
              </span>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={pageIndex >= totalPages - 1 || loading}
            title="Next page"
            aria-label="Go to next page"
            className="nav-button"
          >
            ⟩
          </button>
          <button
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={pageIndex >= totalPages - 1 || loading}
            title="Last page"
            aria-label="Go to last page"
            className="nav-button"
          >
            ⟫
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaginationControls
