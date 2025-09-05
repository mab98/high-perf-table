import "@/components/Table/components/PaginationControls/PaginationControls.css"
import type { PaginationState } from "@/types/table"

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
    if (totalPages <= 4) {
      // Show all pages if 4 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const currentPage = pageIndex + 1
    const result: (number | string)[] = []

    if (currentPage <= 3) {
      // Show first 3 pages + ... + last page
      // e.g., "1 2 3 ... 1000"
      result.push(1, 2, 3, "...", totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Show first page + ... + last 3 pages
      // e.g., "1 ... 998 999 1000"
      result.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
    } else {
      // Show first page + ... + current-1, current, current+1 + ... + last page
      // e.g., "1 ... 49 50 51 ... 1000"
      result.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      )
    }

    // Remove duplicates while preserving order and ellipsis
    const uniquePages: (number | string)[] = []
    for (let i = 0; i < result.length; i++) {
      const page = result[i]
      if (page === "...") {
        // Only add ellipsis if the previous and next items are numbers with a gap
        const prev = result[i - 1] as number
        const next = result[i + 1] as number
        if (prev && next && next - prev > 1) {
          uniquePages.push(page)
        }
      } else if (!uniquePages.includes(page)) {
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
