'use client'

import { useLayoutStore } from '@/store/layout'
import { Button } from '@/ui/button'
import { ArrowDownFromLineIcon, EraserIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

export default function FooterIcon() {
  const [footerTab, triggerFooter] = useLayoutStore(
    useShallow((state) => [state.footerTab, state.triggerFooter]),
  )

  return (
    <div>
      <Button variant="ghost" size="icon" >
        <EraserIcon size={15} />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => triggerFooter('down')}>
        <ArrowDownFromLineIcon size={15} />
      </Button>
    </div>
  )
}
