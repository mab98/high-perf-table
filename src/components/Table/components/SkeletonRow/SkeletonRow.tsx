import "@/components/Table/components/SkeletonRow/SkeletonRow.css"
import { CELL_MIN_WIDTH } from "@/components/Table/constants"
import type { Column } from "@/components/Table/types/table"

interface SkeletonRowProps<T> {
  colDefs: Column<T>[]
}

const SkeletonRow = <T,>({ colDefs }: SkeletonRowProps<T>) => (
  <div className="skeleton-row">
    {colDefs.map((col) => (
      <div
        key={col.key}
        className="skeleton-cell"
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
