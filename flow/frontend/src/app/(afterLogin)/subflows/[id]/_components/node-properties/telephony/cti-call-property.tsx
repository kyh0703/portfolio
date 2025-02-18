'use client'

import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import { NodePropertiesProvider } from '@/contexts/node-properties-context'
import { Separator } from '@/ui/separator'
import { useState } from 'react'
import * as Yup from 'yup'
import BeginnerCTIInfoTab from '../../node-tabs/beginner/cti-info-tab'
import BeginnerInputInfoTab from '../../node-tabs/beginner/input-info-tab'
import BeginnerOutputTab from '../../node-tabs/beginner/output-tab'
import BeginnerTrackingTab from '../../node-tabs/beginner/tracking-tab'
import CTIInfoTab from '../../node-tabs/expert/cti-info-tab'
import GeneralTab from '../../node-tabs/expert/general-tab'
import InputInfoTab from '../../node-tabs/expert/input-info-tab'
import OutputTab from '../../node-tabs/expert/output-tab'
import TrackingTab from '../../node-tabs/expert/tracking-tab'
import type { NodePropertyTabProps } from '../types'
import { CTI_INFO_TAB_SCHEMA, TRACKING_TAB_SCHEMA } from '../validator'

const schema = Yup.object()
  .concat(CTI_INFO_TAB_SCHEMA)
  .concat(TRACKING_TAB_SCHEMA)

const tabList = [
  {
    key: 'general',
    label: 'General',
    beginner: false,
  },
  {
    key: 'info',
    label: 'CTI Info',
    beginner: true,
  },
  {
    key: 'input',
    label: 'Input',
    beginner: true,
  },
  {
    key: 'output',
    label: 'Output',
    beginner: true,
  },
  {
    key: 'tracking',
    label: 'Tracking',
    beginner: true,
  },
] as const

type TabKeys = (typeof tabList)[number]['key']

const renderTabContent = (props: NodePropertyTabProps) => {
  const tabKeys = props.tabName as TabKeys

  const beginnerTabs: Partial<Record<TabKeys, JSX.Element>> = {
    info: <BeginnerCTIInfoTab {...props} />,
    input: <BeginnerInputInfoTab {...props} />,
    output: <BeginnerOutputTab {...props} />,
    tracking: <BeginnerTrackingTab {...props} />,
  }

  const expertTabs: Partial<Record<TabKeys, JSX.Element>> = {
    general: <GeneralTab {...props} />,
    info: <CTIInfoTab {...props} />,
    input: <InputInfoTab {...props} />,
    output: <OutputTab {...props} />,
    tracking: <TrackingTab {...props} />,
  }

  return props.flowMode === 'beginner'
    ? beginnerTabs[tabKeys]
    : expertTabs[tabKeys]
}

export default function CtiCallProperty(props: NodePropertyTabProps) {
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
