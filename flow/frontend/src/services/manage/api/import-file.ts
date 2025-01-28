import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const importFile = async (files: FormData) => {
  const response = await fetchExtended<
    ApiResponse<{ failInfo: { name: string; msg: string }[] }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/admins/import/file`, {
    method: 'POST',
    body: files,
  })

  return response.body.data
}
