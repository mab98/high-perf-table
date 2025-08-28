import { useMemo } from "react"
import { CELL_MIN_WIDTH } from "../constants"
import type { Column } from "../types/table"

interface UseColumnWidthsParams<T> {
  colDefs: Column<T>[]
  tableWidth?: number
}

interface ColumnWidthInfo {
  width: number
  minWidth: number
}

export const useColumnWidths = <T>({
  colDefs,
  tableWidth
}: UseColumnWidthsParams<T>) => {
  return useMemo(() => {
    if (!tableWidth || tableWidth <= 0) {
      // Return original widths with fallback to min width
      return colDefs.map(
        (col): ColumnWidthInfo => ({
          width: col.width || CELL_MIN_WIDTH,
          minWidth: Math.max(col.width || CELL_MIN_WIDTH, CELL_MIN_WIDTH)
        })
      )
    }

    const fixedWidthColumns = colDefs.filter(
      (col) => col.width && col.width > 0
    )
    const flexColumns = colDefs.filter((col) => !col.width || col.width <= 0)

    const totalFixedWidth = fixedWidthColumns.reduce(
      (sum, col) => sum + (col.width || 0),
      0
    )

    const availableWidth = Math.max(0, tableWidth - totalFixedWidth)
    const flexColumnWidth =
      flexColumns.length > 0
        ? Math.max(CELL_MIN_WIDTH, availableWidth / flexColumns.length)
        : CELL_MIN_WIDTH

    return colDefs.map((col): ColumnWidthInfo => {
      if (col.width && col.width > 0) {
        return {
          width: col.width,
          minWidth: Math.max(col.width, CELL_MIN_WIDTH)
        }
      }

      return {
        width: flexColumnWidth,
        minWidth: CELL_MIN_WIDTH
      }
    })
  }, [colDefs, tableWidth])
}
