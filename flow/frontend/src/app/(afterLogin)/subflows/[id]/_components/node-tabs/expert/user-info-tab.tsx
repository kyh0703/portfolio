'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import Label from '@/app/_components/label'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { UserDataInfo } from '@/models/property/route'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function UserInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const userInfo = getValues(props.tabName) as UserDataInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Name</h3>
        <Autocomplete
          name="userInfo.name"
          value={userInfo?.name}
          options={options}
          disabled={userInfo?.update}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.userInfo?.name && (
          <span className="error-msg">{errors.userInfo.name.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Key</h3>
        <Autocomplete
          name="userInfo.key"
          value={userInfo?.key}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.userInfo?.key && (
          <span className="error-msg">{errors.userInfo.key.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Value</h3>
        <Autocomplete
          name="userInfo.value"
          value={userInfo?.value}
          options={options}
          disabled={!userInfo?.update}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.userInfo?.value && (
          <span className="error-msg">{errors.userInfo.value.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Default</h3>
        <Autocomplete
          name="userInfo.default"
          value={userInfo?.default}
          options={options}
          disabled={userInfo?.update}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        <div className="flex gap-3">
          <Checkbox
            id="update"
            checked={userInfo?.update}
            onCheckedChange={(checked) =>
              setValue('userInfo.update', !!checked)
            }
          />
          <Label htmlFor="update">Update</Label>
        </div>
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="userInfo.condition"
          value={userInfo?.condition}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.userInfo?.condition && (
          <span className="error-msg">{errors.userInfo.condition.message}</span>
        )}
      </div>
    </div>
  )
}
