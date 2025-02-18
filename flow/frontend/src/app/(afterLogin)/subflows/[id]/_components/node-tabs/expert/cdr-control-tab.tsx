'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import Label from '@/app/_components/label'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { CdrCtrlInfo } from '@/models/property/flow'
import type { NodePropertyTabProps } from '../../node-properties/types'

export default function CdrControlTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const ctrlInfo = getValues(props.tabName) as CdrCtrlInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="flex gap-3">
        <Checkbox
          id="cdrInit"
          checked={ctrlInfo?.cdrInit}
          onCheckedChange={(checked) => setValue('ctrlInfo.cdrInit', !!checked)}
        />
        <Label htmlFor="cdrInit">CDR Initialize</Label>
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="ctrlInfo.condition"
          value={ctrlInfo?.condition}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.ctrlInfo?.condition && (
          <span className="error-msg">{errors.ctrlInfo.condition.message}</span>
        )}
      </div>
    </div>
  )
}
