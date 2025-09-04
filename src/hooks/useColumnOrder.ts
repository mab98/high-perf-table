import type { Column } from "@/types/table"
import { arrayMove } from "@dnd-kit/sortable"
import { useCallback, useMemo, useState } from "react"

interface UseColumnOrderReturn<T> {
  columnOrder: string[]
  orderedColDefs: Column<T>[]
  onColumnReorder: (activeId: string, overId: string) => void
  setColumnOrder: (order: string[]) => void
}

export const useColumnOrder = <T>(
  colDefs: Column<T>[]
): UseColumnOrderReturn<T> => {
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    colDefs.map((col) => col.key)
  )

  const orderedColDefs = useMemo(() => {
    const colDefsMap = new Map(colDefs.map((col) => [col.key, col]))
    return columnOrder
      .map((key) => colDefsMap.get(key as Extract<keyof T, string>))
      .filter((col): col is Column<T> => col !== undefined)
  }, [colDefs, columnOrder])

  const onColumnReorder = useCallback((activeId: string, overId: string) => {
    setColumnOrder((items) => {
      const oldIndex = items.indexOf(activeId)
      const newIndex = items.indexOf(overId)
      return arrayMove(items, oldIndex, newIndex)
    })
  }, [])

  return {
    columnOrder,
    orderedColDefs,
    onColumnReorder,
    setColumnOrder
  }
}
