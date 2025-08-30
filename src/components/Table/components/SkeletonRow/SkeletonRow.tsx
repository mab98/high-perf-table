import "@/components/Table/components/SkeletonRow/SkeletonRow.css"
import { CELL_MIN_WIDTH } from "@/constants"
import type { Column } from "@/types/table"

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
          width: `${col.width || CELL_MIN_WIDTH}px`,
          minWidth: `${col.width || CELL_MIN_WIDTH}px`,
          maxWidth: `${col.width || CELL_MIN_WIDTH}px`
        }}
      >
        <div className="skeleton" />
      </div>
    ))}
  </div>
)

export default SkeletonRow
