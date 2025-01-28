import Spinner from '@/app/_components/spinner'
import type { DefineScope } from '@/types/define'
import { Suspense } from 'react'
import MenuStatRegisterForm from '../_components/menu-stat-register-form'

export default function Page({ params }: { params: { scope: DefineScope } }) {
  const { scope } = params

  return (
    <section className="h-full w-full">
      <Suspense fallback={<Spinner />}>
        <MenuStatRegisterForm scope={scope} />
      </Suspense>
    </section>
  )
}
