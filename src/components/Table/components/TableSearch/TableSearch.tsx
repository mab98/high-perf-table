import { SearchIcon } from "@/components/Table/Icons/Icons"
import ClearButton from "@/components/Table/components/ClearButton/ClearButton"
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
}: TableSearchProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleClear = () => {
    onChange("")
  }

  return (
    <div className="search-wrapper">
      <div className="search-input-wrapper">
        <div className="search-input-icon">
          <SearchIcon size="18" />
        </div>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
        />
        {value && !disabled && (
          <ClearButton
            onClick={handleClear}
            className="input-clear"
            ariaLabel="Clear input"
            title="Clear input"
          />
        )}
      </div>
    </div>
  )
}

export default TableSearch
