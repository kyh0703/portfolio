'use client'

import { useWebSocket } from '@/contexts/websocket-context'
import useReplace from '@/hooks/use-replace'
import type { Message } from '@/models/web-socket/message'
import { ReplaceProgress } from '@/models/web-socket/replace/progress'
import { memo, useEffect } from 'react'

function WebsocketSubscriber() {
  const { subscribe } = useWebSocket()
  const { onReplaceProperty, onReplaceDefine, onReplaceMenu } = useReplace()

  useEffect(() => {
    const unsubscribeReplaceProgress = subscribe(
      'replaceProgress',
      handleReplaceProgress,
    )
    return () => {
      unsubscribeReplaceProgress()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReplaceProgress = ({
    data: {
      results: { properties, defines, menus },
    },
  }: Message<ReplaceProgress>) => {
    properties.forEach(onReplaceProperty)
    defines.forEach(onReplaceDefine)
    menus.forEach(onReplaceMenu)
  }

  return null
}

export default memo(WebsocketSubscriber)
