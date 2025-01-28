import { useSubFlowStore } from '@/store/sub-flow'
import { useKeyPress, useOnViewportChange, type Viewport } from '@xyflow/react'
import { useEffect, useRef } from 'react'
import { useCopyPaste, useRemove, useSelect, useShortcut, useUndoRedo } from '.'
import { useGlobalStateSynced } from './use-global-state-synced'

export function useInitialize(subFlowId: number) {
  useGlobalStateSynced(subFlowId)

  const { cut, copy, paste } = useCopyPaste(subFlowId)
  const { removeSelectedNode } = useRemove(subFlowId)
  const { selectAll } = useSelect()
  const { undo, redo } = useUndoRedo(subFlowId)

  const viewPortRef = useRef<Viewport>()
  const [setViewPort, setEditMode] = useSubFlowStore((state) => [
    state.setViewPort,
    state.setEditMode,
  ])
  const shiftKeyPressed = useKeyPress('Shift', {
    target: window.document.getElementById('flow-main'),
  })

  useEffect(
    () => setEditMode(shiftKeyPressed ? 'pointer' : 'grab'),
    [setEditMode, shiftKeyPressed],
  )

  useOnViewportChange({
    onEnd: (viewport) => (viewPortRef.current = viewport),
  })

  useEffect(() => {
    return () => {
      if (viewPortRef.current) {
        setViewPort(subFlowId, viewPortRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useShortcut(['Meta+a', 'Control+a'], selectAll)
  useShortcut(['Delete'], removeSelectedNode)
  useShortcut(['Meta+x', 'Control+x'], cut)
  useShortcut(['Meta+c', 'Control+c'], copy)
  useShortcut(['Meta+v', 'Control+v'], paste)
  useShortcut(['Meta+z', 'Control+z'], undo)
  useShortcut(['Meta+y', 'Control+y'], redo)
}
