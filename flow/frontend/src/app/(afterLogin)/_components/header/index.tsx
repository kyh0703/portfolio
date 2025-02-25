import { cn } from '@/utils/cn'
import dynamic from 'next/dynamic'
import Title from '../title'
import BuildButton from './build-button'
import UploadButton from './upload-button'
import WebsocketSubscriber from './websocket-subscriber'
import BookmarkButton from './bookmark-button'
import BotButton from './bot-button'

const ThemeToggle = dynamic(() => import('./theme-toggle'), { ssr: false })

export default function Header() {
  return (
    <header
      className={cn(
        'flex items-center justify-between',
        'sticky',
        'font-noto text-xl font-medium leading-[26px]',
        'h-header',
        'px-[20px] py-[13px]',
        'border-b border-solid',
      )}
    >
      <Title />
      <section className="flex flex-1 items-center justify-center">
        <div
          className={cn(
            'flex h-9 min-w-[320px] items-center justify-center gap-4 rounded-lg px-5',
            'bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5',
            'border border-primary/20',
            'shadow-sm shadow-primary/10',
            'backdrop-blur-md',
          )}
        >
          <BookmarkButton />
          <BotButton />
          <ThemeToggle />
        </div>
      </section>
      <nav className="flex items-center gap-5">
        <BuildButton />
        <UploadButton />
      </nav>
      <WebsocketSubscriber />
    </header>
  )
}
