'use client'

import { useContextStore } from '@/store/context'
import logger from '@/utils/logger'
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'
import { useShallow } from 'zustand/react/shallow'

type YjsState = {
  ydoc: Y.Doc
  isConnected: boolean
  isSynced: boolean
}

const YjsContext = createContext<YjsState | undefined>(undefined)

type YjsProviderProps = {
  baseUrl?: string
} & PropsWithChildren

export default function YjsProvider({ baseUrl, children }: YjsProviderProps) {
  const ydocRef = useRef<Y.Doc>(new Y.Doc())
  const startTimeRef = useRef(performance.now())
  const flowId = useContextStore(useShallow((state) => state.ctx?.id))
  const [isConnected, setIsConnected] = useState(false)
  const [isSynced, setIsSynced] = useState(false)

  useEffect(() => {
    if (!baseUrl) {
      throw new Error('[WS] WebSocket URL is not defined')
    }

    const ydoc = ydocRef.current
    const provider = new WebsocketProvider(baseUrl, `bt/${flowId}`, ydoc)
    ydoc.gc = true
    logger.info('[YJS] Initialized', baseUrl)

    provider.on('status', (event: any) => {
      logger.info('[YJS] Status', ydoc, event.status, new Date())
      if (event.status === 'connected') {
        setIsConnected(true)
      } else {
        setIsConnected(false)
      }
    })

    provider.on('synced', () => {
      // you received the initial content (e.g. the empty paragraph) from the other peers
      const endTime = performance.now()
      const loadTime = ((endTime - startTimeRef.current) / 1000).toFixed(2)

      logger.info(`[YJS] Data synced loadTime ${loadTime}s`, ydoc, new Date())
      setIsSynced(true)
    })

    return () => {
      provider?.destroy()
      ydoc.destroy()
    }
  }, [baseUrl, flowId])

  return (
    <YjsContext.Provider
      value={{ ydoc: ydocRef.current, isConnected, isSynced }}
    >
      {children}
    </YjsContext.Provider>
  )
}

export const useYjs = () => {
  const context = useContext(YjsContext)
  if (!context) {
    throw new Error('useYjs must be used within a YjsProvider')
  }
  return context
}
