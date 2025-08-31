import { ClearIcon } from "@/components/Table/Icons"
import DropdownButton from "@/components/Table/components/DropdownButton"
import "@/components/Table/components/FiltersButton/FiltersButton.css"
import type { Column } from "@/types/table"

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
  const activeFilterCount = Object.values(filters).filter(
    (value) => value.trim() !== ""
  ).length
  const hasActiveFilters = activeFilterCount > 0

  const filterLabel = hasActiveFilters
    ? `Filters (${activeFilterCount})`
    : "Filters"

  return (
    <DropdownButton
      label={filterLabel}
      isActive={hasActiveFilters}
      ariaLabel={`Filters${hasActiveFilters ? ` (${activeFilterCount} active)` : ""}`}
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
            <div className="filter-input-wrapper">
              <input
                id={`filter-${col.key}`}
                type="text"
                className="filter-input"
                placeholder={`Filter by ${col.title.toLowerCase()}...`}
                value={filters[col.key] || ""}
                onChange={(e) => onFilterChange(col.key, e.target.value)}
              />
              {filters[col.key] && (
                <button
                  type="button"
                  className="filter-clear-button"
                  onClick={() => onFilterChange(col.key, "")}
                  aria-label={`Clear ${col.title} filter`}
                  title={`Clear ${col.title} filter`}
                >
                  <ClearIcon />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </DropdownButton>
  )
}

export default FiltersButton
