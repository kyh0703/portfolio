import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'
import type { DefineScope, DefineType } from '@/types/define'

export const getClipboard = async <T>(ip: string) => {
  const response = await fetchExtended<
    ApiResponse<{
      type: 'cut' | 'copy'
      defines: {
        id: number
        defineId: string
        type: DefineType
        scope: DefineScope
        data: T
      }[]
    }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/edits/clipboard/define/recv`, {
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
