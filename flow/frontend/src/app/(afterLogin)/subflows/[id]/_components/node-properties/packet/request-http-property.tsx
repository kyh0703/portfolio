'use client'

import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import { NodePropertiesProvider } from '@/contexts/node-properties-context'
import { Separator } from '@/ui/separator'
import { useState } from 'react'
import * as Yup from 'yup'
import GeneralTab from '../../node-tabs/expert/general-tab'
import HttpDataTab from '../../node-tabs/expert/http-data-tab'
import RequestInfoTab from '../../node-tabs/expert/request-info-tab'
import TrackingTab from '../../node-tabs/expert/tracking-tab'
import type { NodePropertyTabProps } from '../types'
import {
  HTTP_DATA_TAB_SCHEMA,
  REQUEST_INFO_TAB_SCHEMA,
  TRACKING_TAB_SCHEMA,
} from '../validator'

const schema = Yup.object()
  .concat(REQUEST_INFO_TAB_SCHEMA)
  .concat(HTTP_DATA_TAB_SCHEMA)
  .concat(TRACKING_TAB_SCHEMA)

const tabList = [
  {
    key: 'general',
    label: 'General',
    beginner: false,
  },
  {
    key: 'requestInfo',
    label: 'Request Info',
    beginner: false,
  },
  {
    key: 'httpData',
    label: 'HTTP Data',
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
    requestInfo: <RequestInfoTab {...props} />,
    httpData: <HttpDataTab {...props} />,
    tracking: <TrackingTab {...props} />,
  }

  return expertTabs[tabKeys]
}

export default function RequestHTTPProperty(props: NodePropertyTabProps) {
  const [tabValue, setTabValue] = useState<TabKeys>(() =>
    tabList.some((tab) => tab.key === props.focusTab)
      ? (props.focusTab as TabKeys)
      : 'requestInfo',
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
