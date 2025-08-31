import type { Column } from "@/types/table"
import clsx from "clsx"

export const renderSortIcon = <T,>(
  col: Column<T>,
  sortDirection: string | null
) => {
  if (!col.sortable) return null

  const getSortIcon = (direction: string | null): string => {
    if (direction === "asc") return "▲"
    if (direction === "desc") return "▼"
    return "⇅"
  }

  return (
    <span className={clsx("sort-icon", sortDirection)}>
      {getSortIcon(sortDirection)}
    </span>
  )
}
