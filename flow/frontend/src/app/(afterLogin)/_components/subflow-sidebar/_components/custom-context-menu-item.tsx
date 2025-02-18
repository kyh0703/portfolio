'use client'

import { PropsWithChildren } from 'react'

type CustomContextMenuItemProps = { onClick?: () => void } & PropsWithChildren

export default function CustomContextMenuItem({
  children,
  onClick,
}: CustomContextMenuItemProps) {
  return (
    <div
      className="relative flex cursor-default select-none items-center rounded-none px-2 py-1.5 text-sm font-normal outline-none hover:bg-context-focus hover:font-medium hover:text-context-focus-text data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      onClick={onClick}
    >
      {children}
    </div>
  )
}
