import "@/components/Table/components/Columns/Columns.css"
import DropdownButton from "@/components/Table/components/DropdownButton/DropdownButton"
import { useColumnVisibility } from "@/components/Table/hooks/useColumnVisibility"
import { memo, useCallback } from "react"
import type { Column, ColumnVisibility } from "../../types/table"

interface ColumnsProps<T> {
  colDefs: Column<T>[]
  visibleColumns: string[]
  onColumnVisibility: (params: ColumnVisibility) => void
  hasCustomSettings?: boolean
  onResetColumnSettings?: () => void
}

const Columns = <T extends Record<string, unknown>>({
  colDefs,
  visibleColumns,
  onColumnVisibility,
  hasCustomSettings = false,
  onResetColumnSettings
}: ColumnsProps<T>) => {
  const {
    onToggleAll,
    onColumnChange,
    setCheckboxRef,
    isAllVisible,
    toggleableColumns,
    alwaysVisibleColumns,
    columnsLabel
  } = useColumnVisibility({
    colDefs,
    visibleColumns,
    onColumnVisibility
  })

  const renderToggleAllCheckbox = useCallback(
    () => (
      <label className="column-checkbox-item toggle-all">
        <input
          type="checkbox"
          checked={isAllVisible}
          ref={setCheckboxRef}
          onChange={onToggleAll}
          className="column-checkbox"
        />
        <span className="column-label">Show/Hide All</span>
      </label>
    ),
    [isAllVisible, setCheckboxRef, onToggleAll]
  )

  const renderColumnCheckbox = useCallback(
    (col: Column<T>) => {
      const isVisible = visibleColumns.includes(col.key)
      return (
        <label key={col.key} className="column-checkbox-item">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => onColumnChange(col.key, e.target.checked)}
            className="column-checkbox"
          />
          <span className="column-label">{col.title}</span>
        </label>
      )
    },
    [visibleColumns, onColumnChange]
  )

  const handleResetClick = useCallback(() => {
    if (onResetColumnSettings) {
      onResetColumnSettings()
    }
  }, [onResetColumnSettings])

  return (
    <DropdownButton label={columnsLabel} className="columns-dropdown">
      <div className="columns-menu-header">
        <div className="columns-header-content">
          <h3 className="columns-title">Manage Columns</h3>
          {hasCustomSettings && onResetColumnSettings && (
            <button
              type="button"
              className="reset-columns-button"
              onClick={handleResetClick}
              title="Reset all column settings to defaults"
              aria-label="Reset column settings"
            >
              Reset
            </button>
          )}
        </div>
        {alwaysVisibleColumns.length > 0 && (
          <div className="always-visible-note">
            <small>
              Always visible:{" "}
              {alwaysVisibleColumns.map((col) => col.title).join(", ")}.
            </small>
          </div>
        )}
      </div>
      <div className="columns-menu-content">
        {renderToggleAllCheckbox()}
        {toggleableColumns.map(renderColumnCheckbox)}
      </div>
    </DropdownButton>
  )
}

export default memo(Columns) as typeof Columns
