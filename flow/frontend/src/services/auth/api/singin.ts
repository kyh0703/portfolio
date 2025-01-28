import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const signIn = async (email: string, password: string) => {
  const response = await fetchExtended<
    ApiResponse<{ name: string; desc: string }[]>
  >(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/signin`,
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  )

  return response.body.data
}
