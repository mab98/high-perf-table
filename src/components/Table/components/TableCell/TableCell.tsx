import "@/components/Table/components/TableCell/TableCell.css"
import clsx from "clsx"
import React, { memo, useCallback, useEffect, useRef, useState } from "react"

interface TableCellProps {
  content: React.ReactNode
  tooltipText: string
  style?: React.CSSProperties
  className?: string
  onHover?: (text: string, element: HTMLElement | null) => void
  isEditable?: boolean
  isEditing?: boolean
  editValue?: string
  onStartEdit?: () => void
  onCancelEdit?: () => void
  onSaveEdit?: () => void
  onEditValueChange?: (value: string) => void
}

const TableCell: React.FC<TableCellProps> = ({
  content,
  tooltipText,
  style,
  className = "",
  onHover,
  isEditable = false,
  isEditing = false,
  editValue = "",
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditValueChange
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [localValue, setLocalValue] = useState("")

  // Initialize local value when editing starts (only run when isEditing changes)
  useEffect(() => {
    if (isEditing) {
      // Clear any existing tooltip when entering edit mode
      onHover?.("", null)

      // Get the current editValue at the time editing starts
      const currentEditValue = editValue
      setLocalValue(currentEditValue)
      // Use setTimeout to ensure the input is rendered before focusing
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          // Position cursor at the end instead of selecting all text
          const length = inputRef.current.value.length
          inputRef.current.setSelectionRange(length, length)
        }
      }, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]) // Only depend on isEditing to avoid re-selecting text

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Don't show tooltip during edit mode
      if (!isEditing && tooltipText.trim()) {
        onHover?.(tooltipText, e.currentTarget)
      }
    },
    [tooltipText, onHover, isEditing]
  )

  const handleMouseLeave = useCallback(() => {
    onHover?.("", null)
  }, [onHover])

  const handleDoubleClick = useCallback(() => {
    if (isEditable && !isEditing) {
      onStartEdit?.()
    }
  }, [isEditable, isEditing, onStartEdit])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        // Ensure the latest value is saved
        onEditValueChange?.(localValue)
        onSaveEdit?.()
      } else if (e.key === "Escape") {
        e.preventDefault()
        onCancelEdit?.()
      }
    },
    [localValue, onEditValueChange, onSaveEdit, onCancelEdit]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setLocalValue(newValue)
      // Update the edit state in real-time but with local state for stability
      onEditValueChange?.(newValue)
    },
    [onEditValueChange]
  )

  const handleInputBlur = useCallback(() => {
    // Ensure the latest value is saved
    onEditValueChange?.(localValue)
    onSaveEdit?.()
  }, [localValue, onEditValueChange, onSaveEdit])

  useEffect(() => {
    return () => onHover?.("", null)
  }, [onHover])

  return (
    <div
      className={clsx(
        "table-cell",
        className,
        isEditable && "table-cell--editable",
        isEditing && "table-cell--editing"
      )}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="table-cell__input"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
        />
      ) : (
        <div className="cell-value">{content}</div>
      )}
    </div>
  )
}

export default memo(TableCell)
