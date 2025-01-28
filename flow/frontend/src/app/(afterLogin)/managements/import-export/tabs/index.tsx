'use client'

import { Separator } from '@/ui/separator'
import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import { cn } from '@/utils/cn'
import { useState } from 'react'
import DownloadTab from './download'
import ExportTab from './export'
import ImportTab from './import'

type TabList = 'Import' | 'Export' | 'Download'
const tabList: TabList[] = ['Import', 'Export', 'Download']

const renderTabContent = (tab: string) => {
  switch (tab) {
    case 'Import':
      return <ImportTab />
    case 'Export':
      return <ExportTab />
    case 'Download':
      return <DownloadTab />
    default:
      return null
  }
}

export default function ImportExportTab() {
  const [tabValue, setTabValue] = useState<TabList>('Import')

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between gap-6 p-6">
        <h2 className={cn('text-gray-550')}>Import / Export</h2>
      </div>
      <Separator />
      <div className="flex items-center justify-between border border-b-2">
        <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
          {tabList.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              value={tab}
              className="!w-40 grow-0 items-center"
            />
          ))}
        </Tabs>
      </div>
      <div className="flex-1 overflow-auto">
        {tabList.map((tab) => (
          <TabPanel key={tab} activeTab={tabValue} value={tab}>
            {renderTabContent(tab)}
          </TabPanel>
        ))}
      </div>
    </div>
  )
}
