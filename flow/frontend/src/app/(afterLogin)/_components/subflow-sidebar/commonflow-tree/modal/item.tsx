'use client'

import { Separator } from '@/ui/separator'
import { SubFlowList } from '@/models/subflow-list'
import { Tooltip } from 'react-tooltip'
import { twJoin } from 'tailwind-merge'

type CommonFlowMenuItemProps = {
  commonFlowName: string
  description: string
  isActive?: boolean
  onDoubleClick?: (id: number, label: string) => void
}

export default function CommonFlowMenuItem({
  id,
  name,
  updateDate,
  commonFlowName,
  description,
  isActive,
  onDoubleClick,
}: CommonFlowMenuItemProps & SubFlowList) {
  const handleDoubleClick = () => {
    onDoubleClick && onDoubleClick(id, name)
  }

  return (
    <div
      className={twJoin(
        'relative',
        'h-[36px] w-full rounded',
        'flex items-center justify-between',
        isActive && 'bg-gray-120',
      )}
      onDoubleClick={handleDoubleClick}
    >
      <a
        data-tooltip-id="commonflow-id"
        data-tooltip-content={description}
        data-tooltip-update-at={updateDate}
        style={{ width: '100%' }}
      >
        {commonFlowName}
      </a>
      <Tooltip
        id="commonflow-id"
        render={({ content, activeAnchor }) => (
          <div className="font-poppins text-sm">
            <p>{activeAnchor?.getAttribute('data-tooltip-update-at') || ''}</p>
            {content && (
              <>
                <Separator />
                <p>{content}</p>
              </>
            )}
          </div>
        )}
      />
    </div>
  )
}
