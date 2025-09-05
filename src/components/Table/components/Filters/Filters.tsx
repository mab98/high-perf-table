import ClearButton from "@/components/Table/components/ClearButton/ClearButton"
import DropdownButton from "@/components/Table/components/DropdownButton/DropdownButton"
import "@/components/Table/components/Filters/Filters.css"
import { useFilters } from "@/components/Table/hooks/useFilters"
import type { Column } from "@/types/table"
import { memo } from "react"

interface FiltersProps<T> {
  colDefs: Column<T>[]
  visibleColumns: string[]
  filters: Record<string, string>
  onFilterChange: (params: { key: string; value: string }) => void
  onClearAllFilters: () => void
}

const Filters = <T extends Record<string, unknown>>({
  colDefs,
  visibleColumns,
  filters,
  onFilterChange,
  onClearAllFilters
}: FiltersProps<T>) => {
  const {
    filterableColumns,
    activeFilterCount,
    hasFilters,
    filterLabel,
    onInputChange
  } = useFilters({
    colDefs,
    visibleColumns,
    filters,
    onFilterChange
  })

  return (
    <DropdownButton
      label={filterLabel}
      isActive={hasFilters}
      ariaLabel={`Filters${hasFilters ? ` (${activeFilterCount} active)` : ""}`}
      className="filters-dropdown"
    >
      <header className="filters-menu-header">
        <div className="filters-header-content">
          <h3 className="filters-title">Column Filters</h3>
          {hasFilters && (
            <button
              type="button"
              className="clear-filters-button"
              onClick={onClearAllFilters}
              title="Clear all filters"
              aria-label="Clear all filters"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      <div
        className="filters-menu-content"
        role="group"
        aria-label="Filter inputs"
      >
        {filterableColumns.map((col) => {
          const value = filters[col.key] || ""

          const handleInputChange = (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            onInputChange(col.key, e.target.value)
          }

          const handleClear = () => {
            onInputChange(col.key, "")
          }

          return (
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
                  value={value}
                  onChange={handleInputChange}
                />
                {value && (
                  <ClearButton
                    onClick={handleClear}
                    className="input-clear"
                    ariaLabel="Clear filter"
                    title="Clear filter"
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </DropdownButton>
  )
}

export default memo(Filters) as typeof Filters
