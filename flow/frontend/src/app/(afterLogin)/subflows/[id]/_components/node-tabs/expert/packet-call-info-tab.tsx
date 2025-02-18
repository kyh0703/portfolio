'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import { Checkbox } from '@/app/_components/checkbox'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import {
  CHOICE_CALL_OPTIONS,
  PACKET_TYPE_OPTIONS,
  TIMEOUT_OPTIONS_30,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefinePacket, type DefineMent } from '@/models/define'
import { PacketCallInfo } from '@/models/property/packet'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function PacketCallInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const packetInfo = getValues(props.tabName) as PacketCallInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const [mentDesc, setMentDesc] = useState<string>()

  const router = useRouter()

  const { packets, ments } = useSuspenseQueries({
    queries: [
      useQueryDefines<DefinePacket>('packet'),
      useQueryDefines<DefineMent>('ment'),
    ],
    combine: (results) => ({
      packets: removeDuplicateDefines(results[0].data),
      ments: removeDuplicateDefines(results[1].data),
    }),
  })

  useEffect(() => {
    const packet = packets.find(
      (packet) => packet.defineId === packetInfo?.packetId,
    )
    setValue('packetInfo.packetName', packet?.property.name || '')
  }, [packetInfo?.packetId, packets, setValue])

  useEffect(() => {
    const ment = ments?.find((ment) => `'${ment.defineId}'` === packetInfo?.bgm)
    setMentDesc(ment?.property.desc || '')
  }, [ments, packetInfo?.bgm])

  const handleMoveClick = useCallback(() => {
    const packet = packets.find(
      (packet) => packet.defineId === packetInfo?.packetId,
    )!
    if (packet) {
      router.push(`/defines/${packet.scope}/packet/${packet.id}`)
    }
  }, [packets, router, packetInfo?.packetId])

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <div className="flex gap-3">
          <Checkbox
            id="authPacket"
            checked={packetInfo?.authPacket}
            onCheckedChange={(checked) =>
              setValue('packetInfo.authPacket', !!checked)
            }
          />
          <Label htmlFor="authPacket">Authentication Packet</Label>
        </div>
      </div>
      <div className="space-y-3">
        <h3>Name</h3>
        <Autocomplete
          name="packetInfo.name"
          value={packetInfo?.name}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.packetInfo?.name && (
          <span className="error-msg">{errors.packetInfo.name.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Transaction ID</h3>
        <Autocomplete
          name="packetInfo.transId"
          value={packetInfo?.transId}
          options={options}
          selectOptions={
            []
            // TODO: 운영관리 TB Adaptor에서 원하는 ID를 입력한다
          }
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.packetInfo?.transId && (
          <span className="error-msg">{errors.packetInfo.transId.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Packet ID</h3>
        <div className="flex items-center space-x-3">
          <Autocomplete
            name="packetInfo.packetId"
            value={packetInfo?.packetId}
            options={options}
            selectOptions={packets.map((packet) => packet.defineId)}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          <Button
            variant="secondary3"
            disabled={!packetInfo?.packetId}
            onClick={handleMoveClick}
          >
            Move
          </Button>
        </div>
        {errors.packetInfo?.packetId && (
          <span className="error-msg">
            {errors.packetInfo.packetId.message}
          </span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Packet Name</h3>
        <Input
          value={packetInfo?.packetName}
          readOnly={true}
          onChange={() => {}}
        />
      </div>
      <div className="space-y-3">
        <h3>Packet Type</h3>
        <Autocomplete
          name="packetInfo.type"
          value={packetInfo?.type}
          options={options}
          selectOptions={PACKET_TYPE_OPTIONS}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.packetInfo?.type && (
          <span className="error-msg">{errors.packetInfo.type.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Timeout</h3>
        <Autocomplete
          name="packetInfo.timeout"
          value={packetInfo?.timeout}
          options={options}
          selectOptions={TIMEOUT_OPTIONS_30}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.packetInfo?.timeout && (
          <span className="error-msg">{errors.packetInfo.timeout.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Choice Call, for BGM</h3>
        <Autocomplete
          name="packetInfo.choiceCall"
          value={packetInfo?.choiceCall}
          options={options}
          selectOptions={CHOICE_CALL_OPTIONS}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.packetInfo?.choiceCall && (
          <span className="error-msg">
            {errors.packetInfo.choiceCall.message}
          </span>
        )}
      </div>
      <div className="space-y-3">
        <h3>BGM</h3>
        <div className="flex items-center justify-between gap-3">
          <Autocomplete
            name="packetInfo.bgm"
            value={packetInfo?.bgm}
            options={options}
            selectOptions={ments.map((ment) => ({
              label: `'${ment.defineId}' - "${ment.property.desc}"`,
              value: `'${ment.defineId}'`,
            }))}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <Input value={mentDesc} readOnly={true} onChange={() => {}} />
        {errors.packetInfo?.bgm && (
          <span className="error-msg">{errors.packetInfo.bgm.message}</span>
        )}
      </div>
      <div className="space-y-3">
        <h3>Condition</h3>
        <Autocomplete
          name="packetInfo.condition"
          value={packetInfo?.condition}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
        {errors.packetInfo?.condition && (
          <span className="error-msg">
            {errors.packetInfo.condition.message}
          </span>
        )}
      </div>
    </div>
  )
}
