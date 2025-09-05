import { useCallback } from "react"

export interface UseTableSaveLogicProps<T> {
  getStoredEdit: (
    rowId: string | number,
    columnKey: string
  ) => { actualValue: string } | undefined
  saveEdit: (
    rowId: string | number,
    columnKey: string,
    value: string,
    actualValue: string
  ) => void
  fetchedRows: T[]
  originalOnSave: (
    rowId: string | number,
    columnKey: string,
    value: string
  ) => Promise<void>
}

export interface UseTableSaveLogicReturn {
  onSave: (
    rowId: string | number,
    columnKey: string,
    value: string
  ) => Promise<void>
}

export const useTableSaveLogic = <
  T extends Record<string, unknown> & { id: string | number }
>({
  getStoredEdit,
  saveEdit,
  fetchedRows,
  originalOnSave
}: UseTableSaveLogicProps<T>): UseTableSaveLogicReturn => {
  const onSave = useCallback(
    async (rowId: string | number, columnKey: string, value: string) => {
      // Get the actual original value from stored edits if it exists, otherwise from current data
      const existingEdit = getStoredEdit(rowId, columnKey)

      let actualValue: string
      if (existingEdit) {
        // Use the original value from the existing edit
        actualValue = existingEdit.actualValue
      } else {
        // Find the original value from the current data
        const row = fetchedRows.find((r) => r.id === rowId)
        actualValue = row
          ? String(row[columnKey as keyof typeof row] || "")
          : ""
      }

      // Save the edit locally first
      saveEdit(rowId, columnKey, value, actualValue)

      // Then call the original save function to update the table data
      await originalOnSave(rowId, columnKey, value)
    },
    [saveEdit, originalOnSave, fetchedRows, getStoredEdit]
  )

  return { onSave }
}
