import useDebounce from "@/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"

export interface UseDebouncedInputReturn {
  localValue: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
}

export interface UseDebouncedInputOptions {
  value: string
  onChange: (value: string) => void
  delay?: number
  onClear?: () => void
}

export const useDebouncedInput = ({
  value,
  onChange,
  delay = 500,
  onClear
}: UseDebouncedInputOptions): UseDebouncedInputReturn => {
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

  const onInputChange = useCallback(
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

  return {
    localValue,
    onInputChange,
    onClear: handleClear
  }
}
