'use client'

import { Form } from '@/app/_components/form'
import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import { Option } from '@/models/manage'
import { useUpdateOption } from '@/services/option/mutations'
import { useQueryOption } from '@/services/option/queries'
import { useManagementStore } from '@/store/management'
import { Separator } from '@/ui/separator'
import logger from '@/utils/logger'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import BuildTab from './_components/build-tab'
import MentOptionTab from './_components/ment-option'
import MenuFilterTab from './_components/menu-filter'
import SnapshotTab from './_components/snapshot-tab'

const tabMap = {
  build: 'Build',
  snapshot: 'Snapshot',
  mentOption: 'Ment Option',
  menuFilter: 'Menu Filter',
} as const

const renderTabContent = (tabName: string) => {
  switch (tabName) {
    case 'build':
      return <BuildTab />
    case 'snapshot':
      return <SnapshotTab />
    case 'mentOption':
      return <MentOptionTab />
    case 'menuFilter':
      return <MenuFilterTab />
    default:
      return null
  }
}

export default function OptionForm() {
  const [tabValue, setTabValue] = useState('build')
  const setUseSnapshot = useManagementStore((state) => state.setUseSnapshot)

  const { data } = useSuspenseQuery(useQueryOption())
  const form = useForm<Option>({
    defaultValues: data,
  })

  const { handleSubmit, watch } = form
  const watchSnapshotUse = watch('snapShot.use')
  // NOTE: backend에서 api 미구현
  const updateOptionMutate = useUpdateOption({
    onSuccess: () => {
      setUseSnapshot(watchSnapshotUse)
      toast.success('저장되었습니다.')
    },
  })

  const onFormSubmit = (option: Option) => {
    try {
      updateOptionMutate.mutate(option)
    } catch (error) {
      toast.error('Failed to update')
      logger.error(error)
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex h-full w-full overflow-hidden"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <Tabs
          value={tabValue}
          orientation="vertical"
          hiddenArrowButtons
          onChange={(_, value) => setTabValue(value)}
        >
          {Object.entries(tabMap).map(([key, label]) => (
            <Tab key={key} label={label} value={key} align="left" />
          ))}
        </Tabs>
        <Separator orientation="vertical" />
        <div className="flex h-full w-full flex-1 flex-col overflow-auto p-2">
          {Object.entries(tabMap).map(([key]) => (
            <TabPanel key={key} activeTab={tabValue} value={key}>
              {renderTabContent(key)}
            </TabPanel>
          ))}
        </div>
      </form>
    </Form>
  )
}
