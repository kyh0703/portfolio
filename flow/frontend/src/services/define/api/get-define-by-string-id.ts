import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const getDefineByStringId = async <T>(defineId: string) => {
  const response = await fetchExtended<
    ApiResponse<{ property: T; updateTime: Date }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/defines/property/${defineId}`, {
    method: 'GET',
  })

  return response.body.data
}
