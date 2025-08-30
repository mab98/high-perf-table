import TableCell from "@/components/Table/components/TableCell"
import "@/components/Table/components/TableRow/TableRow.css"
import { CELL_MIN_WIDTH } from "@/constants"
import type { Column } from "@/types/table"
import type { ReactNode } from "react"
import { memo } from "react"

interface ColumnWidthInfo {
  width: number
  minWidth: number
}

interface TableRowProps<T> {
  row: T
  colDefs: Column<T>[]
  index: number
  columnWidths: ColumnWidthInfo[]
}

const TableRow = <
  T extends Record<string, unknown> & { id?: string | number }
>({
  row,
  colDefs,
  index,
  columnWidths
}: TableRowProps<T>) => {
  return (
    <div className="table-row" data-row-id={row.id || index}>
      {colDefs.map((col, colIndex) => {
        const cellContent = col.renderer
          ? col.renderer(row)
          : (row[col.key] ?? "")
        const tooltipText = typeof cellContent === "string" ? cellContent : ""
        const widthInfo = columnWidths[colIndex]

        const cellStyle = {
          width: `${widthInfo?.width || CELL_MIN_WIDTH}px`,
          minWidth: `${widthInfo?.minWidth || CELL_MIN_WIDTH}px`
        }

        return (
          <TableCell
            key={col.key}
            content={cellContent as ReactNode}
            tooltipText={tooltipText}
            style={cellStyle}
          />
        )
      })}
    </div>
  )
}

export default memo(TableRow) as typeof TableRow
