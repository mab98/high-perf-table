import type { ApiData } from "@/types/api"
import type { Column } from "@/types/table"

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
  { key: "id", title: "ID", width: 80, sortable: true, filterable: true },
  {
    key: "firstName",
    title: "First Name",
    width: 120,
    editable: true,
    sortable: true,
    filterable: true,
    resizable: true
  },
  {
    key: "lastName",
    title: "Last Name",
    width: 120,
    editable: true,
    sortable: true,
    filterable: true,
    resizable: true
  },
  {
    key: "email",
    title: "Email",
    width: 250,
    editable: true,
    sortable: true,
    filterable: true,
    resizable: true,
    renderer: renderEmail
  },
  {
    key: "phone",
    title: "Phone",
    width: 180,
    editable: true,
    resizable: true
  },
  {
    key: "dateOfBirth",
    title: "Date of Birth",
    width: 120,
    editable: true,
    sortable: true,
    resizable: true,
    renderer: (row) => renderDate(row.dateOfBirth)
  },
  {
    key: "designation",
    title: "Designation",
    width: 150,
    editable: true,
    sortable: true,
    filterable: true,
    resizable: true
  },
  {
    key: "city",
    title: "City",
    width: 120,
    editable: true,
    sortable: true,
    filterable: true,
    resizable: true
  },
  {
    key: "country",
    title: "Country",
    width: 120,
    editable: true,
    sortable: true,
    filterable: true,
    resizable: true
  },
  {
    key: "joinDate",
    title: "Join Date",
    width: 120,
    editable: true,
    sortable: true,
    resizable: true,
    renderer: (row) => renderDate(row.joinDate)
  },
  {
    key: "salary",
    title: "Salary",
    width: 120,
    editable: true,
    sortable: true,
    filterable: true,
    resizable: true,
    renderer: (row) => renderSalary(row.salary)
  }
]
