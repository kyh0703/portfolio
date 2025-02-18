'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import { Checkbox } from '@/app/_components/checkbox'
import Label from '@/app/_components/label'
import { SCORE_OPTIONS_100 } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useAutocomplete from '@/hooks/use-autocomplete'
import useValidate from '@/hooks/use-validation'
import type { RecognizeActInfo } from '@/models/property/telephony'
import {
  useAddSubFlow,
  useQueryAllInFlow,
  useUpdateSubFlow,
} from '@/services/flow'
import { Separator } from '@/ui/separator'
import { removeMainOrEndFlows } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { NodePropertyTabProps } from '../../node-properties/types'

const ARGUMENT_INFO = {
  prev: {
    in: { param: [{ name: 'iprm_envid', value: '' }] },
    out: {
      arg: [
        'ioprm_bargein',
        'ioprm_timer',
        'ioprm_novoicetimeout',
        'ioprm_maxtimeout',
        'ioprm_grammar',
      ],
    },
  },
  next: {
    in: {
      param: [
        { name: 'iprm_envid', value: '' },
        { name: 'iprm_retrycnt', value: '' },
        { name: 'iprm_hightscore', value: '' },
        { name: 'iprm_lowscore', value: '' },
        { name: 'iprm_vrcmdresult', value: '' },
        { name: 'iprm_vrcmdreason', value: '' },
        { name: 'iprm_restrype', value: '' },
        { name: 'iprm_vrresult', value: '' },
        { name: 'iprm_vrspeech', value: '' },
        { name: 'iprm_vrrate', value: '' },
        { name: 'iprm_term_digit', value: '' },
        { name: 'iprm_confirm', value: '' },
      ],
    },
    out: {
      arg: ['iprm_cnt', 'ioprm_digit', 'ioprm_cmd_value'],
    },
  },
}

