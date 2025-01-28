'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import { Button } from '@/app/_components/button'
import ConfirmModal from '@/app/_components/confirm-modal'
import Grid from '@/app/_components/grid'
import { PlusIcon } from '@/app/_components/icon'
import { Input } from '@/app/_components/input'
import { Modal } from '@/app/_components/modal'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridHook from '@/hooks/aggrid/use-grid-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import { type DefineVar } from '@/models/define'
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
import VarModal from '../var-modal'

const colDefs: ColDef<VarList>[] = [
  { field: 'id', hide: true },
  { field: 'scope', hide: true },
  { headerName: 'Name', field: 'property.name' },
  { headerName: 'Value', field: 'property.value' },
  { headerName: 'Description', field: 'property.desc' },
]

type VarList = {
  id: number
  scope: DefineScope
  property: DefineVar
}

export default function VarList({ scope }: { scope: DefineScope }) {
  const { localIp } = useUserContext()
  const openModal = useModalStore((state) => state.openModal)

  const gridRef = useRef<AgGridReact<VarList>>(null)
  const gridOptions = useGridOption<VarList>()
  const { copy, cut, paste, remove } = useClipboardActions<DefineVar>(
    gridRef,
    scope,
    'var',
  )
  const { removeSelectedRows, getSelectedRows, onKeyDown } =
    useGridHook<VarList>(gridRef, {
      onCut: cut,
      onCopy: copy,
      onPaste: paste,
      onRemove: remove,
    })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData, setRowData] = useState<VarList[]>([])

  const queryClient = useQueryClient()
  const { mutateAsync: removeDefinesMutate } = useRemoveDefines('var')
  const { mutateAsync: addClipboardMutate } = useAddClipboard()

  const addMutation = useAddDefine<DefineVar>('var')
  const updateMutation = useUpdateDefine<DefineVar>({
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [defineKeys.all('var')] }),
  })
  const { data } = useSuspenseQuery(useQueryDefines<DefineVar>('var'))

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

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<VarList>) => {
    updateMutation.reset()
    openModal('form-modal', {
      mode: 'update',
      data: { id: event.data?.id, property: event.data?.property },
    })
  }

  const handleFilterTextBoxChanged = () => {
    gridRef.current?.api.setGridOption(
      'quickFilterText',
      (document.getElementById('filter-text-box') as HTMLInputElement).value,
    )
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

  const handleSubmit = (
    mode: 'create' | 'update',
    data: { id?: number; property: DefineVar },
  ) => {
    if (mode === 'create') {
      addMutation.mutate({
        scope,
        type: 'var',
        defineId: data.property.name,
        data: data.property,
      })
    } else {
      updateMutation.mutate({
        scope,
        type: 'var',
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
      <Modal id="form-modal" title="Var Define">
        <VarModal onSubmit={handleSubmit} />
      </Modal>
      <Modal id="confirm-modal" title="Confirm">
        <ConfirmModal
          content="정말 삭제하시겠습니까?"
          onConfirm={handleConfirm}
        />
      </Modal>
      <div className="flex h-full flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-14">
          <div>
            <h3>Variable definition</h3>
          </div>
          <div className="flex-1">
            <Input
              id="filter-text-box"
              className="w-full"
              placeholder="Search"
              onInput={handleFilterTextBoxChanged}
            />
          </div>
          <div>
            <Button
              className="flex items-center justify-between"
              variant="secondary2"
              onClick={handleAddClick}
            >
              <PlusIcon width={20} height={20} />
              Add
            </Button>
          </div>
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
