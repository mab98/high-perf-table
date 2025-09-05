import { useMemo } from "react"
import { CELL_MIN_WIDTH } from "../constants"
import type { Column } from "../types/table"

export interface ColumnWidthInfo {
  width: number
  minWidth: number
}

interface UseColumnWidthsParams<T> {
  colDefs: Column<T>[]
  tableWidth: number
  customWidths?: Record<string, number>
}

export const useColumnWidths = <T>({
  colDefs,
  tableWidth,
  customWidths = {}
}: UseColumnWidthsParams<T>) => {
  return useMemo<ColumnWidthInfo[]>(() => {
    if (tableWidth <= 0 || colDefs.length === 0) {
      return colDefs.map((col) => {
        const customWidth = customWidths[col.key]
        const width = customWidth ?? col.width ?? CELL_MIN_WIDTH
        return { width, minWidth: Math.max(width, CELL_MIN_WIDTH) }
      })
    }

    // Calculate initial widths for all columns
    const initialWidths = colDefs.map((col) => {
      const customWidth = customWidths[col.key]
      const width = customWidth ?? col.width ?? CELL_MIN_WIDTH
      return Math.max(width, CELL_MIN_WIDTH)
    })

    // Calculate total width used by all columns
    const totalUsedWidth = initialWidths.reduce((sum, width) => sum + width, 0)

    // If there's remaining space and we have columns, distribute it equally among all columns
    if (totalUsedWidth < tableWidth && initialWidths.length > 0) {
      const remainingSpace = tableWidth - totalUsedWidth
      const extraWidthPerColumn = remainingSpace / initialWidths.length

      // Distribute the remaining space equally among all columns
      for (let i = 0; i < initialWidths.length; i++) {
        initialWidths[i] += extraWidthPerColumn
      }
    }

    // Return the column width info with the adjusted widths
    return initialWidths.map((width) => ({
      width,
      minWidth: CELL_MIN_WIDTH
    }))
  }, [colDefs, tableWidth, customWidths])
}
