import type { Column } from "../../../../types/table"
import DropdownButton from "../DropdownButton"
import "./ColumnsButton.css"

interface ColumnsButtonProps<T> {
  colDefs: Column<T>[]
  visibleColumns: string[]
  onColumnVisibilityChange: (columnKey: string, visible: boolean) => void
  onToggleAllColumns: (visible: boolean) => void
}

type CheckboxState = "checked" | "unchecked" | "indeterminate"

const ColumnsButton = <T extends Record<string, unknown>>({
  colDefs,
  visibleColumns,
  onColumnVisibilityChange,
  onToggleAllColumns
}: ColumnsButtonProps<T>) => {
  const checkboxState = (): CheckboxState => {
    const visibleCount = visibleColumns.length
    const totalCount = colDefs.length

    if (visibleCount === totalCount) return "checked"
    if (visibleCount === 0) return "unchecked"
    return "indeterminate"
  }

  const handleToggleAll = () => {
    const shouldShowAll = checkboxState() !== "checked"
    onToggleAllColumns(shouldShowAll)
  }

  return (
    <DropdownButton label="Columns" className="columns-dropdown">
      <div className="columns-menu-header">
        <label className="column-checkbox-item toggle-all">
          <input
            type="checkbox"
            checked={checkboxState() === "checked"}
            ref={(input) => {
              if (input) {
                input.indeterminate = checkboxState() === "indeterminate"
              }
            }}
            onChange={handleToggleAll}
            className="column-checkbox"
          />
          <span className="column-label">Show/Hide All</span>
        </label>
      </div>

      <div className="columns-menu-content">
        {colDefs.map((col) => {
          const isVisible = visibleColumns.includes(col.key)

          return (
            <label key={col.key} className="column-checkbox-item">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) =>
                  onColumnVisibilityChange(col.key, e.target.checked)
                }
                className="column-checkbox"
              />
              <span className="column-label">{col.title}</span>
            </label>
          )
        })}
      </div>
    </DropdownButton>
  )
}

export default ColumnsButton
