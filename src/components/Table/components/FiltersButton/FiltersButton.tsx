import { useState, useRef, useEffect, useCallback } from "react"
import type { Column } from "../../../../types/table"
import "./FiltersButton.css"

interface FiltersButtonProps<T> {
  colDefs: Column<T>[]
  filters: Record<string, string>
  onFilterChange: (columnKey: string, value: string) => void
  onClearAllFilters: () => void
}

const DropdownArrow = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="currentColor"
    className={`dropdown-arrow ${isOpen ? "rotated" : ""}`}
    aria-hidden="true"
  >
    <path
      d="M2.5 4.5L6 8l3.5-3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ClearIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 4L12 12M12 4L4 12" />
  </svg>
)

const FiltersButton = <T extends Record<string, unknown>>({
  colDefs,
  filters,
  onFilterChange,
  onClearAllFilters,
}: FiltersButtonProps<T>) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const filterableColumns = colDefs.filter((col) => col.filterable)
  const hasActiveFilters = Object.values(filters).some(
    (value) => value.trim() !== ""
  )

  const closeMenu = () => setIsMenuOpen(false)
  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Node

    if (
      menuRef.current?.contains(target) ||
      buttonRef.current?.contains(target)
    ) {
      return
    }

    closeMenu()
  }, [])

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeMenu()
      buttonRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isMenuOpen, handleClickOutside, handleEscapeKey])

  return (
    <div className="filters-button-container">
      <button
        ref={buttonRef}
        className={`filters-button ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        type="button"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        aria-label={`Filters${hasActiveFilters ? " (active)" : ""}`}
      >
        Filters
        <DropdownArrow isOpen={isMenuOpen} />
      </button>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="filters-menu"
          role="menu"
          aria-label="Column filters menu"
        >
          <header className="filters-menu-header">
            <div className="filters-header-content">
              <h3 className="filters-title">Column Filters</h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="clear-all-button"
                  onClick={onClearAllFilters}
                  aria-label="Clear all filters"
                  title="Clear all filters"
                >
                  <ClearIcon />
                </button>
              )}
            </div>
          </header>

          <div
            className="filters-menu-content"
            role="group"
            aria-label="Filter inputs"
          >
            {filterableColumns.map((col) => (
              <div key={col.key} className="filter-item" role="menuitem">
                <label htmlFor={`filter-${col.key}`} className="filter-label">
                  {col.title}
                </label>
                <input
                  id={`filter-${col.key}`}
                  type="text"
                  className="filter-input"
                  placeholder={`Filter by ${col.title.toLowerCase()}...`}
                  value={filters[col.key] || ""}
                  onChange={(e) => onFilterChange(col.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FiltersButton
