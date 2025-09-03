import ClearButton from "@/components/Table/components/ClearButton/ClearButton"
import useDebounce from "@/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"
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
  const [localValue, setLocalValue] = useState(value)

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const debouncedValue = useDebounce(localValue, delay)

  // Call onChange when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange, value])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value)
    },
    []
  )

  const handleClear = useCallback(() => {
    setLocalValue("")
    if (onClear) {
      onClear()
    } else {
      onChange("")
    }
  }, [onChange, onClear])

  return (
    <div className="debounced-input-wrapper">
      {icon && <div className="debounced-input-icon">{icon}</div>}
      <input
        id={id}
        type={type}
        className={`debounced-input ${className}`}
        placeholder={placeholder}
        value={localValue}
        onChange={handleInputChange}
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
