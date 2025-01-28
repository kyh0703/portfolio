'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import { Button } from '@/app/_components/button'
import ConfirmModal from '@/app/_components/confirm-modal'
import Grid from '@/app/_components/grid'
import { PlusIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridHook from '@/hooks/aggrid/use-grid-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import { DefineUserFunc } from '@/models/define'
import {
  defineKeys,
  useAddClipboard,
  useAddDefine,
  useQueryDefines,
  useRemoveDefines,
  useUpdateDefine,
} from '@/services/define'
import { useUserContext } from '@/store/context'
import { useModalStore } from '@/store/modal'
import type { DefineScope } from '@/types/define'
import logger from '@/utils/logger'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from 'react'
import { useClipboardActions } from '../../../_lib/use-clipboard-action'
import UserfuncModal from '../userfunc-modal'

const colDefs: ColDef<UserFuncList>[] = [
  { field: 'id', hide: true },
  { field: 'scope', hide: true },
  { headerName: 'Function Name', field: 'property.name' },
  { headerName: 'Library File', field: 'property.file' },
  { headerName: 'Library Type', field: 'property.type' },
  { headerName: 'Description', field: 'property.desc' },
]

export type UserFuncList = {
  id: number
  scope: DefineScope
  property: DefineUserFunc
}

export default function UserFuncList({ scope }: { scope: DefineScope }) {
  const { localIp } = useUserContext()
  const openModal = useModalStore((state) => state.openModal)

  const gridRef = useRef<AgGridReact<UserFuncList>>(null)
  const gridOptions = useGridOption<UserFuncList>()
  const { copy, cut, paste, remove } = useClipboardActions<DefineUserFunc>(
    gridRef,
    scope,
    'userfunc',
  )
  const { removeSelectedRows, getSelectedRows, onKeyDown } =
    useGridHook<UserFuncList>(gridRef, {
      onCut: cut,
      onCopy: copy,
      onPaste: paste,
      onRemove: remove,
    })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData, setRowData] = useState<UserFuncList[]>([])

  const queryClient = useQueryClient()
  const { mutateAsync: removeDefinesMutate } = useRemoveDefines('userfunc')
  const { mutateAsync: addClipboardMutate } = useAddClipboard()

  const addMutation = useAddDefine<DefineUserFunc>('userfunc')
  const updateMutation = useUpdateDefine<DefineUserFunc>({
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [defineKeys.all('userfunc')],
      }),
  })
  const { data } = useSuspenseQuery(useQueryDefines<DefineUserFunc>('userfunc'))

  useEffect(() => {
    setRowData(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setRowData(data)
  }, [data])

  const handleAddClick = () => {
    addMutation.reset()
    openModal('form-modal', { mode: 'create' })
  }

  const handleRowDoubleClicked = (
    event: RowDoubleClickedEvent<UserFuncList>,
  ) => {
    updateMutation.reset()
    openModal('form-modal', {
      mode: 'update',
      data: { id: event.data?.id, property: event.data?.property },
    })
  }

  const handleConfirm = async (data: string) => {
    const selectedIds = getSelectedRows()!.map((row) => ({ id: row.data?.id! }))
    try {
      if (data === 'cut') {
        await addClipboardMutate({
          data: {
            ip: localIp,
            type: 'cut',
            defines: selectedIds,
          },
        })
      }
      await removeDefinesMutate({ data: selectedIds })
      removeSelectedRows()
    } catch (error) {
      logger.error(error)
    }
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    data: { id?: number; property: DefineUserFunc },
  ) => {
    if (mode === 'create') {
      addMutation.mutate({
        scope,
        type: 'userfunc',
        defineId: data.property.name,
        data: data.property,
      })
    } else {
      updateMutation.mutate({
        scope,
        type: 'userfunc',
        databaseId: data.id!,
        defineId: data.property.name,
        data: data.property,
      })
    }
  }

  const handleContextMenuClick = async (item: string) => {
    const actions: Record<string, () => void> = {
      delete: remove,
      cut: cut,
      copy: copy,
      paste: paste,
    }
    actions[item]?.()
  }

  return (
    <>
      {contextMenu && (
        <GridContextMenu
          {...contextMenu}
          onItemClick={handleContextMenuClick}
          onClick={() => setContextMenu(null)}
        />
      )}
      <Modal id="form-modal" title="Edit User Function">
        <UserfuncModal onSubmit={handleModalSubmit} />
      </Modal>
      <Modal id="confirm-modal">
        <ConfirmModal
          content="정말 삭제하시겠습니까?"
          onConfirm={handleConfirm}
        />
      </Modal>
      <div className="flex h-full flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <h3>User Function Definition</h3>
          <Button
            className="flex items-center justify-between"
            variant="secondary2"
            onClick={handleAddClick}
          >
            <PlusIcon width={20} height={20} />
            Add
          </Button>
        </div>
        <div className="h-full">
          <Grid
            ref={gridRef}
            gridOptions={gridOptions}
            columnDefs={colDefs}
            rowData={rowData}
            rowDragManaged={true}
            pagination={false}
            onRowDoubleClicked={handleRowDoubleClicked}
            onCellContextMenu={onCellContextMenu}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    </>
  )
}
