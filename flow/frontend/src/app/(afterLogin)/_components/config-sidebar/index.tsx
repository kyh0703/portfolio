import { RightArrowIcon } from '@/app/_components/icon'
import { Separator } from '@/ui/separator'
import ConfigItems from './items'

export default function ConfigSidebar() {
  return (
    <aside className="flex h-full w-full flex-col font-poppins">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between text-nowrap">
          <h2 className="text-base">Management</h2>
          <RightArrowIcon />
        </div>
      </div>
      <Separator />
      <div className="p-4 text-base">
        <ConfigItems />
      </div>
    </aside>
  )
}
