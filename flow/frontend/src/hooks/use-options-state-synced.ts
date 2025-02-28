import { YJS_OPTIONS_KEY } from '@/constants/yjs'
import { useYjs } from '@/contexts/yjs-context'
import type { Option } from '@/models/options'
import { useEffect, useState } from 'react'
import useYjsData from './use-yjs-data'

export function useOptionsStateSynced(): [
  Option | undefined,
  React.Dispatch<React.SetStateAction<Option | undefined>>,
] {
  const { ydoc } = useYjs()
  const { sharedOptionsMap } = useYjsData(ydoc)
  const [options, setOptions] = useState<Option | undefined>(undefined)

  useEffect(() => {
    const observer = () => {
      const syncedOption = sharedOptionsMap.get(YJS_OPTIONS_KEY)
      setOptions(syncedOption)
    }

    const yOptions = sharedOptionsMap.get(YJS_OPTIONS_KEY)
    setOptions(yOptions)

    sharedOptionsMap.observe(observer)
    return () => {
      sharedOptionsMap.unobserve(observer)
    }
  }, [sharedOptionsMap])

  return [options, setOptions]
}
