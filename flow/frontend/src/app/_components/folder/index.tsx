'use client'

import { BottomArrowIcon, TopArrowIcon } from '@/app/_components/icon'
import { useState, type MouseEventHandler, type PropsWithChildren } from 'react'

export type FolderProps = {
  title: string
} & PropsWithChildren

export default function Folder({ title, children }: FolderProps) {
  const [selected, setSelected] = useState(true)

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    setSelected((prev) => !prev)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center p-5">
      <div className="flex w-full justify-between" onClick={handleClick}>
        <span className="text-base font-semibold">{title}</span>
        {selected ? (
          <TopArrowIcon width={12} height={12} />
        ) : (
          <BottomArrowIcon width={12} height={12} />
        )}
      </div>
      {selected && <div className="mt-5 w-full">{children}</div>}
    </div>
  )
}
