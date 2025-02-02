import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const signup = async (data: {
  name: string
  email: string
  password: string
  confirmPassword: string
}) => {
  const response = await fetchExtended<
    ApiResponse<{ name: string; desc: string }[]>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response.body.data
}
