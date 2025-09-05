import { useMemo } from "react"
import type { Column } from "../types/table"

interface UsePinnedColumnsReturn<T> {
  leftPinnedColumns: Column<T>[]
  rightPinnedColumns: Column<T>[]
  centerColumns: Column<T>[]
  allColumnGroups: {
    left: Column<T>[]
    center: Column<T>[]
    right: Column<T>[]
  }
}

interface UsePinnedColumnsOptions<T> {
  columns: Column<T>[]
}

export const usePinnedColumns = <T>({
  columns
}: UsePinnedColumnsOptions<T>): UsePinnedColumnsReturn<T> => {
  const columnGroups = useMemo(() => {
    const left: Column<T>[] = []
    const center: Column<T>[] = []
    const right: Column<T>[] = []

    columns.forEach((column) => {
      if (column.pinned === "left") {
        left.push(column)
      } else if (column.pinned === "right") {
        right.push(column)
      } else {
        center.push(column)
      }
    })

    return { left, center, right }
  }, [columns])

  return {
    leftPinnedColumns: columnGroups.left,
    rightPinnedColumns: columnGroups.right,
    centerColumns: columnGroups.center,
    allColumnGroups: columnGroups
  }
}
