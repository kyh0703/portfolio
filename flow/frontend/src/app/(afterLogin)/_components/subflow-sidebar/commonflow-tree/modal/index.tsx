'use client'

import { Button } from '@/app/_components/button'
import {
  AddIcon,
  TriangleLeftIcon,
  TriangleRightIcon,
} from '@/app/_components/icon'
import SearchBox from '@/app/_components/search-bar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { useYjs } from '@/contexts/yjs-context'
import useYjsData from '@/hooks/use-yjs-data'
import { SubFlow } from '@/models/subflow'
import { FlowTreeData, SubFlowList } from '@/models/subflow-list'
import {
  flowKeys,
  useAddCommonFlow,
  useJoinCommonFlow,
  useQueryCommonFlowInFlow,
  useQueryCommonFlows,
  useReplicateCommonFlow,
} from '@/services/flow'
import { useUnJoinCommonFlow } from '@/services/flow/mutations/use-unjoin-common-flow'
import { useUserContext } from '@/store/context'
import { useFlowTabStore } from '@/store/flow-tab'
import { ScrollArea } from '@/ui/scroll-area'
import { cn } from '@/utils/cn'
import logger from '@/utils/logger'
import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import FlowAddForm from './form'
import CommonFlowAddPopover from './popover'

export type CommonFlowAddFormType = {
  name: string
  version: string
}

export type InflowListType = {
  name: string
  id: number
  defaultVersion: string
  options: { version: string; id: number }[]
}

