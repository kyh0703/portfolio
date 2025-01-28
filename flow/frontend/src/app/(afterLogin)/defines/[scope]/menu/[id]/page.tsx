import Spinner from '@/app/_components/spinner'
import type { DefineScope } from '@/types/define'
import { Suspense } from 'react'
import MenuTree from '../_components/menu-tree'

export default function Page({
  params,
}: {
  params: { scope: DefineScope; id: string }
}) {
  const { scope, id } = params
  const rootId = +id

  return (
    <section className="h-full w-full">
      <Suspense fallback={<Spinner />}>
        <MenuTree scope={scope} rootId={rootId} />
      </Suspense>
    </section>
  )
}
