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
import { type DefineLog } from '@/models/define'
import {
  defineKeys,
  useAddClipboard,
  useAddDefine,
  useAddDefines,
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
import LogModal from '../log-modal'

const colDefs: ColDef<LogList>[] = [
  { field: 'id', hide: true },
  { field: 'scope', hide: true },
  { headerName: 'Name', field: 'property.id' },
  { headerName: 'Path', field: 'property.path' },
  { headerName: 'Extension', field: 'property.extension' },
  { headerName: 'Time Stamp', field: 'property.timeStamp' },
  { headerName: 'Period', field: 'property.period' },
]

type LogList = {
  id: number
  scope: DefineScope
  property: DefineLog
}

export default function LogList({ scope }: { scope: DefineScope }) {
  const { localIp } = useUserContext()
  const openModal = useModalStore((state) => state.openModal)

  const gridRef = useRef<AgGridReact<LogList>>(null)
  const gridOptions = useGridOption<LogList>()
  const { copy, cut, paste, remove } = useClipboardActions<DefineLog>(
    gridRef,
    scope,
    'log',
  )
  const { removeSelectedRows, getSelectedRows, onKeyDown } =
    useGridHook<LogList>(gridRef, {
      onCut: cut,
      onCopy: copy,
      onPaste: paste,
      onRemove: remove,
    })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData, setRowData] = useState<LogList[]>([])

  const queryClient = useQueryClient()
  const { mutateAsync: addDefinesMutate } = useAddDefines<DefineLog>('log')
  const { mutateAsync: removeDefinesMutate } = useRemoveDefines('log')
  const { mutateAsync: addClipboardMutate } = useAddClipboard()
  const addMutation = useAddDefine<DefineLog>('log')
  const updateMutation = useUpdateDefine<DefineLog>({
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [defineKeys.all('log')] }),
  })
  const { data } = useSuspenseQuery(useQueryDefines<DefineLog>('log'))

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

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<LogList>) => {
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
    data: { id?: number; property: DefineLog },
  ) => {
    if (mode === 'create') {
      addMutation.mutate({
        scope,
        type: 'log',
        defineId: data.property.id,
        data: data.property,
      })
    } else {
      updateMutation.mutate({
        scope,
        type: 'log',
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
      <Modal id="form-modal" title="Edit Log">
        <LogModal onSubmit={handleSubmit} />
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
            <h3>Log definition</h3>
          </div>
          <div className="flex-1">
            <Input
              id="filter-text-box"
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
            onCellClicked={onCellContextMenu}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    </>
  )
}
