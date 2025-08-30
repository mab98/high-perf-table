import "@/components/Table/Icons/Icons.css"

export const ClearIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 4L12 12M12 4L4 12" />
  </svg>
)

export const DropdownArrow = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="currentColor"
    className={`dropdown-arrow ${isOpen ? "rotated" : ""}`}
    aria-hidden="true"
  >
    <path
      d="M2.5 4.5L6 8l3.5-3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const SearchIcon = ({ size = "64" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="11"
        cy="11"
        r="8"
        fill="#f8fafc"
        stroke="#6c757d"
        strokeWidth="2"
      />
      <path
        d="m21 21-4.35-4.35"
        stroke="#6c757d"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
