import { WebSocketProvider } from '@/contexts/websocket-context'
import YjsProvider from '@/contexts/yjs-context'
import { type PropsWithChildren } from 'react'
import Header from './_components/header'
import Main from './_components/main'
import NavigationBar from './_components/navigation-bar'
import { StatusBar } from './_components/status-bar'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <YjsProvider baseUrl={process.env.YJS_BASE_URL}>
      <WebSocketProvider baseUrl={process.env.WS_BASE_URL}>
        <div className="flex h-full w-full flex-col overflow-hidden">
          <div className="flex h-full w-full overflow-hidden">
            <NavigationBar />
            <div className="flex h-full w-full flex-col overflow-hidden">
              <Header />
              <div className="flex h-full grow overflow-hidden">
                <Main>{children}</Main>
              </div>
            </div>
          </div>
          <StatusBar />
        </div>
      </WebSocketProvider>
    </YjsProvider>
  )
}
