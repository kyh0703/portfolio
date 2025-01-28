import { getSnapshots } from '../api/get-snapshots'
import { snapshotKeys } from '../keys'

export const useQuerySnapshot = (flowId: number) => ({
  queryKey: [snapshotKeys.detail(flowId)],
  queryFn: () => getSnapshots(flowId),
})
