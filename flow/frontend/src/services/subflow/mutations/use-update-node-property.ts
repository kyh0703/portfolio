import type { CustomResponse } from '@/services'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { updateNodeProperty } from '..'

type Response = unknown
type Variables<T> = { nodeId: number; nodeProperty: T }
type MutationOptions<T> = UseMutationOptions<
  Response,
  CustomResponse,
  Variables<T>
>

export const useUpdateNodeProperty = <T>(options?: MutationOptions<T>) => {
  return useMutation<Response, CustomResponse, Variables<T>>({
    ...options,
    mutationFn: ({ nodeId, nodeProperty }) => {
      return updateNodeProperty(nodeId, nodeProperty)
    },
    onSuccess: (data, variables, context) => {
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
