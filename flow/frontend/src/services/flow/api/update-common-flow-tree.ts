import type { FlowTreeData } from '@/models/subflow-list'
import { fetchExtended } from '@/services/lib/fetch'
import { CustomResponse } from '@/services/types'

export const updateCommonFlowTree = async (tree: {
  flowtree: FlowTreeData[]
}) => {
  const response = await fetchExtended<CustomResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}//flows/commonflowtree`,
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
