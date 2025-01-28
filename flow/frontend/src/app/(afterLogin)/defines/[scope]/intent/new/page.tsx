import Spinner from '@/app/_components/spinner'
import { Suspense } from 'react'
import IntentRegisterForm from '../_components/intent-register-form'
import type { DefineScope } from '@/types/define'

export default function Page({ params }: { params: { scope: DefineScope } }) {
  const { scope } = params

  return (
    <section className="h-full w-full">
      <Suspense fallback={<Spinner />}>
        <IntentRegisterForm scope={scope} />
      </Suspense>
    </section>
  )
}
