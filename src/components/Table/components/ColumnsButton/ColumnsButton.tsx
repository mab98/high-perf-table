import { useState, useRef, useEffect, useCallback } from "react"
import type { Column } from "../../../../types/table"
import "./ColumnsButton.css"

interface ColumnsButtonProps<T> {
  colDefs: Column<T>[]
  visibleColumns: string[]
  onColumnVisibilityChange: (columnKey: string, visible: boolean) => void
  onToggleAllColumns: (visible: boolean) => void
}

type CheckboxState = "checked" | "unchecked" | "indeterminate"

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

const ColumnsButton = <T extends Record<string, unknown>>({
  colDefs,
  visibleColumns,
  onColumnVisibilityChange,
  onToggleAllColumns,
}: ColumnsButtonProps<T>) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const checkboxState = (): CheckboxState => {
    const visibleCount = visibleColumns.length
    const totalCount = colDefs.length

    if (visibleCount === totalCount) return "checked"
    if (visibleCount === 0) return "unchecked"
    return "indeterminate"
  }

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  // Handle click outside to close menu
  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (
        menuRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return
      }

      closeMenu()
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu()
        buttonRef.current?.focus()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isMenuOpen, closeMenu])

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleToggleAll = () => {
    const shouldShowAll = checkboxState() !== "checked"
    onToggleAllColumns(shouldShowAll)
  }

  return (
    <div className="columns-button-container">
      <button
        ref={buttonRef}
        className={`columns-button${isMenuOpen ? " active" : ""}`}
        onClick={handleToggleMenu}
        type="button"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
      >
        Columns
        <DropdownArrow isOpen={isMenuOpen} />
      </button>

      {isMenuOpen && (
        <div ref={menuRef} className="columns-menu">
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
        </div>
      )}
    </div>
  )
}

export default ColumnsButton
