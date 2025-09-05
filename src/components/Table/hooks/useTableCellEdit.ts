import { useCallback, useEffect, useRef, useState } from "react"

export interface UseTableCellEditReturn {
  isEditing: boolean
  localValue: string
  inputRef: React.RefObject<HTMLInputElement | null>
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: () => void
  onDoubleClick: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onInputBlur: () => void
}

export interface UseTableCellEditOptions {
  isEditable?: boolean
  isEditing?: boolean
  editValue?: string
  editError?: string
  tooltipText: string
  onHover?: (text: string, element: HTMLElement | null) => void
  onValidationError?: (text: string, element: HTMLElement | null) => void
  onStartEdit?: () => void
  onCancelEdit?: () => void
  onSaveEdit?: () => void
  onEditValueChange?: (value: string) => void
}

export const useTableCellEdit = ({
  isEditable = false,
  isEditing = false,
  editValue = "",
  editError,
  tooltipText,
  onHover,
  onValidationError,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditValueChange
}: UseTableCellEditOptions): UseTableCellEditReturn => {
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
  }, [isEditing, editValue, onHover])

  // Handle validation error tooltip
  useEffect(() => {
    if (isEditing && editError && inputRef.current && onValidationError) {
      // Show validation error tooltip positioned relative to the input
      onValidationError(editError, inputRef.current)
    } else if (onValidationError) {
      // Hide validation error tooltip
      onValidationError("", null)
    }
  }, [isEditing, editError, onValidationError])

  const onMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Don't show tooltip during edit mode
      if (!isEditing && tooltipText.trim()) {
        onHover?.(tooltipText, e.currentTarget)
      }
    },
    [tooltipText, onHover, isEditing]
  )

  const onMouseLeave = useCallback(() => {
    onHover?.("", null)
  }, [onHover])

  const onDoubleClick = useCallback(() => {
    if (isEditable && !isEditing) {
      onStartEdit?.()
    }
  }, [isEditable, isEditing, onStartEdit])

  const onKeyDown = useCallback(
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

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setLocalValue(newValue)
      // Update the edit state in real-time but with local state for stability
      onEditValueChange?.(newValue)
    },
    [onEditValueChange]
  )

  const onInputBlur = useCallback(() => {
    // Ensure the latest value is saved
    onEditValueChange?.(localValue)

    // If there's a validation error, cancel the edit (same as Escape)
    if (editError) {
      onCancelEdit?.()
    } else {
      // If no validation error, save the edit (same as Enter)
      onSaveEdit?.()
    }
  }, [localValue, onEditValueChange, onSaveEdit, onCancelEdit, editError])

  // Cleanup tooltip on unmount
  useEffect(() => {
    return () => onHover?.("", null)
  }, [onHover])

  return {
    isEditing,
    localValue,
    inputRef,
    onMouseEnter,
    onMouseLeave,
    onDoubleClick,
    onKeyDown,
    onInputChange,
    onInputBlur
  }
}
