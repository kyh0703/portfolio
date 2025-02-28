'use client'

import { Textarea } from '@/ui/textarea'
import {
  useForm,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { Form, FormControl, FormField } from '../form'

export type FormInputProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export default function FormTextarea<T extends FieldValues>({
  control,
  name,
  disabled,
  maxLength,
  ...props
}: FormInputProps<T>) {
  const methods = useForm()

  return (
    <Form {...methods}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormControl>
            <Textarea {...field} {...props} />
          </FormControl>
        )}
      />
    </Form>
  )
}
