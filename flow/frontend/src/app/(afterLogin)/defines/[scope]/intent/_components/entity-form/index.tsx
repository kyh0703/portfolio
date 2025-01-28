'use client'

import { Button } from '@/app/_components/button'
import { Form } from '@/app/_components/form'
import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import type { EntityList } from '@/models/define'
import { useDefineStore } from '@/store/define'
import { Separator } from '@/ui/separator'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import ChatTab from '../chat-tab'
import DigitTab from '../digit-tab'
import EntityTab from '../entity-tab'
import MentTab from '../ment-tab'

const tabMap = {
  info: 'Entity',
  mentInfo: 'Ment',
  digitInfo: 'Digit',
  chatInfo: 'Chat',
} as const

type TabKeys = keyof typeof tabMap

const renderTabContent = (key: TabKeys) => {
  switch (key) {
    case 'info':
      return <EntityTab />
    case 'mentInfo':
      return <MentTab />
    case 'digitInfo':
      return <DigitTab />
    case 'chatInfo':
      return <ChatTab />
    default:
      return null
  }
}

const schema = Yup.object().shape({
  info: Yup.object()
    .shape({
      id: Yup.string().required('ID를 입력해주세요.'),
      name: Yup.string().required('Name을 입력해주세요.'),
    })
    .required(),
  mentInfo: Yup.object().shape({}).required(),
  digitInfo: Yup.object().when('info.inputType', {
    is: (inputType: 'STT' | 'DIGIT') => inputType === 'DIGIT',
    then: (schema) =>
      schema.shape({
        length: Yup.string()
          .required('Length를 입력해주세요.')
          .matches(/^[1-9]\d*$/, '1 이상의 숫자를 입력해주세요.'),
        timeout: Yup.string()
          .required('Timeout을 입력해주세요.')
          .matches(/^[1-9]\d*$/, '1 이상의 숫자를 입력해주세요.'),
        interTimeout: Yup.string()
          .required('InterTimeout을 입력해주세요.')
          .matches(/^[1-9]\d*$/, '1 이상의 숫자를 입력해주세요.'),
      }),
    otherwise: (schema) => schema,
  }),
  chatInfo: Yup.object()
    .shape({
      input: Yup.object().shape({
        timeout: Yup.string().required('Timeout을 입력해주세요.'),
      }),
    })
    .required(),
})

export default function EntityForm({
  onSubmit,
}: {
  onSubmit?: (mode: 'create' | 'update', data: EntityList) => void
}) {
  const [entityData, closeEntityForm] = useDefineStore(
    useShallow((state) => [state.entityData, state.closeEntityForm]),
  )
  const [tabValue, setTabValue] = useState<TabKeys>('info')
  const methods = useForm<EntityList>({
    defaultValues: entityData?.data || {
      info: {
        id: '',
        name: '',
        inputType: 'STT',
        retry: 1,
        choiceCall: '',
        sttTracking: {
          enable: false,
          encrypt: false,
          id: '',
          name: '',
        },
        nluTracking: {
          enable: false,
          encrypt: false,
          id: '',
          name: '',
        },
        nluText: false,
        text: '',
      },
      mentInfo: {
        common: {
          ttsFailure: false,
          retryIndex: '',
        },
        ment: [],
      },
      digitInfo: {
        cdrWrite: false,
        encrypt: false,
        length: '1',
        dtmfMask: '',
        endKey: '',
        errorKey: '',
        timeout: '5',
        interTimeout: '5',
        safeTone: '',
      },
      chatInfo: {
        output: {
          category: [
            { categoryName: 'QUESTION', expressionCode: '', codeData: [] },
            { categoryName: 'TIMEOUT', expressionCode: '', codeData: [] },
            { categoryName: 'FAIL', expressionCode: '', codeData: [] },
            { categoryName: 'RETRY', expressionCode: '', codeData: [] },
          ],
        },
        input: {
          timeout: '60',
        },
      },
    },
    resolver: yupResolver<EntityList>(schema),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods
  const watchInputType = useWatch({ control, name: 'info.inputType' })

  useEffect(() => {
    if (!errors) {
      return
    }
    if (errors.info) {
      setTabValue('info')
    } else if (errors.mentInfo) {
      setTabValue('mentInfo')
    } else if (errors.digitInfo) {
      setTabValue('digitInfo')
    } else if (errors.chatInfo) {
      setTabValue('chatInfo')
    }
  }, [errors])

  const onFormSubmit = (data: EntityList) => {
    closeEntityForm()
    onSubmit && onSubmit(entityData!.mode, data)
  }

  return (
    <Form {...methods}>
      <form
        className="absolute left-0 top-0 z-30 flex h-full w-full flex-col overflow-auto bg-background"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <div className="flex items-center justify-between p-6">
          <h2>Intent definition</h2>
          <div className="space-x-3">
            <Button variant="error" onClick={() => closeEntityForm()}>
              Cancel
            </Button>
            <Button type="submit">OK</Button>
          </div>
        </div>
        <Separator />
        <div className="flex flex-grow flex-col gap-6 p-6">
          <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
            {Object.entries(tabMap).map(([key, label]) => (
              <Tab
                key={key}
                label={label}
                value={key}
                disabled={label === 'Digit' && watchInputType !== 'DIGIT'}
              />
            ))}
          </Tabs>
        </div>
        <Separator />
        <div className="h-full w-full">
          {Object.entries(tabMap).map(([key]) => (
            <TabPanel key={key} activeTab={tabValue} value={key}>
              {renderTabContent(key as TabKeys)}
            </TabPanel>
          ))}
        </div>
      </form>
    </Form>
  )
}
