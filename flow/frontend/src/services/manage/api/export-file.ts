import type { ExportVariables } from '@/models/manage'
import type { ApiResponse } from '@/services'
import { fetchExtended } from '@/services/lib/fetch'

export const exportFile = async (exportData: ExportVariables) => {
  const response = await fetchExtended<ApiResponse<string>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/admins/export`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exportData),
    },
  )

  return response.body.data
}
