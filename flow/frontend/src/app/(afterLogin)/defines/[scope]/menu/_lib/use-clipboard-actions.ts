import { getClipboard, menuKeys, useAddClipboard } from '@/services/menu'
import { useAddCutPaste } from '@/services/menu/mutations/use-add-cut-paste'
import { useAddReplicate } from '@/services/menu/mutations/use-add-replicate'
import { useUserContext } from '@/store/context'
import { useModalStore } from '@/store/modal'
import { useQueryClient } from '@tanstack/react-query'
import type { AgGridReact } from 'ag-grid-react'
import { type RefObject } from 'react'

export function useClipboardActions(ref: RefObject<AgGridReact> | null) {
  const { localIp } = useUserContext()
  const queryClient = useQueryClient()
  const openModal = useModalStore((state) => state.openModal)

  const { mutateAsync: addClipboardMutate } = useAddClipboard()
  const { mutateAsync: addReplicateMenuMutate } = useAddReplicate()
  const { mutateAsync: addCutPasteMenuMutate } = useAddCutPaste()

  const remove = () => {
    const api = ref?.current?.api
    if (!api) {
      return
    }
    if (api.getSelectedRows()?.length === 0) {
      return
    }
    openModal('confirm-modal', 'delete')
  }

  const cut = () => {
    const api = ref?.current?.api
    if (!api) {
      return
    }
    if (api.getSelectedRows()?.length === 0) {
      return
    }
    openModal('confirm-modal', 'cut')
  }

  const copy = async () => {
    const api = ref?.current?.api
    if (!api) {
      return
    }

    const selectedId = api.getSelectedRows()[0]?.id
    if (!selectedId) {
      return
    }

    await addClipboardMutate({
      data: {
        ip: localIp,
        type: 'copy',
        rootId: selectedId,
        menus: [{ id: selectedId }],
      },
    })
  }

  const paste = async () => {
    const clipboard = await getClipboard(localIp)
    if (!clipboard) {
      return
    }
    if (clipboard.menus.length === 0) {
      return
    }
    if (clipboard.type === 'cut') {
      await addCutPasteMenuMutate({
        localIp,
        target: {
          parentId: 0,
          rootId: 0,
        },
      })
    } else {
      await addReplicateMenuMutate({
        menuId: clipboard.menus[0].id,
        target: { parentId: 0, rootId: 0 },
      })
    }
    queryClient.invalidateQueries({
      queryKey: [menuKeys.top],
    })
  }

  return {
    remove,
    cut,
    copy,
    paste,
  }
}
