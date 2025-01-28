import { fetchExtended } from '@/services/lib/fetch'
import { type CustomResponse } from '@/services/types'

export const addNodePropertyClipboard = async <T>(data: {
  ip: string
  type: 'cut' | 'copy'
  property: T[]
}) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/edits/clipboard/property`,
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
