import type { ReactNode } from "react"
import { memo } from "react"
import type { Column } from "../../../../types/table"
import TableCell from "../TableCell"
import "./TableRow.css"

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

        return (
          <TableCell
            key={col.key}
            content={cellContent as ReactNode}
            tooltipText={tooltipText}
            style={{
              width: `${widthInfo?.width || col.width}px`,
              minWidth: `${widthInfo?.minWidth || col.width}px`
            }}
          />
        )
      })}
    </div>
  )
}

export default memo(TableRow) as typeof TableRow
