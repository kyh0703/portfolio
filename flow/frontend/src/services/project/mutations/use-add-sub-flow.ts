import type { SubFlow } from '@/models/flow'
import type { CustomResponse } from '@/services'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { addSubFlow, flowKeys } from '..'

type Response = { flowId: number; updateTime: Date }
type Variables = Omit<SubFlow, 'id'>
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useAddSubFlow = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    throwOnError: false,
    mutationFn: (subFlow) => {
      return addSubFlow(subFlow)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [flowKeys.subFlows] })

      if (options?.onSuccess) {
        options?.onSuccess(data, variables, context)
      }
      return data
    },
    onError: (error, variables, context) => {
      toast.error(error.message)

      if (options?.onError) {
        options?.onError(error, variables, context)
      }
    },
  })
}
