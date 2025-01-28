'use client'

import { Button } from '@/app/_components/button'
import { useBuildStore } from '@/store/build'
import {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from '@/ui/hover-card'
import { cn } from '@/utils'
import { Wrench } from 'lucide-react'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import BuildProgressModal from './build-status-modal'

type ActiveButtonProps = {
  isSelf: boolean
  onClick?: (buildType: 'build' | 'rebuild' | 'buildstop') => void
}

export function ActiveButton({ isSelf, onClick }: ActiveButtonProps) {
  const status = useBuildStore(useShallow((state) => state.build.status))

  const progress = useMemo(() => {
    if (status?.data.logs.type === 'Status') {
      const { procCount, totalCount } = status.data.logs.message
      return (procCount / totalCount) * 100
    }
    return 0
  }, [status])

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="secondary"
          className="relative w-[110px] overflow-hidden transition-all"
          onClick={() => isSelf && onClick?.('buildstop')}
        >
          <div
            className="absolute inset-0 origin-left bg-secondary/70 transition-transform duration-300 ease-in-out"
            style={{
              transform: `scaleX(${progress})`,
              backgroundColor: 'rgba(41, 140, 133, 0.7)',
            }}
          />
          <div
            className={cn(
              'absolute inset-0 z-10 flex items-center justify-between',
              isSelf ? 'px-4' : 'px-2',
            )}
          >
            <Wrench size={18} />
            {isSelf ? (
              <span className="grow">Stop</span>
            ) : (
              <span className="text-sm">Building...</span>
            )}
          </div>
        </Button>
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent className="w-full bg-dialog">
          {status && <BuildProgressModal data={status} />}
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  )
}
