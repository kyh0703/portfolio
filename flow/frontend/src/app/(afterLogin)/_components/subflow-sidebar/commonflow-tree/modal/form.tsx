import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import {
  ERROR_VARIABLE_NAME_MESSAGE,
  ERROR_VERSION_MESSAGE,
} from '@/constants/error-message'
import { REG_EX_VARIABLE_NAME, REG_EX_VERSION } from '@/constants/regex'
import { cn } from '@/utils/cn'
import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { CommonFlowAddFormType } from '.'

type PropData = {
  name?: string
  version?: string
  onSubmit: (data: CommonFlowAddFormType) => void
} & Omit<ComponentProps<'form'>, 'onSubmit'>

export default function FlowAddForm({
  className,
  name,
  version,
  onSubmit,
}: PropData) {
  const schema = Yup.object().shape({
    name: Yup.string()
      .required('Name을 입력해주세요.')
      .matches(REG_EX_VARIABLE_NAME, ERROR_VARIABLE_NAME_MESSAGE),
    version: Yup.string()
      .required('Version을 입력해주세요.')
      .matches(REG_EX_VERSION, ERROR_VERSION_MESSAGE)
      .test((v) => v !== version),
  })
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    name: string
    version: string
  }>({
    defaultValues: {
      name: name || '',
      version: version || '',
    },
    resolver: yupResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cn('flex items-center justify-between p-2 pb-4 gap-1', className)}>
        <FormInput control={control} name="name" placeholder="Name" />
        <FormInput control={control} name="version" placeholder="Version" />
        <Button variant="secondary2" type="submit">
          Add
        </Button>
      </div>
      {errors.name ? (
        <span className="error-msg">{errors.name.message}</span>
      ) : (
        errors.version && (
          <span className="error-msg">{errors.version.message}</span>
        )
      )}
    </form>
  )
}
