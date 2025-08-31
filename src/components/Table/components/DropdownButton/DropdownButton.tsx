import { DropdownArrow } from "@/components/Table/Icons/Icons"
import "@/components/Table/components/DropdownButton/DropdownButton.css"
import clsx from "clsx"
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react"

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

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), [])

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node
      if (
        menuRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      )
        return
      closeMenu()
    },
    [closeMenu]
  )

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu()
        buttonRef.current?.focus()
      }
    },
    [closeMenu]
  )

  const buttonClasses = useMemo(
    () =>
      clsx("dropdown-button", {
        "has-active-state": isActive,
        active: isMenuOpen
      }),
    [isActive, isMenuOpen]
  )

  const menuClasses = useMemo(
    () => clsx("dropdown-menu", { open: isMenuOpen }),
    [isMenuOpen]
  )

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
    <div className={clsx("dropdown-button-container", className)}>
      <button
        ref={buttonRef}
        type="button"
        className={buttonClasses}
        onClick={toggleMenu}
        aria-label={ariaLabel || label}
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
      >
        <span>{label}</span>
        <DropdownArrow isOpen={isMenuOpen} />
      </button>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className={menuClasses}
          role="menu"
          aria-hidden={!isMenuOpen}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default memo(DropdownButton)
