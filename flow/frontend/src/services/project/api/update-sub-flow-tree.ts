import type { FlowTree } from '@/models/subflow-list'
import { fetchExtended } from '@/services/lib/fetch'
import { CustomResponse } from '@/services/types'

export const updateSubFlowTree = async (tree: { flowtree: FlowTree[] }) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/flows/subflowtree`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tree),
    },
  )

  return response.body
}
