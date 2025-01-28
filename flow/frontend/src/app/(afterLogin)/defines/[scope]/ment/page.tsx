import Spinner from '@/app/_components/spinner'
import type { DefineScope } from '@/types/define'
import { Suspense } from 'react'
import MentList from './_components/ment-list'

export default async function Page({
  params,
}: {
  params: { scope: DefineScope }
}) {
  const { scope } = params

  return (
    <section className="h-full w-full">
      <Suspense fallback={<Spinner />}>
        <MentList scope={scope} />
      </Suspense>
    </section>
  )
}
