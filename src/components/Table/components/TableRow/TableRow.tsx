import type { ReactNode } from "react"
import type { Column } from "../../../../types/table"
import TableCell from "../TableCell"
import { TABLE_CELL_MIN_WIDTH } from "../../../../constants/table"

interface TableRowProps<T> {
  row: T
  colDefs: Column<T>[]
  index: number
}

const TableRow = <
  T extends Record<string, unknown> & { id?: string | number }
>({
  row,
  colDefs,
  index,
}: TableRowProps<T>) => {
  return (
    <td key={row.id ?? index} className="table-row">
      {colDefs.map((col) => {
        const cellContent = col.renderer
          ? col.renderer(row)
          : row[col.key] ?? ""

        const tooltipText = typeof cellContent === "string" ? cellContent : ""

        return (
          <TableCell
            key={col.key}
            content={cellContent as ReactNode}
            tooltipText={tooltipText}
            style={{
              width: col.width ? `${col.width}px` : undefined,
              maxWidth: col.width ? `${col.width}px` : undefined,
              minWidth: col.width
                ? `${col.width}px`
                : `${TABLE_CELL_MIN_WIDTH}px`,
            }}
          />
        )
      })}
    </td>
  )
}

export default TableRow
