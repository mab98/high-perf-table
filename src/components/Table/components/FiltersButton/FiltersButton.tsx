import type { Column } from "../../../../types/table"
import DropdownButton from "../DropdownButton"
import "./FiltersButton.css"

interface FiltersButtonProps<T> {
  colDefs: Column<T>[]
  filters: Record<string, string>
  onFilterChange: (columnKey: string, value: string) => void
  onClearAllFilters: () => void
}

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
  onClearAllFilters
}: FiltersButtonProps<T>) => {
  const filterableColumns = colDefs.filter((col) => col.filterable)
  const hasActiveFilters = Object.values(filters).some(
    (value) => value.trim() !== ""
  )

  return (
    <DropdownButton
      label="Filters"
      isActive={hasActiveFilters}
      ariaLabel={`Filters${hasActiveFilters ? " (active)" : ""}`}
      className="filters-dropdown"
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
    </DropdownButton>
  )
}

export default FiltersButton
