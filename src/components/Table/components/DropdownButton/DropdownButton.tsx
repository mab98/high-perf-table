import { DropdownArrow } from "@/components/Table/Icons"
import "@/components/Table/components/DropdownButton/DropdownButton.css"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

interface DropdownButtonProps {
  label: string
  isActive?: boolean
  ariaLabel?: string
  children: ReactNode
  className?: string
}

const DropdownButton = ({
  label,
  isActive = false,
  ariaLabel,
  children,
  className = ""
}: DropdownButtonProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const closeMenu = () => setIsMenuOpen(false)
  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Node

    if (
      menuRef.current?.contains(target) ||
      buttonRef.current?.contains(target)
    ) {
      return
    }

    closeMenu()
  }, [])

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeMenu()
      buttonRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isMenuOpen, handleClickOutside, handleEscapeKey])

  return (
    <div className={`dropdown-button-container ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        className={`dropdown-button ${isActive ? "has-active-state" : ""} ${
          isMenuOpen ? "active" : ""
        }`}
        onClick={toggleMenu}
        aria-label={ariaLabel || label}
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
      >
        <span>{label}</span>
        <DropdownArrow isOpen={isMenuOpen} />
      </button>

      <div
        ref={menuRef}
        className={`dropdown-menu ${isMenuOpen ? "open" : ""}`}
        role="menu"
        aria-hidden={!isMenuOpen}
      >
        {children}
      </div>
    </div>
  )
}

export default DropdownButton
