import type { Flow } from '@/models/flow';
import type { ApiResponse } from '@/services';
import { fetchExtended } from '@/services/lib/fetch';

export const addFlow = async (flow: Omit<Flow, 'id'>) => {
  const response = await fetchExtended<
    ApiResponse<{ flowId: number; updateTime: Date }>
  >(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/flows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flow),
  })

  return response.body.data
}
