import "@/components/Table/components/TableTooltip/TableTooltip.css"
import clsx from "clsx"
import { createPortal } from "react-dom"

interface Position {
  x: number
  y: number
}

interface TableTooltipProps {
  text: string
  position: Position | null
  className?: string
}

const TableTooltip = ({ text, position, className }: TableTooltipProps) => {
  if (!text.trim() || !position) return null

  return createPortal(
    <div
      role="tooltip"
      aria-hidden={!text.trim() || !position}
      className={clsx("tooltip", className)}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      {text}
    </div>,
    document.body
  )
}

export default TableTooltip
