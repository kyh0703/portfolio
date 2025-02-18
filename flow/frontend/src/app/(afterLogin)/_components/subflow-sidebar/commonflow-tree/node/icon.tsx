'use client'

import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileIcon,
  FolderClosedIcon,
} from 'lucide-react'

type NodeIconProps = {
  type: 'file' | 'folder'
  isOpen: boolean
}

export default function NodeIcon({ type, isOpen }: NodeIconProps) {
  return (
    <div className="flex shrink-0 gap-1">
      {type === 'folder' && (
        <>
          {isOpen ? (
            <ChevronDownIcon
              className="text-[#757575] dark:text-[#B0BEC5]"
              size={15}
            />
          ) : (
            <ChevronRightIcon
              className="text-[#757575] dark:text-[#B0BEC5]"
              size={15}
            />
          )}
        </>
      )}
      {type === 'folder' ? (
        <FolderClosedIcon className="text-[#1976D2]" size={15} />
      ) : (
        <FileIcon className="text-[#757575] dark:text-[#B0BEC5]" size={15} />
      )}
    </div>
  )
}
