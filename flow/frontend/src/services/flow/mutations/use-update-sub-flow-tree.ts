import { FlowTree } from '@/models/subflow-list'
import { CustomResponse } from '@/services/types'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { flowKeys, updateSubFlowTree } from '..'

type Response = unknown
type Variables = { flowtree: FlowTree[] }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateSubFlowTree = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    throwOnError: false,
    mutationFn: (payload) => {
      return updateSubFlowTree(payload)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [flowKeys.subFlowTree] })

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
