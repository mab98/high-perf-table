import { useEffect, useRef, useState } from "react"

export interface UseDropdownReturn {
  isMenuOpen: boolean
  buttonRef: React.RefObject<HTMLButtonElement | null>
  menuRef: React.RefObject<HTMLDivElement | null>
  toggleMenu: () => void
}

export const useDropdown = (): UseDropdownReturn => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node
    if (
      menuRef.current?.contains(target) ||
      buttonRef.current?.contains(target)
    )
      return
    setIsMenuOpen(false)
  }

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsMenuOpen(false)
      buttonRef.current?.focus()
    }
  }

  useEffect(() => {
    if (!isMenuOpen) return

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isMenuOpen])

  return {
    isMenuOpen,
    buttonRef,
    menuRef,
    toggleMenu
  }
}
