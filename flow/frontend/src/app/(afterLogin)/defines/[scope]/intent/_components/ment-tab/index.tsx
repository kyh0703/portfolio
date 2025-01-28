'use client'

import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormCheckbox from '@/app/_components/form-checkbox'
import { Separator } from '@/ui/separator'
import { RETRY_OPTIONS } from '@/constants/options'
import type { EntityList } from '@/models/define'
import { useFormContext } from 'react-hook-form'
import MentGrid from '../ment-grid'

export default function MentTab() {
  const { control } = useFormContext<EntityList>()

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col space-y-6 p-6">
        <div className="space-y-3">
          <h2>Common</h2>
          <FormCheckbox
            control={control}
            name="mentInfo.common.ttsFailure"
            label="TTS Failure behavior"
          />
          <h3>Retry Index</h3>
          <FormAutocomplete
            control={control}
            name="mentInfo.common.retryIndex"
            selectOptions={RETRY_OPTIONS}
          />
        </div>
        <Separator />
        <MentGrid />
      </div>
      <Separator orientation="vertical" />
      <div className="w-full space-y-6 p-6"></div>
    </div>
  )
}
