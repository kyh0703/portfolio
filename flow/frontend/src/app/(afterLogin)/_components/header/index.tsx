import { cn } from '@/utils/cn'
import dynamic from 'next/dynamic'
import Title from '../title'
import Avatar from './avatar'
import BuildButton from './build-button'
import ExitButton from './exit-button'
import UploadButton from './upload-button'
import WebsocketSubscriber from './websocket-subscriber'

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
      <nav className="flex items-center gap-5">
        <UploadButton />
        <BuildButton />
        <div className="flex items-center justify-end gap-[5px] p-0">
          <ThemeToggle />
          <Avatar />
          <ExitButton />
        </div>
      </nav>
      <WebsocketSubscriber />
    </header>
  )
}
