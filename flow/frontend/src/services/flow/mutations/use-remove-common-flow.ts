import type { CustomResponse } from '@/services'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { flowKeys, removeCommonFlow } from '..'

type Response = unknown
type Variables = { flowId: number }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useRemoveCommonFlow = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    throwOnError: false,
    mutationFn: ({ flowId }) => {
      return removeCommonFlow(flowId)
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
