import type { SubFlow } from '@/models/subflow'
import type { CustomResponse } from '@/services'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { addCommonFlow, flowKeys } from '..'

type Response = { flowId: number; updateTime: Date }
type Variables = Omit<SubFlow, 'id'>
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useAddCommonFlow = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    throwOnError: false,
    mutationFn: (subFlow) => {
      return addCommonFlow(subFlow)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [flowKeys.commonInFlows] })
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
