'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormInput from '@/app/_components/form-input'
import FormSelect from '@/app/_components/form-select'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { SelectItem } from '@/app/_components/select'
import { useModalId } from '@/contexts/modal-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineMenuStat } from '@/models/define'
import { CatList } from '@/models/property/tracking'
import { useQueryDefines } from '@/services/define'
import { useModalStore } from '@/store/modal'
import { removeDuplicateDefines } from '@/utils/options'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import type { NodePropertyTabProps } from '../node-property/types'

const schema = Yup.object().shape({
  id: Yup.string().required('Category ID를 입력해주세요'),
  condition: Yup.string().required('Condition을 입력해주세요'),
  valueList: Yup.array().required(),
})

type ModalData = {
  mode: 'create' | 'update'
  data?: CatList
}

export default function MenuStatInfoModal({
  tabProps,
  onSubmit,
}: {
  tabProps: NodePropertyTabProps
  onSubmit?: (mode: 'create' | 'update', data: CatList) => void
}) {
  const id = useModalId()
  const [options, _, onValueChange] = useAutocomplete({ ...tabProps })
  const [valueTitles, setValueTitles] = useState<string[]>([])
  const valuesLength = useRef(0)
  const [modalData, closeModal] = useModalStore(
    useShallow((state) => [state.data as ModalData, state.closeModal]),
  )
  const {
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm<CatList>({
    defaultValues: modalData?.data || {
      id: '',
      name: '',
      valueList: Array(9).fill(''),
      condition: '1',
    },
    resolver: yupResolver(schema),
  })

  const watchValueList = watch('valueList')

  const { data: menustats } = useSuspenseQuery({
    ...useQueryDefines<DefineMenuStat>('menustat'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    if (modalData.mode === 'update') {
      const selectedCategory = menustats.find(
        (menustat) => menustat.defineId === modalData.data!.id,
      )!
      setValueTitles(selectedCategory.property.name!)
      const valueList = modalData.data?.valueList
      if (valueList) {
        valuesLength.current = valueList.length || 0
      }
    }
  }, [menustats, modalData])

  const handleValueChange = (value: string) => {
    const selectedCategory = menustats.find(
      (menustat) => menustat.defineId === value,
    )!

    const nameData = selectedCategory.property.name || []
    setValue('name', selectedCategory.property.desc)
    setValue('valueList', Array(9).fill(''))
    valuesLength.current = nameData.length
    setValueTitles(nameData)
  }

  const onSubmitForm = (data: CatList) => {
    closeModal(id)
    reset()
    onSubmit && onSubmit(modalData.mode, data)
  }

  const handleCancelClick = () => {
    closeModal(id)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <ModalContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3>Category ID</h3>
            <FormSelect
              control={control}
              name="id"
              onValueChange={handleValueChange}
            >
              {menustats.map((menustat) => (
                <SelectItem key={menustat.defineId} value={menustat.defineId}>
                  {menustat.defineId}
                </SelectItem>
              ))}
            </FormSelect>
            {errors.id && (
              <span className="error-msg">{errors.id.message}</span>
            )}
            <FormInput
              control={control}
              name="name"
              readOnly={true}
              onChange={() => {}}
            />
          </div>
          {Array(9)
            .fill('')
            .map((_, index) => {
              return (
                <div className="space-y-3" key={index}>
                  <h3>{valueTitles[index] || `Value ${index + 1}`}</h3>
                  <Autocomplete
                    name=""
                    value={watchValueList[index]}
                    options={options}
                    disabled={index >= valuesLength.current}
                    autoFocus={index === 0}
                    onChange={(_, value) => {
                      setValue(`valueList.${index}`, value)
                    }}
                    onValueChange={() =>
                      onValueChange(`valueList.${index}`, watchValueList[index])
                    }
                  />
                </div>
              )
            })}
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
