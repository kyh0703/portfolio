'use client'

import { useQuerySubFlows } from '@/services/flow'
import { setTokens } from '@/services/lib/token'
import { useQueryOption } from '@/services/option/queries'
import useQueryToken from '@/services/token/queries/use-query-token'
import { useContextStore } from '@/store/context'
import { useFlowTabStore } from '@/store/flow-tab'
import { useManagementStore } from '@/store/management'
import { useQueries, useQuery } from '@tanstack/react-query'
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
  const setUseSnapshot = useManagementStore((state) => state.setUseSnapshot)
  const initializeTab = useFlowTabStore((state) => state.initializeTab)

  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
    setTokens({ accessToken, refreshToken })
  }, [accessToken, refreshToken])

  const { token, option } = useQueries({
    queries: [
      { ...useQueryToken(), enabled: mounted },
      { ...useQueryOption(), enabled: mounted },
    ],
    combine: (results) => ({
      token: results[0].data,
      option: results[1].data,
    }),
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
    if (option) {
      setUseSnapshot(option.snapShot.use)
    }
  }, [option, setUseSnapshot])

  useEffect(() => {
    if (subFlows && token) {
      const subFlowId = initializeTab(token.id, subFlows)
      router.push(`/subflows/${subFlowId}`)
    }
  }, [subFlows, token, router, initializeTab])

  return null
}
