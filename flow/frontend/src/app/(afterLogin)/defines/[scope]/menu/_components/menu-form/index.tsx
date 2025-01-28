'use client'

import { Button } from '@/app/_components/button'
import { Form } from '@/app/_components/form'
import Spinner from '@/app/_components/spinner'
import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import { ERROR_VARIABLE_NAME_MESSAGE } from '@/constants/error-message'
import { REG_EX_VARIABLE_NAME } from '@/constants/regex'
import type { DefineMent, DefineMenu, MenuCheckOption } from '@/models/define'
import { useQueryDefines } from '@/services/define'
import { useQueryAllInFlow } from '@/services/flow'
import {
  useAddMenu,
  useQueryMenu,
  useUpdateMenu,
  useUpdateMenuOption,
  useUpdateMenuTree,
} from '@/services/menu'
import { Separator } from '@/ui/separator'
import { removeDuplicateDefines, removeMainOrEndFlows } from '@/utils'
import logger from '@/utils/logger'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery, useSuspenseQueries } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'
import ChatInfoTab from '../chat-tab'
import MenuOptionTab from '../menu-option-tab'
import MenuTab from '../menu-tab'
import VRActionTab from '../vr-action-tab'
import VRInfoTab from '../vr-info-tab'
import { defaultValues } from './constants'

const schema: Yup.ObjectSchema<DefineMenu, MenuCheckOption> =
  Yup.object().shape({
    id: Yup.string()
      .required('ID is Required')
      .matches(REG_EX_VARIABLE_NAME, ERROR_VARIABLE_NAME_MESSAGE),
    name: Yup.string().required('Name is Required'),
    rootId: Yup.number().required('Root ID is Required'),
    parentId: Yup.number().required('Parent ID is Required'),
    svcCode: Yup.string().optional(),
    dtmf: Yup.string().when('$isRoot', {
      is: (isRoot: boolean) => isRoot,
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required('DTMF is Required'),
    }),
    custom: Yup.boolean().optional(),
    capMent: Yup.object().shape({
      type: Yup.string().when('ment', {
        is: (ment: string) => ment,
        then: (schema) => schema.required('Type is required'),
      }),
    }),
    choiceMent: Yup.object().shape({
      type: Yup.string().when('ment', {
        is: (ment: string) => ment,
        then: (schema) => schema.required('Type is required'),
      }),
    }),
    subFlowName: Yup.string().optional(),
    dtmfMask: Yup.string().optional(),
    length: Yup.string()
      .required('DTFM Length is Required')
      .matches(/^[1-9]\d*$/, '1 이상의 숫자를 입력해주세요.'),
    playIndex: Yup.string().optional(),
    retryDtmf: Yup.string().optional(),
    condition: Yup.string().required('Condition is Required'),
    menuOpt: Yup.object().shape({
      topKey: Yup.string().required('Top Key is Required'),
      upKey: Yup.string().required('Up Key is Required'),
      timeout: Yup.string().required('Timeout is Required'),
      retry: Yup.string().required('Retry is Required'),
    }),
    vrInfo: Yup.object().shape({
      voice: Yup.string().when('$checkOption', {
        is: (checkOption: MenuCheckOption) => checkOption.control?.vr,
        then: (schema) => schema.required('Voice is Required'),
        otherwise: (schema) => schema.optional(),
      }),
      gramList: Yup.array().when('$checkOption', {
        is: (checkOption: MenuCheckOption) => checkOption.control?.vr,
        then: (schema) =>
          schema
            .required('Gram List is required')
            .min(1, 'At least one value is required'),
        otherwise: (schema) => schema.optional(),
      }),
      sttName: Yup.string().when('$checkOption', {
        is: (checkOption: MenuCheckOption) => checkOption.control?.vr,
        then: (schema) => schema.required('STT Name is Required'),
        otherwise: (schema) => schema.optional(),
      }),
      noVoiceTimeout: Yup.string().when('$checkOption', {
        is: (checkOption: MenuCheckOption) => checkOption.control?.vr,
        then: (schema) => schema.required('No Voice Timeout is Required'),
        otherwise: (schema) => schema.optional(),
      }),
      maxTimeout: Yup.string().when('$checkOption', {
        is: (checkOption: MenuCheckOption) => checkOption.control?.vr,
        then: (schema) => schema.required('Max Timeout is Required'),
        otherwise: (schema) => schema.optional(),
      }),
    }),
    vrAct: Yup.object().shape({
      recog: Yup.object().shape({
        highScore: Yup.string().when('$checkOption', {
          is: (checkOption: MenuCheckOption) => checkOption.control?.vr,
          then: (schema) => schema.required('High Score is Required'),
          otherwise: (schema) => schema.optional(),
        }),
        lowScore: Yup.string().when('$checkOption', {
          is: (checkOption: MenuCheckOption) => checkOption.control?.vr,
          then: (schema) => schema.required('Low Score is Required'),
          otherwise: (schema) => schema.optional(),
        }),
      }),
    }),
    chat: Yup.object().shape({
      input: Yup.object().shape({
        timeout: Yup.string().required('Timeout is Required'),
      }),
    }),
  })

