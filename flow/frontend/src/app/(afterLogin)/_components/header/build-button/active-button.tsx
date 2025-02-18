'use client'

import { Button } from '@/app/_components/button'
import { useBuildStore } from '@/store/build'
import {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from '@/ui/hover-card'
import { Wrench } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import BuildProgressModal from './build-status-modal'

type ActiveButtonProps = {
  isSelf: boolean
  onClick?: (buildType: 'build' | 'rebuild' | 'buildstop') => void
}

export function ActiveButton({ isSelf, onClick }: ActiveButtonProps) {
  const isStopping = useBuildStore(
    useShallow((state) => state.build.isStopping),
  )

  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>
        <Button
          variant="secondary"
          className="relative w-[110px] overflow-hidden transition-all"
          disabled={isStopping}
          onClick={() => isSelf && onClick?.('buildstop')}
        >
          <Wrench size={18} />
          {isSelf ? (
            <span className="grow">Stop</span>
          ) : (
            <span className="text-sm">Building...</span>
          )}
        </Button>
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent className="w-full bg-dialog">
          <BuildProgressModal />
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  )
}
