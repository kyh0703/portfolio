'use client'

import { LoadingIcon } from '@/app/_components/icon'
import { useWebSocket } from '@/contexts/websocket-context'
import { useYjs } from '@/contexts/yjs-context'
import { createPortal } from 'react-dom'

export default function LoadingPortal() {
  const { isSynced } = useYjs()
  const { isConnected } = useWebSocket()

  return (
    (!isSynced || !isConnected) &&
    createPortal(
      <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-dialog-overlay">
        <div className="flex flex-col items-center space-y-10 rounded-lg bg-dialog px-24 py-12 shadow-xl">
          <LoadingIcon size={60} className="animate-spin" />
          <div className="space-y-2 p-3 text-center">
            <h2 className="text-text">
              {isConnected ? '데이터 동기화중입니다.' : '서버와 연결중입니다.'}
            </h2>
          </div>
        </div>
      </div>,
      document.body,
    )
  )
}
