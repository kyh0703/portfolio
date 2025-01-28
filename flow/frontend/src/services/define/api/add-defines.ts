import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'
import type { DefineScope, DefineType } from '@/types/define'

export const addDefines = async <T>(data: {
  data: { scope: DefineScope; type: DefineType; defineId: string; data: T }[]
}) => {
  const response = await fetchExtended<
    ApiResponse<{
      list: { id: number; defineId: string; property: T; updateTime: Date }[]
    }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/defines/list/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return response.body.data
}
