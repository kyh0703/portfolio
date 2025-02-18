'use client'

import { Button } from '@/app/_components/button'
import { useBuildStore } from '@/store/build'
import { useLayoutStore } from '@/store/layout'
import { ArrowDownFromLineIcon, EraserIcon } from 'lucide-react'
import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'

export default function FooterIcon() {
  const [footerTab, triggerFooter] = useLayoutStore(
    useShallow((state) => [state.footerTab, state.triggerFooter]),
  )
  const [resetBuildMessages, resetCompileMessages] = useBuildStore(
    useShallow((state) => [state.resetBuildMessage, state.resetCompileMessage]),
  )

  const handleEraserClick = useCallback(() => {
    switch (footerTab) {
      case 'build':
        resetBuildMessages()
        break
      case 'compile':
        resetCompileMessages()
        break
    }
  }, [footerTab, resetBuildMessages, resetCompileMessages])

  return (
    <div>
      <Button variant="ghost" size="icon" onClick={handleEraserClick}>
        <EraserIcon size={15} />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => triggerFooter('down')}>
        <ArrowDownFromLineIcon size={15} />
      </Button>
    </div>
  )
}
