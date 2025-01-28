'use client'

import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormCheckbox from '@/app/_components/form-checkbox'
import FormInput from '@/app/_components/form-input'
import { Separator } from '@/ui/separator'
import type { DefineMenu, MenuCheckOption } from '@/models/define'
import { useFormContext } from 'react-hook-form'
import VRInfoGrid from '../vr-info-grid'

type VRInfoTabProps = {
  checkOption: MenuCheckOption
}

export default function VRInfoTab({ checkOption }: VRInfoTabProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<DefineMenu>()

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col space-y-6 p-6">
        <div className="space-y-3">
          <h3>Voice Value</h3>
          <FormInput control={control} name="vrInfo.voice" />
          {errors.vrInfo?.voice && (
            <span className="error-msg">{errors.vrInfo.voice.message}</span>
          )}
        </div>
        <Separator />
        <div className="flex h-full flex-col space-y-3">
          <h2>Grammar</h2>
          <VRInfoGrid />
          {errors.vrInfo?.gramList && (
            <span className="error-msg">{errors.vrInfo.gramList.message}</span>
          )}
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="w-full space-y-6 p-6">
        <div className="space-y-3">
          <FormCheckbox
            control={control}
            name="vrInfo.bargeIn"
            label="Barge-In"
          />
          <h3>STT Name</h3>
          <FormAutocomplete control={control} name="vrInfo.sttName" />
          {errors.vrInfo?.sttName && (
            <span className="error-msg">{errors.vrInfo.sttName.message}</span>
          )}
          <FormCheckbox
            control={control}
            name="vrInfo.startTimer"
            label="Set Timer"
          />
          <h3>No Voice Timeout</h3>
          <FormInput control={control} name="vrInfo.noVoiceTimeout" />
          {errors.vrInfo?.noVoiceTimeout && (
            <span className="error-msg">
              {errors.vrInfo.noVoiceTimeout.message}
            </span>
          )}
          <h3>Max Timeout</h3>
          <FormInput control={control} name="vrInfo.maxTimeout" />
          {errors.vrInfo?.maxTimeout && (
            <span className="error-msg">
              {errors.vrInfo.maxTimeout.message}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
