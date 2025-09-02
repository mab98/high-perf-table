import "@/components/Table/components/TableTooltip/TableTooltip.css"
import type { Tooltip } from "@/types/table"
import { createPortal } from "react-dom"

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
