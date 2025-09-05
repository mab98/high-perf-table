import { ClearIcon } from "@/components/Table/Icons/Icons"
import "@/components/Table/components/ClearButton/ClearButton.css"

interface ClearButtonProps {
  onClick: () => void
  disabled?: boolean
  className?: string
  ariaLabel?: string
  title?: string
}

const ClearButton = ({
  onClick,
  disabled = false,
  className = "",
  ariaLabel = "Clear",
  title = "Clear"
}: ClearButtonProps) => {
  return (
    <button
      type="button"
      className={`clear-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
    >
      <ClearIcon />
    </button>
  )
}

export default ClearButton
