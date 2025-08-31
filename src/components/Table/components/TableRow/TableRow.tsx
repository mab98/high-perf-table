import TableCell from "@/components/Table/components/TableCell/TableCell"
import "@/components/Table/components/TableRow/TableRow.css"
import { CELL_MIN_WIDTH } from "@/constants"
import type { ColumnWidthInfo } from "@/hooks/useColumnWidths"
import type { Column } from "@/types/table"
import type { ReactNode } from "react"
import { memo, useMemo } from "react"

interface TableRowProps<T> {
  row: T
  colDefs: Column<T>[]
  index: number // Not used here, but required by TableVirtuoso API
  columnWidths: ColumnWidthInfo[]
  onCellHover: (text: string, element: HTMLElement | null) => void
}

const TableRow = <T extends Record<string, unknown>>({
  row,
  colDefs,
  columnWidths,
  onCellHover
}: TableRowProps<T>) => {
  const cells = useMemo(
    () =>
      colDefs.map((col, colIndex) => {
        const content = col.renderer ? col.renderer(row) : (row[col.key] ?? "")
        const tooltipText = typeof content === "string" ? content : ""
        const widthInfo = columnWidths[colIndex]

        const cellStyle = {
          width: `${widthInfo?.width || CELL_MIN_WIDTH}px`,
          minWidth: `${widthInfo?.minWidth || CELL_MIN_WIDTH}px`
        }

        return (
          <TableCell
            key={col.key}
            content={content as ReactNode}
            tooltipText={tooltipText}
            style={cellStyle}
            onHover={onCellHover}
          />
        )
      }),
    [colDefs, columnWidths, row, onCellHover]
  )

  return <div className="table-row">{cells}</div>
}

export default memo(TableRow) as typeof TableRow
