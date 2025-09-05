import TableCell from "@/components/Table/components/TableCell/TableCell"
import "@/components/Table/components/TableRow/TableRow.css"
import type { ColumnWidthInfo } from "@/components/Table/hooks/useColumnWidths"
import { CELL_MIN_WIDTH } from "@/constants"
import type { Column } from "@/types/table"
import type { ReactNode } from "react"
import { memo, useMemo } from "react"

interface TableRowProps<T> {
  row: T
  colDefs: Column<T>[]
  index: number // Not used here, but required by TableVirtuoso API
  columnWidths: ColumnWidthInfo[]
  onCellHover: (text: string, element: HTMLElement | null) => void
  onValidationError: (text: string, element: HTMLElement | null) => void
  // Inline editing props
  isEditing?: (rowId: string | number, columnKey: string) => boolean
  editValue?: string
  editError?: string
  onStartEdit?: (
    rowId: string | number,
    columnKey: string,
    currentValue: string
  ) => void
  onCancelEdit?: () => void
  onSaveEdit?: () => void
  onEditValueChange?: (value: string) => void
  getRowId?: () => string | number
}

const TableRow = <T,>({
  row,
  colDefs,
  index,
  columnWidths,
  onCellHover,
  onValidationError,
  // Inline editing props
  isEditing,
  editValue,
  editError,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditValueChange,
  getRowId
}: TableRowProps<T>) => {
  const rowId = getRowId
    ? getRowId()
    : ((row as Record<string, unknown>)?.id as string | number) ||
      `row-${index}`

  const cells = useMemo(() => {
    let leftPinnedOffset = 0
    let rightPinnedOffset = 0

    // Calculate offsets for right-pinned columns (in reverse order)
    const rightPinnedWidths: number[] = []
    for (let i = colDefs.length - 1; i >= 0; i--) {
      const col = colDefs[i]
      if (col.pinned === "right") {
        const widthInfo = columnWidths[i]
        const colWidth = widthInfo?.width || CELL_MIN_WIDTH
        rightPinnedWidths.unshift(rightPinnedOffset)
        rightPinnedOffset += colWidth
      }
    }

    let rightPinnedIndex = 0

    return colDefs.map((col, colIndex) => {
      const content = col.renderer ? col.renderer(row) : (row[col.key] ?? "")
      const tooltipText = col.tooltip ? String(row[col.key] || "") : ""
      const widthInfo = columnWidths[colIndex]
      const isCurrentlyEditing = isEditing?.(rowId, col.key) || false
      const currentValue =
        typeof row[col.key] === "string"
          ? (row[col.key] as string)
          : String(row[col.key] || "")

      const colWidth = widthInfo?.width || CELL_MIN_WIDTH
      const cellStyle: React.CSSProperties = {
        width: `${colWidth}px`,
        minWidth: `${widthInfo?.minWidth || CELL_MIN_WIDTH}px`
      }

      // Apply positioning for pinned columns
      if (col.pinned === "left") {
        cellStyle.left = `${leftPinnedOffset}px`
        leftPinnedOffset += colWidth
      } else if (col.pinned === "right") {
        cellStyle.right = `${rightPinnedWidths[rightPinnedIndex]}px`
        rightPinnedIndex++
      }

      return (
        <TableCell
          key={col.key}
          content={content as ReactNode}
          tooltipText={tooltipText}
          style={cellStyle}
          columnKey={col.key}
          onHover={onCellHover}
          onValidationError={onValidationError}
          isEditable={!!col.editable}
          isEditing={isCurrentlyEditing}
          editValue={
            isCurrentlyEditing && editValue !== undefined
              ? editValue
              : currentValue
          }
          editError={isCurrentlyEditing ? editError : undefined}
          onStartEdit={() => onStartEdit?.(rowId, col.key, currentValue)}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onEditValueChange={onEditValueChange}
          pinned={col.pinned || null}
        />
      )
    })
  }, [
    colDefs,
    columnWidths,
    row,
    onCellHover,
    onValidationError,
    rowId,
    isEditing,
    editValue,
    editError,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onEditValueChange
  ])

  return <div className="table-row">{cells}</div>
}

export default memo(TableRow) as typeof TableRow
