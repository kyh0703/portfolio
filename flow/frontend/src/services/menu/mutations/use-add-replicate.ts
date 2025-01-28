import type { MenuTree } from '@/models/menu'
import type { CustomResponse } from '@/services'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { replicateMenu } from '..'

type Response = MenuTree[]
type Variables = {
  menuId: number
  target: {
    parentId: number
    rootId: number
  }
}
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useAddReplicate = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ menuId, target }) => {
      return replicateMenu(menuId, target)
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
