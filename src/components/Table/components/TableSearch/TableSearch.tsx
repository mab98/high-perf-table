import searchIcon from "../../../../assets/search-icon.svg"
import "./TableSearch.css"

interface TableSearchProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

const TableSearch = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Search..."
}: TableSearchProps) => (
  <div className="search-wrapper">
    <img
      src={searchIcon}
      alt="Search"
      className="search-icon"
      aria-hidden="true"
    />
    <input
      type="search"
      name="search"
      className="search-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  </div>
)

export default TableSearch
