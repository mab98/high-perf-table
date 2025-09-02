import TableCell from "@/components/Table/components/TableCell/TableCell"
import "@/components/Table/components/TableRow/TableRow.css"
import { CELL_MIN_WIDTH } from "@/constants"
import type { ColumnWidthInfo } from "@/hooks/useColumnWidths"
import type { Column } from "@/types/table"
import type { ReactNode } from "react"
import { memo, useMemo } from "react"

interface TableRowProps<T> {
  row: T
  colDefs: Column<T>[]
  index: number // Not used here, but required by TableVirtuoso API
  columnWidths: ColumnWidthInfo[]
  onCellHover: (text: string, element: HTMLElement | null) => void
  // Inline editing props
  isEditing?: (rowId: string | number, columnKey: string) => boolean
  editValue?: string
  onStartEdit?: (
    rowId: string | number,
    columnKey: string,
    currentValue: string
  ) => void
  onCancelEdit?: () => void
  onSaveEdit?: () => void
  onEditValueChange?: (value: string) => void
  getRowId?: (row: T) => string | number
}

const TableRow = <T extends Record<string, unknown>>({
  row,
  colDefs,
  index,
  columnWidths,
  onCellHover,
  isEditing,
  editValue,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditValueChange,
  getRowId
}: TableRowProps<T>) => {
  const rowId = getRowId
    ? getRowId(row)
    : (row.id as string | number) || `row-${index}`

  const cells = useMemo(
    () =>
      colDefs.map((col, colIndex) => {
        const content = col.renderer ? col.renderer(row) : (row[col.key] ?? "")
        const tooltipText = typeof content === "string" ? content : ""
        const widthInfo = columnWidths[colIndex]
        const isCurrentlyEditing = isEditing?.(rowId, col.key) || false
        const currentValue =
          typeof row[col.key] === "string"
            ? (row[col.key] as string)
            : String(row[col.key] || "")

        const cellStyle = {
          width: `${widthInfo?.width || CELL_MIN_WIDTH}px`,
          minWidth: `${widthInfo?.minWidth || CELL_MIN_WIDTH}px`
        }

        return (
          <TableCell
            key={col.key}
            content={content as ReactNode}
            tooltipText={tooltipText}
            style={cellStyle}
            onHover={onCellHover}
            isEditable={col.editable}
            isEditing={isCurrentlyEditing}
            editValue={
              isCurrentlyEditing && editValue !== undefined
                ? editValue
                : currentValue
            }
            onStartEdit={() => onStartEdit?.(rowId, col.key, currentValue)}
            onCancelEdit={onCancelEdit}
            onSaveEdit={onSaveEdit}
            onEditValueChange={onEditValueChange}
          />
        )
      }),
    [
      colDefs,
      columnWidths,
      row,
      onCellHover,
      rowId,
      isEditing,
      editValue,
      onStartEdit,
      onCancelEdit,
      onSaveEdit,
      onEditValueChange
    ]
  )

  return <div className="table-row">{cells}</div>
}

export default memo(TableRow) as typeof TableRow
