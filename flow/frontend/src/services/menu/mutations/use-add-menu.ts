import type { DefineMenu } from '@/models/define'
import type { CustomResponse } from '@/services'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { addMenu } from '..'

type Response = { menuId: number; updateTime: Date }
type Variables = { menu: DefineMenu }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useAddMenu = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ menu }) => {
      return addMenu(menu)
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
