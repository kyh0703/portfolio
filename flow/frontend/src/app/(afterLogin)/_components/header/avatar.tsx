'use client'

import { Button } from '@/app/_components/button'
import { DarkUserIcon, UserIcon } from '@/app/_components/icon'
import { useUserContext } from '@/store/context'
import {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from '@/ui/hover-card'

export default function Avatar() {
  const { user } = useUserContext()

  const getLevelColor = (level: number) => {
    if (level < 10) {
      return 'bg-blue-500'
    }
    if (level < 20) {
      return 'bg-green-500'
    }
    if (level < 30) {
      return 'bg-yellow-500'
    }
    return 'bg-red-500'
  }
  const levelColor = getLevelColor(+user.userLevel)

  return (
    <HoverCard openDelay={200} closeDelay={200}>
      <HoverCardTrigger>
        <Button size="icon" variant="ghost">
          <UserIcon className="light-icon" width={32} height={32} />
          <DarkUserIcon className="dark-icon" width={32} height={32} />
        </Button>
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent className="w-32">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">{user.userName}</h4>
            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${levelColor.split(' ')[0]}`}
              ></div>
              <p className="text-sm">Level {user.userLevel}</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  )
}
