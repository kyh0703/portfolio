'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefinePacket } from '@/models/define'
import { PacketSizeInfo } from '@/models/property/packet'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { getDefinePath } from '@/utils/route-path'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function PacketSizeInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const packetInfo = getValues(props.tabName) as PacketSizeInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const router = useRouter()

  const { data: packets } = useSuspenseQuery({
    ...useQueryDefines<DefinePacket>('packet'),
    select: (data) => removeDuplicateDefines(data),
  })

  const handleMoveButtonClick = () => {
    const packet = packets.find(
      (packet) => packet.defineId === packetInfo?.packetId,
    )!
    router.push(getDefinePath(packet.scope, 'packet', packet.id))
  }

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
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
            onClick={handleMoveButtonClick}
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
