import type { Column, ColumnVisibility } from "@/types/table"
import { useCallback, useMemo } from "react"

export interface UseColumnsReturn<T> {
  isAllVisible: boolean
  setCheckboxRef: (element: HTMLInputElement | null) => void
  onToggleAll: () => void
  onColumnChange: (key: string, visible: boolean) => void
  toggleableColumns: Column<T>[]
  alwaysVisibleColumns: Column<T>[]
  columnsLabel: string
}

export interface UseColumnsOptions<T> {
  colDefs: Column<T>[]
  visibleColumns: string[]
  onColumnVisibility: (params: ColumnVisibility) => void
}

export const useColumns = <T>({
  colDefs,
  visibleColumns,
  onColumnVisibility
}: UseColumnsOptions<T>): UseColumnsReturn<T> => {
  const toggleableColumns = useMemo(
    () => colDefs.filter((col) => !col.alwaysVisible),
    [colDefs]
  )

  const alwaysVisibleColumns = useMemo(
    () => colDefs.filter((col) => col.alwaysVisible),
    [colDefs]
  )

  const totalCount = toggleableColumns.length
  const visibleCount = useMemo(
    () =>
      toggleableColumns.filter((col) => visibleColumns.includes(col.key))
        .length,
    [toggleableColumns, visibleColumns]
  )

  const isAllVisible = visibleCount === totalCount

  const columnsLabel = useMemo(
    () => `Columns (${visibleCount}/${totalCount})`,
    [visibleCount, totalCount]
  )

  const onToggleAll = useCallback(() => {
    // When toggling all, only affect toggleable columns
    onColumnVisibility({ visible: !isAllVisible, all: true })
  }, [isAllVisible, onColumnVisibility])

  const onColumnChange = useCallback(
    (key: string, visible: boolean) => onColumnVisibility({ key, visible }),
    [onColumnVisibility]
  )

  const setCheckboxRef = useCallback(
    (input: HTMLInputElement | null) => {
      if (input) {
        const isIndeterminate = !isAllVisible && visibleCount > 0
        input.indeterminate = isIndeterminate
      }
    },
    [isAllVisible, visibleCount]
  )

  return {
    isAllVisible,
    setCheckboxRef,
    onToggleAll,
    onColumnChange,
    toggleableColumns,
    alwaysVisibleColumns,
    columnsLabel
  }
}
