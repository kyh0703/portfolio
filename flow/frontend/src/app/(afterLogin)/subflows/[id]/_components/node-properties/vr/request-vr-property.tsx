'use client'

import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import { NodePropertiesProvider } from '@/contexts/node-properties-context'
import { useOptionsStateSynced } from '@/hooks/use-options-state-synced'
import { Separator } from '@/ui/separator'
import { useState } from 'react'
import * as Yup from 'yup'
import ChatInfoTab from '../../node-tabs/expert/chat-info-tab'
import GeneralTab from '../../node-tabs/expert/general-tab'
import MentInfoTab from '../../node-tabs/expert/ment-info-tab'
import RecognizeInfoTab from '../../node-tabs/expert/recognize-info-tab'
import TrackingTab from '../../node-tabs/expert/tracking-tab'
import type { NodePropertyTabProps } from '../types'
import {
  CHAT_INFO_TAB_SCHEMA,
  RECOGNIZE_INFO_TAB_SCHEMA,
  TRACKING_TAB_SCHEMA,
} from '../validator'

const schema = Yup.object()
  .concat(RECOGNIZE_INFO_TAB_SCHEMA)
  .concat(CHAT_INFO_TAB_SCHEMA)
  .concat(TRACKING_TAB_SCHEMA)

const tabList = [
  {
    key: 'general',
    label: 'General',
    beginner: false,
  },
  {
    key: 'recognizeInfo',
    label: 'Recognize Info',
    beginner: false,
  },
  {
    key: 'ment',
    label: 'Ment Info',
    beginner: false,
  },
  {
    key: 'chat',
    label: 'Chat Info',
    beginner: false,
  },
  {
    key: 'tracking',
    label: 'Tracking',
    beginner: false,
  },
] as const

type TabKeys = (typeof tabList)[number]['key']

const renderTabContent = (props: NodePropertyTabProps) => {
  const tabKeys = props.tabName as TabKeys

  const expertTabs: Partial<Record<TabKeys, JSX.Element>> = {
    general: <GeneralTab {...props} />,
    recognizeInfo: <RecognizeInfoTab {...props} />,
    ment: <MentInfoTab {...props} />,
    chat: <ChatInfoTab {...props} />,
    tracking: <TrackingTab {...props} />,
  }

  return expertTabs[tabKeys]
}

export default function RequestVRProperty(props: NodePropertyTabProps) {
  const [tabValue, setTabValue] = useState<TabKeys>(() =>
    tabList.some((tab) => tab.key === props.focusTab)
      ? (props.focusTab as TabKeys)
      : 'recognizeInfo',
  )
  const [options] = useOptionsStateSynced()
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
            <Tab
              key={key}
              label={label}
              value={key}
              disabled={key === 'chat' && !options?.flow.chatSupport}
            />
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
