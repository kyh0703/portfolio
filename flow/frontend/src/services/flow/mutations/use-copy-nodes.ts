import type { CustomResponse } from '@/services'
import { toModelNode } from '@/utils/xyflow/convert'
import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import type { AppNode } from '@xyflow/react'
import { toast } from 'react-toastify'
import { addNodes } from '..'

// NOTE: 기존 아이디를 노드 데이터안에 넣어서 타겟 플로우 프로퍼티를 복사할 수 있게 지정하여서 사용
type Response = { id: number }[]
type Variables = { flowId: number; data: AppNode[] }
type MutationOptions = UseMutationOptions<Response, CustomResponse, Variables>

export const useCopyNodes = (options?: MutationOptions) => {
  return useMutation<Response, CustomResponse, Variables>({
    ...options,
    mutationFn: ({ flowId, data }) => {
      return addNodes(
        flowId,
        data.map((node) => toModelNode(node)),
      )
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
