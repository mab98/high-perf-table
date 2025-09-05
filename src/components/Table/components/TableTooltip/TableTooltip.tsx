import "@/components/Table/components/TableTooltip/TableTooltip.css"
import { createPortal } from "react-dom"
import type { Tooltip } from "../../types/table"

const TableTooltip = ({ text, position }: Tooltip) => {
  if (!text.trim() || !position) return null

  return createPortal(
    <div
      role="tooltip"
      aria-hidden={!text.trim() || !position}
      className={"tooltip"}
      style={{ left: position.x, top: position.y }}
    >
      {text}
    </div>,
    document.body
  )
}

export default TableTooltip
