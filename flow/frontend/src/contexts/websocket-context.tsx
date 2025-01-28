'use client'

import { getTokens } from '@/services/lib/token'
import logger from '@/utils/logger'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'

type Subscribers = {
  [type: string]: Array<(message: string) => void>
}

type WebSocketState = {
  isConnected: boolean
  subscribe: (type: string, callback: (message: any) => void) => () => void
  send: (message: any) => void
}

const WebSocketContext = createContext<WebSocketState | undefined>(undefined)

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const wsRef = useRef<WebSocket | null>(null)
  const subscribersRef = useRef<Subscribers>({})
  const reconnectRef = useRef<{
    try: number
    max: number
  }>({
    try: 1,
    max: 3,
  })

  const [isConnected, setIsConnected] = useState(false)
  const [waitingToReconnect, setWaitingToReconnect] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const send = useCallback((message: any) => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  const subscribe = useCallback(
    (type: string, callback: (message: string) => void): (() => void) => {
      if (!subscribersRef.current[type]) {
        subscribersRef.current[type] = []
      }
      subscribersRef.current[type].push(callback)

      return () => {
        subscribersRef.current[type] = subscribersRef.current[type].filter(
          (cb) => cb !== callback,
        )
        if (subscribersRef.current[type].length === 0) {
          delete subscribersRef.current[type]
        }
      }
    },
    [],
  )

  useEffect(() => {
    if (waitingToReconnect) {
      return
    }
    if (wsRef.current) {
      return
    }

    logger.info('[WS] Initialized')
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_API_WS_BASE_URL}`)
    wsRef.current = ws

    const token = getTokens()!
    const accessToken = token.accessToken

    ws.onopen = () => {
      logger.info('[WS] Opened')
      ws.send(
        JSON.stringify({
          type: 'auth',
          data: {
            token: accessToken,
          },
          timestamp: new Date(),
        }),
      )
      reconnectRef.current.try = 1
      setIsConnected(true)
    }

    ws.onerror = (error) => {
      logger.error('[WS] Error:', error)
    }

    ws.onclose = () => {
      if (wsRef.current) {
        logger.warn('[WS] Closed by server')
      } else {
        logger.warn('[WS] Closed by app component unmount')
      }

      if (waitingToReconnect) {
        return
      }

      setIsConnected(false)
      setWaitingToReconnect(true)

      if (reconnectRef.current.max < reconnectRef.current.try) {
        logger.info('[WS] Reconnect max attempts reached')
        setError(
          new Error(
            'WebSocket 연결에 실패했습니다. 잠시후 다시 시도해주시기 바랍니다.',
          ),
        )
      }

      logger.info(
        `[WS] Reconnect attempt: ${reconnectRef.current.try} ${3000 * reconnectRef.current.try}`,
      )
      reconnectRef.current.try += 1
      setTimeout(() => {
        setWaitingToReconnect(false)
      }, 3000 * reconnectRef.current.try)
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      logger.debug('[WS] message:', data)

      const dataType = data.type
      const callbacks = subscribersRef.current[dataType]
      if (callbacks) {
        callbacks.forEach((callback) => callback(data))
      }
    }

    return () => {
      logger.info('[WS] cleanup')
      wsRef.current = null
      ws.close()
    }
  }, [waitingToReconnect])

  if (error) {
    throw error
  }

  return (
    <WebSocketContext.Provider value={{ send, subscribe, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocket Provider')
  }
  return context
}
