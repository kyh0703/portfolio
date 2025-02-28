'use client'

import type { RecvMessageType, SendMessageType } from '@/constants/message'
import type { Message } from '@/models/web-socket/message'
import { getToken } from '@/services/lib/token'
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
  subscribe: (
    type: RecvMessageType,
    callback: (message: any) => void,
  ) => () => void
  send: (type: SendMessageType, data: any) => void
}

const WebSocketContext = createContext<WebSocketState | undefined>(undefined)

type WebSocketProviderProps = {
  baseUrl?: string
} & PropsWithChildren

export const WebSocketProvider = ({
  baseUrl,
  children,
}: WebSocketProviderProps) => {
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

  const send = useCallback((type: SendMessageType, data: any) => {
    if (wsRef.current) {
      const message: string = JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString(),
      } as Message<any>)
      logger.debug('Ⓜ️[WS] >', message)
      wsRef.current.send(message)
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
    if (waitingToReconnect || wsRef.current) {
      return
    }

    if (!baseUrl) {
      throw new Error('[WS] WebSocket URL is not defined')
    }

    const connectWebSocket = () => {
      logger.info('[WS] Attempting to connect', baseUrl)
      const ws = new WebSocket(baseUrl)
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
        setWaitingToReconnect(false)
      }

      ws.onerror = (error) => {
        logger.error('[WS] Error', error)
      }

      ws.onclose = () => {
        if (wsRef.current) {
          logger.warn('[WS] Closed by server')
        } else {
          logger.warn('[WS] Closed by app component unmount')
        }

        setIsConnected(false)

        if (reconnectRef.current.max < reconnectRef.current.try) {
          logger.info('[WS] Reconnect max attempts reached')
          setError(
            new Error(
              'WebSocket 연결에 실패했습니다. 잠시후 다시 시도해주시기 바랍니다.',
            ),
          )
          return
        }

        setWaitingToReconnect(true)
        setTimeout(() => {
          logger.info(
            `[WS] Reconnect attempt try ${reconnectRef.current.try} sleep ${3000 * reconnectRef.current.try}`,
          )
          reconnectRef.current.try += 1
          setWaitingToReconnect(false)
        }, 3000 * reconnectRef.current.try)
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        logger.debug('Ⓜ️[WS] <', JSON.stringify(data))

        const callbacks = subscribersRef.current[data.type]
        if (callbacks) {
          callbacks.forEach((callback) => callback(data))
        }
      }
    }

    connectWebSocket()

    return () => {
      logger.info('[WS] cleanup')
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [baseUrl, waitingToReconnect])

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
