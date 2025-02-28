'use client'

import { Button } from '@/ui/button'
import { RefreshCwIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function InternalServerError({ message }: { message?: string }) {
  const router = useRouter()

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {/* <Image
        src={InternalServerIllustration}
        width={287}
        height={197}
        alt="internal-server-error"
        priority
      /> */}
      <h1 className="mt-14 text-center font-poppins text-3xl font-semibold text-gray-550">
        Return Home(to SWAT)
        <br />
        Internal Server Error(error status: 500)
      </h1>
      <h3 className="mt-4 text-2xl font-medium text-gray-550">
        {message || '사이트에 연결할 수 없습니다.'}
      </h3>
      <h3 className="mb-14 text-2xl font-medium text-gray-550">
        잠시 후 다시 시도해주세요.
      </h3>
      <Button
        className="flex h-11 w-28 items-center justify-between text-gray-550"
        variant="outline"
        onClick={router.back}
      >
        <RefreshCwIcon size={20} />
        <h4 className="text-base">Refresh</h4>
      </Button>
    </div>
  )
}
