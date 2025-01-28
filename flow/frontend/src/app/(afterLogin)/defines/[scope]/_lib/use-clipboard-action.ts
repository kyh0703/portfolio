import { getClipboard, useAddClipboard, useAddDefines } from '@/services/define'
import { useUserContext } from '@/store/context'
import { useModalStore } from '@/store/modal'
import type { DefineScope, DefineType } from '@/types/define'
import type { AgGridReact } from 'ag-grid-react'
import { type RefObject } from 'react'

export function useClipboardActions<T>(
  ref: RefObject<AgGridReact> | null,
  scope: DefineScope,
  type: DefineType,
) {
  const { localIp } = useUserContext()
  const openModal = useModalStore((state) => state.openModal)

  const { mutateAsync: addClipboardMutate } = useAddClipboard()
  const { mutateAsync: addDefinesMutate } = useAddDefines<T>(type)

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

    const selectedRows = api.getSelectedRows()
    if (selectedRows?.length === 0) {
      return
    }

    const selectedIds = selectedRows.map((row) => ({
      id: row.id,
    }))
    if (selectedIds.length === 0) {
      return
    }

    await addClipboardMutate({
      data: {
        ip: localIp,
        type: 'copy',
        defines: selectedIds,
      },
    })
  }

  const paste = async () => {
    const clipboard = await getClipboard<T>(localIp)
    if (!clipboard) {
      return
    }

    const filteredClipboard = clipboard.defines.filter(
      (define) => define.scope === scope && define.type === type,
    )
    if (filteredClipboard.length === 0) {
      return
    }

    const clipboardRows = filteredClipboard.map((row) => {
      const defineId = (row.data as Record<string, any>)['id']
        ? (row.data as Record<string, any>)['id']
        : (row.data as Record<string, any>)['name']

      return {
        scope: row.scope,
        type: row.type,
        defineId: defineId as string,
        data: row.data,
      }
    })

    await addDefinesMutate({ data: clipboardRows })
  }

  return {
    remove,
    cut,
    copy,
    paste,
  }
}
