'use client'

import { Button } from '@/app/_components/button'
import FormCheckbox from '@/app/_components/form-checkbox'
import { Separator } from '@/ui/separator'
import { Option } from '@/models/manage'
import { cn } from '@/utils'
import { useFormContext } from 'react-hook-form'

export default function SnapshotTab() {
  const { control } = useFormContext<Option>()

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-end gap-6 p-3">
        <Button type="submit">Save</Button>
      </div>
      <Separator />
      <div className="p-6">
        <div className="space-y-3">
          <h3 className={cn('text-lg')}>Snapshot Options</h3>
          <FormCheckbox
            control={control}
            name="snapShot.use"
            label="Use Snapshot"
          />
        </div>
      </div>
    </div>
  )
}
