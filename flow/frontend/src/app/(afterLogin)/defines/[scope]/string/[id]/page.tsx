import Spinner from '@/app/_components/spinner'
import type { DefineScope } from '@/types/define'
import { Suspense } from 'react'
import StringDetailForm from '../_component/string-detail-form'

export default function Page({
  params,
}: {
  params: { scope: DefineScope; id: string }
}) {
  const { scope, id } = params

  return (
    <section className="h-full w-full">
      <Suspense fallback={<Spinner />}>
        <StringDetailForm scope={scope} databaseId={+id} />
      </Suspense>
    </section>
  )
}
