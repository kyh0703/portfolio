'use client'

import { Button } from '@/app/_components/button'
import { uploadSwat } from '@/services/flow'
import { CloudUpload } from 'lucide-react'

export default function UploadButton() {
  const handleClick = async () => {
    await uploadSwat()
  }

  return (
    <Button
      className="flex w-[110px] justify-between bg-violet-700 hover:bg-violet-900 focus:bg-violet-900"
      onClick={handleClick}
    >
      <CloudUpload className="mr-2" size={18} />
      <span className="grow">Upload</span>
    </Button>
  )
}
