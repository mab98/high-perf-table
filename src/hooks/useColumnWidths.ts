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
}

export const useColumnWidths = <T>({
  colDefs,
  tableWidth
}: UseColumnWidthsParams<T>) => {
  return useMemo<ColumnWidthInfo[]>(() => {
    if (tableWidth <= 0) {
      return colDefs.map((col) => {
        const width = col.width ?? CELL_MIN_WIDTH
        return { width, minWidth: Math.max(width, CELL_MIN_WIDTH) }
      })
    }

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
  }, [colDefs, tableWidth])
}
