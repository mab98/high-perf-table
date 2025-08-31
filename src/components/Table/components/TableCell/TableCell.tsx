import "@/components/Table/components/TableCell/TableCell.css"
import clsx from "clsx"
import React, { memo, useCallback } from "react"

interface TableCellProps {
  content: React.ReactNode
  tooltipText: string
  style?: React.CSSProperties
  className?: string
  onHover?: (text: string, element: HTMLElement | null) => void
}

import { useEffect } from "react"

const TableCell: React.FC<TableCellProps> = ({
  content,
  tooltipText,
  style,
  className = "",
  onHover
}) => {
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (tooltipText.trim()) {
        onHover?.(tooltipText, e.currentTarget)
      }
    },
    [tooltipText, onHover]
  )

  const handleMouseLeave = useCallback(() => {
    onHover?.("", null)
  }, [onHover])

  useEffect(() => {
    return () => onHover?.("", null)
  }, [onHover])

  return (
    <div
      className={clsx("table-cell", className)}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cell-value">{content}</div>
    </div>
  )
}

export default memo(TableCell)
