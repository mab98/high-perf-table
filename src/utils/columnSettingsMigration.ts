// Migration utility to convert old localStorage format to new format
export const migrateColumnSettings = () => {
  const oldStorageKey = "table-column-settings"

  try {
    const stored = localStorage.getItem(oldStorageKey)
    if (!stored) return

    const oldSettings = JSON.parse(stored)

    // Check if it's the old format
    if (
      oldSettings.visibleColumns &&
      oldSettings.columnOrder &&
      oldSettings.columnWidths
    ) {
      console.log("Migrating column settings to new format...")

      // Convert to new format
      const newSettings = {
        columns: oldSettings.visibleColumns.map((key: string) => ({
          key,
          ...(oldSettings.columnWidths[key] && {
            width: oldSettings.columnWidths[key]
          })
        }))
      }

      // Save in new format
      localStorage.setItem(oldStorageKey, JSON.stringify(newSettings))

      console.log("Migration completed:", newSettings)

      return newSettings
    }
  } catch (error) {
    console.error("Failed to migrate column settings:", error)
  }
}

// Test data to demonstrate the new format
export const demonstrateNewFormat = () => {
  console.log("=== NEW COLUMN SETTINGS FORMAT DEMO ===")

  // Example of old format (what we had before)
  const oldFormat = {
    visibleColumns: ["id", "firstName", "email", "phone"],
    columnOrder: ["id", "firstName", "lastName", "email", "phone", "address"],
    columnWidths: { firstName: 150, email: 200 }
  }

  // New format (much cleaner!)
  const newFormat = {
    columns: [
      { key: "id" },
      { key: "firstName", width: 150 },
      { key: "email", width: 200 },
      { key: "phone" }
    ]
  }

  console.log("Old format (before):", JSON.stringify(oldFormat, null, 2))
  console.log("New format (after):", JSON.stringify(newFormat, null, 2))

  console.log("\nBenefits:")
  console.log("- Single source of truth")
  console.log("- Much smaller storage footprint")
  console.log("- Easier to understand and maintain")
  console.log("- Order and width combined naturally")
  console.log("- Hidden columns don't take up storage space")
}

// Run demonstration
if (typeof window !== "undefined") {
  demonstrateNewFormat()
}
