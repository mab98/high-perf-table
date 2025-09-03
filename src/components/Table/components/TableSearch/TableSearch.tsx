import { SearchIcon } from "@/components/Table/Icons/Icons"
import DebouncedInput from "@/components/Table/components/DebouncedInput/DebouncedInput"
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
    <DebouncedInput
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className="search-input"
      icon={<SearchIcon size="18" />}
      clearButton={true}
    />
  </div>
)

export default TableSearch
