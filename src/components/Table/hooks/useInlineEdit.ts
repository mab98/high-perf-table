import { useCallback, useState } from "react"

export interface EditState {
  rowId: string | number
  columnKey: string
  value: string
  error?: string // Add error field
}

export interface UseInlineEditReturn {
  editState: EditState | null
  onStartEdit: (
    rowId: string | number,
    columnKey: string,
    currentValue: string
  ) => void
  onCancelEdit: () => void
  onSaveEdit: () => void
  onEditValueChange: (value: string) => void
  isEditing: (rowId: string | number, columnKey: string) => boolean
}

export interface UseInlineEditOptions {
  onSave?: (
    rowId: string | number,
    columnKey: string,
    value: string
  ) => Promise<void> | void
  onValidate?: (columnKey: string, value: string) => string | null // Returns error message or null if valid
}

export const useInlineEdit = ({
  onSave,
  onValidate
}: UseInlineEditOptions = {}): UseInlineEditReturn => {
  const [editState, setEditState] = useState<EditState | null>(null)

  const onStartEdit = useCallback(
    (rowId: string | number, columnKey: string, currentValue: string) => {
      setEditState({
        rowId,
        columnKey,
        value: currentValue
      })
    },
    []
  )

  const onCancelEdit = useCallback(() => {
    setEditState(null)
  }, [])

  const onSaveEdit = useCallback(async () => {
    if (!editState) return

    // Validate the value if validator is provided
    if (onValidate) {
      const validationError = onValidate(editState.columnKey, editState.value)
      if (validationError) {
        // Update edit state with error to show in UI
        setEditState((prev) =>
          prev ? { ...prev, error: validationError } : null
        )
        return
      }
    }

    try {
      await onSave?.(editState.rowId, editState.columnKey, editState.value)
      setEditState(null)
    } catch (error) {
      console.error("Failed to save edit:", error)
      // Keep edit state active on error so user can retry
    }
  }, [editState, onSave, onValidate])

  const onEditValueChange = useCallback((value: string) => {
    setEditState((prev) => (prev ? { ...prev, value, error: undefined } : null))
  }, [])

  const isEditing = useCallback(
    (rowId: string | number, columnKey: string) => {
      return editState?.rowId === rowId && editState?.columnKey === columnKey
    },
    [editState]
  )

  return {
    editState,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onEditValueChange,
    isEditing
  }
}
