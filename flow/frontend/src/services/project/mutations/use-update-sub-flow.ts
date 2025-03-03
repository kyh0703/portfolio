import type { Flow } from '@/models/flow'
import type { CustomResponse } from '@/services'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { flowKeys, updateFlow } from '..'

type Response = unknown
type Variables = { flowId: number; data: Partial<Flow> }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateFlow = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    throwOnError: false,
    mutationFn: ({ flowId, data }) => {
      return updateFlow(flowId, data)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [flowKeys.detail(variables.flowId)],
      })

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
