import type { Column } from "@/types/table"
import { arrayMove } from "@dnd-kit/sortable"
import { useCallback, useMemo } from "react"

interface UseColumnOrderReturn<T> {
  orderedColDefs: Column<T>[]
  onColumnReorder: (activeId: string, overId: string) => void
}

interface UseColumnOrderOptions<T> {
  colDefs: Column<T>[]
  columnOrder: string[]
  setColumnOrder: (order: string[]) => void
}

export const useColumnOrder = <T>({
  colDefs,
  columnOrder,
  setColumnOrder
}: UseColumnOrderOptions<T>): UseColumnOrderReturn<T> => {
  const orderedColDefs = useMemo(() => {
    const colDefsMap = new Map(colDefs.map((col) => [col.key as string, col]))
    return columnOrder
      .map((key) => colDefsMap.get(key))
      .filter((col): col is Column<T> => col !== undefined)
  }, [colDefs, columnOrder])

  const onColumnReorder = useCallback(
    (activeId: string, overId: string) => {
      const oldIndex = columnOrder.indexOf(activeId)
      const newIndex = columnOrder.indexOf(overId)
      const newOrder = arrayMove(columnOrder, oldIndex, newIndex)
      setColumnOrder(newOrder)
    },
    [columnOrder, setColumnOrder]
  )

  return {
    orderedColDefs,
    onColumnReorder
  }
}
