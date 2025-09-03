import ClearButton from "@/components/Table/components/ClearButton/ClearButton"
import DebouncedInput from "@/components/Table/components/DebouncedInput/DebouncedInput"
import DropdownButton from "@/components/Table/components/DropdownButton/DropdownButton"
import "@/components/Table/components/Filters/Filters.css"
import type { Column } from "@/types/table"
import { memo, useCallback, useMemo } from "react"

interface FiltersProps<T> {
  colDefs: Column<T>[]
  filters: Record<string, string>
  onFilterChange: (params: { key: string; value: string }) => void
  onClearAllFilters: () => void
}

const Filters = <T extends Record<string, unknown>>({
  colDefs,
  filters,
  onFilterChange,
  onClearAllFilters
}: FiltersProps<T>) => {
  const filterableColumns = useMemo(
    () => colDefs.filter((col) => col.filterable),
    [colDefs]
  )

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v.trim() !== "").length,
    [filters]
  )
  const hasFilters = activeFilterCount > 0

  const filterLabel = useMemo(
    () => (hasFilters ? `Filters (${activeFilterCount})` : "Filters"),
    [hasFilters, activeFilterCount]
  )

  const handleInputChange = useCallback(
    (key: string, value: string) => onFilterChange({ key, value }),
    [onFilterChange]
  )

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
            <ClearButton
              onClick={onClearAllFilters}
              className="header-clear"
              ariaLabel="Clear all filters"
              title="Clear all filters"
            />
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
          return (
            <div key={col.key} className="filter-item" role="menuitem">
              <label htmlFor={`filter-${col.key}`} className="filter-label">
                {col.title}
              </label>
              <DebouncedInput
                id={`filter-${col.key}`}
                className="filter-input"
                placeholder={`Filter by ${col.title.toLowerCase()}...`}
                value={value}
                onChange={(newValue) => handleInputChange(col.key, newValue)}
                clearButton={true}
                onClear={() => handleInputChange(col.key, "")}
              />
            </div>
          )
        })}
      </div>
    </DropdownButton>
  )
}

export default memo(Filters) as typeof Filters
