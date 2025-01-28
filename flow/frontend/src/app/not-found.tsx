'use client'

import Image from 'next/image'
import NotFoundIllustration from '/public/images/illustrations/not-found.png'

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Image
        src={NotFoundIllustration}
        width={200}
        height={174}
        alt="not-found"
        priority
      />
      <h1 className="mt-14 text-center font-poppins text-3xl font-semibold text-gray-550">
        Not-Found(error status: 404)
      </h1>
      <h3 className="mb-14 mt-4 text-2xl font-medium text-gray-550">
        요청하신 페이지는 존재하지 않습니다.
      </h3>
    </div>
  )
}
