'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Checkbox } from '@/app/_components/checkbox'
import Label from '@/app/_components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { DN_GROUP_NAME_OPTIONS } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { GetChannelInfo } from '@/models/property/telephony'
import type { NodePropertyTabProps } from '../../node-properties/types'

export default function ChannelInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as GetChannelInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Name</h3>
        <Autocomplete
          name="info.name"
          value={info?.name}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.name && (
          <span className="error-msg">{errors.info.name.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>User Data</h3>
        <Autocomplete
          name="info.usrData"
          value={info?.usrData}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
      <div className="space-y-3">
        <h3>DN Group Name</h3>
        <Autocomplete
          name="info.dnGroupName"
          value={info?.dnGroupName}
          options={options}
          selectOptions={
            // NOTE: 운영관리와 연동된 데이터가 있다면 “DN Group” 을 리스팅
            []
          }
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.info?.dnGroupName && (
          <span className="error-msg">{errors.info.dnGroupName.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Media Type</h3>
        <Select
          value={info?.mediaType}
          onValueChange={(value) => setValue('info.format', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DN_GROUP_NAME_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        <h3>Scenario Name</h3>
        <Autocomplete
          name="info.scnName"
          value={info?.scnName}
          options={options}
          selectOptions={
            // NOTE: 운영관리와 연동된 데이터가 있다면 Outbound Flow 를 리스팅
            []
          }
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
      <div className="flex flex-col space-y-3">
        <div className="flex gap-3">
          <Checkbox
            id="agent"
            checked={info?.agent}
            onCheckedChange={(checked) => {
              if (checked) {
                setValue('info.agent', true)
                setValue('info.auth', false)
              } else {
                setValue('info.agent', false)
              }
            }}
          />
          <Label htmlFor="agent">Agent Call</Label>
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="auth"
            checked={info?.auth}
            onCheckedChange={(checked) => {
              if (checked) {
                setValue('info.auth', true)
                setValue('info.agent', false)
              } else {
                setValue('info.auth', false)
              }
            }}
          />
          <Label htmlFor="agent">Authenticate Call</Label>
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="multi"
            checked={info?.multi}
            onCheckedChange={(checked) => setValue('info.multi', !!checked)}
          />
          <Label htmlFor="multi">Multi Call(In one Channel)</Label>
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="new"
            checked={info?.new}
            onCheckedChange={(checked) => setValue('info.new', !!checked)}
          />
          <Label htmlFor="new">New Call</Label>
        </div>
      </div>
    </div>
  )
}