export default function CommonFlowEditModal({
  handleAddTree,
  handleRemoveTree,
  handleChangeTree,
}: {
  handleAddTree?: (id: number, name: string) => void
  handleRemoveTree?: (name: string) => void
  handleChangeTree?: (name: string, newId: number) => void
}) {
  const { ydoc } = useYjs()
  const { clearSubFlow } = useYjsData(ydoc)
  const router = useRouter()
  const [filterInflows, setFilterInflows] = useState<InflowListType[]>()
  const [filterFlows, setFilterFlows] = useState<SubFlowList[]>()
  const [isOpenCreateForm, toggleIsOpenCreateForm] = useReducer(
    (state) => !state,
    false,
  )

  const closeTab = useFlowTabStore((state) => state.closeTab)
  const { id: flowId } = useUserContext()
  const queryClient = useQueryClient()
  const [selectedFlow, setSelectedFlow] = useState<{
    id: number
    name: string
    type: 'flow' | 'inflow'
  }>()

  const { mutateAsync: addMutate } = useAddCommonFlow()
  const { mutateAsync: joinMutate } = useJoinCommonFlow()
  const { mutateAsync: unJoinMutate } = useUnJoinCommonFlow()
  const replicateMutation = useReplicateCommonFlow()

  const { inflows, flows } = useSuspenseQueries({
    queries: [useQueryCommonFlowInFlow(), useQueryCommonFlows()],
    combine: (results) => {
      return {
        inflows: results[0].data.flow,
        flows: results[1].data.flow,
      }
    },
  })

  const isJoinFlow = useMemo(
    () => inflows.some((inflow) => inflow.name === selectedFlow?.name),
    [inflows, selectedFlow],
  )

  const groupInflowsByName = useCallback(
    (inflows: SubFlow[]) => {
      const resultMap = new Map<string, InflowListType>()

      inflows.forEach(({ name, version, id }) => {
        if (!resultMap.has(name)) {
          const matchingFlows = flows.filter((flow) => flow.name === name)

          if (matchingFlows.length > 0) {
            resultMap.set(name, {
              name,
              id,
              defaultVersion: version,
              options: matchingFlows.map((flow) => ({
                version: flow.version,
                id: flow.id,
              })),
            })
          }
        }
      })

      return Array.from(resultMap.values())
    },
    [flows],
  )

  const handleAddCommonFlowSubmit = async (data: CommonFlowAddFormType) => {
    try {
      await addMutate({
        desc: '',
        args: {
          in: {
            param: [],
          },
          out: { arg: [] },
        },
        updateDate: new Date(),
        ...data,
      })
      toggleIsOpenCreateForm()
    } catch (error) {
      logger.error('failed to add common flow', error)
    }
  }

  const handleReplicateSubmit = (data: CommonFlowAddFormType) => {
    if (!selectedFlow) return
    replicateMutation.mutate({
      commonFlowId: selectedFlow.id,
      commonFlow: {
        desc: '',
        args: {
          in: {
            param: [],
          },
          out: { arg: [] },
        },
        updateDate: new Date(),
        ...data,
      },
    })
  }

  const handleJoinClick = async () => {
    try {
      await joinMutate(selectedFlow!.id)
      await handleAddTree?.(selectedFlow!.id, selectedFlow!.name)
      queryClient.invalidateQueries({ queryKey: [flowKeys.commonFlows] })
    } catch (error) {
      logger.error('failed to join common flow', error)
    }
  }

  const handleUnJoinClick = async () => {
    try {
      await unJoinMutate(selectedFlow!.id)
      await handleRemoveTree?.(selectedFlow!.name)
      queryClient.invalidateQueries({ queryKey: [flowKeys.commonInFlows] })
      queryClient.invalidateQueries({ queryKey: [flowKeys.commonFlows] })
      clearSubFlow('' + selectedFlow!.id)
      const moveSubFlowId = closeTab(flowId, selectedFlow!.id)
      router.push(`/subflows/${moveSubFlowId}`)
    } catch (error) {
      logger.error('failed to unjoin common flow', error)
    }
  }

  const handleSearchInflow: ChangeEventHandler<HTMLInputElement> = (e) => {
    const filterInflows = inflows.filter(({ name }) =>
      name.startsWith(e.target.value),
    )
    const groupInflow = groupInflowsByName(filterInflows)
    const sortedInflow = groupInflow.sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    setFilterInflows(sortedInflow)
  }

  const handleSearchFlow: ChangeEventHandler<HTMLInputElement> = (e) => {
    const filterCommonFlows = flows
      .filter(({ name }) => name.startsWith(e.target.value))
      .sort((a, b) => a.name.localeCompare(b.name))
    setFilterFlows(filterCommonFlows)
  }

  const handleChangeVersion = async ({
    oldName,
    oldVersion,
    newVersion,
  }: {
    oldName: string
    oldVersion: string
    newVersion: string
  }) => {
    // 이미 조인되어있는 flow 찾기
    const flow = filterInflows!.find((inflow) => inflow.name === oldName)!
    const oldFlowId = flow.options.find(
      (option) => option.version === oldVersion,
    )!.id
    const newFlowId = flow.options.find(
      (option) => option.version === newVersion,
    )!.id

    try {
      await unJoinMutate(oldFlowId)
      await joinMutate(newFlowId)
      await handleChangeTree?.(oldName, newFlowId)
      clearSubFlow('' + oldFlowId)
      const moveSubFlowId = closeTab(flowId, oldFlowId)
      router.push(`/subflows/${moveSubFlowId}`)
    } catch (error) {
      logger.error('failed to change common flow version', error)
    }
  }

  const filterFlowTree = (
    items: FlowTreeData[],
    flowId: string,
  ): FlowTreeData[] => {
    return items
      .map((item) => {
        if (item.type === 'file' && item.id === flowId) {
          return null
        } else if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: filterFlowTree(item.children, flowId),
          }
        }
        return item
      })
      .filter((item): item is FlowTreeData => item !== null)
  }

  useEffect(() => {
    if (inflows) {
      const sortedInflow = groupInflowsByName(inflows).sort((a, b) =>
        a.name.localeCompare(b.name),
      )
      setFilterInflows(sortedInflow)
    }
  }, [inflows, groupInflowsByName])

  useEffect(() => {
    if (flows) {
      const sortedFlows = flows
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
      setFilterFlows(sortedFlows)
    }
  }, [flows])

  return (
    <div className="flex gap-5 sm:flex-col md:flex-row">
      <div className="basis-1/2 space-y-4">
        <div className="flex w-full flex-shrink-0 items-center justify-center border-solid">
          <SearchBox onChange={handleSearchInflow} />
        </div>
        <ScrollArea className="h-72 rounded-md bg-grid-header py-2">
          {filterInflows &&
            filterInflows.map(({ name, id, defaultVersion, options }) => (
              <div
                key={name}
                className={cn(
                  'flex cursor-pointer items-center justify-between space-y-2 px-4 text-sm',
                )}
                onClick={() => setSelectedFlow({ id, name, type: 'inflow' })}
              >
                <span
                  className={cn(
                    `grow basis-9/12 text-base`,
                    selectedFlow?.type === 'inflow' &&
                      selectedFlow.id === id &&
                      'font-semibold',
                  )}
                >
                  {name}
                </span>
                <div className="basis-3/12">
                  <Select
                    defaultValue={defaultVersion}
                    onValueChange={(v) =>
                      handleChangeVersion({
                        oldName: name,
                        oldVersion: defaultVersion,
                        newVersion: v,
                      })
                    }
                  >
                    <SelectTrigger className="h-10 focus:ring-0 focus:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map(({ version, id }) => (
                        <SelectItem key={`${name}-${id}`} value={version}>
                          {version}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
        </ScrollArea>
      </div>
      <div className="flex flex-col items-center justify-center gap-6">
        <Button
          className="h-5 w-5 rounded-md"
          variant="outline"
          size="icon"
          disabled={
            selectedFlow?.type === 'inflow' || !selectedFlow?.id || isJoinFlow
          }
          onClick={handleJoinClick}
        >
          <TriangleLeftIcon className="p-0" width={8} height={12} />
        </Button>
        <Button
          className="h-5 w-5 rounded-md"
          variant="outline"
          size="icon"
          disabled={selectedFlow?.type === 'flow' || !selectedFlow?.id}
          onClick={handleUnJoinClick}
        >
          <TriangleRightIcon className="p-0" width={8} height={12} />
        </Button>
      </div>
      <div className="basis-1/2 space-y-4">
        <div className="flex w-full flex-shrink-0 items-center justify-center gap-2 border-solid">
          <SearchBox onChange={handleSearchFlow} />
          <Button
            className="w-10 p-0"
            variant="ghost"
            onClick={toggleIsOpenCreateForm}
          >
            <AddIcon width={20} height={20} />
          </Button>
        </div>
        <div className="rounded-md bg-grid-header">
          {isOpenCreateForm && (
            <FlowAddForm
              className="mt-2"
              onSubmit={handleAddCommonFlowSubmit}
            />
          )}
          <ScrollArea className="h-72 rounded-md">
            {filterFlows &&
              filterFlows.map(({ name, version, id }) => (
                <div
                  key={id}
                  className={cn(
                    'flex items-center justify-between space-y-2 px-4 text-base',
                    selectedFlow?.type === 'flow' &&
                      selectedFlow?.id === id &&
                      'font-semibold',
                  )}
                  onClick={() => setSelectedFlow({ id, name, type: 'flow' })}
                >
                  <span>{name}</span>
                  <div className="flex basis-4/12 items-center justify-between gap-2">
                    <span>{version}</span>
                    <CommonFlowAddPopover
                      data={{ name, version }}
                      onSubmit={handleReplicateSubmit}
                    />
                  </div>
                </div>
              ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
