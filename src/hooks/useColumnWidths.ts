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
  customWidths?: Record<string, number>
}

export const useColumnWidths = <T>({
  colDefs,
  tableWidth,
  allColDefs,
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

    // Check if all columns are visible
    const allColumnsVisible = allColDefs
      ? colDefs.length === allColDefs.length
      : true

    // If all columns are visible, use enhanced logic with space redistribution
    if (allColumnsVisible) {
      // Calculate initial widths (custom or original)
      const initialWidths = colDefs.map((col) => ({
        key: col.key,
        width: customWidths[col.key] ?? col.width ?? CELL_MIN_WIDTH,
        originalWidth: col.width ?? CELL_MIN_WIDTH,
        hasCustomWidth: customWidths[col.key] !== undefined,
        isResizable: col.resizable !== false
      }))

      // Calculate total current width
      const totalCurrentWidth = initialWidths.reduce(
        (sum, col) => sum + col.width,
        0
      )

      // If total width is less than available table width, redistribute the extra space
      if (totalCurrentWidth < tableWidth) {
        const extraSpace = tableWidth - totalCurrentWidth

        // Prioritize resizable columns for expansion
        const resizableColumns = initialWidths.filter((col) => col.isResizable)
        const columnsToExpand =
          resizableColumns.length > 0 ? resizableColumns : initialWidths

        if (columnsToExpand.length > 0) {
          // Distribute extra space proportionally based on original widths
          const totalExpandableWidth = columnsToExpand.reduce(
            (sum, col) => sum + col.originalWidth,
            0
          )

          return colDefs.map((col) => {
            const initialCol = initialWidths.find((c) => c.key === col.key)!
            const shouldExpand = columnsToExpand.some((c) => c.key === col.key)

            let width = initialCol.width
            if (shouldExpand && totalExpandableWidth > 0) {
              const proportion = initialCol.originalWidth / totalExpandableWidth
              width = initialCol.width + extraSpace * proportion
            }

            return {
              width: Math.max(width, CELL_MIN_WIDTH),
              minWidth: CELL_MIN_WIDTH
            }
          })
        }
      }

      // If total width exceeds table width, proportionally reduce resizable columns
      if (totalCurrentWidth > tableWidth) {
        const excessWidth = totalCurrentWidth - tableWidth
        const resizableColumns = initialWidths.filter(
          (col) => col.isResizable && col.width > CELL_MIN_WIDTH
        )

        if (resizableColumns.length > 0) {
          const totalResizableWidth = resizableColumns.reduce(
            (sum, col) => sum + Math.max(0, col.width - CELL_MIN_WIDTH),
            0
          )

          if (totalResizableWidth > 0) {
            return colDefs.map((col) => {
              const initialCol = initialWidths.find((c) => c.key === col.key)!
              const isResizable = resizableColumns.some(
                (c) => c.key === col.key
              )

              let width = initialCol.width
              if (isResizable) {
                const availableToReduce = Math.max(
                  0,
                  initialCol.width - CELL_MIN_WIDTH
                )
                const proportion = availableToReduce / totalResizableWidth
                const reduction = Math.min(
                  availableToReduce,
                  excessWidth * proportion
                )
                width = initialCol.width - reduction
              }

              return {
                width: Math.max(width, CELL_MIN_WIDTH),
                minWidth: CELL_MIN_WIDTH
              }
            })
          }
        }
      }

      // If total width equals or fits within table width, use current widths
      return colDefs.map((col) => {
        const initialCol = initialWidths.find((c) => c.key === col.key)!
        return {
          width: Math.max(initialCol.width, CELL_MIN_WIDTH),
          minWidth: CELL_MIN_WIDTH
        }
      })
    }

    // If some columns are hidden, distribute width evenly among visible columns
    const evenWidth = Math.max(CELL_MIN_WIDTH, tableWidth / colDefs.length)

    return colDefs.map((col) => {
      const customWidth = customWidths[col.key]
      const width = customWidth ?? evenWidth
      return {
        width,
        minWidth: CELL_MIN_WIDTH
      }
    })
  }, [colDefs, tableWidth, allColDefs, customWidths])
}
