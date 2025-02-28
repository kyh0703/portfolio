'use client'

import { Select, SelectContent, SelectTrigger, SelectValue } from '@/ui/select'
import type { SelectProps } from '@radix-ui/react-select'
import type { PropsWithChildren } from 'react'
import {
  useForm,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '../form'

export type FormSelectProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  className?: string
  placeholder?: string
  onValueChange?: (value: string) => void
} & SelectProps &
  PropsWithChildren

export default function FormSelect<T extends FieldValues>({
  control,
  name,
  className,
  placeholder,
  children,
  onValueChange,
  ...props
}: FormSelectProps<T>) {
  const methods = useForm()

  return (
    <Form {...methods}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="w-full">
            <Select
              key={field.value}
              defaultValue={field.value}
              onValueChange={(value) => {
                onValueChange && onValueChange(value)
                field.onChange(value === '\u00A0' ? '' : value)
              }}
              {...props}
            >
              <FormControl>
                <SelectTrigger className={className}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>{children}</SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </Form>
  )
}
