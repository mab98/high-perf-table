import "./TableSearch.css"

interface TableSearchProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const TableSearch: React.FC<TableSearchProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="search">
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  )
}

export default TableSearch
