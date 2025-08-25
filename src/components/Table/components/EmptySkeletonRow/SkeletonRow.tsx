import { TABLE_CELL_MIN_WIDTH } from "../../../../constants/table"
import type { Column } from "../../../../types/table"
import "./SkeletonRow.css"

interface SkeletonRowProps<T> {
  colDefs: Column<T>[]
}

export const SkeletonRow = <T,>({ colDefs }: SkeletonRowProps<T>) => (
  <tr className="table-row">
    {colDefs.map((col) => (
      <td
        key={col.key}
        className="table-cell"
        style={{
          width: col.width ? `${col.width}px` : undefined,
          minWidth: col.width ? `${col.width}px` : `${TABLE_CELL_MIN_WIDTH}px`,
          height: "16px", // Explicit height to match normal cells
        }}
      >
        <div className="skeleton-placeholder" />
      </td>
    ))}
  </tr>
)