type MenuFormProps = {
  scope: string
  checkOption: MenuCheckOption
  rootId: number
  menuId?: number
  onClose?: () => void
}

export default function MenuForm({
  scope,
  checkOption,
  rootId,
  menuId,
  onClose,
}: MenuFormProps) {
  const router = useRouter()
  const [tabValue, setTabValue] = useState(0)

  const { mutateAsync: addMenuMutate } = useAddMenu()
  const { mutateAsync: updateMenuMutate } = useUpdateMenu()
  const { mutateAsync: updateMenuTreeMutate } = useUpdateMenuTree()
  const { mutateAsync: updateMenuOption } = useUpdateMenuOption()

  const { data, isLoading } = useQuery({
    ...useQueryMenu(menuId!),
    enabled: !!menuId,
    select: (data) => data.property,
  })

  const { mentInfos, subFlowList } = useSuspenseQueries({
    queries: [useQueryDefines<DefineMent>('ment'), useQueryAllInFlow()],
    combine: (results) => ({
      mentInfos: removeDuplicateDefines(results[0].data),
      subFlowList: removeMainOrEndFlows(results[1].data.flow),
    }),
  })

  const form = useForm<DefineMenu>({
    defaultValues: data ?? defaultValues,
    resolver: yupResolver<DefineMenu>(schema),
    context: {
      checkOption,
      isRoot: !data || data.parentId === 0,
    },
  })
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  useEffect(() => {
    if (data) {
      reset(data ?? defaultValues)
    }
  }, [data, reset])

  useEffect(() => {
    if (!errors) {
      return
    }
    if (errors.menuOpt) {
      setTabValue(1)
    } else if (errors.vrInfo) {
      setTabValue(2)
    } else if (errors.vrAct) {
      setTabValue(3)
    } else if (errors.chat) {
      setTabValue(4)
    } else {
      setTabValue(0)
    }
  }, [errors])

  if (isLoading) {
    return <Spinner />
  }

  const onFormSubmitUpdate = (data: DefineMenu) => {
    onFormSubmit(data)
  }

  const onFormSubmitOk = (data: DefineMenu) => {
    onFormSubmit(data)
    onClose?.()
  }

  const onFormSubmit = async (data: DefineMenu) => {
    try {
      if (menuId) {
        await updateMenuMutate({
          menuId,
          menu: { ...data, rootId },
        })
      } else {
        const response = await addMenuMutate({
          menu: { ...data, rootId },
        })
        await updateMenuTreeMutate({
          menuId: response.menuId,
          tree: [
            {
              uuid: uuidv4(),
              id: response.menuId,
              name: data.id,
              children: [],
            },
          ],
        })
        await updateMenuOption({
          menuId: response.menuId,
          option: checkOption,
        })
        router.push(`/defines/${scope}/menu/${response.menuId}`)
      }
    } catch (error) {
      toast.error('Failed to update')
      logger.error(error)
    }
  }

  return (
    <Form {...form}>
      <form className="flex h-full w-full overflow-hidden">
        <div className="flex h-full flex-col items-center justify-between p-2">
          <Tabs
            value={tabValue}
            orientation="vertical"
            onChange={(_, value) => setTabValue(value)}
          >
            <Tab label="Menu" value={0} />
            <Tab label="Menu Option" value={1} />
            <Tab
              label="VR Info"
              value={2}
              disabled={!checkOption?.control?.vr}
            />
            <Tab
              label="VR Act"
              value={3}
              disabled={!checkOption?.control?.vr}
            />
            <Tab label="Chat Info" value={4} />
          </Tabs>
          <div className="flex flex-col gap-3">
            {data && (
              <Button
                variant="secondary2"
                onClick={handleSubmit(onFormSubmitUpdate)}
              >
                Update
              </Button>
            )}
            <Button variant="error" onClick={() => onClose?.()}>
              Cancel
            </Button>
            <Button variant="secondary3" onClick={handleSubmit(onFormSubmitOk)}>
              OK
            </Button>
          </div>
        </div>
        <Separator orientation="vertical" />
        <div className="flex h-full w-full flex-1 flex-col overflow-auto p-2">
          <TabPanel activeTab={tabValue} value={0}>
            <MenuTab
              isFirstCreated={!data}
              subFlowList={subFlowList}
              mentInfos={mentInfos}
              checkOption={checkOption}
            />
          </TabPanel>
          <TabPanel activeTab={tabValue} value={1}>
            <MenuOptionTab
              subFlowList={subFlowList}
              mentInfos={mentInfos}
              checkOption={checkOption}
            />
          </TabPanel>
          <TabPanel activeTab={tabValue} value={2}>
            <VRInfoTab checkOption={checkOption} />
          </TabPanel>
          <TabPanel activeTab={tabValue} value={3}>
            <VRActionTab
              subFlowList={subFlowList}
              mentInfos={mentInfos}
              checkOption={checkOption}
            />
          </TabPanel>
          <TabPanel activeTab={tabValue} value={4}>
            <ChatInfoTab />
          </TabPanel>
        </div>
      </form>
    </Form>
  )
}
