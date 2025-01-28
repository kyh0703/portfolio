import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'
import type { DefineList, DefineType } from '@/types/define'

export const getAllDefine = async <T>(type: DefineType) => {
  const response = await fetchExtended<ApiResponse<DefineList<T>[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/defines/list/${type}`,
    {
      method: 'GET',
    },
  )

  return response.body.data
}
