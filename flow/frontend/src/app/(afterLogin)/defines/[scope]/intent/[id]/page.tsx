import Spinner from '@/app/_components/spinner'
import type { DefineScope } from '@/types/define'
import { Suspense } from 'react'
import IntentDetailForm from '../_components/intent-detail-form'

export default function Page({
  params,
}: {
  params: { scope: DefineScope; id: string }
}) {
  const { scope, id } = params

  return (
    <section className="h-full w-full">
      <Suspense fallback={<Spinner />}>
        <IntentDetailForm scope={scope} databaseId={+id} />
      </Suspense>
    </section>
  )
}
