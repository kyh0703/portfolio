import Spinner from '@/app/_components/spinner'
import type { DefineScope } from '@/types/define'
import { Suspense } from 'react'
import PacketRegisterForm from '../_components/packet-register-form'

export default function Page({ params }: { params: { scope: DefineScope } }) {
  const { scope } = params

  return (
    <section className="h-full w-full">
      <Suspense fallback={<Spinner />}>
        <PacketRegisterForm scope={scope} />
      </Suspense>
    </section>
  )
}
