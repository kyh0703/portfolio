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
import { DefineTracking } from '@/models/define'
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
import TrackModal from '../track-modal'

const colDefs: ColDef<TrackList>[] = [
  { field: 'id', hide: true },
  { field: 'scope', hide: true },
  { headerName: 'ID', field: 'property.id' },
  { headerName: 'Name', field: 'property.name' },
  { headerName: 'Type', field: 'property.type' },
]

type TrackList = {
  id: number
  scope: DefineScope
  property: DefineTracking
}

export default function TrackList({ scope }: { scope: DefineScope }) {
  const { localIp } = useUserContext()
  const openModal = useModalStore((state) => state.openModal)

  const gridRef = useRef<AgGridReact<TrackList>>(null)
  const gridOptions = useGridOption<TrackList>()
  const { copy, cut, paste, remove } = useClipboardActions<DefineTracking>(
    gridRef,
    scope,
    'track',
  )
  const { removeSelectedRows, getSelectedRows, onKeyDown } =
    useGridHook<TrackList>(gridRef, {
      onCut: cut,
      onCopy: copy,
      onPaste: paste,
      onRemove: remove,
    })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData, setRowData] = useState<TrackList[]>([])

  const queryClient = useQueryClient()
  const { mutateAsync: removeDefinesMutate } = useRemoveDefines('track')
  const { mutateAsync: addClipboardMutate } = useAddClipboard()

  const addMutation = useAddDefine<DefineTracking>('track')
  const updateMutation = useUpdateDefine<DefineTracking>({
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [defineKeys.all('track')] }),
  })
  const { data } = useSuspenseQuery(useQueryDefines<DefineTracking>('track'))

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

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<TrackList>) => {
    updateMutation.reset()
    openModal('form-modal', { mode: 'update', data: event.data })
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
    data: { id?: number; property: DefineTracking },
  ) => {
    if (mode === 'create') {
      addMutation.mutate({
        scope,
        type: 'track',
        defineId: data.property.id,
        data: data.property,
      })
    } else if (mode === 'update') {
      updateMutation.mutate({
        scope: scope,
        type: 'track',
        databaseId: data.id!,
        defineId: data.property.id,
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
      <Modal id="form-modal" title="Edit Track">
        <TrackModal onSubmit={handleModalSubmit} />
      </Modal>
      <Modal id="confirm-modal">
        <ConfirmModal
          content="정말 삭제하시겠습니까?"
          onConfirm={handleConfirm}
        />
      </Modal>
      <div className="flex h-full flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <h3>Track Definition</h3>
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
