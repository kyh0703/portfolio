'use client'

import { useQuerySubFlows } from '@/services/flow'
import { setTokens } from '@/services/lib/token'
import useQueryToken from '@/services/token/queries/use-query-token'
import { useContextStore } from '@/store/context'
import { getSubFlowPath } from '@/utils/route-path'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useLayoutEffect, useState } from 'react'

export default function AuthRedirect({
  localIp,
  accessToken,
  refreshToken,
}: {
  localIp: string
  accessToken: string
  refreshToken: string
}) {
  const router = useRouter()
  const initialize = useContextStore((state) => state.Initialize)
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
    setTokens({ accessToken, refreshToken })
  }, [accessToken, refreshToken])

  const { data: token } = useQuery({
    ...useQueryToken(),
    enabled: mounted,
  })

  const { data: subFlows } = useQuery({
    ...useQuerySubFlows(),
    enabled: !!token,
    select: (data) => data?.flow,
  })

  useEffect(() => {
    if (token) {
      initialize({ ...token, localIp })
    }
  }, [token, initialize, localIp])

  useEffect(() => {
    if (subFlows && token) {
      router.push(getSubFlowPath())
    }
  }, [subFlows, token, router, initialize])

  return null
}
