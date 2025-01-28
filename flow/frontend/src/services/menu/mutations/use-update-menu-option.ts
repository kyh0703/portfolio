import type { MenuCheckOption } from '@/models/define'
import type { CustomResponse } from '@/services'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { menuKeys, updateMenuOption } from '..'

type Response = unknown
type Variables = { menuId: number; option: MenuCheckOption }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateMenuOption = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ menuId, option }) => {
      return updateMenuOption(menuId, option)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [menuKeys.menuOption(variables.menuId)],
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
