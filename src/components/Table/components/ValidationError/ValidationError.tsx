import "@/components/Table/components/ValidationError/ValidationError.css"
import { createPortal } from "react-dom"

interface ValidationErrorProps {
  text: string
  position: { x: number; y: number }
}

const ValidationError = ({ text, position }: ValidationErrorProps) => {
  if (!text.trim() || !position) return null

  return createPortal(
    <div
      role="tooltip"
      aria-live="polite"
      className="validation-error"
      style={{ left: position.x, top: position.y }}
    >
      {text}
    </div>,
    document.body
  )
}

export default ValidationError
