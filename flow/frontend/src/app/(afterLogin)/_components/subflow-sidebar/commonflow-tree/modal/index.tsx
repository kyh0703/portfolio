'use client'

import { Button } from '@/app/_components/button'
import { Checkbox } from '@/app/_components/checkbox'
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
import { SubFlowList } from '@/models/subflow-list'
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
import { getSubFlowPath } from '@/utils/route-path'
import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query'
import { CircleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { toast } from 'react-toastify'
import FlowAddForm from './form'
import CommonFlowAddPopover from './popover'

export type CommonFlowAddFormType = {
  name: string
  version: string
  oldFlowId?: number
}

export type InflowListType = {
  name: string
  id: number
  defaultVersion: string
  options: SubFlowList[]
}

export default function CommonFlowEditModal({
  handleAddTree,
  handleRemoveTreeByName,
  handleChangeTree,
}: {
  handleAddTree?: (flows: SubFlowList[]) => void
  handleRemoveTreeByName?: (names: string[]) => void
  handleChangeTree?: (data: SubFlowList) => void
}) {
  const [filterInflows, setFilterInflows] = useState<InflowListType[]>([])
  const [filterFlows, setFilterFlows] = useState<SubFlowList[]>([])
  const [isOpenCreateForm, toggleIsOpenCreateForm] = useReducer(
    (state) => !state,
    false,
  )
  const [selectedInFlows, setSelectedInFlows] = useState<
    {
      id: number
      name: string
    }[]
  >([])
  const [selectedFlows, setSelectedFlows] = useState<SubFlowList[]>([])

  const router = useRouter()
  const { ydoc } = useYjs()
  const { clearSubFlow } = useYjsData(ydoc)
  const [isOpenTab, closeTab] = useFlowTabStore((state) => [
    state.isOpenTab,
    state.closeTab,
  ])
  const { id: flowId, mode: flowMode } = useUserContext()
  const queryClient = useQueryClient()

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
              options: matchingFlows,
            })
          }
        }
      })

      return Array.from(resultMap.values())
    },
    [flows],
  )

  const handleAddFlow = async (data: CommonFlowAddFormType) => {
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
  }

  const handleReplicate = (data: CommonFlowAddFormType) => {
    replicateMutation.mutate({
      commonFlowId: data.oldFlowId!,
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

  const handleJoin = useCallback(async () => {
    try {
      for await (const flow of selectedFlows) {
        await joinMutate(flow!.id)
      }
      await handleAddTree?.(selectedFlows)
      setSelectedFlows([])
      queryClient.invalidateQueries({ queryKey: [flowKeys.commonFlows] })
    } catch (error) {
      toast.warn('Common Flow Join에 실패했습니다.')
      logger.error('failed to join common flow', error)
    }
  }, [handleAddTree, joinMutate, queryClient, selectedFlows])

  const handleUnJoin = useCallback(async () => {
    try {
      for await (const flow of selectedInFlows) {
        await unJoinMutate(flow!.id)
      }
      await handleRemoveTreeByName?.(selectedInFlows.map((flow) => flow.name))
      queryClient.invalidateQueries({ queryKey: [flowKeys.commonInFlows] })
      queryClient.invalidateQueries({ queryKey: [flowKeys.commonFlows] })

      let moveSubFlowId
      for (const flow of selectedInFlows) {
        if (isOpenTab(flowId, flow.id)) {
          moveSubFlowId = closeTab(flowId, flow!.id)
        }
        clearSubFlow(flowMode, '' + flow.id)
      }
      setSelectedInFlows([])
      router.push(getSubFlowPath(moveSubFlowId))
    } catch (error) {
      toast.warn('Common Flow Unjoin에 실패했습니다.')
      logger.error('failed to unjoin common flow', error)
    }
  }, [
    clearSubFlow,
    closeTab,
    flowId,
    flowMode,
    handleRemoveTreeByName,
    isOpenTab,
    queryClient,
    router,
    selectedInFlows,
    unJoinMutate,
  ])

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

  const handleChangeVersion = async (
    newVersion: string,
    flow: InflowListType,
  ) => {
    const joinedFlow = filterInflows!.find(
      (inflow) => inflow.name === flow.name,
    )!
    const oldFlowId = joinedFlow.options.find(
      (option) => option.version === flow.defaultVersion,
    )!.id
    const newFlow = flow.options.find((option) => option.version === newVersion)

    try {
      await unJoinMutate(oldFlowId)
      await joinMutate(newFlow!.id)
      await handleChangeTree?.(newFlow!)

      if (isOpenTab(flowId, oldFlowId)) {
        const moveSubFlowId = closeTab(flowId, oldFlowId)
        router.push(getSubFlowPath(moveSubFlowId))
      }
      clearSubFlow(flowMode, '' + oldFlowId)
    } catch (error) {
      logger.error('failed to change common flow version', error)
    }
  }

  const activeInFlowStyle = useCallback(
    (name: string): string =>
      selectedInFlows?.some((flow) => flow.name === name)
        ? 'rounded-sm bg-search font-bold'
        : '',
    [selectedInFlows],
  )

  const activeFlowStyle = useCallback(
    (id: number): string =>
      selectedFlows?.some((flow) => flow.id === id)
        ? 'rounded-sm bg-search font-bold'
        : '',
    [selectedFlows],
  )

  const isAlreadyJoined = useCallback(
    (id: number, name: string) =>
      filterInflows.some((flow) => flow.name === name) ||
      selectedFlows.some((flow) => flow.id !== id && flow.name === name),
    [filterInflows, selectedFlows],
  )

  const handleCheckedChangeInFlow = useCallback(
    (checked: boolean | string, flow: InflowListType) => {
      const isAlreadyChecked = selectedInFlows?.some(
        (selectedInFlow) => selectedInFlow.name === flow.name,
      )
      if (checked && !isAlreadyChecked) {
        setSelectedInFlows((prev) => [
          ...prev,
          { id: flow.id, name: flow.name },
        ])
      } else if (!checked && isAlreadyChecked) {
        setSelectedInFlows((prev) =>
          prev.filter((selectedInFlow) => selectedInFlow.name !== flow.name),
        )
      }
    },
    [selectedInFlows],
  )

  const handleCheckedChangeFlow = useCallback(
    (checked: boolean | string, flow: SubFlowList) => {
      const isAlreadyChecked = selectedFlows?.some(
        (selectedFlow) => selectedFlow.id === flow.id,
      )
      if (checked && !isAlreadyChecked) {
        setSelectedFlows((prev) => [...prev, flow])
      } else if (!checked && isAlreadyChecked) {
        setSelectedFlows((prev) =>
          prev.filter((selectedFlow) => selectedFlow.id !== flow.id),
        )
      }
    },
    [selectedFlows],
  )

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
    <>
      <div className="grid grid-cols-11">
        <div className="col-span-5 flex flex-col space-y-4">
          <SearchBox onChange={handleSearchInflow} />
          <ScrollArea className="h-72 grow gap-4 rounded-md bg-active p-2">
            {filterInflows.map((flow) => (
              <div
                key={`in-flow-${flow.name}`}
                className={cn(
                  'grid h-10 grid-cols-12 px-2 text-sm',
                  activeInFlowStyle(flow.name),
                )}
              >
                <div className="col-span-9 flex items-center space-x-2">
                  <Checkbox
                    id={`in-flow-${flow.name}`}
                    onCheckedChange={(checked) =>
                      handleCheckedChangeInFlow(checked, flow)
                    }
                  />
                  <label
                    htmlFor={`in-flow-${flow.name}`}
                    className="text-truncate grow"
                  >
                    {flow.name}
                  </label>
                </div>
                <div className="col-span-3 flex items-center justify-end">
                  <Select
                    defaultValue={flow.defaultVersion}
                    onValueChange={(v) => handleChangeVersion(v, flow)}
                  >
                    <SelectTrigger className="h-7 focus:ring-0 focus:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {flow.options.map(({ version, id }) => (
                        <SelectItem key={`${flow.name}-${id}`} value={version}>
                          <span className="font-mono text-xs">{version}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="col-span-1 flex flex-col items-center justify-center gap-6">
          <Button
            className="h-5 w-5 rounded-md"
            variant="outline"
            size="icon"
            disabled={selectedFlows?.length === 0}
            onClick={handleJoin}
          >
            <TriangleLeftIcon className="p-0" size={8} />
          </Button>
          <Button
            className="h-5 w-5 rounded-md"
            variant="outline"
            size="icon"
            disabled={selectedInFlows?.length === 0}
            onClick={handleUnJoin}
          >
            <TriangleRightIcon className="p-0" size={8} />
          </Button>
        </div>
        <div className="col-span-5 flex flex-col space-y-4">
          <div className="flex w-full flex-shrink-0 items-center justify-center gap-2 border-solid">
            <SearchBox onChange={handleSearchFlow} />
            <Button
              className="w-10 p-0"
              variant="ghost"
              onClick={toggleIsOpenCreateForm}
            >
              <AddIcon size={20} />
            </Button>
          </div>
          <div className="grow space-y-3 rounded-md bg-active p-2">
            {isOpenCreateForm && <FlowAddForm onSubmit={handleAddFlow} />}
            <ScrollArea className="h-72 gap-4 rounded-md">
              {filterFlows.map((flow) => (
                <div
                  key={flow.id}
                  className={cn(
                    'my-auto grid h-10 grid-cols-12 px-2',
                    activeFlowStyle(flow.id),
                  )}
                >
                  <div className="col-span-9 flex items-center space-x-2">
                    <Checkbox
                      id={`flow-${flow.id}`}
                      checked={selectedFlows.some(({ id }) => id === flow.id)}
                      disabled={isAlreadyJoined(flow.id, flow.name)}
                      onCheckedChange={(checked) =>
                        handleCheckedChangeFlow(checked, flow)
                      }
                    />
                    <label
                      htmlFor={`flow-${flow.id}`}
                      className="text-truncate flex grow justify-between"
                    >
                      <div className="shrink-0 grow text-sm">{flow.name}</div>
                      <div className="my-auto font-mono text-xs">
                        {flow.version}
                      </div>
                    </label>
                  </div>
                  <div className="col-span-3 flex items-center justify-end">
                    <CommonFlowAddPopover
                      data={{
                        name: flow.name,
                        version: flow.version,
                        oldFlowId: flow.id,
                      }}
                      onSubmit={handleReplicate}
                    />
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
      <h5 className="mt-4 flex items-center gap-2 text-sm text-gray-700">
        <CircleAlert size={20} />
        Common SubFlow 삭제/수정은 Management페이지의 Common SubFlow Editing에서
        진행해주세요.
      </h5>
    </>
  )
}
