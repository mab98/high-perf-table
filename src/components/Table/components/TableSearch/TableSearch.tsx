import { SearchIcon } from "@/components/Table/Icons"
import "@/components/Table/components/TableSearch/TableSearch.css"

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
    <SearchIcon size="18" />
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
