'use client'

import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import { NodePropertiesProvider } from '@/contexts/node-properties-context'
import { Separator } from '@/ui/separator'
import { useState } from 'react'
import GeneralTab from '../../node-tabs/expert/general-tab'
import WaitWebInboundTab from '../../node-tabs/expert/wait-web-inbound-tab'
import type { NodePropertyTabProps } from '../types'
import { WAIT_WEB_INBOUND_TAB_SCHEMA } from '../validator'

const schema = WAIT_WEB_INBOUND_TAB_SCHEMA

const tabList = [
  {
    key: 'general',
    label: 'General',
    beginner: false,
  },
  {
    key: 'info',
    label: 'WaitWeb Info',
    beginner: true,
  },
] as const

type TabKeys = (typeof tabList)[number]['key']

const renderTabContent = (props: NodePropertyTabProps) => {
  const tabKeys = props.tabName as TabKeys

  const beginnerTabs: Partial<Record<TabKeys, JSX.Element>> = {
    info: <WaitWebInboundTab {...props} />,
  }

  const expertTabs: Partial<Record<TabKeys, JSX.Element>> = {
    general: <GeneralTab {...props} />,
    info: <WaitWebInboundTab {...props} />,
  }

  return props.flowMode === 'beginner'
    ? beginnerTabs[tabKeys]
    : expertTabs[tabKeys]
}

export default function WaitWebInboundProperty(props: NodePropertyTabProps) {
  const [tabValue, setTabValue] = useState<TabKeys>(() =>
    tabList.some((tab) => tab.key === props.focusTab)
      ? (props.focusTab as TabKeys)
      : 'info',
  )
  const filteredTabs =
    props.flowMode === 'beginner'
      ? tabList.filter((tab) => tab.beginner)
      : tabList

  return (
    <NodePropertiesProvider
      subFlowId={props.subFlowId}
      nodeId={props.databaseId}
      schema={schema}
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
