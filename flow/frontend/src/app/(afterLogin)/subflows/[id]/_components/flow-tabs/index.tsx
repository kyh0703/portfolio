'use client'

import { Button } from '@/app/_components/button'
import { HamburgerMenuIcon, XIcon } from '@/app/_components/icon'
import { Tab, Tabs } from '@/app/_components/tab'
import { useRemoveHistory } from '@/services/subflow'
import { useUserContext } from '@/store/context'
import { useFlowTabStore } from '@/store/flow-tab'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
} from '@/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { cn } from '@/utils/cn'
import { getSubFlowPath } from '@/utils/route-path'
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd'
import { ContextMenuTrigger } from '@radix-ui/react-context-menu'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'

export default function FlowTabs() {
  const router = useRouter()
  const { id: flowId } = useUserContext()

  const [currentTab, moveTab, closeTab, closeOthersTab, closeAllTab] =
    useFlowTabStore(
      useShallow((state) => [
        state.tabs[flowId],
        state.moveTab,
        state.closeTab,
        state.closeOthersTab,
        state.closeAllTab,
      ]),
    )

  const { mutate: removeHistoryMutate } = useRemoveHistory()

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    moveTab(flowId, result.source.index, result.destination.index)
  }

  const handleClose = useCallback(
    (event: React.MouseEvent, closeSubFlowId: number) => {
      event.stopPropagation()
      removeHistoryMutate({ subFlowId: closeSubFlowId })
      const subFlowId = closeTab(flowId, closeSubFlowId)
      router.push(getSubFlowPath(subFlowId))
    },
    [closeTab, flowId, removeHistoryMutate, router],
  )

  const handleCloseOthers = useCallback(
    (event: React.MouseEvent, closeSubFlowId: number) => {
      event.stopPropagation()

      const result = closeOthersTab(flowId, closeSubFlowId)
      for (const subFlowId of result.closedSubFlowIds) {
        removeHistoryMutate({ subFlowId })
      }
      router.push(getSubFlowPath(result.subFlowId))
    },
    [closeOthersTab, flowId, removeHistoryMutate, router],
  )

  const handleCloseAll = useCallback(
    (event: React.MouseEvent) => {
      event?.stopPropagation()
      const closeSubFlowIds = closeAllTab(flowId)
      for (const subFlowId of closeSubFlowIds) {
        removeHistoryMutate({ subFlowId })
      }
      router.push(getSubFlowPath())
    },
    [closeAllTab, flowId, removeHistoryMutate, router],
  )

  const handleTabClick = (index: number) => {
    const subFlow = currentTab.subFlows[index]
    if (subFlow) {
      router.push(`/subflows/${subFlow.id}`)
    }
  }

  return (
    <div className={cn('flex w-full items-center justify-between')}>
      {currentTab && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided) => (
              <Tabs
                ref={provided.innerRef}
                value={currentTab.index}
                hiddenArrowButtons
                {...provided.droppableProps}
              >
                {currentTab.subFlows.map(({ id, name }, index) => (
                  <ContextMenu key={id}>
                    <ContextMenuTrigger>
                      <Draggable
                        draggableId={`id-${id}`}
                        index={index}
                        disableInteractiveElementBlocking={true}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            className="h-[40px] w-[166px]"
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Tab
                              className="group p-0"
                              label={name}
                              icon={
                                <XIcon
                                  className="invisible shrink-0 group-hover:visible"
                                  size={12}
                                  onClick={(event) => handleClose(event, id)}
                                />
                              }
                              selected={currentTab.index === index}
                              iconPosition="end"
                              onClick={() => handleTabClick(index)}
                            />
                          </div>
                        )}
                      </Draggable>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={(event) => handleClose(event, id)}
                      >
                        Close
                      </ContextMenuItem>
                      <ContextMenuItem
                        disabled={currentTab.subFlows.length === 1}
                        onClick={(event) => handleCloseOthers(event, id)}
                      >
                        Close Others
                      </ContextMenuItem>
                      <ContextMenuItem onClick={handleCloseAll}>
                        Close All
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
                {provided.placeholder}
              </Tabs>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="mr-2" variant="ghost" size="icon">
            <HamburgerMenuIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          {currentTab &&
            currentTab.subFlows.map((subFlow, index) => (
              <DropdownMenuItem
                key={subFlow.id}
                className={cn(
                  'h-11',
                  currentTab.index === index &&
                    'bg-accent text-accent-foreground',
                )}
                onClick={() => {
                  router.push(`/subflows/${subFlow.id}`)
                }}
              >
                <span className="overflow-hidden text-ellipsis text-nowrap">
                  {subFlow.name}
                </span>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
