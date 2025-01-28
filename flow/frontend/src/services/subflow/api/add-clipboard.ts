import { fetchExtended } from '@/services/lib/fetch'
import { type CustomResponse } from '@/services/types'

export const addClipboard = async (data: {
  ip: string
  type: 'cut' | 'copy'
  nodes: { id: number }[]
  edges: { id: number }[]
}) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/edits/clipboard/node`,
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
