import { useState } from "react"
import "./Toast.css"

interface ToastProps {
  message: string
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <div className={`toast ${isVisible ? "toast-show" : "toast-hide"}`}>
      <div className="toast-message">
        <strong>Error:</strong> {message}
      </div>
      <button className="toast-close" onClick={handleClose} aria-label="Close">
        ✕
      </button>
    </div>
  )
}

export default Toast
