'use client'

import Folder from '@/app/_components/folder'
import SearchBox from '@/app/_components/search-bar'
import { useUserContext } from '@/store/context'
import { useCurrentTab } from '@/store/flow-tab'
import { useLayoutStore } from '@/store/layout'
import { Separator } from '@/ui/separator'
import React, { useEffect, useMemo, useState, type DragEvent } from 'react'
import { commands } from './types'
import { validateCommand } from './validator'

export default function CommandSidebar() {
  const { id: flowId } = useUserContext()
  const currentTab = useCurrentTab(flowId)
  const setNav = useLayoutStore((state) => state.setNav)
  const [searchFiled, setSearchField] = useState('')

  const filteredCommands = useMemo(() => {
    return Object.entries(commands)
      .map(([title, commandList]) => ({
        title,
        commands: commandList.filter(
          (command) =>
            command.title.toLowerCase().includes(searchFiled) &&
            validateCommand(
              currentTab.subFlows[currentTab.index].name,
              command,
            ),
        ),
      }))
      .filter((item) => item.commands.length > 0)
  }, [currentTab.index, currentTab.subFlows, searchFiled])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value.toLowerCase())
  }

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    nodeType: string,
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  useEffect(() => {
    setNav('component')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <aside className="flex h-full w-full flex-col gap-2">
      <div className="flex h-search w-full flex-shrink-0 items-center justify-center border-b border-solid px-4">
        <SearchBox onChange={handleChange} />
      </div>
      <section className="flex-grow overflow-auto font-poppins text-sm">
        {filteredCommands.map(({ title, commands }) => (
          <div key={title}>
            <Folder title={title}>
              <div className="grid grid-cols-[repeat(auto-fill,_minmax(65px,_1fr))] gap-5">
                {commands.map((command) => (
                  <div
                    key={command.nodeType}
                    className="flex flex-col items-center justify-center"
                    draggable
                    onDragStart={(e) => handleDragStart(e, command.nodeType)}
                  >
                    <command.icon cursor="grab" width={32} height={32} />
                    <p className="text-center text-xs">{command.title}</p>
                  </div>
                ))}
              </div>
            </Folder>
            <Separator />
          </div>
        ))}
      </section>
    </aside>
  )
}
