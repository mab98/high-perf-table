import type { Column } from "../types/table"
import type { ApiData } from "../types/api"

export const colDefs: Column<ApiData>[] = [
  {
    key: "id",
    title: "ID",
    width: 80,
    sortable: true,
    filterable: true,
  },
  {
    key: "firstName",
    title: "First Name",
    width: 120,
    editable: true,
    sortable: true,
    filterable: true,
  },
  {
    key: "lastName",
    title: "Last Name",
    width: 120,
    editable: true,
    sortable: true,
    filterable: true,
  },
  {
    key: "email",
    title: "Email",
    width: 250,
    editable: true,
    sortable: true,
    filterable: true,
    renderer: (apiData: ApiData) => {
      return (
        <a
          href={`mailto:${apiData.email}`}
          className="email-link"
          onClick={(e) => e.stopPropagation()}
        >
          {apiData.email}
        </a>
      )
    },
  },
  {
    key: "phone",
    title: "Phone",
    width: 180,
    editable: true,
  },
  {
    key: "dateOfBirth",
    title: "Date of Birth",
    width: 120,
    editable: true,
    sortable: true,
    renderer: (apiData: ApiData) => {
      const date = new Date(apiData.dateOfBirth)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    },
  },
  {
    key: "designation",
    title: "Designation",
    width: 150,
    editable: true,
    sortable: true,
    filterable: true,
  },
  {
    key: "city",
    title: "City",
    width: 120,
    editable: true,
    sortable: true,
    filterable: true,
  },
  {
    key: "country",
    title: "Country",
    width: 120,
    editable: true,
    sortable: true,
    filterable: true,
  },
  {
    key: "joinDate",
    title: "Join Date",
    width: 120,
    editable: true,
    sortable: true,
    renderer: (apiData: ApiData) => {
      const date = new Date(apiData.joinDate)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    },
  },
  {
    key: "salary",
    title: "Salary",
    width: 120,
    editable: true,
    sortable: true,
    filterable: true,
    renderer: (apiData: ApiData) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(apiData.salary)
    },
  },
]
