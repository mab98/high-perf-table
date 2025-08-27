import type { Column } from "../../../../types/table"
import "./SkeletonRow.css"

interface SkeletonRowProps<T> {
  colDefs: Column<T>[]
}

const SkeletonRow = <T,>({ colDefs }: SkeletonRowProps<T>) => (
  <div className="table-row">
    {colDefs.map((col) => (
      <div
        key={col.key}
        className="table-cell"
        style={{
          width: col.width ? `${col.width}px` : undefined,
          minWidth: col.width ? `${col.width}px` : undefined,
          maxWidth: col.width ? `${col.width}px` : undefined,
        }}
      >
        <div className="skeleton" />
      </div>
    ))}
  </div>
)

export default SkeletonRow
