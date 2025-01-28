import type { AbsolutePosition } from '@/app/_components/context-menu'
import type { CellContextMenuEvent } from 'ag-grid-community'
import { useCallback, useState } from 'react'

export default function useGridContext<T>(): [
  AbsolutePosition | null,
  React.Dispatch<React.SetStateAction<AbsolutePosition | null>>,
  (event: CellContextMenuEvent<T>) => void,
] {
  const [contextMenu, setContextMenu] = useState<AbsolutePosition | null>(null)

  const onCellContextMenu = useCallback((event: CellContextMenuEvent<T>) => {
    const selectedNodes = event.api.getSelectedNodes()
    if (!selectedNodes.find((row) => row.rowIndex === event.node.rowIndex)) {
      event.api.deselectAll()
      event.node.setSelected(true)
    }

    const pointerEvent = event.event as PointerEvent
    setContextMenu({
      top: pointerEvent.clientY,
      left: pointerEvent.clientX,
    })
  }, [])

  return [contextMenu, setContextMenu, onCellContextMenu]
}
