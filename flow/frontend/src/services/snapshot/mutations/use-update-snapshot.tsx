import type { CustomResponse } from '@/services'
import { subFlowKeys } from '@/services/subflow'
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { updateSnapshot } from '../api/update-snapshot'

type Response = unknown
type Variables = { flowId: number; name: string }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateSnapshot = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: (data) => {
      return updateSnapshot(data)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [subFlowKeys.nodeList(variables.flowId)],
      })
      queryClient.invalidateQueries({
        queryKey: [subFlowKeys.edgeList(variables.flowId)],
      })

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
