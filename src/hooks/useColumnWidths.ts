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
  allColDefs?: Column<T>[]
}

export const useColumnWidths = <T>({
  colDefs,
  tableWidth,
  allColDefs
}: UseColumnWidthsParams<T>) => {
  return useMemo<ColumnWidthInfo[]>(() => {
    if (tableWidth <= 0) {
      return colDefs.map((col) => {
        const width = col.width ?? CELL_MIN_WIDTH
        return { width, minWidth: Math.max(width, CELL_MIN_WIDTH) }
      })
    }

    // Check if all columns are visible
    const allColumnsVisible = allColDefs
      ? colDefs.length === allColDefs.length
      : true

    // If all columns are visible, use the original logic with colDef widths
    if (allColumnsVisible) {
      const fixedWidthColumns = colDefs.filter(
        (col) => col.width && col.width > 0
      )
      const flexColumns = colDefs.filter((col) => !col.width || col.width <= 0)

      const totalFixedWidth = fixedWidthColumns.reduce(
        (sum, col) => sum + (col.width ?? 0),
        0
      )

      const availableWidth = Math.max(0, tableWidth - totalFixedWidth)
      const flexColumnWidth = flexColumns.length
        ? Math.max(CELL_MIN_WIDTH, availableWidth / flexColumns.length)
        : CELL_MIN_WIDTH

      return colDefs.map((col) => {
        const width = col.width && col.width > 0 ? col.width : flexColumnWidth
        return { width, minWidth: Math.max(width, CELL_MIN_WIDTH) }
      })
    }

    // If some columns are hidden, distribute width evenly among visible columns
    const evenWidth = Math.max(CELL_MIN_WIDTH, tableWidth / colDefs.length)

    return colDefs.map(() => ({
      width: evenWidth,
      minWidth: CELL_MIN_WIDTH
    }))
  }, [colDefs, tableWidth, allColDefs])
}
