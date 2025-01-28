import { RightArrowIcon } from '@/app/_components/icon'
import { Separator } from '@/ui/separator'
import DefineScopeButton from './scope-button'
import DefineItems from './items'

export default function DefineSidebar() {
  return (
    <aside className="flex h-full w-full flex-col font-poppins">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between text-nowrap">
          <h2 className="text-base text-truncate">Definition Data Management</h2>
          <RightArrowIcon />
        </div>
        <div className="flex flex-col gap-[8px]">
          <DefineScopeButton />
        </div>
      </div>
      <Separator />
      <div className="p-6 text-base">
        <DefineItems />
      </div>
    </aside>
  )
}
