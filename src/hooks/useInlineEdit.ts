import { useCallback, useState } from "react"

export interface EditState {
  rowId: string | number
  columnKey: string
  value: string
}

export interface UseInlineEditReturn {
  editState: EditState | null
  startEdit: (
    rowId: string | number,
    columnKey: string,
    currentValue: string
  ) => void
  cancelEdit: () => void
  saveEdit: () => void
  updateEditValue: (value: string) => void
  isEditing: (rowId: string | number, columnKey: string) => boolean
}

export interface UseInlineEditOptions {
  onSave?: (
    rowId: string | number,
    columnKey: string,
    value: string
  ) => Promise<void> | void
  onCancel?: () => void
  onValidate?: (columnKey: string, value: string) => string | null // Returns error message or null if valid
}

export const useInlineEdit = ({
  onSave,
  onCancel,
  onValidate
}: UseInlineEditOptions = {}): UseInlineEditReturn => {
  const [editState, setEditState] = useState<EditState | null>(null)

  const startEdit = useCallback(
    (rowId: string | number, columnKey: string, currentValue: string) => {
      setEditState({
        rowId,
        columnKey,
        value: currentValue
      })
    },
    []
  )

  const cancelEdit = useCallback(() => {
    setEditState(null)
    onCancel?.()
  }, [onCancel])

  const saveEdit = useCallback(async () => {
    console.log("saveEdit called, editState:", editState)
    if (!editState) return

    // Validate the value if validator is provided
    if (onValidate) {
      const validationError = onValidate(editState.columnKey, editState.value)
      if (validationError) {
        console.error("Validation error:", validationError)
        // Could emit an error event or show toast notification
        return
      }
    }

    try {
      console.log(
        "Calling onSave with:",
        editState.rowId,
        editState.columnKey,
        editState.value
      )
      await onSave?.(editState.rowId, editState.columnKey, editState.value)
      setEditState(null)
    } catch (error) {
      console.error("Failed to save edit:", error)
      // Keep edit state active on error so user can retry
    }
  }, [editState, onSave, onValidate])

  const updateEditValue = useCallback((value: string) => {
    setEditState((prev) => (prev ? { ...prev, value } : null))
  }, [])

  const isEditing = useCallback(
    (rowId: string | number, columnKey: string) => {
      return editState?.rowId === rowId && editState?.columnKey === columnKey
    },
    [editState]
  )

  return {
    editState,
    startEdit,
    cancelEdit,
    saveEdit,
    updateEditValue,
    isEditing
  }
}
