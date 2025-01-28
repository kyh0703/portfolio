'use client'

import { globalItems } from '@/app/(afterLogin)/_components/define-sidebar/items'
import { Button } from '@/app/_components/button'
import { Checkbox } from '@/app/_components/checkbox'
import Label from '@/app/_components/label'
import { Tab, TabPanel, Tabs } from '@/app/_components/tab'
import {
  useQueryCommonFlowInFlow,
  useQueryCommonFlows,
  useQuerySubFlows,
} from '@/services/flow'
import { useExportManage } from '@/services/manage'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useCallback, useMemo, useReducer, useState } from 'react'
import ExportList from './export-list'
import { Loader2Icon } from 'lucide-react'
import { cn } from '@/utils'

const tabMap = {
  global: 'Global',
  subFlow: 'SubFlow',
  commonInFlow: 'CommonSubFlow(InFlow)',
  commonFlow: 'CommonSubFlow',
} as const

export default function ExportTab() {
  const [tabValue, setTabValue] = useState('global')

  const [isFlowAll, toggleIsFlowAll] = useReducer((state) => !state, false)
  const [selectedSubflowIds, setSelectedSubflowIds] = useState<number[]>([])
  const [selectedDefineIds, setSelectedDefineIds] = useState<string[]>([])

  const isDisabledExportButton = useMemo(
    () =>
      !isFlowAll &&
      selectedDefineIds.length === 0 &&
      selectedSubflowIds.length == 0,
    [isFlowAll, selectedDefineIds, selectedSubflowIds],
  )

  const { subFlows, commonInFlows, commonFlows } = useSuspenseQueries({
    queries: [
      useQuerySubFlows(),
      useQueryCommonFlowInFlow(),
      useQueryCommonFlows(),
    ],
    combine: (results) => ({
      subFlows: results[0].data.flow.map((flow) => ({
        id: flow.id,
        name: flow.name,
      })),
      commonInFlows: results[1].data.flow.map((flow) => ({
        id: flow.id,
        name: flow.name,
      })),
      commonFlows: results[2].data.flow.map((flow) => ({
        id: flow.id,
        name: flow.name,
      })),
    }),
  })

  const { mutateAsync: exportMutation, isPending } = useExportManage()

  const defines = useMemo(
    () => globalItems.map((item) => ({ id: item.toLowerCase(), name: item })),
    [],
  )

  const addSubflowId = useCallback(
    (newIds: number[]) => {
      setSelectedSubflowIds((prevIds) => {
        const uniqueIds = newIds.filter((id) => !prevIds.includes(id))
        return [...prevIds, ...uniqueIds] // 중복되지 않은 ID만 추가
      })
    },
    [setSelectedSubflowIds],
  )

  const handleClickExport = () => {
    const payloadData = {
      exportInfo: {
        flow: isFlowAll,
        subFlow: !!selectedSubflowIds.length,
        define: !!selectedDefineIds.length,
      },
      subFlows: selectedSubflowIds,
      defines: selectedDefineIds,
    }
    exportMutation(payloadData)
  }

  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="mb-3 flex gap-3">
        <Checkbox
          id="bargeIn"
          checked={isFlowAll}
          onCheckedChange={() => toggleIsFlowAll()}
        />
        <Label htmlFor="setIntent">Flow All</Label>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center justify-between border border-b-2">
          <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
            {Object.entries(tabMap).map(([key, label]) => (
              <Tab
                key={key}
                className="border-r border-gray-300 last:border-r-0"
                label={label}
                value={key}
              />
            ))}
          </Tabs>
        </div>
        <Button
          className={cn(`${isPending && `w-28`}`)}
          type="submit"
          disabled={isPending || isDisabledExportButton}
          onClick={handleClickExport}
        >
          {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Export
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <TabPanel activeTab={tabValue} value="global">
          <ExportList
            data={defines}
            selectedIds={selectedDefineIds}
            onSelectedChanged={(ids) => setSelectedDefineIds(ids as string[])}
          />
        </TabPanel>
        <TabPanel activeTab={tabValue} value="subFlow">
          <ExportList
            data={subFlows}
            selectedIds={selectedSubflowIds}
            onSelectedChanged={(ids) => addSubflowId(ids as number[])}
          />
        </TabPanel>
        <TabPanel activeTab={tabValue} value="commonInFlow">
          <ExportList
            data={commonInFlows}
            selectedIds={selectedSubflowIds}
            onSelectedChanged={(ids) => addSubflowId(ids as number[])}
          />
        </TabPanel>
        <TabPanel activeTab={tabValue} value="commonFlow">
          <ExportList
            data={commonFlows}
            selectedIds={selectedSubflowIds}
            onSelectedChanged={(ids) => addSubflowId(ids as number[])}
          />
        </TabPanel>
      </div>
    </div>
  )
}
