import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

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
    body: JSON.stringify(snakecaseKeys(data, { deep: true })),
  })

  return camelcaseKeys(response.body.data, { deep: true })
}
