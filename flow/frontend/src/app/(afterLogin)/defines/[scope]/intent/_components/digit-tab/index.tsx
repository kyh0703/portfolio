'use client'

import FormCheckbox from '@/app/_components/form-checkbox'
import FormInput from '@/app/_components/form-input'
import FormSelect from '@/app/_components/form-select'
import { SelectItem } from '@/app/_components/select'
import { END_KEY_OPTIONS, SAFE_TONE_OPTIONS } from '@/constants/options'
import type { EntityList } from '@/models/define'
import { Separator } from '@/ui/separator'
import { useFormContext, useWatch } from 'react-hook-form'

export default function DigitTab() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EntityList>()
  const watchEndKey = useWatch({ control, name: 'digitInfo.endKey' })

  return (
    <div className="flex h-full w-full">
      <div className="w-full space-y-6 p-6">
        <div className="flex justify-around">
          <FormCheckbox
            control={control}
            name="digitInfo.cdrWrite"
            label="CDR Write"
          />
          <FormCheckbox
            control={control}
            name="digitInfo.encrypt"
            label="Encrypt"
          />
        </div>
        <div className="space-y-3">
          <h3>Length</h3>
          <FormInput control={control} name="digitInfo.length" />
          {errors.digitInfo?.length && (
            <span className="error-msg">{errors.digitInfo.length.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>DTMF Mask</h3>
          <FormInput control={control} name="digitInfo.dtmfMask" />
        </div>
        <div className="space-y-3">
          <h3>End Key</h3>
          <FormSelect control={control} name="digitInfo.endKey">
            {END_KEY_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </FormSelect>
        </div>
        <div className="space-y-3">
          <h3>Error Key</h3>
          <FormSelect
            control={control}
            name="digitInfo.errorKey"
            disabled={!watchEndKey}
          >
            {END_KEY_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </FormSelect>
        </div>
        <div className="space-y-3">
          <h3>Timeout</h3>
          <FormInput control={control} name="digitInfo.timeout" />
          {errors.digitInfo?.timeout && (
            <span className="error-msg">
              {errors.digitInfo.timeout.message}
            </span>
          )}
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="w-full space-y-6 p-6">
        <div className="space-y-3">
          <h3>Inter Timeout</h3>
          <FormInput control={control} name="digitInfo.interTimeout" />
          {errors.digitInfo?.interTimeout && (
            <span className="error-msg">
              {errors.digitInfo.interTimeout.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>SafeTone</h3>
          <FormSelect control={control} name="digitInfo.safeTone">
            {SAFE_TONE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </FormSelect>
        </div>
      </div>
    </div>
  )
}
