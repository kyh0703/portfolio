import { CustomResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const addClipboard = async (data: {
  ip: string
  type: 'cut' | 'copy'
  rootId: number
  menus: { id: number }[]
}) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/edits/clipboard/menu`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  )

  return response.body
}
