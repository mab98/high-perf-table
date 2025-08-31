import "@/components/ErrorToast/ErrorToast.css"
import { ClearIcon } from "@/components/Table/Icons/Icons"
import { useState } from "react"

interface ErrorToastProps {
  message: string
}

const ErrorToast: React.FC<ErrorToastProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="error-toast" role="alert" aria-live="polite">
      <div className="error-toast-icon">⚠️</div>
      <div className="error-toast-content">
        <div className="error-toast-title">Error</div>
        <div className="error-toast-message">{message}</div>
      </div>
      <button
        className="error-toast-close"
        onClick={handleClose}
        aria-label="Close error notification"
        type="button"
      >
        <ClearIcon />
      </button>
    </div>
  )
}

export default ErrorToast
