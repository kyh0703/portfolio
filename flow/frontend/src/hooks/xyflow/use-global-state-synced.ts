import { useYjs } from '@/contexts/yjs-context'
import { useQueryUndoRedoCount } from '@/services/flow/queries/use-query-undo-redo-count'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import useYjsData from '../use-yjs-data'

export function useGlobalStateSynced(subFlowId: number) {
  const { ydoc } = useYjs()
  const { sharedHistoryMap } = useYjsData(ydoc)
  const id = useMemo(() => '' + subFlowId, [subFlowId])
  const [undoRedo, setUndoRedo] = useState<{
    undoCount: number
    redoCount: number
  }>({
    undoCount: 0,
    redoCount: 0,
  })

  const { data } = useSuspenseQuery(useQueryUndoRedoCount(subFlowId))

  useEffect(() => {
    const observer = () => {
      const newData = sharedHistoryMap.get(id)
      setUndoRedo({
        undoCount: newData?.undoCount ?? 0,
        redoCount: newData?.redoCount ?? 0,
      })
    }

    const yDocData = sharedHistoryMap.get(id)
    if (yDocData) {
      setUndoRedo(yDocData)
    } else {
      setUndoRedo({
        undoCount: data.undocnt,
        redoCount: data.redocnt,
      })
      sharedHistoryMap.set(id, {
        undoCount: data.undocnt,
        redoCount: data.redocnt,
      })
    }

    sharedHistoryMap.observe(observer)
    return () => {
      sharedHistoryMap.unobserve(observer)
    }
  }, [data.redocnt, data.undocnt, id, sharedHistoryMap])
}
