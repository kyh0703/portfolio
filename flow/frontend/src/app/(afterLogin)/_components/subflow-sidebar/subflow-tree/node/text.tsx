'use client'

import { FlowTreeData } from '@/models/subflow-list'
import { Separator } from '@/ui/separator'
import { formatKoreanTime } from '@/utils'
import { PropsWithChildren, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Tooltip } from 'react-tooltip'

type NodeTextProps = {
  data: FlowTreeData
}

export default function NodeText({
  data: { id, name, desc, updateDate },
}: NodeTextProps) {
  const hiddenTooltip = useMemo(() => name === 'main' || name === 'end', [name])
  return (
    <>
      <span
        className="overflow-hidden text-ellipsis text-nowrap"
        data-tooltip-id={`subflow-node-${id}`}
        data-tooltip-content={desc}
        data-tooltip-update-at={formatKoreanTime(updateDate)}
      >
        {name}
      </span>
      <BodyPortal>
        <Tooltip
          id={`subflow-node-${id}`}
          place="right"
          hidden={hiddenTooltip}
          opacity={1}
          className="max-w-64 bg-tooltip px-2 py-1.5"
          render={({ content, activeAnchor }) => (
            <>
              <p className="text-xs">
                {activeAnchor?.getAttribute('data-tooltip-update-at')}
              </p>
              {content && (
                <>
                  <Separator className="my-1 opacity-40" />
                  <p className="break-all text-sm">{content}</p>
                </>
              )}
            </>
          )}
        />
      </BodyPortal>
    </>
  )
}

function BodyPortal({ children }: PropsWithChildren) {
  return createPortal(children, document.body)
}
