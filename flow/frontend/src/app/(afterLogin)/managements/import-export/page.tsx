import Spinner from '@/app/_components/spinner'
import { Suspense } from 'react'
import ImportExportTab from './tabs'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <section className="h-full w-full">
      <Suspense fallback={<Spinner />}>
        <ImportExportTab />
      </Suspense>
    </section>
  )
}
