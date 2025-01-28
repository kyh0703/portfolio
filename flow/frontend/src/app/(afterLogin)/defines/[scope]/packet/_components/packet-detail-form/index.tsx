'use client'

import { Button } from '@/app/_components/button'
import { Form } from '@/app/_components/form'
import FormCheckbox from '@/app/_components/form-checkbox'
import FormInput from '@/app/_components/form-input'
import FormSelect from '@/app/_components/form-select'
import { PlusIcon } from '@/app/_components/icon'
import { SelectItem } from '@/app/_components/select'
import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import { ERROR_VARIABLE_NAME_MESSAGE } from '@/constants/error-message'
import { TRIM_OPTIONS } from '@/constants/options'
import { REG_EX_VARIABLE_NAME } from '@/constants/regex'
import type { DefinePacket } from '@/models/define'
import {
  defineKeys,
  useQueryDefine,
  useQueryDefines,
  useUpdateDefine,
} from '@/services/define'
import { useBuildStore } from '@/store/build'
import { useModalStore } from '@/store/modal'
import type { DefineScope } from '@/types/define'
import { Separator } from '@/ui/separator'
import { removeDuplicateDefines } from '@/utils/options'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import useExport from '../../lib/use-export'
import ReceivePartGrid from '../receive-part-grid'
import RepeatPartGrid from '../repeat-part-grid'
import SendPartGrid from '../send-part-grid'

const tabList = ['Send Part', 'Receive Part', 'Repeat Part']

const schema = Yup.object().shape({
  id: Yup.string()
    .required('ID를 입력해주세요')
    .matches(REG_EX_VARIABLE_NAME, ERROR_VARIABLE_NAME_MESSAGE),
  name: Yup.string().required('Name을 입력해주세요'),
})

export default function PacketDetailForm({
  scope,
  databaseId,
}: {
  scope: DefineScope
  databaseId: number
}) {
  const router = useRouter()
  const openModal = useModalStore((state) => state.openModal)
  const isBuilding = useBuildStore(
    useShallow((state) => state.build.isBuilding),
  )
  const [tabValue, setTabValue] = useState(0)
  const { exportExcel } = useExport()

  const queryClient = useQueryClient()
  const updateMutation = useUpdateDefine<DefinePacket>({
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [defineKeys.detail(databaseId)],
      }),
  })

  const { data, packetList } = useSuspenseQueries({
    queries: [
      useQueryDefine<DefinePacket>(databaseId),
      useQueryDefines<DefinePacket>('packet'),
    ],
    combine: (results) => {
      return {
        data: results[0].data,
        packetList: removeDuplicateDefines(results[1].data),
      }
    },
  })

  const methods = useForm<DefinePacket>({
    defaultValues: data.property,
    resolver: yupResolver(schema),
  })
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods
  const [watchComFormat, watchId] = useWatch({
    control,
    name: ['comFormat', 'id'],
  })

  const referencePacketIds = useMemo(
    () =>
      packetList
        .filter(
          (packet) =>
            !packet.property.comFormat && packet.property.common === watchId,
        )
        .map((packet) => packet.property.id),
    [packetList, watchId],
  )

  const commonPacketIds = useMemo(
    () =>
      packetList
        .filter((packet) => packet.property.comFormat)
        .map((packet) => packet.property.id),
    [packetList],
  )

  const onSubmit = (data: DefinePacket) => {
    if (isBuilding) {
      toast.warn('빌드 중에는 편집할 수 없습니다.')
      return
    }
    updateMutation.mutate(
      {
        scope,
        type: 'packet',
        databaseId,
        defineId: data.id,
        data,
      },
      {
        onSuccess: () => router.push(`/defines/${scope}/packet`),
      },
    )
  }

  return (
    <Form {...methods}>
      <form
        className="flex h-full w-full flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between p-6">
          <h2>Packet definition</h2>
          <div className="space-x-3">
            <Button variant="error" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">OK</Button>
          </div>
        </div>
        <Separator />
        <div className="flex h-full flex-col p-6">
          <div className="space-y-6 pb-6">
            <FormCheckbox
              control={control}
              name="comFormat"
              label="Set Common Packet"
            />
            <div className="space-y-6">
              <div className="flex gap-7">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3>ID</h3>
                    {errors.id && (
                      <span className="error-msg">{errors.id.message}</span>
                    )}
                  </div>
                  <FormInput control={control} name="id" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3>Name</h3>
                    {errors.name && (
                      <span className="error-msg">{errors.name.message}</span>
                    )}
                  </div>
                  <FormInput control={control} name="name" />
                </div>
              </div>
              <div className="flex gap-7">
                {watchComFormat ? (
                  <div className="flex-1 space-y-3">
                    <h3>Reference Packet ID</h3>
                    <FormSelect control={control} name="common">
                      {referencePacketIds.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </FormSelect>
                  </div>
                ) : (
                  <div className="flex-1 space-y-3">
                    <h3>Common</h3>
                    <FormSelect control={control} name="common">
                      {commonPacketIds.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </FormSelect>
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <h3>Trim</h3>
                  <FormSelect control={control} name="trim">
                    {TRIM_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </FormSelect>
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex h-full flex-col pt-1">
            <div className="flex items-center justify-between">
              <Tabs
                value={tabValue}
                onChange={(_, value) => setTabValue(value)}
              >
                {tabList.map((label, index) => (
                  <Tab key={label} label={label} value={index} />
                ))}
              </Tabs>
              <div>
                <div className="flex gap-14">
                  <div className="space-x-5">
                    {/* <Button variant="secondary3">Export</Button>
                    <Button variant="secondary3">Import</Button> */}
                  </div>
                  <Button
                    className="flex items-center justify-between"
                    variant="secondary2"
                    onClick={() => openModal('form-modal', { mode: 'create' })}
                  >
                    <PlusIcon width={20} height={20} />
                    Add
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-grow">
              <TabPanel activeTab={tabValue} value={0}>
                <SendPartGrid />
              </TabPanel>
              <TabPanel activeTab={tabValue} value={1}>
                <ReceivePartGrid />
              </TabPanel>
              <TabPanel activeTab={tabValue} value={2}>
                <RepeatPartGrid />
              </TabPanel>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
