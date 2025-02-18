'use client'

import { FlowTreeData } from '@/models/subflow-list'
import { Separator } from '@/ui/separator'
import { cn, formatKoreanTime } from '@/utils'
import { PropsWithChildren, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Tooltip } from 'react-tooltip'

type NodeTextProps = {
  data: FlowTreeData
}

export default function NodeText({
  data: { id, name, desc, type, version, updateDate },
}: NodeTextProps) {
  const hiddenTooltip = useMemo(() => name === 'main' || name === 'end', [name])
  return (
    <div
      className={cn('grid w-full overflow-hidden', {
        'grid-cols-[7fr_5fr]': type === 'file',
        'grid-cols-[12fr]': type !== 'file',
      })}
    >
      <div className="text-truncate">
        <span
          data-tooltip-id={`common-subflow-node-${id}`}
          data-tooltip-content={desc}
          data-tooltip-update-at={formatKoreanTime(updateDate)}
        >
          {name}
        </span>
      </div>
      {type === 'file' && (
        <div className="text-truncate my-auto text-right font-mono text-xs">
          {version}
        </div>
      )}
      <BodyPortal>
        <Tooltip
          id={`common-subflow-node-${id}`}
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
    </div>
  )
}

function BodyPortal({ children }: PropsWithChildren) {
  return createPortal(children, document.body)
}
