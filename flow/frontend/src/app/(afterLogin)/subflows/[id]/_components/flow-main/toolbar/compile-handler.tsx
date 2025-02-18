'use client'

import { useWebSocket } from '@/contexts/websocket-context'
import type { BuildProgress, BuildResult, MessageLog } from '@/models/build'
import { useBuildStore } from '@/store/build'
import { useCallback, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

export default function CompileHandler() {
  const { subscribe } = useWebSocket()
  const [appendCompileMessages, doneComplete] = useBuildStore(
    useShallow((state) => [state.appendCompileMessages, state.doneCompile]),
  )

  const onProgress = useCallback(
    (data: BuildProgress<MessageLog>) => {
      const { data: inner } = data
      switch (inner.buildType) {
        case 'compile':
          appendCompileMessages(data)
          break
      }
    },
    [appendCompileMessages],
  )

  const onResult = useCallback(
    (data: BuildResult) => {
      const { data: inner } = data
      switch (inner.buildType) {
        case 'compile':
          doneComplete(data)
          break
      }
    },
    [doneComplete],
  )

  useEffect(() => {
    const unsubscribeStart = subscribe('buildStart', onProgress)
    const unsubscribeProgress = subscribe('buildProgress', onProgress)
    const unsubscribeResult = subscribe('buildResult', onResult)
    return () => {
      unsubscribeStart()
      unsubscribeProgress()
      unsubscribeResult()
    }
  }, [onProgress, onResult, subscribe])

  return null
}
