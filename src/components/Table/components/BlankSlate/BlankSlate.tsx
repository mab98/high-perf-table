import "@/components/Table/components/BlankSlate/BlankSlate.css"
import type { ReactNode } from "react"

interface BlankSlateProps {
  title: string
  icon: ReactNode
  subtitle?: string
  actionButton?: {
    text: string
    onClick: () => void
  }
}

const BlankSlate = ({
  title,
  icon,
  subtitle,
  actionButton
}: BlankSlateProps) => (
  <div className="blank-slate">
    <div className="blank-slate-icon">{icon}</div>
    <div className="blank-slate-content">
      <h3 className="blank-slate-title">{title}</h3>
      {subtitle && <p className="blank-slate-subtitle">{subtitle}</p>}
      {actionButton && (
        <button
          type="button"
          className="blank-slate-action-button"
          onClick={actionButton.onClick}
        >
          {actionButton.text}
        </button>
      )}
    </div>
  </div>
)

export default BlankSlate
