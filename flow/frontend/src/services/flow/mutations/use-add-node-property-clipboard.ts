import type { CustomResponse } from '@/services'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { addNodePropertyClipboard } from '..'

type Response = unknown
type Variables<T> = {
  data: {
    ip: string
    type: 'cut' | 'copy'
    property: T[]
  }
}
type MutationOptions<T> = UseMutationOptions<
  Response,
  CustomResponse,
  Variables<T>
>

export const useAddNodePropertyClipboard = <T>(
  options?: MutationOptions<T>,
) => {
  return useMutation<Response, CustomResponse, Variables<T>>({
    ...options,
    mutationFn: ({ data }) => {
      return addNodePropertyClipboard<T>(data)
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
