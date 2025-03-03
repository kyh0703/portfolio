import Spinner from '@/app/_components/spinner'
import { Suspense } from 'react'
import FlowLayout from './_components/flow-layout'
import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ focusNode?: string; focusTab?: string }>
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params
  const { focusNode, focusTab } = await searchParams

  if (!id) {
    redirect('/flow')
  }

  return (
    <Suspense fallback={<Spinner />}>
      <FlowLayout id={+id} focusNode={focusNode} focusTab={focusTab} />
    </Suspense>
  )
}
