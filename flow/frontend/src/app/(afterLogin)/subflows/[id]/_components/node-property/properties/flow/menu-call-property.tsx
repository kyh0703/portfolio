'use client'

import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import { NodePropertiesProvider } from '@/contexts/node-properties-context'
import { Separator } from '@/ui/separator'
import { useState } from 'react'
import * as Yup from 'yup'
import ExpandMenuTab from '../../../node-tabs/expand-menu-info-tab'
import GeneralTab from '../../../node-tabs/general-tab'
import MenuInfoTab from '../../../node-tabs/menu-info-tab'
import TrackingTab from '../../../node-tabs/tracking-tab'
import {
  EXPAND_MENU_INFO_TAB_SCHEMA,
  MENU_INFO_TAB_SCHEMA,
  TRACKING_TAB_SCHEMA,
} from '../../../node-tabs/validator'
import type { NodePropertyTabProps } from '../../types'

const schema = Yup.object()
  .concat(MENU_INFO_TAB_SCHEMA)
  .concat(EXPAND_MENU_INFO_TAB_SCHEMA)
  .concat(TRACKING_TAB_SCHEMA)

const tabMap = {
  general: 'General',
  menuInfo: 'Menu Info',
  expandMenuInfo: 'Expand Menu Info',
  tracking: 'Tracking',
} as const

type TabKeys = keyof typeof tabMap

const renderTabContent = (props: NodePropertyTabProps) => {
  switch (props.tabName) {
    case 'general':
      return <GeneralTab {...props} />
    case 'menuInfo':
      return <MenuInfoTab {...props} />
    case 'expandMenuInfo':
      return <ExpandMenuTab {...props} />
    case 'tracking':
      return <TrackingTab {...props} />
    default:
      return null
  }
}

export default function MenuCallProperty(props: NodePropertyTabProps) {
  const [tabValue, setTabValue] = useState<TabKeys>(() => {
    if (props.focusTab && props.focusTab in tabMap) {
      return props.focusTab as TabKeys
    }
    return 'menuInfo'
  })

  return (
    <NodePropertiesProvider
      subFlowId={props.subFlowId}
      nodeId={props.databaseId}
      schema={schema}
    >
      <div className="flex h-full w-full flex-col whitespace-nowrap">
        <div className="flex h-property-title items-center px-6 py-3 font-semibold">
          {`${props.nodeId} > ${tabMap[tabValue]}`}
        </div>
        <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
          {Object.entries(tabMap).map(([key, label]) => (
            <Tab key={key} label={label} value={key} />
          ))}
        </Tabs>
        <Separator />
        <div className="flex-1 overflow-auto">
          {Object.entries(tabMap).map(([key]) => (
            <TabPanel key={key} activeTab={tabValue} value={key}>
              {renderTabContent({ ...props, tabName: key })}
            </TabPanel>
          ))}
        </div>
      </div>
    </NodePropertiesProvider>
  )
}
