'use client'

import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import { NodePropertiesProvider } from '@/contexts/node-properties-context'
import { Separator } from '@/ui/separator'
import { useState } from 'react'
import * as Yup from 'yup'
import BeginnerIntentNluInfoTab from '../../node-tabs/beginner/intent-nlu-info-tab'
import BeginnerLinkTab from '../../node-tabs/beginner/link-tab'
import BeginnerRecognizeInfoTab from '../../node-tabs/beginner/recognize-info-tab'
import BeginnerTrackingTab from '../../node-tabs/beginner/tracking-tab'
import GeneralTab from '../../node-tabs/expert/general-tab'
import IntentNluInfoTab from '../../node-tabs/expert/intent-nlu-info-tab'
import LinkTab from '../../node-tabs/expert/link-tab'
import RecognizeInfoTab from '../../node-tabs/expert/recognize-info-tab'
import TrackingTab from '../../node-tabs/expert/tracking-tab'
import type { NodePropertyTabProps } from '../types'
import { INTENT_NLU_INTO_TAB_SCHEMA, TRACKING_TAB_SCHEMA } from '../validator'

const schema = Yup.object()
  .concat(INTENT_NLU_INTO_TAB_SCHEMA)
  .concat(TRACKING_TAB_SCHEMA)

const tabList = [
  {
    key: 'general',
    label: 'General',
    beginner: false,
  },
  {
    key: 'entityInfo',
    label: 'Intent & NLU Info',
    beginner: true,
  },
  {
    key: 'recognizeInfo',
    label: 'Recognize Info',
    beginner: true,
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
    entityInfo: <BeginnerIntentNluInfoTab {...props} />,
    recognizeInfo: <BeginnerRecognizeInfoTab {...props} />,
    tracking: <BeginnerTrackingTab {...props} />,
    link: <BeginnerLinkTab {...props} />,
  }

  const expertTabs: Partial<Record<TabKeys, JSX.Element>> = {
    general: <GeneralTab {...props} />,
    entityInfo: <IntentNluInfoTab {...props} />,
    recognizeInfo: <RecognizeInfoTab {...props} />,
    tracking: <TrackingTab {...props} />,
    link: <LinkTab {...props} />,
  }

  return props.flowMode === 'beginner'
    ? beginnerTabs[tabKeys]
    : expertTabs[tabKeys]
}

export default function EntityCallProperty(props: NodePropertyTabProps) {
  const [tabValue, setTabValue] = useState<TabKeys>(() =>
    tabList.some((tab) => tab.key === props.focusTab)
      ? (props.focusTab as TabKeys)
      : 'entityInfo',
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
