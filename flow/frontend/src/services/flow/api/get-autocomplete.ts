import { fetchExtended } from '@/services/lib/fetch'
import type { ApiResponse } from '@/services/types'
import type { CustomNodeType } from '@xyflow/react'

export const getAutocomplete = async (
  subFlowId: number,
  nodeType: CustomNodeType,
  tabName: string,
  property: string,
  keyword: string,
) => {
  const response = await fetchExtended<ApiResponse<string[]>>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/nodes/auto/${subFlowId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kind: nodeType,
        tabName,
        prptName: property,
        key: keyword,
      }),
    },
  )

  return response.body.data
}
