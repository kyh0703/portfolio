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
import type { DefineMenuStat } from '@/models/define'
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
import type { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useClipboardActions } from '../../../_lib/use-clipboard-action'

const colDefs: ColDef<MenuStatList>[] = [
  { field: 'id', hide: true },
  { field: 'scope', hide: true },
  { headerName: 'ID', field: 'property.id' },
  { headerName: 'Description', field: 'property.desc' },
]

type MenuStatList = {
  id: number
  scope: DefineScope
  property: DefineMenuStat
}

export default function MenuStatList({ scope }: { scope: DefineScope }) {
  const router = useRouter()
  const { localIp } = useUserContext()

  const gridRef = useRef<AgGridReact<MenuStatList>>(null)
  const gridOptions = useGridOption<MenuStatList>()
  const { copy, cut, paste, remove } = useClipboardActions<DefineMenuStat>(
    gridRef,
    scope,
    'menustat',
  )
  const { getSelectedRows, removeSelectedRows, onKeyDown } =
    useGridHook<MenuStatList>(gridRef, {
      onCut: cut,
      onCopy: copy,
      onPaste: paste,
      onRemove: remove,
    })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData, setRowData] = useState<MenuStatList[]>([])

  const { mutateAsync: removeDefinesMutate } = useRemoveDefines('menustat')
  const { mutateAsync: addClipboardMutate } = useAddClipboard()
  const { data } = useSuspenseQuery(useQueryDefines<DefineMenuStat>('menustat'))

  useEffect(() => {
    setRowData(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setRowData(data)
  }, [data])

  const handleAddClick = () => {
    router.push(`/defines/${scope}/menustat/new`)
  }

  const handleRowDoubleClicked = (
    event: RowDoubleClickedEvent<MenuStatList>,
  ) => {
    const id = event.data?.id
    router.push(`/defines/${scope}/menustat/${id}`)
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
      <div className="flex h-full flex-col space-y-3 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3>Menu Stat definition</h3>
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
        <div className="flex-grow">
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
