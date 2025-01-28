import { fetchExtended } from '@/services/lib/fetch'
import { CustomResponse } from '@/services/types'
import type { DefineScope, DefineType } from '@/types/define'

export const updateDefine = async <T>({
  databaseId,
  defineId,
  scope,
  type,
  data,
}: {
  databaseId: number
  defineId: string
  scope: DefineScope
  type: DefineType
  data: T
}) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/defines/${databaseId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scope,
        type,
        defineId,
        data,
      }),
    },
  )

  return response.body
}
