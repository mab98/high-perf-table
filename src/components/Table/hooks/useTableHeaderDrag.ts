import {
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type Modifier
} from "@dnd-kit/core"
import { useCallback, useRef, useState } from "react"

export interface UseTableHeaderDragProps {
  tableWidth?: number
}

export interface UseTableHeaderDragReturn {
  activeColumn: string | null
  setActiveColumn: (column: string | null) => void
  tableHeaderRef: React.RefObject<HTMLDivElement | null>
  constrainedHorizontalModifier: Modifier
  sensors: ReturnType<typeof useSensors>
  handleDragStart: (event: DragStartEvent) => void
  handleDragEnd: (event: DragEndEvent) => void
}

export const useTableHeaderDrag = ({
  tableWidth,
  onColumnReorder
}: UseTableHeaderDragProps & {
  onColumnReorder?: (activeId: string, overId: string) => void
}): UseTableHeaderDragReturn => {
  const [activeColumn, setActiveColumn] = useState<string | null>(null)
  const tableHeaderRef = useRef<HTMLDivElement>(null)

  /* Constrain drag horizontally within table bounds */
  const constrainedHorizontalModifier: Modifier = useCallback(
    ({ transform, draggingNodeRect }) => {
      if (!draggingNodeRect || !tableWidth || !tableHeaderRef.current) {
        return { x: transform.x, y: 0, scaleX: 1, scaleY: 1 }
      }

      const headerRect = tableHeaderRef.current.getBoundingClientRect()
      const dragNodeWidth = draggingNodeRect.width

      const leftBoundary = headerRect.left
      const rightBoundary = headerRect.left + tableWidth

      const currentLeft = draggingNodeRect.left + transform.x
      const currentRight = currentLeft + dragNodeWidth

      let constrainedX = transform.x
      if (currentLeft < leftBoundary) {
        constrainedX = leftBoundary - draggingNodeRect.left
      }
      if (currentRight > rightBoundary) {
        constrainedX = rightBoundary - dragNodeWidth - draggingNodeRect.left
      }

      return { x: constrainedX, y: 0, scaleX: 1, scaleY: 1 }
    },
    [tableWidth]
  )

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveColumn(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (active.id !== over?.id && over?.id && onColumnReorder) {
        onColumnReorder(active.id as string, over.id as string)
      }

      setActiveColumn(null)
    },
    [onColumnReorder]
  )

  return {
    activeColumn,
    setActiveColumn,
    tableHeaderRef,
    constrainedHorizontalModifier,
    sensors,
    handleDragStart,
    handleDragEnd
  }
}
