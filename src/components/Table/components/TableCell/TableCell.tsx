import "@/components/Table/components/TableCell/TableCell.css"
import { useTableCellEdit } from "@/components/Table/hooks/useTableCellEdit"
import clsx from "clsx"
import React, { memo } from "react"

interface TableCellProps {
  content: React.ReactNode
  tooltipText: string
  style?: React.CSSProperties
  className?: string
  columnKey?: string
  onHover?: (text: string, element: HTMLElement | null) => void
  onValidationError?: (text: string, element: HTMLElement | null) => void
  isEditable?: boolean
  isEditing?: boolean
  editValue?: string
  editError?: string
  onStartEdit?: () => void
  onCancelEdit?: () => void
  onSaveEdit?: () => void
  onEditValueChange?: (value: string) => void
  pinned?: "left" | "right" | null
}

const TableCell: React.FC<TableCellProps> = ({
  content,
  tooltipText,
  style,
  className = "",
  columnKey,
  onHover,
  onValidationError,
  isEditable = false,
  isEditing = false,
  editValue = "",
  editError,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditValueChange,
  pinned
}) => {
  const {
    inputRef,
    localValue,
    onMouseEnter,
    onMouseLeave,
    onDoubleClick,
    onKeyDown,
    onInputChange,
    onInputBlur
  } = useTableCellEdit({
    isEditable,
    isEditing,
    editValue,
    editError,
    tooltipText,
    onHover,
    onValidationError,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onEditValueChange
  })

  return (
    <div
      className={clsx(
        "table-cell",
        className,
        isEditable && "table-cell--editable",
        isEditing && "table-cell--editing",
        pinned === "left" && "table-cell--pinned-left",
        pinned === "right" && "table-cell--pinned-right"
      )}
      style={style}
      data-cell-key={columnKey}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDoubleClick={onDoubleClick}
    >
      {isEditing ? (
        <div className="table-cell__edit-container">
          <input
            ref={inputRef}
            className={clsx(
              "table-cell__input",
              editError && "table-cell__input--error"
            )}
            value={localValue}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            onBlur={onInputBlur}
          />
        </div>
      ) : (
        <div className="cell-value">{content}</div>
      )}
    </div>
  )
}

export default memo(TableCell)
