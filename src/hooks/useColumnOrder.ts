import type { Column } from "@/types/table"
import { arrayMove } from "@dnd-kit/sortable"
import { useCallback, useMemo } from "react"

interface UseColumnOrderReturn<T> {
  orderedColDefs: Column<T>[]
  onColumnReorder: (activeId: string, overId: string) => void
  canReorder: (activeId: string, overId: string) => boolean
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
  const colDefsMap = useMemo(
    () => new Map(colDefs.map((col) => [col.key as string, col])),
    [colDefs]
  )

  const orderedColDefs = useMemo(() => {
    return columnOrder
      .map((key) => colDefsMap.get(key))
      .filter((col): col is Column<T> => col !== undefined)
  }, [columnOrder, colDefsMap])

  // Check if two columns can be reordered (must be in same pinning group)
  const canReorder = useCallback(
    (activeId: string, overId: string) => {
      const activeCol = colDefsMap.get(activeId)
      const overCol = colDefsMap.get(overId)

      if (!activeCol || !overCol) return false

      // Get pinning status (undefined means not pinned)
      const activePinned = activeCol.pinned
      const overPinned = overCol.pinned

      // Both must be in the same pinning group
      return activePinned === overPinned
    },
    [colDefsMap]
  )

  const onColumnReorder = useCallback(
    (activeId: string, overId: string) => {
      // Check if reordering is allowed
      if (!canReorder(activeId, overId)) {
        return
      }

      const oldIndex = columnOrder.indexOf(activeId)
      const newIndex = columnOrder.indexOf(overId)
      const newOrder = arrayMove(columnOrder, oldIndex, newIndex)
      setColumnOrder(newOrder)
    },
    [columnOrder, setColumnOrder, canReorder]
  )

  return {
    orderedColDefs,
    onColumnReorder,
    canReorder
  }
}
