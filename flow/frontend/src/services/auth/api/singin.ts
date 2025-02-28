import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const signin = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  const response = await fetchExtended<
    ApiResponse<{ name: string; desc: string }[]>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/auth/signin`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  return response.body.data
}
