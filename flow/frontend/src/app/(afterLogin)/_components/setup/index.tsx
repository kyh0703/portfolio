'use client'

import { YJS_OPTIONS_KEY } from '@/constants/yjs'
import { useYjs } from '@/contexts/yjs-context'
import useYjsData from '@/hooks/use-yjs-data'
import { useQueryOption } from '@/services/option'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export default function Setup() {
  const { ydoc } = useYjs()
  const { sharedOptionsMap } = useYjsData(ydoc)

  const { data: options } = useQuery(useQueryOption())

  useEffect(() => {
    if (options) {
      sharedOptionsMap.set(YJS_OPTIONS_KEY, options)
    }
  }, [options, sharedOptionsMap])

  return null
}
