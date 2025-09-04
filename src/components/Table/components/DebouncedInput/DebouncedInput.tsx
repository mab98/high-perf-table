import ClearButton from "@/components/Table/components/ClearButton/ClearButton"
import { useDebouncedInput } from "@/hooks/useDebouncedInput"
import "./DebouncedInput.css"

interface DebouncedInputProps {
  value: string
  onChange: (value: string) => void
  delay?: number
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
  type?: string
  clearButton?: boolean
  onClear?: () => void
  icon?: React.ReactNode
}

const DebouncedInput = ({
  value,
  onChange,
  delay = 500,
  placeholder,
  disabled = false,
  className = "",
  id,
  type = "text",
  clearButton = false,
  onClear,
  icon
}: DebouncedInputProps) => {
  const {
    localValue,
    onInputChange,
    onClear: handleClear
  } = useDebouncedInput({
    value,
    onChange,
    delay,
    onClear
  })

  return (
    <div className="debounced-input-wrapper">
      {icon && <div className="debounced-input-icon">{icon}</div>}
      <input
        id={id}
        type={type}
        className={`debounced-input ${className}`}
        placeholder={placeholder}
        value={localValue}
        onChange={onInputChange}
        disabled={disabled}
      />
      {clearButton && localValue && !disabled && (
        <ClearButton
          onClick={handleClear}
          className="input-clear"
          ariaLabel="Clear input"
          title="Clear input"
        />
      )}
    </div>
  )
}

export default DebouncedInput
