import { useYjs } from '@/contexts/yjs-context'
import type {
  DefineData,
  MenuData,
  PropertyData,
} from '@/models/web-socket/search/types'
import { defineKeys } from '@/services/define'
import { menuKeys } from '@/services/menu'
import { useUpdateNodeProperty } from '@/services/subflow'
import { useBuildStore } from '@/store/build'
import logger from '@/utils/logger'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { set } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useShallow } from 'zustand/react/shallow'
import useYjsData from './use-yjs-data'

export default function useReplace() {
  const { ydoc } = useYjs()
  const { sharedNodePropertiesMap } = useYjsData(ydoc)
  const isBuilding = useBuildStore(
    useShallow((state) => state.build.isBuilding),
  )

  const queryClient = useQueryClient()
  const { mutateAsync } = useUpdateNodeProperty()

  const onReplaceProperty = useCallback(
    async ({ nodeId, path, replace: value }: PropertyData) => {
      if (isBuilding) {
        toast.warn('빌드 중에는 편집할 수 없습니다.')
        return
      }
      try {
        const id = '' + nodeId
        const currentData = sharedNodePropertiesMap.get(id)
        const updateData = { ...currentData }
        const nodeProperty = sharedNodePropertiesMap.get(id)
        set(updateData, path, value)
        sharedNodePropertiesMap.set(id, updateData)
        await mutateAsync({ nodeId, nodeProperty })
      } catch (error) {
        logger.error(error)
      }
    },
    [isBuilding, mutateAsync, sharedNodePropertiesMap],
  )

  const onReplaceDefine = useCallback(
    ({ defineId }: DefineData) => {
      queryClient.invalidateQueries({
        queryKey: [defineKeys.detail(defineId)],
      })
    },
    [queryClient],
  )

  const onReplaceMenu = useCallback(
    ({ menuId }: MenuData) => {
      queryClient.invalidateQueries({
        queryKey: [menuKeys.detail(menuId)],
      })
    },
    [queryClient],
  )

  return { onReplaceProperty, onReplaceDefine, onReplaceMenu }
}
