import { CustomResponse } from '@/services/types'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { flowKeys, updateCommonFlowTree } from '..'
import { FlowTreeData } from './../../../models/subflow-list'

type Response = unknown
type Variables = { flowtree: FlowTreeData[] }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateCommonFlowTree = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    throwOnError: false,
    mutationFn: (tree) => {
      return updateCommonFlowTree(tree)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [flowKeys.commonFlowTree] })

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
