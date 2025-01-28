'use client'

import { Button } from '@/app/_components/button'
import { HamburgerMenuIcon, XIcon } from '@/app/_components/icon'
import { Tab, Tabs } from '@/app/_components/tab'
import { useRemoveHistory } from '@/services/subflow'
import { useUserContext } from '@/store/context'
import { useCurrentTab, useFlowTabStore } from '@/store/flow-tab'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { cn } from '@/utils/cn'
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'

export default function FlowTabs() {
  const router = useRouter()
  const { id: flowId } = useUserContext()
  const currentTab = useCurrentTab(flowId)

  const [moveTab, closeTab] = useFlowTabStore((state) => [
    state.moveTab,
    state.closeTab,
  ])

  const { mutate: removeHistoryMutate } = useRemoveHistory()

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    moveTab(flowId, result.source.index, result.destination.index)
  }

  const handleClose = useCallback(
    (event: React.MouseEvent, removeSubFlowId: number) => {
      event.stopPropagation()
      removeHistoryMutate({ subFlowId: removeSubFlowId })
      const subFlowId = closeTab(flowId, removeSubFlowId)
      router.push(`/subflows/${subFlowId}`)
    },
    [closeTab, flowId, removeHistoryMutate, router],
  )

  const handleTabClick = (index: number) => {
    const subFlow = currentTab.subFlows[index]
    if (subFlow) {
      router.push(`/subflows/${subFlow.id}`)
    }
  }

  return (
    <div className={cn('flex w-full items-center justify-between')}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <Tabs
              ref={provided.innerRef}
              value={currentTab.index}
              {...provided.droppableProps}
            >
              {currentTab &&
                currentTab.subFlows.map(({ id, name }, index) => (
                  <Draggable
                    key={id}
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
                            currentTab.subFlows.length > 1 && (
                              <XIcon
                                width={12}
                                height={12}
                                className="invisible shrink-0 group-hover:visible"
                                onClick={(e) => handleClose(e, id)}
                              />
                            )
                          }
                          selected={currentTab.index === index}
                          iconPosition="end"
                          onClick={() => handleTabClick(index)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </Tabs>
          )}
        </Droppable>
      </DragDropContext>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="mr-2" variant="ghost" size="icon">
            <HamburgerMenuIcon width={24} height={24} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          {currentTab &&
            currentTab.subFlows.map((subFlow, index) => (
              <DropdownMenuItem
                key={subFlow.id}
                className={cn(
                  'h-11',
                  'overflow-hidden text-ellipsis text-nowrap',
                  currentTab.index === index &&
                    'bg-accent text-accent-foreground',
                )}
                onClick={() => {
                  router.push(`/subflows/${subFlow.id}`)
                }}
              >
                {subFlow.name}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
