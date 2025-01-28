'use client'

import { Button } from '@/app/_components/button'
import FormInput from '@/app/_components/form-input'
import { Option } from '@/models/manage'
import { Separator } from '@/ui/separator'
import { cn } from '@/utils/cn'
import { useFormContext } from 'react-hook-form'

export default function MentOptionTab() {
  const { control } = useFormContext<Option>()

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-end gap-6 p-3">
        <Button type="submit">Save</Button>
      </div>
      <Separator />
      <div className="flex w-full flex-col flex-wrap overflow-y-auto overflow-x-hidden">
        <div className="shrink-1 flex w-1/2 grow-0 flex-col gap-6 p-6">
          <div className="space-y-3">
            <h3 className={cn('text-lg')}>Multi Ment</h3>
            <div className="space-y-2">
              <span className="text-gray-450">MT 1</span>
              <FormInput control={control} name="multiMent.mt1" />
            </div>
            <div className="space-y-2">
              <span className="text-gray-450">MT 2</span>
              <FormInput control={control} name="multiMent.mt2" />
            </div>
            <div className="space-y-2">
              <span className="text-gray-450">MT 3</span>
              <FormInput control={control} name="multiMent.mt3" />
            </div>
            <div className="space-y-2">
              <span className="text-gray-450">MT 4</span>
              <FormInput control={control} name="multiMent.mt4" />
            </div>
            <div className="space-y-2">
              <span className="text-gray-450">MT 5</span>
              <FormInput control={control} name="multiMent.mt5" />
            </div>
          </div>
        </div>
        <Separator orientation="vertical" />
        <div className="shrink-1 flex w-1/2 grow-0 flex-col gap-6 overflow-hidden p-6">
          <div className="space-y-3">
            <h3 className={cn('text-lg')}>Ment Play</h3>
            <div className="space-y-2">
              <span className="text-gray-450">Path</span>
              <FormInput control={control} name="mentPlay.path" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
