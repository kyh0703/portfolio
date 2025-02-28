'use client'

import { useLayoutStore, type FooterTab } from '@/store/layout'
import { Separator } from '@/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { useShallow } from 'zustand/react/shallow'
import FooterIcon from './icon'
import BuildTab from './tabs/log-tab'
import CompileTab from './tabs/compile-tab'

const tabList: FooterTab[] = ['build', 'compile']

export default function Footer() {
  const [footerTab, setFooterTab] = useLayoutStore(
    useShallow((state) => [state.footerTab, state.setFooterTab]),
  )

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background text-foreground">
      <Tabs
        className="flex h-full w-full flex-col"
        value={footerTab}
        onValueChange={(value) => setFooterTab(value as FooterTab)}
      >
        <div className="flex items-center justify-between p-2">
          <TabsList className="bg-background">
            {tabList.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <FooterIcon />
        </div>
        <Separator />
        <div className="flex-grow overflow-hidden">
          <TabsContent value="build" className="h-full">
            <BuildTab />
          </TabsContent>
          <TabsContent value="compile" className="h-full">
            <CompileTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
