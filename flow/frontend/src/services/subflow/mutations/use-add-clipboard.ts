import type { CustomResponse } from '@/services'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { addClipboard } from '..'

type Response = unknown
type Variables = {
  data: {
    ip: string
    type: 'cut' | 'copy'
    nodes: { id: number }[]
    edges: { id: number }[]
  }
}
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useAddClipboard = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ data }) => {
      return addClipboard(data)
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
