import { TABLE_CELL_MIN_WIDTH } from "../../../../constants/table"
import type { Column } from "../../../../types/table"

interface EmptyRowProps<T> {
  colDefs: Column<T>[]
}

export const EmptyRow = <T,>({ colDefs }: EmptyRowProps<T>) => (
  <tr className="table-row">
    {colDefs.map((col) => (
      <td
        key={col.key}
        className="table-cell"
        style={{
          width: col.width ? `${col.width}px` : undefined,
          maxWidth: col.width ? `${col.width}px` : undefined,
          minWidth: col.width ? `${col.width}px` : `${TABLE_CELL_MIN_WIDTH}px`,
          borderBottom: "none",
        }}
      >
        &nbsp;
      </td>
    ))}
  </tr>
)
