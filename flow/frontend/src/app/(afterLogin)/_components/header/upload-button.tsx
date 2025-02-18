'use client'

import { Button } from '@/app/_components/button'
import { uploadSwat } from '@/services/flow'
import logger from '@/utils/logger'
import { CloudUpload } from 'lucide-react'
import { toast } from 'react-toastify'

export default function UploadButton() {
  const handleClick = async () => {
    try {
      await uploadSwat()
      toast.success('Upload 요청을 전송했습니다.')
    } catch (error) {
      toast.error('Upload 요청을 전송하는데 실패했습니다.')
      logger.error('failed to upload swat', error)
    }
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
