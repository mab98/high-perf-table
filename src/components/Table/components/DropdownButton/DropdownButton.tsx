import { DropdownArrow } from "@/components/Table/Icons/Icons"
import "@/components/Table/components/DropdownButton/DropdownButton.css"
import { useDropdown } from "@/components/Table/hooks/useDropdown"
import clsx from "clsx"
import { memo, useMemo, type ReactNode } from "react"

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
  const { isMenuOpen, buttonRef, menuRef, toggleMenu } = useDropdown()

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
