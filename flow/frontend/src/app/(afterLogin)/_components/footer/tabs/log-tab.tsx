'use client'

import { ScrollArea } from '@/ui/scroll-area'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

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

export default function LogTab() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]',
    )

    const scrollToBottom = () => {
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: true ? 'smooth' : 'auto',
        })
      }
    }

    scrollToBottom()
  }, [])

  const handleRowClick = () => {}

  return (
    <ScrollArea ref={scrollRef} className="h-full w-full p-2">
      <div className="flex flex-col px-1"></div>
    </ScrollArea>
  )
}
