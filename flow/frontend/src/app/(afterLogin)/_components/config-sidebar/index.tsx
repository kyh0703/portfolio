import { RightArrowIcon } from '@/app/_components/icon'
import { Separator } from '@/ui/separator'
import ConfigItems from './items'

export default function ConfigSidebar() {
  return (
    <aside className="flex h-full w-full flex-col font-poppins">
      <div className="flex items-center justify-between gap-6 text-nowrap p-6">
        <h2 className="text-truncate text-base">Management</h2>
        <RightArrowIcon />
      </div>
      <Separator />
      <div className="p-6 text-base">
        <ConfigItems />
      </div>
    </aside>
  )
}
