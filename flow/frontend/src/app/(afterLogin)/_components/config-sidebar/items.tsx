import { UserLevel } from '@/constants/authorization'
import { useUserContext } from '@/store/context'
import { useManagementStore } from '@/store/management'
import { cn } from '@/utils'
import Link from 'next/link'
import { useShallow } from 'zustand/react/shallow'

const configMap = {
  options: 'Options',
  'commonflow-edit': 'Common SubFlow Editing',
  'import-export': 'Import/Export',
} as const

export type ConfigKeys = keyof typeof configMap

export default function ConfigItems() {
  const { user } = useUserContext()
  const [page, setPage] = useManagementStore(
    useShallow((state) => [state.page, state.setPage]),
  )
  const filterConfigItems = Object.entries(configMap).filter(
    ([path, label]) => {
      if (path === 'commonflow-edit') {
        return user.userLevel === UserLevel.Admin
      }
      return true
    },
  )

  return (
    <ul className="flex flex-col gap-3">
      {filterConfigItems.map(([path, label]) => (
        <Link key={path} href={`/managements/${path}`}>
          <li
            className={cn(
              'text-truncate cursor-pointer rounded p-2',
              'hover:bg-active hover:text-active-foreground',
              page == path && 'bg-active font-bold text-active-foreground',
            )}
            onClick={() => setPage(path as ConfigKeys)}
          >
            {label}
          </li>
        </Link>
      ))}
    </ul>
  )
}
