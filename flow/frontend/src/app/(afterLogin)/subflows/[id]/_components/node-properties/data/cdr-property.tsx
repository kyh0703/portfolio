'use client'

import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import { NodePropertiesProvider } from '@/contexts/node-properties-context'
import { Separator } from '@/ui/separator'
import { useState } from 'react'
import BeginnerCdrDataListTab from '../../node-tabs/beginner/cdr-data-list-tab'
import CdrDataListTab from '../../node-tabs/expert/cdr-data-list-tab'
import GeneralTab from '../../node-tabs/expert/general-tab'
import type { NodePropertyTabProps } from '../types'

const tabList = [
  {
    key: 'general',
    label: 'General',
    beginner: false,
  },
  {
    key: 'dataList',
    label: 'CDR Data List',
    beginner: true,
  },
] as const

type TabKeys = (typeof tabList)[number]['key']

const renderTabContent = (props: NodePropertyTabProps) => {
  const tabKeys = props.tabName as TabKeys

  const beginnerTabs: Partial<Record<TabKeys, JSX.Element>> = {
    dataList: <BeginnerCdrDataListTab {...props} />,
  }

  const expertTabs: Partial<Record<TabKeys, JSX.Element>> = {
    general: <GeneralTab {...props} />,
    dataList: <CdrDataListTab {...props} />,
  }

  return props.flowMode === 'beginner'
    ? beginnerTabs[tabKeys]
    : expertTabs[tabKeys]
}

export default function CdrProperty(props: NodePropertyTabProps) {
  const [tabValue, setTabValue] = useState<TabKeys>(() =>
    tabList.some((tab) => tab.key === props.focusTab)
      ? (props.focusTab as TabKeys)
      : 'dataList',
  )
  const filteredTabs =
    props.flowMode === 'beginner'
      ? tabList.filter((tab) => tab.beginner)
      : tabList

  return (
    <NodePropertiesProvider
      subFlowId={props.subFlowId}
      nodeId={props.databaseId}
    >
      <div className="flex h-full w-full flex-col whitespace-nowrap">
        <div className="flex h-property-title items-center px-6 py-3 font-semibold">
          {`${props.nodeId} > ${tabList.find((tab) => tab.key === tabValue)?.label}`}
        </div>
        <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
          {filteredTabs.map(({ key, label }) => (
            <Tab key={key} label={label} value={key} />
          ))}
        </Tabs>
        <Separator />
        <div className="flex-1 overflow-auto">
          {filteredTabs.map(({ key }) => (
            <TabPanel key={key} activeTab={tabValue} value={key}>
              {renderTabContent({ ...props, tabName: key })}
            </TabPanel>
          ))}
        </div>
      </div>
    </NodePropertiesProvider>
  )
}
