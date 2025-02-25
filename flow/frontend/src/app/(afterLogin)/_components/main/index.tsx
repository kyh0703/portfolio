'use client'

import Spinner from '@/app/_components/spinner'
import { useLayoutStore } from '@/store/layout'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/ui/resizable'
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type PropsWithChildren,
} from 'react'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import { useShallow } from 'zustand/react/shallow'
import Footer from '../footer'
import LeftSideBar from '../left-sidebar'
import LoadingPortal from '../loading-portal'

export default function Main({ children }: PropsWithChildren) {
  const footerRef = useRef<ImperativePanelHandle>(null)
  const [open, setLeftSidebarWidth, footer] = useLayoutStore(
    useShallow((state) => [
      state.leftSidebar.open,
      state.setLeftSidebarWidth,
      state.footer,
    ]),
  )

  const handleLeftSidebarResize = useCallback(
    (size: number, _: number | undefined) => {
      const width = (window.innerWidth * size) / 100
      setLeftSidebarWidth(width)
    },
    [setLeftSidebarWidth],
  )

  useLayoutEffect(() => {
    const width = (window.innerWidth * 20) / 100
    setLeftSidebarWidth(width)
  }, [setLeftSidebarWidth])

  useEffect(() => {
    if (footer.action === 'up') {
      footerRef.current?.expand()
    } else {
      footerRef.current?.collapse()
    }
  }, [footer])

  return (
    <>
      <LoadingPortal />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={20}
          maxSize={50}
          hidden={!open}
          onResize={handleLeftSidebarResize}
        >
          <LeftSideBar />
        </ResizablePanel>
        <ResizableHandle className="w-1 data-[resize-handle-active]:bg-left-tool data-[resize-handle-state=hover]:bg-left-tool" />
        <ResizablePanel>
          <div className="flex h-full w-full bg-main">
            <main className="grow overflow-hidden bg-main p-4">
              <Suspense fallback={<Spinner />}>
                <div className="flex h-full flex-col bg-background text-foreground">
                  <ResizablePanelGroup direction="vertical">
                    <ResizablePanel>{children}</ResizablePanel>
                    <ResizableHandle className="w-1 data-[resize-handle-active]:bg-left-tool data-[resize-handle-state=hover]:bg-left-tool" />
                    <ResizablePanel
                      ref={footerRef}
                      defaultSize={20}
                      maxSize={50}
                      collapsedSize={0}
                      collapsible
                    >
                      <Footer />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
              </Suspense>
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}
