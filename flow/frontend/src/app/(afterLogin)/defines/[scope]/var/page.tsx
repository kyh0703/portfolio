import Spinner from '@/app/_components/spinner'
import type { DefineScope } from '@/types/define'
import { Suspense } from 'react'
import VarList from './_components/var-list'

export default async function Page({
  params,
}: {
  params: { scope: DefineScope }
}) {
  const { scope } = params

  return (
    <section className="h-full w-full">
      <Suspense fallback={<Spinner />}>
        <VarList scope={scope} />
      </Suspense>
    </section>
  )
}
