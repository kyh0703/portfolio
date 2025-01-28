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
import type { DefineString } from '@/models/define'
import { useAddDefine, useQueryDefines } from '@/services/define'
import { useModalStore } from '@/store/modal'
import type { DefineScope } from '@/types/define'
import { Separator } from '@/ui/separator'
import { removeDuplicateDefines } from '@/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import RepeatPartGrid from '../repeat-part-grid'
import StringPartGrid from '../string-part-grid'

const tabList = ['String Format Part', 'Repeat Part']

const schema = Yup.object().shape({
  id: Yup.string()
    .required('ID를 입력해주세요')
    .matches(REG_EX_VARIABLE_NAME, ERROR_VARIABLE_NAME_MESSAGE),
  name: Yup.string().required('Name을 입력해주세요'),
})

export default function StringRegisterForm({ scope }: { scope: DefineScope }) {
  const router = useRouter()
  const openModal = useModalStore((state) => state.openModal)
  const [tabValue, setTabValue] = useState(0)

  const methods = useForm<DefineString>({
    defaultValues: {
      id: '',
      name: '',
      common: '',
      trim: TRIM_OPTIONS[0],
      stringPart: [],
      rptPart: [],
    },
    resolver: yupResolver(schema),
  })
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods

  const addMutation = useAddDefine<DefineString>('string')

  const { data } = useSuspenseQuery({
    ...useQueryDefines<DefineString>('string'),
    select: (data) => removeDuplicateDefines(data),
  })

  const commonStringIds = useMemo(
    () =>
      data
        .filter((string) => string.property.comFormat)
        .map((string) => string.property.id),
    [data],
  )

  const onSubmit = (data: DefineString) => {
    addMutation.mutate(
      {
        scope,
        type: 'string',
        defineId: data.id,
        data,
      },
      {
        onSuccess: () => router.push(`/defines/${scope}/string`),
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
          <h2>String format definition</h2>
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
              label="Set Common Format"
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
                  <h3>Name</h3>
                  <FormInput control={control} name="name" />
                </div>
              </div>
              <div className="flex gap-7">
                <div className="flex-1 space-y-3">
                  <h3>Common</h3>
                  <FormSelect control={control} name="common">
                    {commonStringIds.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </FormSelect>
                </div>
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
                <div className="flex justify-end">
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
                <StringPartGrid />
              </TabPanel>
              <TabPanel activeTab={tabValue} value={1}>
                <RepeatPartGrid />
              </TabPanel>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
