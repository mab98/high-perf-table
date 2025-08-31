import { SearchIcon } from "@/components/Table/Icons/Icons"
import "@/components/Table/components/BlankSlate/BlankSlate.css"

interface BlankSlateProps {
  text: string
  onClearAll?: () => void
  hasActiveFilters?: boolean
}

const BlankSlate = ({
  text,
  onClearAll,
  hasActiveFilters
}: BlankSlateProps) => (
  <div className="blank-slate">
    <div className="blank-slate-icon">
      <SearchIcon size="48" />
    </div>
    <div className="blank-slate-content">
      <h3 className="blank-slate-text">{text}</h3>
      {hasActiveFilters && (
        <p className="blank-slate-subtitle">
          Try adjusting your search or filter criteria
        </p>
      )}
      {onClearAll && hasActiveFilters && (
        <button
          type="button"
          className="blank-slate-clear-button"
          onClick={onClearAll}
        >
          Clear All Filters
        </button>
      )}
    </div>
  </div>
)

export default BlankSlate
