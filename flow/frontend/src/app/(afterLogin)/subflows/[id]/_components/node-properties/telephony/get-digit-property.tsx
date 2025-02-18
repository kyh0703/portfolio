'use client'

import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import { NodePropertiesProvider } from '@/contexts/node-properties-context'
import { useOptionsStateSynced } from '@/hooks/use-options-state-synced'
import { Separator } from '@/ui/separator'
import { useState } from 'react'
import * as Yup from 'yup'
import ChatInfoTab from '../../node-tabs/expert/chat-info-tab'
import DigitInfoTab from '../../node-tabs/expert/digit-info-tab'
import GeneralTab from '../../node-tabs/expert/general-tab'
import LinkTab from '../../node-tabs/expert/link-tab'
import MentInfoTab from '../../node-tabs/expert/ment-info-tab'
import RecognizeInfoTab from '../../node-tabs/expert/recognize-info-tab'
import TrackingTab from '../../node-tabs/expert/tracking-tab'
import VisualARSTab from '../../node-tabs/expert/visual-ars-tab'
import VRActionTab from '../../node-tabs/expert/vr-action-tab'
import type { NodePropertyTabProps } from '../types'
import {
  CHAT_INFO_TAB_SCHEMA,
  DIGIT_INFO_TAB_SCHEMA,
  RECOGNIZE_INFO_TAB_SCHEMA,
  TRACKING_TAB_SCHEMA,
} from '../validator'
import BeginnerLinkTab from '../../node-tabs/beginner/link-tab'
import BeginnerTrackingTab from '../../node-tabs/beginner/tracking-tab'
import BeginnerMentInfoTab from '../../node-tabs/beginner/ment-info-tab'
import BeginnerRecognizeInfoTab from '../../node-tabs/beginner/recognize-info-tab'
import BeginnerChatInfoTab from '../../node-tabs/beginner/chat-info-tab'
import BeginnerDigitInfoTab from '../../node-tabs/beginner/digit-info-tab'

const schema = Yup.object()
  .concat(DIGIT_INFO_TAB_SCHEMA)
  .concat(CHAT_INFO_TAB_SCHEMA)
  .concat(RECOGNIZE_INFO_TAB_SCHEMA)
  .concat(TRACKING_TAB_SCHEMA)

const tabList = [
  {
    key: 'general',
    label: 'General',
    beginner: false,
  },
  {
    key: 'ment',
    label: 'Ment Info',
    beginner: true,
  },
  {
    key: 'digit',
    label: 'Digit Info',
    beginner: true,
  },
  {
    key: 'chat',
    label: 'Chat Info',
    beginner: true,
  },
  {
    key: 'recognizeInfo',
    label: 'VR Info',
    beginner: false,
  },
  {
    key: 'vrAct',
    label: 'VR Action',
    beginner: false,
  },
  {
    key: 'vars',
    label: 'Visual ARS',
    beginner: false,
  },
  {
    key: 'tracking',
    label: 'Tracking',
    beginner: true,
  },
  {
    key: 'link',
    label: 'Link',
    beginner: true,
  },
] as const

type TabKeys = (typeof tabList)[number]['key']

const renderTabContent = (props: NodePropertyTabProps) => {
  const tabKeys = props.tabName as TabKeys

  const beginnerTabs: Partial<Record<TabKeys, JSX.Element>> = {
    ment: <BeginnerMentInfoTab {...props} />,
    digit: <BeginnerDigitInfoTab {...props} />,
    chat: <BeginnerChatInfoTab {...props} />,
    recognizeInfo: <BeginnerRecognizeInfoTab {...props} />,
    tracking: <BeginnerTrackingTab {...props} />,
    link: <BeginnerLinkTab {...props} />,
  }

  const expertTabs: Partial<Record<TabKeys, JSX.Element>> = {
    general: <GeneralTab {...props} />,
    ment: <MentInfoTab {...props} />,
    digit: <DigitInfoTab {...props} />,
    chat: <ChatInfoTab {...props} />,
    recognizeInfo: <RecognizeInfoTab {...props} />,
    vrAct: <VRActionTab {...props} />,
    vars: <VisualARSTab {...props} />,
    tracking: <TrackingTab {...props} />,
    link: <LinkTab {...props} />,
  }

  return props.flowMode === 'beginner'
    ? beginnerTabs[tabKeys]
    : expertTabs[tabKeys]
}

export default function GetDigitProperty(props: NodePropertyTabProps) {
  const [tabValue, setTabValue] = useState<TabKeys>(() =>
    tabList.some((tab) => tab.key === props.focusTab)
      ? (props.focusTab as TabKeys)
      : 'ment',
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
