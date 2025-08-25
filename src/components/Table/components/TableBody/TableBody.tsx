import type { Column } from "../../../../types/table"
import BlankSlate from "../BlankSlate"
import { EmptyRow, SkeletonRow } from "../EmptySkeletonRow"
import TableRow from "../TableRow"

interface TableBodyProps<t> {
  data: t[]
  colDefs: Column<t>[]
  loading: boolean
  pageSize: number
  blankSlateText: string
}

const TableBody = <
  t extends Record<string, unknown> & { id?: string | number }
>({
  data,
  colDefs,
  loading,
  pageSize,
  blankSlateText,
}: TableBodyProps<t>) => {
  return (
    <>
      <tbody>
        {loading ? (
          Array.from({ length: pageSize }).map((_, index) => (
            <SkeletonRow key={index} colDefs={colDefs} />
          ))
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={colDefs.length}>
              <BlankSlate text={blankSlateText} />
            </td>
          </tr>
        ) : (
          <>
            {/* Render actual data rows */}
            {data.map((row, index) => (
              <TableRow
                key={row.id ?? index}
                row={row}
                colDefs={colDefs}
                index={index}
              />
            ))}

            {/* Add empty rows to maintain consistent height */}
            {data.length < pageSize &&
              Array.from({ length: pageSize - data.length }).map((_, index) => (
                <EmptyRow key={`empty-${index}`} colDefs={colDefs} />
              ))}
          </>
        )}
      </tbody>
    </>
  )
}

export default TableBody
