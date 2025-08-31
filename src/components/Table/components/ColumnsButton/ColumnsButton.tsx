import "@/components/Table/components/ColumnsButton/ColumnsButton.css"
import DropdownButton from "@/components/Table/components/DropdownButton/DropdownButton"
import type { Column } from "@/types/table"
import { memo, useCallback, useMemo } from "react"

interface ColumnsButtonProps<T> {
  colDefs: Column<T>[]
  visibleColumns: string[]
  onColumnVisibilityChange: (params: { key: string; visible: boolean }) => void
  onToggleAllColumns: (visible: boolean) => void
}

const ColumnsButton = <T extends Record<string, unknown>>({
  colDefs,
  visibleColumns,
  onColumnVisibilityChange,
  onToggleAllColumns
}: ColumnsButtonProps<T>) => {
  const totalCount = colDefs.length
  const visibleCount = visibleColumns.length

  const isAllVisible = visibleCount === totalCount
  const isNoneVisible = visibleCount === 0
  const isIndeterminate = !isAllVisible && !isNoneVisible

  const columnsLabel = useMemo(
    () => `Columns (${visibleCount}/${totalCount})`,
    [visibleCount, totalCount]
  )

  const handleToggleAll = useCallback(
    () => onToggleAllColumns(!isAllVisible),
    [isAllVisible, onToggleAllColumns]
  )

  const handleColumnChange = useCallback(
    (key: string, visible: boolean) =>
      onColumnVisibilityChange({ key, visible }),
    [onColumnVisibilityChange]
  )

  const setCheckboxRef = useCallback(
    (input: HTMLInputElement | null) => {
      if (input) input.indeterminate = isIndeterminate
    },
    [isIndeterminate]
  )

  const renderToggleAllCheckbox = useCallback(
    () => (
      <label className="column-checkbox-item toggle-all">
        <input
          type="checkbox"
          checked={isAllVisible}
          ref={setCheckboxRef}
          onChange={handleToggleAll}
          className="column-checkbox"
        />
        <span className="column-label">Show/Hide All</span>
      </label>
    ),
    [isAllVisible, setCheckboxRef, handleToggleAll]
  )

  const renderColumnCheckbox = useCallback(
    (col: Column<T>) => {
      const isVisible = visibleColumns.includes(col.key)
      return (
        <label key={col.key} className="column-checkbox-item">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => handleColumnChange(col.key, e.target.checked)}
            className="column-checkbox"
          />
          <span className="column-label">{col.title}</span>
        </label>
      )
    },
    [visibleColumns, handleColumnChange]
  )

  return (
    <DropdownButton label={columnsLabel} className="columns-dropdown">
      <div className="columns-menu-header">
        <div className="columns-header-content">
          <h3 className="columns-title">Manage Columns</h3>
        </div>
      </div>
      <div className="columns-menu-content">
        {renderToggleAllCheckbox()}
        {colDefs.map(renderColumnCheckbox)}
      </div>
    </DropdownButton>
  )
}

export default memo(ColumnsButton) as typeof ColumnsButton
