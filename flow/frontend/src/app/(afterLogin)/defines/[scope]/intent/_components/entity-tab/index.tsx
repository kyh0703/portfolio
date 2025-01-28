'use client'

import FormAutocomplete from '@/app/_components/form-autocomplete'
import FormCheckbox from '@/app/_components/form-checkbox'
import FormInput from '@/app/_components/form-input'
import FormRadioGroup from '@/app/_components/form-radio-group'
import Label from '@/app/_components/label'
import { RadioGroupItem } from '@/app/_components/radio-group'
import { Separator } from '@/ui/separator'
import { CHOICE_CALL_OPTIONS } from '@/constants/options'
import type { DefineTracking, EntityList } from '@/models/define'
import { useQueryDefines } from '@/services/define'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

export default function EntityTab() {
  const {
    control,
    formState: { errors },
  } = useFormContext<EntityList>()
  const [watchDefault, watchSTTTracking, watchNLUTracking, watchNLUText] =
    useWatch({
      control,
      name: [
        'info.default',
        'info.sttTracking.enable',
        'info.nluTracking.enable',
        'info.nluText',
      ],
    })

  const { data: defineTracking } = useSuspenseQuery({
    ...useQueryDefines<DefineTracking>('track'),
    select: (data) => removeDuplicateDefines(data),
  })

  const sttTrackingOptions = useMemo(
    () =>
      defineTracking
        .filter(
          (define) =>
            define.property.type === '' ||
            define.property.type === 'VoiceRecognize',
        )
        .map((option) => ({
          label: `${option.property.id}-${option.property.name}`,
          value: option.property.id,
        })),
    [defineTracking],
  )

  const nluTrackingOptions = useMemo(
    () =>
      defineTracking
        .filter(
          (define) =>
            define.property.type === '' ||
            define.property.type === 'NLURequest',
        )
        .map((option) => ({
          label: `${option.property.id}-${option.property.name}`,
          value: option.property.id,
        })),
    [defineTracking],
  )

  return (
    <div className="flex h-full w-full">
      <div className="w-full space-y-6 p-6">
        <div className="space-y-3">
          <h3>Entity ID</h3>
          <FormInput control={control} name="info.id" />
          {errors.info?.id && (
            <span className="error-msg">{errors.info.id.message}</span>
          )}
          <h3>Entity Name</h3>
          <FormInput control={control} name="info.name" />
          {errors.info?.name && (
            <span className="error-msg">{errors.info.name.message}</span>
          )}
        </div>
        <Separator />
        <div className="flex w-full gap-3 ">
          <FormRadioGroup
            className="flex w-full justify-around"
            control={control}
            name="info.inputType"
          >
            <div className="flex gap-3">
              <RadioGroupItem value="STT" id="stt" />
              <Label htmlFor="stt">Input Type STT</Label>
            </div>
            <div className="flex gap-3">
              <RadioGroupItem value="DIGIT" id="digit" />
              <Label htmlFor="digit">Input Type Digit</Label>
            </div>
          </FormRadioGroup>
        </div>
        <Separator />
        <div className="space-y-3">
          <FormCheckbox control={control} name="info.default" label="Default" />
          <h3>Value</h3>
          <FormInput
            control={control}
            name="info.value"
            disabled={!watchDefault}
          />
        </div>
        <Separator />
        <div className="space-y-3">
          <h3>Retry</h3>
          <FormInput control={control} name="info.retry" />
          <h3>Choice Call</h3>
          <FormAutocomplete
            control={control}
            name="info.choiceCall"
            selectOptions={CHOICE_CALL_OPTIONS}
          />
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="w-full space-y-6 p-6">
        <div className="w-full space-y-3">
          <FormCheckbox
            control={control}
            name="info.sttTracking.enable"
            label="STT / Digit Tracking"
          />
          <h3>Track ID</h3>
          <div className="flex gap-3">
            <FormAutocomplete
              control={control}
              name="info.sttTracking.id"
              selectOptions={sttTrackingOptions}
              disabled={!watchSTTTracking}
            />
            <FormCheckbox
              control={control}
              name="info.sttTracking.encrypt"
              label="Encrypt"
              disabled={!watchSTTTracking}
            />
          </div>
          <FormInput
            control={control}
            name="info.sttTracking.name"
            readOnly={true}
            disabled
            onChange={() => {}}
          />
        </div>
        <Separator />
        <div className="space-y-3">
          <FormCheckbox
            control={control}
            name="info.nluTracking.enable"
            label="NLU Tracking"
          />
          <h3>Track ID</h3>
          <div className="flex gap-3">
            <FormAutocomplete
              control={control}
              name="info.nluTracking.id"
              selectOptions={nluTrackingOptions}
              disabled={!watchNLUTracking}
            />
            <FormCheckbox
              control={control}
              name="info.nluTracking.encrypt"
              label="Encrypt"
              disabled={!watchNLUTracking}
            />
          </div>
          <FormInput
            control={control}
            name="info.nluTracking.name"
            readOnly={true}
            disabled
            onChange={() => {}}
          />
        </div>
        <Separator />
        <div className="space-y-3">
          <FormCheckbox
            control={control}
            name="info.nluText"
            label="NLU Text"
          />
          <FormInput
            control={control}
            name="info.text"
            disabled={!watchNLUText}
          />
        </div>
      </div>
    </div>
  )
}
