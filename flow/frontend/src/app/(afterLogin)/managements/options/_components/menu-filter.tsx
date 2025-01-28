'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import { Option } from '@/models/manage'
import { Separator } from '@/ui/separator'
import { useFormContext } from 'react-hook-form'

export default function MenuFilterTab() {
  const { control } = useFormContext<Option>()

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-end gap-6 p-3">
        <Button type="submit">Save</Button>
      </div>
      <Separator />
      <div className="overflow-y-auto overflow-x-hidden p-6">
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <div className="space-y-2" key={index}>
              <span className="text-gray-450">Filter {index + 1}</span>
              <FormInput
                control={control}
                name={`menuFilter.filter${index + 1}` as keyof Option}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
