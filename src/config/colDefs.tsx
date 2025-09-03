import type { ApiData } from "@/types/api"
import type { Column } from "@/types/table"

// Validation functions
const validateName = (value: string): string | null => {
  if (!value.trim()) return "Name is required"
  if (value.trim().length < 2) return "Name must be at least 2 characters"
  if (!/^[a-zA-Z\s]+$/.test(value))
    return "Name can only contain letters and spaces"
  return null
}

const validateEmail = (value: string): string | null => {
  if (!value.trim()) return "Email is required"
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) return "Please enter a valid email address"
  return null
}

const validateRequired = (value: string): string | null => {
  if (!value.trim()) return "This field is required"
  return null
}

const validateSalary = (value: string): string | null => {
  if (!value.trim()) return "Salary is required"
  const numValue = parseFloat(value)
  if (isNaN(numValue)) return "Please enter a valid number"
  if (numValue < 0) return "Salary cannot be negative"
  if (numValue > 1000000) return "Salary seems too high"
  return null
}

// Formatters
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric"
})

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})

// --- Renderers ---
const renderEmail = (apiData: ApiData) => (
  <a href={`mailto:${apiData.email}`} onClick={(e) => e.stopPropagation()}>
    {apiData.email}
  </a>
)

const renderDate = (date: string) => dateFormatter.format(new Date(date))

const renderSalary = (salary: number) => currencyFormatter.format(salary)

export const colDefs: Column<ApiData>[] = [
  { key: "id", title: "ID", width: 80, sortable: true, filterable: false },
  {
    key: "firstName",
    title: "First Name",
    width: 120,
    editable: { validation: validateName, showEditIconInHeader: true },
    sortable: true,
    filterable: true,
    resizable: true,
    tooltip: true
  },
  {
    key: "lastName",
    title: "Last Name",
    width: 120,
    editable: { validation: validateName, showEditIconInHeader: true },
    sortable: true,
    filterable: true,
    resizable: true,
    tooltip: true
  },
  {
    key: "email",
    title: "Email",
    width: 250,
    editable: { validation: validateEmail, showEditIconInHeader: true },
    sortable: true,
    filterable: true,
    resizable: true,
    tooltip: true,
    renderer: renderEmail
  },
  {
    key: "phone",
    title: "Phone",
    width: 180,
    sortable: false,
    filterable: false,
    resizable: true,
    tooltip: true
  },
  {
    key: "dateOfBirth",
    title: "Date of Birth",
    width: 120,
    sortable: true,
    filterable: false,
    resizable: true,
    tooltip: false,
    renderer: (row) => renderDate(row.dateOfBirth)
  },
  {
    key: "designation",
    title: "Designation",
    width: 150,
    editable: { validation: validateRequired, showEditIconInHeader: true },
    sortable: true,
    filterable: true,
    resizable: true,
    tooltip: true
  },
  {
    key: "city",
    title: "City",
    width: 120,
    editable: { validation: validateRequired, showEditIconInHeader: false },
    sortable: true,
    filterable: true,
    resizable: false,
    tooltip: true
  },
  {
    key: "country",
    title: "Country",
    width: 120,
    sortable: true,
    filterable: true,
    resizable: true,
    tooltip: false
  },
  {
    key: "joinDate",
    title: "Join Date",
    width: 120,
    sortable: true,
    filterable: false,
    resizable: true,
    tooltip: true,
    renderer: (row) => renderDate(row.joinDate)
  },
  {
    key: "salary",
    title: "Salary",
    width: 120,
    editable: { validation: validateSalary, showEditIconInHeader: true },
    sortable: true,
    filterable: true,
    resizable: true,
    tooltip: true,
    renderer: (row) => renderSalary(row.salary)
  }
]
