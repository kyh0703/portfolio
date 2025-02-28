'use client'


export default function UnAuthorizedError({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {/* <Image
        src={UnAuthorizedIllustration}
        width={292}
        height={183}
        alt="not-found"
        priority
      /> */}
      <h1 className="mt-14 text-center font-poppins text-3xl font-semibold text-gray-550">
        Return Home(to SWAT)
        <br />
        401 Unauthorized Error
      </h1>
      <h3 className="mb-14 mt-4 text-2xl font-medium text-gray-550">
        {message || '인증 오류가 발생했습니다.'}
      </h3>
    </div>
  )
}
