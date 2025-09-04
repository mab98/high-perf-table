import "./ResetColumnSettingsButton.css"

interface ResetColumnSettingsButtonProps {
  onResetSettings: () => void
  disabled?: boolean
  hasCustomSettings?: boolean
}

const ResetColumnSettingsButton = ({
  onResetSettings,
  disabled = false,
  hasCustomSettings = false
}: ResetColumnSettingsButtonProps) => {
  const handleResetClick = () => {
    if (onResetSettings) {
      const confirmed = window.confirm(
        "Are you sure you want to reset all column settings? This will clear custom column widths, visibility, and order. This action cannot be undone."
      )
      if (confirmed) {
        onResetSettings()
      }
    }
  }

  // Only show the button if there are custom settings
  if (!hasCustomSettings) {
    return null
  }

  return (
    <button
      type="button"
      className="reset-column-settings-button"
      onClick={handleResetClick}
      disabled={disabled}
      aria-label="Reset column settings"
      title="Reset all column settings to defaults"
    >
      Reset Columns
    </button>
  )
}

export default ResetColumnSettingsButton
