import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const getDefine = async <T>(defineId: number) => {
  const response = await fetchExtended<
    ApiResponse<{ property: T; updateTime: Date }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/defines/${defineId}`, {
    method: 'GET',
  })

  return response.body.data
}
