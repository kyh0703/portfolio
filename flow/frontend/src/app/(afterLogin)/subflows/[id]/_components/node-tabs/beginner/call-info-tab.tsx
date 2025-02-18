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
import {
  AGENT_TYPE_OPTIONS,
  CHOICE_CALL_OPTIONS,
  FORMAT_OPTIONS,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { MakeCallInfo } from '@/models/property/telephony'
import { Separator } from '@/ui/separator'
import type { NodePropertyTabProps } from '../../node-properties/types'

export default function BeginnerCallInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as MakeCallInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  return (
    <div className="flex h-full w-full flex-col">
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>To</h3>
          <Autocomplete
            name="info.to"
            value={info?.to}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.info?.to && (
            <span className="error-msg">{errors.info.to.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>ANI</h3>
          <Autocomplete
            name="info.ani"
            value={info?.ani}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>User Data</h3>
          <div className="flex gap-1.5">
            <Autocomplete
              name="info.usrData"
              value={info?.usrData}
              options={options}
              selectOptions={
                // 콤보박스 버튼을 누르면 정의된 변수 및 정의 들을 리스팅
                []
              }
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <Select
              value={info?.format}
              onValueChange={(value) => setValue('info.format', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-3">
          <h3>Timeout</h3>
          <div className="flex items-center space-x-3">
            <Autocomplete
              name="info.timeout"
              value={info?.timeout}
              options={options}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <h3>(s)</h3>
          </div>
          {errors.info?.timeout && (
            <span className="error-msg">{errors.info.timeout.message}</span>
          )}
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="flex gap-3">
          <Checkbox
            id="toneDetect"
            checked={info?.toneDetect}
            onCheckedChange={(checked) =>
              setValue('info.toneDetect', !!checked)
            }
          />
          <Label htmlFor="toneDetect">Tone Detect</Label>
        </div>
        <div className="space-y-3">
          <h3>Tone Dial Timeout</h3>
          <div className="flex items-center space-x-3">
            <Autocomplete
              name="info.toneDialTimeout"
              value={info?.toneDialTimeout}
              options={options}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <h3>(s)</h3>
          </div>
          {errors.info?.toneDialTimeout && (
            <span className="error-msg">
              {errors.info.toneDialTimeout.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Tone Timeout</h3>
          <div className="flex items-center space-x-3">
            <Autocomplete
              name="info.toneTimeout"
              value={info?.toneTimeout}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <h3>(s)</h3>
          </div>
          {errors.info?.toneTimeout && (
            <span className="error-msg">{errors.info.toneTimeout.message}</span>
          )}
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="flex gap-3">
          <Checkbox
            id="info.agent"
            checked={info?.agent}
            onCheckedChange={(checked) => setValue('info..agent', !!checked)}
          />
          <Label htmlFor="info.agent">Agent Call</Label>
        </div>
        <div className="space-y-3">
          <h3>Agent Type</h3>
          <Select
            value={info?.agentType}
            onValueChange={(value) => setValue('info.agentType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AGENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>Media Type</h3>
          <Select
            value={info?.mediaType}
            onValueChange={(value) => setValue('info.mediaType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['Voice'].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.info?.mediaType && (
            <span className="error-msg">{errors.info.mediaType.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>DN Group Name</h3>
          <Autocomplete
            name="info.dnGroupName"
            value={info?.dnGroupName}
            options={options}
            selectOptions={
              // 운영관리와 연동된 데이터가 있다면 “DN Group” 을 리스팅
              []
            }
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
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
        <div className="space-y-3">
          <h3>SIP Relay Header</h3>
          <Autocomplete
            name="info.relayHeader"
            value={info?.relayHeader}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
      </div>
    </div>
  )
}
