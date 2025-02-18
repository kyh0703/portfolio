'use client'

import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormInput from '@/app/_components/form-input'
import { Input } from '@/app/_components/input'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import {
  ERROR_DEFINE_VARIABLE_NAME_MESSAGE,
  ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
} from '@/constants/error-message'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefinePacket } from '@/models/define'
import { PacketData } from '@/models/property/packet'
import { useQueryDefines } from '@/services/define'
import { useModalStore } from '@/store/modal'
import { validateVarDefine, validateVarExpression } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../../node-properties/types'

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Name을 입력해주세요')
    .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
  expression: Yup.string()
    .required()
    .test(
      'expression',
      ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
      validateVarExpression,
    ),
  condition: Yup.string().required('Condition을 입력해주세요'),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: PacketData
  rowIndex?: number
}

export default function AssignPacketDataModal({
  tabProps,
  packetId = '',
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  packetId?: string
  onSubmit?: (
    mode: 'create' | 'update',
    data: PacketData,
    rowIndex?: number,
  ) => void
}) {
  const id = useModalId()
  const [options, _, onValueChange] = useAutocomplete({ ...tabProps })
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )

  const {
    watch,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<PacketData>({
    defaultValues: modalData?.data || {
      name: '',
      len: '',
      expression: '',
      condition: '1',
    },
    resolver: yupResolver(schema),
  })
  const watchName = watch('name')

  const { data: packets } = useSuspenseQuery(
    useQueryDefines<DefinePacket>('packet'),
  )
  const nameOptions = useMemo(() => {
    const packet = packets.find((packet) => packet.defineId === packetId)

    const data: string[] = []

    const commonPacketId = packet?.property.common
    const commonPacket = packets.find(
      (packet) => packet.defineId === commonPacketId,
    )
    if (commonPacket) {
      const sndPart = commonPacket?.property.sndPart
        ?.filter((item) => !item.type.includes('Repeat'))
        .map((item) => `common:${item.name}`)
      const rptPart = commonPacket.property.rptPart?.map((item) => {
        return `common repeat:${item.name}[]`
      })
      sndPart && data.push(...sndPart)
      rptPart && data.push(...rptPart)
    }

    data.push(
      ...(packet?.property.sndPart?.map((item) => {
        const isRepeat = item.type.includes('Repeat')
        return `send${isRepeat ? ' repeat' : ''}:${item.name}${isRepeat ? '[]' : ''}`
      }) || []),
    )

    return data
  }, [packets, packetId])

  const onSubmitForm = (data: PacketData) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData.mode, data, modalData.rowIndex)
  }

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  useEffect(() => {
    if (!watchName) {
      return
    }

    let currentName = watchName
    const splitName = watchName.split(':')
    if (splitName.length > 1) {
      currentName = splitName[1]
    }

    const packet = packets.find((packet) => packet.defineId === packetId)

    const commonPacketId = packet?.property.common
    let commonPacket = packets.find(
      (packet) => packet.defineId === commonPacketId,
    )

    const searchPacket = [
      ...(packet?.property.sndPart || []),
      ...(commonPacket?.property.sndPart?.filter(
        (item) => !item.type.includes('Repeat'),
      ) || []),
      ...(commonPacket?.property.rptPart || []),
    ]
    const sndPart = searchPacket?.find((part) => {
      const isRepeat = part.type.includes('Repeat')
      return (
        part.name === (isRepeat ? currentName?.replace('[]', '') : currentName)
      )
    })

    setValue('len', sndPart?.length ? sndPart.length : '')
  }, [packets, packetId, setValue, watchName])

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <ModalContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3>Packet ID</h3>
            <Input value={packetId} readOnly={true} onChange={() => {}} />
          </div>
          <div className="space-y-3">
            <h3>Variable Name</h3>
            <FormAutocomplete
              control={control}
              name="name"
              options={options}
              selectOptions={nameOptions}
              autoFocus
              onValueChange={onValueChange}
            />
            {errors.name && (
              <span className="error-msg">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Length</h3>
            <FormInput
              control={control}
              name="len"
              readOnly={true}
              onChange={() => {}}
            />
          </div>
          <div className="space-y-3">
            <h3>Expression</h3>
            <FormAutocomplete
              control={control}
              name="expression"
              rows={10}
              options={options}
              onValueChange={onValueChange}
            />
            {errors.expression && (
              <span className="error-msg">{errors.expression.message}</span>
            )}
          </div>
          <div className="space-y-3">
            <h3>Condition</h3>
            <FormAutocomplete
              control={control}
              name="condition"
              options={options}
              onValueChange={onValueChange}
            />
            {errors.condition && (
              <span className="error-msg">{errors.condition.message}</span>
            )}
          </div>
        </div>
      </ModalContent>
      <ModalAction>
        <Button variant="error" onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button type="submit">OK</Button>
      </ModalAction>
    </form>
  )
}
