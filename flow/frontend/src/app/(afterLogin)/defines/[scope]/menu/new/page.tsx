import Spinner from '@/app/_components/spinner'
import type { DefineScope } from '@/types/define'
import { Suspense } from 'react'
import MenuNew from '../_components/menu-new'

export default function Page({ params }: { params: { scope: DefineScope } }) {
  const { scope } = params

  return (
    <section className="flex h-full w-full">
      <Suspense fallback={<Spinner />}>
        <MenuNew scope={scope} />
      </Suspense>
    </section>
  )
}
