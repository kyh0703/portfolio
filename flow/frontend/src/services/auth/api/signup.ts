import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'
import camelcaseKeys from 'camelcase-keys'

export const signup = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  const response = await fetchExtended<
    ApiResponse<{ name: string; desc: string }[]>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/signup`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password, confirmPassword }),
  })

  return camelcaseKeys(response.body.data, { deep: true })
}
