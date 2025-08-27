import React, { useState } from "react"
import TableTooltip from "../TableTooltip"
import "./TableCell.css"

interface Position {
  x: number
  y: number
}

interface TooltipState {
  show: boolean
  text: string
  position: Position
}

interface TableCellProps {
  content: React.ReactNode
  tooltipText: string
  style?: React.CSSProperties
  className?: string
}

const INITIAL_TOOLTIP_STATE: TooltipState = {
  show: false,
  text: "",
  position: { x: 0, y: 0 },
}

const TOOLTIP_OFFSET = 5

const TableCell: React.FC<TableCellProps> = ({
  content,
  tooltipText,
  style,
  className = "",
}) => {
  const [tooltip, setTooltip] = useState<TooltipState>(INITIAL_TOOLTIP_STATE)

  const calculateTooltipPosition = (element: HTMLElement): Position => {
    const rect = element.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top - TOOLTIP_OFFSET,
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tooltipText.trim()) return

    const position = calculateTooltipPosition(e.currentTarget)
    setTooltip({
      show: true,
      text: tooltipText,
      position,
    })
  }

  const handleMouseLeave = () => {
    setTooltip(INITIAL_TOOLTIP_STATE)
  }

  return (
    <>
      <td
        className={`table-cell ${className}`}
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="cell-value">{content}</div>
      </td>

      <TableTooltip {...tooltip} />
    </>
  )
}

export default TableCell
