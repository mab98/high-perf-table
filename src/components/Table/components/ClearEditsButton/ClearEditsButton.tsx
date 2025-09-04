import "./ClearEditsButton.css"

interface ClearEditsButtonProps {
  onClearAllEdits: () => void
  disabled?: boolean
}

const ClearEditsButton = ({
  onClearAllEdits,
  disabled = false
}: ClearEditsButtonProps) => {
  const handleClearEditsClick = () => {
    if (onClearAllEdits) {
      const confirmed = window.confirm(
        "Are you sure you want to clear all local edits? This action cannot be undone."
      )
      if (confirmed) {
        onClearAllEdits()
      }
    }
  }

  return (
    <button
      type="button"
      className="clear-edits-button"
      onClick={handleClearEditsClick}
      disabled={disabled}
      aria-label="Clear all edits"
      title="Clear all local edits"
    >
      Clear Edits
    </button>
  )
}

export default ClearEditsButton
