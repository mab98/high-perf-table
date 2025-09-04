import { useCallback, useState } from "react"

export interface UseToastReturn {
  isVisible: boolean
  onClose: () => void
}

export const useToast = (initialVisible: boolean = true): UseToastReturn => {
  const [isVisible, setIsVisible] = useState(initialVisible)

  const onClose = useCallback(() => {
    setIsVisible(false)
  }, [])

  return {
    isVisible,
    onClose
  }
}
