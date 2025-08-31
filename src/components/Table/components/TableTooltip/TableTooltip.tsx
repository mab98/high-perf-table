import "@/components/Table/components/TableTooltip/TableTooltip.css"
import React from "react"
import { createPortal } from "react-dom"

interface Position {
  x: number
  y: number
}

interface TableTooltipProps {
  show: boolean
  text: string
  position: Position
  className?: string
}

const TableTooltip: React.FC<TableTooltipProps> = ({
  show,
  text,
  position,
  className
}) => {
  if (!show || !text.trim()) return null

  const tooltipStyle: React.CSSProperties = {
    left: position.x,
    top: position.y,
    transform: "translate(-50%, -100%)"
  }

  return createPortal(
    <div
      role="tooltip"
      aria-hidden={!show}
      className={`tooltip ${className || ""}`}
      style={tooltipStyle}
    >
      {text}
    </div>,
    document.body
  )
}

export default TableTooltip
