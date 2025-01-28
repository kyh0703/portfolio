'use client'

import {
  BuildProgress,
  BuildResult,
  LogLevel,
  MessageLog,
} from '@/models/build'
import { useBuildStore } from '@/store/build'
import { ScrollArea } from '@/ui/scroll-area'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'

const getLogLevelColor = (level: keyof typeof LogLevel) => {
  switch (level) {
    case 'ERR':
      return 'text-red-500'
    case 'WRN':
      return 'text-yellow-500'
    case 'INF':
      return 'text-blue-500'
    case 'TRC':
      return 'text-text'
    case 'DBG':
      return 'text-green-500'
    default:
      return 'text-gray-300'
  }
}

const formatMessageContent = (content: string) => {
  const uniqueMessages = new Set()

  return content.split('\n').map((line, index) => {
    if (uniqueMessages.has(line)) {
      return null
    }
    uniqueMessages.add(line)
    const errorMatch = line.match(/(\d+) error\(s\)/)
    const warningMatch = line.match(/(\d+) warning\(s\)/)

    return (
      <div key={index}>
        {line
          .split(/(\d+ error\(s\)|\d+ warning\(s\))/)
          .map((part, partIndex) => {
            if (errorMatch && part.includes('error(s)')) {
              return (
                <span key={partIndex} className="text-red-500">
                  {part}
                </span>
              )
            }
            if (warningMatch && part.includes('warning(s)')) {
              return (
                <span key={partIndex} className="text-yellow-500">
                  {part}
                </span>
              )
            }
            return part
          })}
      </div>
    )
  })
}

export default function CompileTab() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isCompiling, compileMessages] = useBuildStore(
    useShallow((state) => [state.compile.isCompiling, state.compile.messages]),
  )

  useEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]',
    )

    const scrollToBottom = () => {
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: isCompiling ? 'smooth' : 'auto',
        })
      }
    }

    scrollToBottom()
  }, [isCompiling, compileMessages])

  console.log('rerender')

  const handleRowClick = ({ message }: MessageLog) => {
    const isDefine = message.subFlowId === 0
    if (isDefine) {
      switch (message.subFlowName) {
        case 'var':
        case 'ment':
        case 'log':
        case 'userfunc':
        case 'track':
        case 'service':
          router.push(`/defines/${message.scope}/${message.subFlowName}`)
          break
        case 'menu':
        case 'packet':
        case 'intent':
        case 'cdr':
        case 'string':
        case 'menustat':
          router.push(
            `/defines/${message.scope}/${message.subFlowName}/${message.nodeId}`,
          )
          break
      }
    } else {
      if (message.subFlowId && message.nodeName) {
        router.push(
          `/subflows/${message.subFlowId}?focusNode=${message.nodeName}&focusTab=${message.tabName}`,
        )
      }
    }
  }

  const formatMessage = (msg: BuildProgress<MessageLog> | BuildResult) => {
    const baseClassName =
      'font-mono text-xs cursor-pointer rounded p-2 transition-colors duration-200 ease-in-out hover:bg-gray-100'

    if (msg.type === 'buildResult') {
      return (
        <div key={msg.timestamp} className={baseClassName}>
          {formatMessageContent(msg.data.message)}
        </div>
      )
    }

    const { level, message } = msg.data.logs
    const color = getLogLevelColor(level)
    const content =
      level === 'ERR' || level === 'WRN'
        ? `[${level}] ${message.message}`
        : message.message

    return (
      <div
        key={msg.timestamp}
        className={`${baseClassName} ${color}`}
        onClick={() => handleRowClick(msg.data.logs)}
      >
        {content}
      </div>
    )
  }

  return (
    <ScrollArea ref={scrollRef} className="h-full w-full p-2">
      <div className="flex flex-col px-1">
        {compileMessages.map(formatMessage)}
      </div>
    </ScrollArea>
  )
}
