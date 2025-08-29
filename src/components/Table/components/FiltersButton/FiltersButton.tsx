import type { Column } from "../../../../types/table"
import { ClearIcon } from "../../Icons"
import DropdownButton from "../DropdownButton"
import "./FiltersButton.css"

interface FiltersButtonProps<T> {
  colDefs: Column<T>[]
  filters: Record<string, string>
  onFilterChange: (key: string, value: string) => void
  onClearAllFilters: () => void
}

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
              type="search"
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
