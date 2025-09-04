import type { Column } from "@/types/table"
import { useCallback, useEffect, useState } from "react"

export interface ColumnConfig {
  key: string
  width?: number
}

export interface ColumnSettings {
  columns: ColumnConfig[]
}

export interface UseColumnSettingsReturn {
  visibleColumns: string[]
  columnOrder: string[]
  columnWidths: Record<string, number>
  setVisibleColumns: (columns: string[]) => void
  setColumnOrder: (order: string[]) => void
  setColumnWidth: (columnKey: string, width: number) => void
  resetColumnWidth: (columnKey: string) => void
  resetAllColumnWidths: () => void
  resetAllSettings: () => void
  hasCustomSettings: boolean
}

const STORAGE_KEY = "table-column-settings"

// Helper function to load initial settings from localStorage
const loadInitialSettings = <T>(colDefs: Column<T>[]): ColumnSettings => {
  // Default settings - all columns visible in their original order
  const defaultSettings: ColumnSettings = {
    columns: colDefs.map((col) => ({ key: col.key as string }))
  }

  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return defaultSettings
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, unknown>

      // Check if this is old format and migrate
      if (parsed.visibleColumns && parsed.columnOrder && parsed.columnWidths) {
        console.log("🔄 Migrating column settings to new format...")

        // Convert old format to new format
        const visibleColumns = parsed.visibleColumns as string[]
        const columnWidths = parsed.columnWidths as Record<string, number>

        const newSettings: ColumnSettings = {
          columns: visibleColumns.map((key: string) => ({
            key,
            ...(columnWidths[key] && { width: columnWidths[key] })
          }))
        }

        // Save migrated settings
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
        console.log("✅ Migration completed successfully")

        return newSettings
      }

      // Handle new format
      if (parsed.columns && Array.isArray(parsed.columns)) {
        // Validate stored columns against current colDefs
        const validColumns = (parsed.columns as ColumnConfig[]).filter((col) =>
          colDefs.some((colDef) => colDef.key === col.key)
        )

        // Add any new columns that aren't in the stored settings
        const storedKeys = validColumns.map((col) => col.key)
        const newColumns = colDefs
          .filter((colDef) => !storedKeys.includes(colDef.key as string))
          .map((colDef) => ({ key: colDef.key as string }))

        return {
          columns: [...validColumns, ...newColumns]
        }
      }
    }
  } catch (error) {
    console.error("Failed to load column settings from localStorage:", error)
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEY)
  }

  return defaultSettings
}

export const useColumnSettings = <T>(
  colDefs: Column<T>[]
): UseColumnSettingsReturn => {
  const [settings, setSettings] = useState<ColumnSettings>(() =>
    loadInitialSettings(colDefs)
  )

  // Update settings when colDefs change (e.g., new columns added)
  useEffect(() => {
    const currentColumnKeys = colDefs.map((col) => col.key as string)

    setSettings((prev) => {
      // Filter out columns that no longer exist
      const validColumns = prev.columns.filter((col) =>
        currentColumnKeys.includes(col.key)
      )

      // Add any new columns
      const existingKeys = validColumns.map((col) => col.key)
      const newColumns = currentColumnKeys
        .filter((key) => !existingKeys.includes(key))
        .map((key) => ({ key }))

      return {
        columns: [...validColumns, ...newColumns]
      }
    })
  }, [colDefs])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    // Only save to localStorage in browser environment
    if (typeof window === "undefined") {
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error("Failed to save column settings to localStorage:", error)
    }
  }, [settings])

  // Derived values for backward compatibility
  const visibleColumns = settings.columns.map((col) => col.key)
  const columnOrder = settings.columns.map((col) => col.key)
  const columnWidths = Object.fromEntries(
    settings.columns
      .filter((col) => col.width !== undefined)
      .map((col) => [col.key, col.width!])
  )

  const setVisibleColumns = useCallback((columns: string[]) => {
    setSettings((prev) => ({
      columns: columns.map((key) => {
        // Preserve existing width if column had one
        const existingCol = prev.columns.find((col) => col.key === key)
        return existingCol || { key }
      })
    }))
  }, [])

  const setColumnOrder = useCallback((order: string[]) => {
    setSettings((prev) => {
      const colMap = new Map(prev.columns.map((col) => [col.key, col]))
      return {
        columns: order.map((key) => colMap.get(key) || { key })
      }
    })
  }, [])

  const setColumnWidth = useCallback((columnKey: string, width: number) => {
    setSettings((prev) => ({
      columns: prev.columns.map((col) =>
        col.key === columnKey ? { ...col, width } : col
      )
    }))
  }, [])

  const resetColumnWidth = useCallback((columnKey: string) => {
    setSettings((prev) => ({
      columns: prev.columns.map((col) =>
        col.key === columnKey ? { key: col.key } : col
      )
    }))
  }, [])

  const resetAllColumnWidths = useCallback(() => {
    setSettings((prev) => ({
      columns: prev.columns.map((col) => ({ key: col.key }))
    }))
  }, [])

  const resetAllSettings = useCallback(() => {
    const defaultSettings: ColumnSettings = {
      columns: colDefs.map((col) => ({ key: col.key as string }))
    }

    setSettings(defaultSettings)

    // Also clear from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [colDefs])

  const hasCustomSettings =
    settings.columns.some((col) => col.width !== undefined) ||
    settings.columns.length !== colDefs.length ||
    !settings.columns.every(
      (col, index) => col.key === (colDefs[index]?.key as string)
    )

  return {
    visibleColumns,
    columnOrder,
    columnWidths,
    setVisibleColumns,
    setColumnOrder,
    setColumnWidth,
    resetColumnWidth,
    resetAllColumnWidths,
    resetAllSettings,
    hasCustomSettings
  }
}
