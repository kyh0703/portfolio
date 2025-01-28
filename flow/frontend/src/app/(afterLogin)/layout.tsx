import { WebSocketProvider } from '@/contexts/websocket-context'
import YjsProvider from '@/contexts/yjs-context'
import { type PropsWithChildren } from 'react'
import Header from './_components/header'
import Main from './_components/main'
import NavigationBar from './_components/navigation-bar'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <YjsProvider>
      <WebSocketProvider>
        <div className="flex h-full w-full overflow-hidden">
          <NavigationBar />
          <div className="flex h-full w-full flex-col overflow-hidden">
            <Header />
            <div className="flex h-full grow overflow-hidden">
              <Main>{children}</Main>
            </div>
          </div>
        </div>
      </WebSocketProvider>
    </YjsProvider>
  )
}
