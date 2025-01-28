import { getAutocomplete } from '@/services/subflow'
import type { CustomNodeType } from '@xyflow/react'
import debounce from 'lodash-es/debounce'
import { useState } from 'react'

type AutocompleteProps = {
  subFlowId: number
  nodeType: CustomNodeType
  tabName: string
}

export default function useAutocomplete({
  subFlowId,
  nodeType,
  tabName,
}: AutocompleteProps): [
  string[],
  React.Dispatch<React.SetStateAction<string[]>>,
  (name: string, search: string) => void,
] {
  const [options, setOptions] = useState<string[]>([])

  const onValueChange = (name: string, keyword: string) => {
    const splitStr = name.split('.')
    const property = splitStr[splitStr.length - 1]
    const debounceFn = debounce(async () => {
      const response = await getAutocomplete(
        subFlowId,
        nodeType,
        tabName,
        property,
        keyword,
      )
      const options = new Set(response)
      setOptions(Array.from(options))
    }, 200)
    debounceFn()
  }

  return [options, setOptions, onValueChange]
}
