import Spinner from '@/app/_components/spinner'
import type { DefineScope } from '@/types/define'
import { Suspense } from 'react'
import MenuStatDetailForm from '../_components/menu-stat-detail-form'

export default async function Page({
  params,
}: {
  params: { scope: DefineScope; id: string }
}) {
  const { scope, id } = params

  return (
    <section className="h-full w-full">
      <Suspense fallback={<Spinner />}>
        <MenuStatDetailForm scope={scope} databaseId={+id} />
      </Suspense>
    </section>
  )
}
