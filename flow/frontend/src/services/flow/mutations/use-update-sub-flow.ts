import type { SubFlow } from '@/models/subflow'
import type { CustomResponse } from '@/services'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { flowKeys, updateSubFlow } from '..'

type Response = unknown
type Variables = { subFlowId: number; updateSubFlow: Partial<SubFlow> }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateSubFlow = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    throwOnError: false,
    mutationFn: ({ subFlowId, updateSubFlow: updateSubFlowData }) => {
      return updateSubFlow(subFlowId, updateSubFlowData)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [flowKeys.subFlows] })

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
