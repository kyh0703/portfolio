import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'

export const getClipboard = async (ip: string) => {
  const response = await fetchExtended<
    ApiResponse<{
      type: 'cut' | 'copy'
      menus: { id: number }[]
    }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/edits/clipboard/menu/recv`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ip,
    }),
  })

  return response.body.data
}
