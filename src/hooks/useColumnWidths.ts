import { CELL_MIN_WIDTH } from "@/constants"
import type { Column } from "@/types/table"
import { useMemo } from "react"

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
    if (tableWidth <= 0) {
      return colDefs.map((col) => {
        const customWidth = customWidths[col.key]
        const width = customWidth ?? col.width ?? CELL_MIN_WIDTH
        return { width, minWidth: Math.max(width, CELL_MIN_WIDTH) }
      })
    }

    // Simple approach: respect custom widths and original widths without redistribution
    // This ensures resizing one column doesn't affect others
    return colDefs.map((col) => {
      const customWidth = customWidths[col.key]
      const width = customWidth ?? col.width ?? CELL_MIN_WIDTH
      const constrainedWidth = Math.max(width, CELL_MIN_WIDTH)

      return {
        width: constrainedWidth,
        minWidth: CELL_MIN_WIDTH
      }
    })
  }, [colDefs, tableWidth, customWidths])
}
