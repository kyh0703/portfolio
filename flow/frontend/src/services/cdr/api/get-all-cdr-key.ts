import type { CdrType } from '@/constants/options'
import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const getAllCdrKey = async (type: CdrType) => {
  const response = await fetchExtended<
    ApiResponse<{ name: string; desc: string }[]>
  >(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/reserveds/cdrlist/${type.toLowerCase()}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
