'use client'

import { Button } from '@/app/_components/button'
import FormCheckbox from '@/app/_components/form-checkbox'
import FormInput from '@/app/_components/form-input'
import FormSelect from '@/app/_components/form-select'
import { SelectItem } from '@/app/_components/select'
import { LOG_LEVEL_OPTIONS } from '@/constants/options'
import { Option } from '@/models/manage'
import { Separator } from '@/ui/separator'
import { cn } from '@/utils/cn'
import { useFormContext } from 'react-hook-form'

export default function BuildTab() {
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
            <h3 className={cn('text-lg')}>File Encoding</h3>
            <div className="space-y-2">
              <span className="text-gray-450">Encoding Type</span>
              <FormSelect control={control} name="build.encode">
                <SelectItem value="ANSI">ANSI</SelectItem>
                <SelectItem value="UTF-8">UTF-8</SelectItem>
              </FormSelect>
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <h3 className={cn('text-lg')}>Log Options</h3>
            <FormCheckbox
              control={control}
              name="build.logOpt.information"
              label="Information log output"
            />
            <FormCheckbox
              control={control}
              name="build.logOpt.notice"
              label="Notice log output"
            />
            <FormCheckbox
              control={control}
              name="build.logOpt.timeWrite"
              label="Build Time output"
            />
            <FormCheckbox
              control={control}
              name="build.logOpt.unlinkedDigit"
              label="Unconnected digit edge warning log output"
            />
            <FormCheckbox
              control={control}
              name="build.logOpt.unlinkedDefaultDigit"
              label="Unconnected default digit edge warning log output"
            />
            <FormCheckbox
              control={control}
              name="build.logOpt.unlinkedNext"
              label="Unconnected next edge warning log output"
            />
            <div className="space-y-2">
              <span className="text-gray-450">Level</span>
              <FormSelect control={control} name="build.logOpt.level">
                {LOG_LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </FormSelect>
            </div>
          </div>
        </div>
        <Separator orientation="vertical" />
        <div className="shrink-1 flex w-1/2 grow-0 flex-col gap-6 overflow-hidden p-6">
          <div className="space-y-3">
            <h3 className={cn('text-lg')}>Expression Options</h3>
            <FormCheckbox
              control={control}
              name="build.buildOpt.ignoreErrorNotDefVar"
              label="Ignore error for not defined variable"
            />
            <FormCheckbox
              control={control}
              name="build.buildOpt.ignoreErrorPktHeadAndBodyFieldDup"
              label="Ignore packet header and body field duplication"
            />
            <FormCheckbox
              control={control}
              name="build.buildOpt.allowPrevCdrKeyToBeUsed"
              label="Allow previous cdr key to be used"
            />
            <FormCheckbox
              control={control}
              name="build.buildOpt.ignoreVarCreateOrderCheckArraySubsVar"
              label="Ignore variable creation order check for array subscript variable"
            />
          </div>
          <Separator />
          <div className="space-y-3">
            <h3 className={cn('text-lg')}>Tag Options</h3>
            <FormCheckbox
              control={control}
              name="build.tagOpt.stopDgtInAtPrmtPlayErrInGetdigit"
              label="Stop digit input at play error in getdigit node"
            />
            <div className="space-y-2">
              <span className="text-gray-450">VR Start waiting time</span>
              <div className="flex items-center gap-2">
                <FormInput
                  control={control}
                  name="build.tagOpt.vrStartWaitTm"
                  type="number"
                />
                <span className="basis-1/2">(ms)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
