'use client'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/ui/resizable'
import { Fragment, useCallback, useRef, useState } from 'react'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import CollapsibleItem from './collapsible-item'
import IntentOutline from './intent'
import MentOutline from './ment'
import MenuOutline from './menu'
import PacketOutline from './packet'
import UserFuncOutline from './userfunc'
import VarOutline from './var'

export const outlines = [
  { label: 'var', component: <VarOutline /> },
  { label: 'menu', component: <MenuOutline /> },
  { label: 'ment', component: <MentOutline /> },
  { label: 'packet', component: <PacketOutline /> },
  { label: 'intent', component: <IntentOutline /> },
  { label: 'userfunc', component: <UserFuncOutline /> },
] as const

const MIN_SIZE = 4

export type OutlineKey = (typeof outlines)[number]['label']

export default function OutlineSidebar() {
  const outlineRefs = useRef<Record<OutlineKey, ImperativePanelHandle | null>>(
    {} as Record<OutlineKey, ImperativePanelHandle | null>,
  )
  const [outlineStatus, setOutlineStatus] = useState<
    Record<OutlineKey, boolean>
  >(
    outlines.reduce(
      (acc, { label }) => {
        return (acc[label] = true), acc
      },
      {} as Record<OutlineKey, boolean>,
    ),
  )

  const togglePanel = useCallback((label: OutlineKey) => {
    setOutlineStatus((prev) => {
      const open = !prev[label]
      const next = { ...prev, [label]: open }
      const ref = outlineRefs.current[label]
      if (open) {
        ref?.expand()
      } else {
        ref?.collapse()
      }
      return next
    })
  }, [])

  return (
    <ResizablePanelGroup direction="vertical">
      {outlines.map(({ label, component }, index) => {
        const isLast = index === outlines.length - 1

        return (
          <Fragment key={label}>
            <ResizablePanel
              ref={(el) => {
                outlineRefs.current[label] = el
              }}
              minSize={MIN_SIZE}
              collapsedSize={MIN_SIZE}
              collapsible
            >
              <CollapsibleItem
                label={label}
                open={outlineStatus[label]}
                onOpenChange={() => togglePanel(label)}
              >
                {component}
              </CollapsibleItem>
            </ResizablePanel>
            {!isLast && <ResizableHandle />}
          </Fragment>
        )
      })}
    </ResizablePanelGroup>
  )
}
