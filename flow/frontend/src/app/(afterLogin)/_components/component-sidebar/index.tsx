'use client'

import Folder from '@/app/_components/folder'
import SearchBox from '@/app/_components/search-bar'
import { useFlowTabStore } from '@/store/flow-tab'
import { useLayoutStore } from '@/store/layout'
import { Separator } from '@/ui/separator'
import React, { useEffect, useMemo, useState, type DragEvent } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { components } from './types'

export default function ComponentSidebar() {
  const currentTab = useFlowTabStore(useShallow((state) => state.tabs[flowId]))
  const setNav = useLayoutStore((state) => state.setNav)
  const [searchFiled, setSearchField] = useState('')
  const subFlow = useMemo(
    () => currentTab?.subFlows[currentTab?.index] ?? undefined,
    [currentTab],
  )

  const filteredComponents = useMemo(() => {
    return Object.entries(components)
      .map(([title, componentItems]) => ({
        title,
        components: componentItems.filter(
          (component) =>
            component.title.toLowerCase().includes(searchFiled)
        ),
      }))
      .filter((item) => item.components.length > 0)
  }, [ searchFiled, subFlow?.name])

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
      <div className="flex h-search w-full flex-shrink-0 items-center justify-center border-b border-solid px-5">
        <SearchBox onChange={handleChange} />
      </div>
      <section className="flex-grow overflow-auto font-poppins">
        {filteredComponents.map(({ title, components }) => (
          <div key={title}>
            <Folder title={title}>
              <div className="grid grid-cols-[repeat(auto-fill,_minmax(65px,_1fr))] gap-5">
                {components.map((component) => (
                  <div
                    key={component.nodeType}
                    className="flex flex-col items-center justify-center"
                    draggable
                    onDragStart={(e) => handleDragStart(e, component.nodeType)}
                  >
                    <component.icon cursor="grab" size={32} />
                    <p className="text-center text-sm">{component.title}</p>
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