export default function VRActionTab(props: NodePropertyTabProps) {
  const router = useRouter()
  const { getValues, setValue } = useNodePropertiesContext()
  const vrAct = getValues(props.tabName) as RecognizeActInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const { validateSubFlow } = useValidate()

  const [prevSetParam, setPrevSetParam] = useState<boolean>(false)
  const [nextSetParam, setNextSetParam] = useState<boolean>(false)

  const { data: inflows } = useSuspenseQuery({
    ...useQueryAllInFlow(),
    select: (data) => removeMainOrEndFlows(data.flow),
  })
  const addSubFlowMutation = useAddSubFlow()
  const updateSubFlowMutation = useUpdateSubFlow()
  const inflowOptions = useMemo(() => inflows.map((opt) => opt.name), [inflows])

  const handleOpenClick = (type: 'prev' | 'next', setParams?: boolean) => {
    let flowName =
      type === 'prev' ? vrAct?.prevSubCall : vrAct?.nextSubCall.scnName
    const existingSubFlow = inflows.find((flow) => flow.name === flowName)

    if (!existingSubFlow) {
      toast.warn('존재하지 않는 SubFlow 입니다.')
      return
    }
    if (!setParams) {
      router.push(`/subflows/${existingSubFlow.id}`)
      return
    }
    updateSubFlowMutation.mutate(
      {
        subFlowId: existingSubFlow.id,
        updateSubFlow: {
          name: existingSubFlow.name,
          desc: existingSubFlow.desc,
          args: ARGUMENT_INFO[type],
          updateDate: new Date(),
        },
      },
      {
        onSuccess: (res) => {
          if (res) {
            router.push(`/subflows/${existingSubFlow.id}`)
          }
        },
      },
    )
  }

  const handleCreateClick = async (
    type: 'prev' | 'next',
    setParams?: boolean,
  ) => {
    const flowName =
      type === 'prev' ? vrAct?.prevSubCall : vrAct?.nextSubCall.scnName

    if (!validateSubFlow(flowName!)) {
      return
    }

    const isExistingSubFlow = inflows.some((flow) => flow.name === flowName)

    if (isExistingSubFlow) {
      toast.warn('이미 존재하는 SubFlow 입니다.')
      return
    }

    const defaultArgs = { in: { param: [] }, out: { arg: [] } }
    const args = setParams ? ARGUMENT_INFO[type] : defaultArgs

    addSubFlowMutation.mutate(
      {
        name: flowName!,
        version: '1.1.1',
        desc: '',
        args,
        updateDate: new Date(),
      },
      {
        onSuccess: (res) => {
          if (res) {
            router.push(`/subflows/${res.flowId}`)
          }
        },
      },
    )
  }

  return (
    <div className="flex h-full w-full flex-col space-y-6">
      <div className="space-y-3 px-6 pt-6">
        <div className="flex gap-3">
          <Checkbox
            id="enable"
            checked={vrAct?.enable}
            onCheckedChange={(checked) => setValue('vrAct.enable', !!checked)}
          />
          <Label htmlFor="enable">Use VR Action</Label>
        </div>
      </div>
      <Separator />
      <div className="space-y-3 px-6">
        <h3>Environment ID</h3>
        <Autocomplete
          name="vrAct.envID"
          value={vrAct?.envID}
          options={options}
          onChange={setValue}
          onValueChange={onValueChange}
        />
      </div>
      <Separator />
      <div className="space-y-3 px-6">
        <h3>Prev SubCall</h3>
        <div className="flex gap-1.5">
          <Autocomplete
            name="vrAct.prevSubCall"
            value={vrAct?.prevSubCall}
            options={options}
            selectOptions={inflowOptions}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          <Button
            className="flex-shrink-0"
            variant="secondary3"
            disabled={!vrAct?.prevSubCall}
            onClick={() => handleOpenClick('prev')}
          >
            Open
          </Button>
          <Button
            className="flex-shrink-0"
            variant="secondary3"
            disabled={!vrAct?.prevSubCall}
            onClick={() => handleCreateClick('prev')}
          >
            Create
          </Button>
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="c1"
            checked={prevSetParam}
            disabled={!vrAct?.prevSubCall}
            onCheckedChange={(checked) => setPrevSetParam(!!checked)}
          />
          <Label htmlFor="c1">Set Param</Label>
        </div>
        {prevSetParam && (
          <>
            <div className="flex items-center gap-1.5">
              <Button
                className="flex-grow"
                variant="secondary3"
                disabled={!vrAct?.prevSubCall}
                onClick={() => handleOpenClick('prev', true)}
              >
                Open + Set Param
              </Button>
              <Button
                className="flex-grow"
                variant="secondary3"
                disabled={!vrAct?.prevSubCall}
                onClick={() => handleCreateClick('prev', true)}
              >
                Create + Set Param
              </Button>
            </div>
            <div className="rounded-md border border-[#CED4DA]  px-3 py-2 font-poppins">
              <h3 className="text-[14px] font-medium text-blue-850">
                [In Param]
              </h3>
              {ARGUMENT_INFO.next.in.param.map(({ name }, index) => (
                <h5 key={index} className="text-[14px] font-normal text-brown">
                  {name}
                </h5>
              ))}
              &nbsp;
              <h3 className="text-[14px] font-medium text-blue-850">
                [Out Param]
              </h3>
              {ARGUMENT_INFO.next.out.arg.map((text, index) => (
                <h5 key={index} className="text-[14px] font-normal text-brown">
                  {text}
                </h5>
              ))}
            </div>
          </>
        )}
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>Next SubCall</h3>
          <div className="flex gap-1.5">
            <div className="flex-1">
              <Autocomplete
                name="vrAct.nextSubCall.scnName"
                value={vrAct?.nextSubCall.scnName}
                options={options}
                selectOptions={inflowOptions}
                disabled={!vrAct?.enable}
                onChange={setValue}
                onValueChange={onValueChange}
              />
            </div>
            <Button
              className="flex-shrink"
              variant="secondary3"
              disabled={!vrAct?.nextSubCall.scnName}
              onClick={() => handleOpenClick('next')}
            >
              Open
            </Button>
            <Button
              className="flex-shrink"
              variant="secondary3"
              disabled={!vrAct?.nextSubCall.scnName}
              onClick={() => handleCreateClick('next')}
            >
              Create
            </Button>
          </div>
          <div className="flex gap-3">
            <Checkbox
              id="c2"
              checked={nextSetParam}
              disabled={!vrAct?.nextSubCall.scnName}
              onCheckedChange={(checked) => setNextSetParam(!!checked)}
            />
            <Label htmlFor="c2">Set Param</Label>
          </div>
          {nextSetParam && (
            <>
              <div className="flex items-center gap-1.5">
                <Button
                  className="w-full flex-grow basis-2/4"
                  variant="secondary3"
                  disabled={!vrAct?.nextSubCall.scnName}
                  onClick={() => handleOpenClick('next', true)}
                >
                  Open + Set Param
                </Button>
                <Button
                  className="w-full flex-grow basis-2/4"
                  variant="secondary3"
                  disabled={!vrAct?.nextSubCall.scnName}
                  onClick={() => handleCreateClick('next', true)}
                >
                  Create + Set Param
                </Button>
              </div>
              <div className="rounded-md border border-[#CED4DA]  px-3 py-2 font-poppins">
                <h3 className="text-[14px] font-medium text-blue-850">
                  [In Param]
                </h3>
                {ARGUMENT_INFO.next.in.param.map(({ name }, index) => (
                  <h5
                    key={index}
                    className="text-[14px] font-normal text-brown"
                  >
                    {name}
                  </h5>
                ))}
                &nbsp;
                <h3 className="text-[14px] font-medium text-blue-850">
                  [Out Param]
                </h3>
                {ARGUMENT_INFO.next.out.arg.map((text, index) => (
                  <h5
                    key={index}
                    className="text-[14px] font-normal text-brown"
                  >
                    {text}
                  </h5>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="space-y-3">
          <h3>Confidence High/Log</h3>
          <div className="flex items-baseline gap-3">
            <Autocomplete
              name="vrAct.nextSubCall.confidence.high"
              value={vrAct?.nextSubCall.confidence.high}
              options={options}
              selectOptions={SCORE_OPTIONS_100}
              disabled={!vrAct?.enable}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <span className="text-xl">/</span>
            <Autocomplete
              name="vrAct.nextSubCall.confidence.low"
              value={vrAct?.nextSubCall.confidence.low}
              options={options}
              selectOptions={SCORE_OPTIONS_100}
              disabled={!vrAct?.enable}
              onChange={setValue}
              onValueChange={onValueChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
