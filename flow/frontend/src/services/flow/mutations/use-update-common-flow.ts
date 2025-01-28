import type { SubFlow } from '@/models/subflow'
import type { CustomResponse } from '@/services'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { flowKeys, updateCommonFlow } from '..'

type Response = unknown
type Variables = { commonFlowId: number; updateCommonFlow: Partial<SubFlow> }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateCommonFlow = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    throwOnError: false,
    mutationFn: ({ commonFlowId, updateCommonFlow: updateCommonFlowData }) => {
      return updateCommonFlow(commonFlowId, updateCommonFlowData)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [flowKeys.commonFlows] })

      if (options?.onSuccess) {
        options?.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      toast.error(error.errormsg)

      if (options?.onError) {
        options?.onError(error, variables, context)
      }
    },
  })
}
