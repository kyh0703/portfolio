import type { MenuTree } from '@/models/menu/menu'
import type { CustomResponse } from '@/services'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { updateMenuTree } from '..'

type Response = unknown
type Variables = { menuId: number; tree: MenuTree[] }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateMenuTree = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ menuId, tree }) => {
      return updateMenuTree(menuId, tree)
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
