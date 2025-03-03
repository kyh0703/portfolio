import { useSubFlowStore } from '@/store/flow'
import { useKeyPress, useOnViewportChange, type Viewport } from '@xyflow/react'
import { useEffect, useRef } from 'react'
import { useCopyPaste, useRemove, useSelect, useShortcut, useUndoRedo } from '.'
import { useGlobalStateSynced } from './use-global-state-synced'

export function useInitialize(flowId: number) {
  useGlobalStateSynced(flowId)

  const { cut, copy, paste } = useCopyPaste(flowId)
  const { removeSelectedNode } = useRemove(flowId)
  const { selectAll } = useSelect()
  const { undo, redo } = useUndoRedo(flowId)

  const viewPortRef = useRef<Viewport | null>(null)
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
        setViewPort(flowId, viewPortRef.current)
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
