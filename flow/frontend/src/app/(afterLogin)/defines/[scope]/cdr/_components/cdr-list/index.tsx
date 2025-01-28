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
import { DefineCDR } from '@/models/define'
import {
  useAddClipboard,
  useQueryDefines,
  useRemoveDefines,
} from '@/services/define'
import { useUserContext } from '@/store/context'
import type { DefineScope } from '@/types/define'
import logger from '@/utils/logger'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useClipboardActions } from '../../../_lib/use-clipboard-action'

const colDefs: ColDef<CdrList>[] = [
  { field: 'id', hide: true },
  { field: 'scope', hide: true },
  { headerName: 'Name', field: 'property.name' },
  { headerName: 'Description', field: 'property.desc' },
  { headerName: 'Enable', field: 'property.enable' },
]

type CdrList = {
  id: number
  scope: DefineScope
  property: DefineCDR
}

export default function CdrList({ scope }: { scope: DefineScope }) {
  const router = useRouter()
  const { localIp } = useUserContext()

  const gridRef = useRef<AgGridReact<CdrList>>(null)
  const gridOptions = useGridOption<CdrList>()
  const { copy, cut, paste, remove } = useClipboardActions<DefineCDR>(
    gridRef,
    scope,
    'cdr',
  )
  const { getSelectedRows, removeSelectedRows, onKeyDown } =
    useGridHook<CdrList>(gridRef, {
      onCut: cut,
      onCopy: copy,
      onPaste: paste,
      onRemove: remove,
    })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData, setRowData] = useState<CdrList[]>([])

  const { mutateAsync: removeDefinesMutate } = useRemoveDefines('cdr')
  const { mutateAsync: addClipboardMutate } = useAddClipboard()
  const { data } = useSuspenseQuery(useQueryDefines<DefineCDR>('cdr'))

  useEffect(() => {
    setRowData(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setRowData(data)
  }, [data])

  const handleAddClick = () => {
    router.push(`/defines/${scope}/cdr/new`)
  }

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<CdrList>) => {
    const id = event.data?.id
    router.push(`/defines/${scope}/cdr/${id}`)
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
      <Modal id="confirm-modal">
        <ConfirmModal
          content="정말 삭제하시겠습니까?"
          onConfirm={handleConfirm}
        />
      </Modal>
      <div className="flex h-full flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <h3>CDR definition</h3>
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
