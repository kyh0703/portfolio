import type { DefineMenu } from '@/models/define'
import type { CustomResponse } from '@/services'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { menuKeys, updateMenu } from '..'

type Response = unknown
type Variables = { menuId: number; menu: Partial<DefineMenu> }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useUpdateMenu = (options?: MutationOptions) => {
  const queryClient = useQueryClient()
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ menuId, menu }) => {
      return updateMenu(menuId, menu)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [menuKeys.detail(variables.menuId)],
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
