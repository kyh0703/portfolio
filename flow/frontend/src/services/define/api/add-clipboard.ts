import type { CustomResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const addClipboard = async <T>(data: {
  ip: string
  type: 'cut' | 'copy'
  defines: { id: number }[]
}) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/edits/clipboard/define`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
      }),
    },
  )

  return response.body
}
