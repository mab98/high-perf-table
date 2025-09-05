import type { ApiData } from "@/types/api"
import { useCallback, useEffect, useState } from "react"

export interface StoredEdit {
  rowId: string | number
  columnKey: string
  updatedValue: string
  actualValue: string
}

export interface UseLocalStorageEditsReturn {
  storedEdits: Record<string, StoredEdit>
  saveEdit: (
    rowId: string | number,
    columnKey: string,
    value: string,
    actualValue: string
  ) => void
  clearEdit: (rowId: string | number, columnKey: string) => void
  clearAllEdits: () => void
  applyEditsToData: (data: ApiData[]) => ApiData[]
  getStoredEdit: (
    rowId: string | number,
    columnKey: string
  ) => StoredEdit | undefined
  hasEdits: boolean
  editCount: number
}

const STORAGE_KEY = "table-inline-edits"

// Helper function to create a unique key for each edit
const createEditKey = (rowId: string | number, columnKey: string): string => {
  return `${rowId}-${columnKey}`
}

// Helper function to load initial data from localStorage
const loadInitialEdits = (): Record<string, StoredEdit> => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return {}
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, unknown>

      // Filter out any stored edits that don't have actualValue (backward compatibility)
      const validEdits: Record<string, StoredEdit> = {}
      Object.entries(parsed).forEach(([key, edit]) => {
        if (
          edit &&
          typeof edit === "object" &&
          edit !== null &&
          "actualValue" in edit
        ) {
          validEdits[key] = edit as StoredEdit
        }
      })

      return validEdits
    }
  } catch {
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEY)
  }
  return {}
}

export const useLocalStorageEdits = (): UseLocalStorageEditsReturn => {
  const [storedEdits, setStoredEdits] =
    useState<Record<string, StoredEdit>>(loadInitialEdits)

  // Save edits to localStorage whenever storedEdits changes
  useEffect(() => {
    // Only save to localStorage in browser environment
    if (typeof window === "undefined") {
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedEdits))
    } catch (error) {
      console.error("Failed to save edits to localStorage:", error)
    }
  }, [storedEdits])

  const saveEdit = useCallback(
    (
      rowId: string | number,
      columnKey: string,
      updatedValue: string,
      actualValue: string
    ) => {
      const editKey = createEditKey(rowId, columnKey)

      // If the new value equals the original value, remove the edit
      if (updatedValue === actualValue) {
        setStoredEdits((prev) => {
          const newEdits = { ...prev }
          delete newEdits[editKey]
          return newEdits
        })
        return
      }

      const edit: StoredEdit = {
        rowId,
        columnKey,
        updatedValue,
        actualValue
      }

      setStoredEdits((prev) => {
        const newEdits = {
          ...prev,
          [editKey]: edit
        }
        return newEdits
      })
    },
    []
  )

  const clearEdit = useCallback((rowId: string | number, columnKey: string) => {
    const editKey = createEditKey(rowId, columnKey)
    setStoredEdits((prev) => {
      const newEdits = { ...prev }
      delete newEdits[editKey]
      return newEdits
    })
  }, [])

  const clearAllEdits = useCallback(() => {
    setStoredEdits({})
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const applyEditsToData = useCallback(
    (data: ApiData[]): ApiData[] => {
      if (Object.keys(storedEdits).length === 0) {
        return data
      }

      return data.map((row) => {
        // Check if this row has any stored edits
        const rowEdits = Object.values(storedEdits).filter(
          (edit) => String(edit.rowId) === String(row.id)
        )

        if (rowEdits.length === 0) {
          return row
        }

        // Apply all edits for this row
        let editedRow = { ...row }
        rowEdits.forEach((edit) => {
          // Only apply edit if the column exists in the row
          if (edit.columnKey in editedRow) {
            editedRow = {
              ...editedRow,
              [edit.columnKey]: edit.updatedValue
            }
          }
        })

        return editedRow
      })
    },
    [storedEdits]
  )

  const getStoredEdit = useCallback(
    (rowId: string | number, columnKey: string): StoredEdit | undefined => {
      const editKey = createEditKey(rowId, columnKey)
      return storedEdits[editKey]
    },
    [storedEdits]
  )

  return {
    storedEdits,
    saveEdit,
    clearEdit,
    clearAllEdits,
    applyEditsToData,
    getStoredEdit,
    hasEdits: Object.keys(storedEdits).length > 0,
    editCount: Object.keys(storedEdits).length
  }
}
