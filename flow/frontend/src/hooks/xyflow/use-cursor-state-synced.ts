import { useYjs } from '@/contexts/yjs-context'
import type { Cursor } from '@/types/collaboration'
import { stringToColor } from '@/utils/xyflow/string-to-color'
import { useReactFlow } from '@xyflow/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useYjsData from '../use-yjs-data'

const MAX_IDLE_TIME = 10000

export function useCursorStateSynced(flowId: number) {
  const [cursors, setCursors] = useState<Cursor[]>([])
  const { ydoc } = useYjs()
  const { getCursorsMap } = useYjsData(ydoc)
  const cursorsMap = useMemo(
    () => getCursorsMap(flowId),
    [getCursorsMap, flowId],
  )
  const clientId = ydoc.clientID.toString()
  const { screenToFlowPosition } = useReactFlow()
  const cursorColor = stringToColor(clientId)

  // Flush any cursors that have gone stale.
  const flush = useCallback(() => {
    const now = Date.now()

    for (const [id, cursor] of cursorsMap) {
      if (now - cursor.timestamp > MAX_IDLE_TIME) {
        cursorsMap.delete(id)
      }
    }
  }, [cursorsMap])

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      cursorsMap.set(clientId, {
        id: clientId,
        color: cursorColor,
        x: position.x,
        y: position.y,
        timestamp: Date.now(),
      })
    },
    [clientId, cursorColor, cursorsMap, screenToFlowPosition],
  )

  useEffect(() => {
    const timer = window.setInterval(flush, MAX_IDLE_TIME)
    const observer = () => {
      setCursors([...cursorsMap.values()])
    }

    flush()
    setCursors([...cursorsMap.values()])
    cursorsMap.observe(observer)

    return () => {
      cursorsMap.unobserve(observer)
      window.clearInterval(timer)
    }
  }, [cursorsMap, flush])

  const cursorsWithoutSelf = useMemo(
    () => cursors.filter(({ id }) => id !== clientId),
    [clientId, cursors],
  )

  return [cursorsWithoutSelf, onMouseMove] as const
}
