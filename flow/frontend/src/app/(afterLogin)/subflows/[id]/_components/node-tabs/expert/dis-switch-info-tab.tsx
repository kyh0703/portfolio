'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { CHOICE_CALL_OPTIONS } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { SwitchInfo } from '@/models/property/common/switch-info'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function DisSwitchInfoTab(props: NodePropertyTabProps) {
  const { getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as SwitchInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-3 p-6">
      <h3>Choice Call</h3>
      <Autocomplete
        name="info.choiceCall"
        value={info?.choiceCall}
        options={options}
        selectOptions={CHOICE_CALL_OPTIONS}
        onChange={setValue}
        onValueChange={onValueChange}
      />
    </div>
  )
}
