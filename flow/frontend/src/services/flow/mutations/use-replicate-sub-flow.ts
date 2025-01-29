import { SubFlow } from '@/models/subflow'
import type { CustomResponse } from '@/services'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { flowKeys, replicateSubFlow } from '..'

type Response = { flowId: number; updateTime: Date }
type Variables = { subFlowId: number; subFlow: Omit<SubFlow, 'id'> }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useReplicateSubFlow = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    throwOnError: false,
    mutationFn: (payload) => {
      return replicateSubFlow(payload.subFlowId, payload.subFlow)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [flowKeys.subFlows] })

      if (options?.onSuccess) {
        options?.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      toast.error(error.message)

      if (options?.onError) {
        options?.onError(error, variables, context)
      }
    },
  })
}
