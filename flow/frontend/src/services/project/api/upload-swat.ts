import { type CustomResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const uploadSwat = async () => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/flows/swat/upload`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  return response.body
}
