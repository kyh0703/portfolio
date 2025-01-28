import type { MenuTree } from '@/models/menu'
import type { CustomResponse } from '@/services'
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { cutPasteMenu, menuKeys } from '..'

type Response = MenuTree[]
type Variables = {
  localIp: string
  target: {
    parentId: number
    rootId: number
  }
}
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useAddCutPaste = (options?: MutationOptions) => {
  const queryClient = useQueryClient()

  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ localIp, target }) => {
      return cutPasteMenu(localIp, target)
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [menuKeys.menuTree(variables.target.rootId)],
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
