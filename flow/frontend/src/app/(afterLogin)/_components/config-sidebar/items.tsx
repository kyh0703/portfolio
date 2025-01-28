import { ManagementType } from '@/models/manage'
import { useManagementStore } from '@/store/management'
import { cn } from '@/utils'
import Link from 'next/link'
import { useShallow } from 'zustand/react/shallow'

const configItems = [
  { path: 'options', label: 'Options' },
  { path: 'commonflow-edit', label: 'Common SubFlow Editing' },
  { path: 'import-export', label: 'Import / Export' },
]

export default function ConfigItems() {
  const [page, setPage] = useManagementStore(
    useShallow((state) => [state.page, state.setPage]),
  )

  return (
    <ul className="flex flex-col gap-3">
      {configItems.map(({ path, label }) => (
        <Link key={path} href={`/managements/${path}`}>
          <li
            className={cn(
              'cursor-pointer rounded p-2',
              'hover:',
              page == path && 'bg-main font-bold text-brown',
              'text-truncate',
            )}
            onClick={() => setPage(path as ManagementType)}
          >
            {label}
          </li>
        </Link>
      ))}
    </ul>
  )
}
