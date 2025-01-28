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
import { type DefineMenu } from '@/models/define'
import { useAddClipboard, useRemoveMenu } from '@/services/menu'
import { useQueryTopMenus } from '@/services/menu/queries/use-query-top-menus'
import { useUserContext } from '@/store/context'
import type { DefineScope } from '@/types/define'
import logger from '@/utils/logger'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useClipboardActions } from '../../_lib/use-clipboard-actions'

const colDefs: ColDef<MenuList>[] = [
  { field: 'id', hide: true },
  { headerName: 'ID', field: 'property.id' },
  { headerName: 'Name', field: 'property.name' },
]

type MenuList = {
  id: number
  property: Pick<DefineMenu, 'id' | 'name'>
}

export default function MenuList({ scope }: { scope: DefineScope }) {
  const router = useRouter()
  const { localIp } = useUserContext()

  const gridRef = useRef<AgGridReact<MenuList>>(null)
  const gridOptions = useGridOption<MenuList>()
  const { cut, copy, paste, remove } = useClipboardActions(gridRef)
  const { getSelectedRow, removeSelectedRows, onKeyDown } =
    useGridHook<MenuList>(gridRef, {
      onCut: cut,
      onCopy: copy,
      onPaste: paste,
      onRemove: remove,
    })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData, setRowData] = useState<MenuList[]>([])

  const { mutateAsync: addClipboardMutate } = useAddClipboard()
  const { mutateAsync: removeMenuMutate } = useRemoveMenu()
  const { data } = useSuspenseQuery(useQueryTopMenus())

  useEffect(() => {
    setRowData(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setRowData(data)
  }, [data])

  const handleAddClick = () => {
    router.push(`/defines/${scope}/menu/new`)
  }

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<DefineMenu>) => {
    const id = event.data?.id
    router.push(`/defines/${scope}/menu/${id}`)
  }

  const handleConfirm = async (data: string) => {
    const selectedId = getSelectedRow()?.data?.id
    if (!selectedId) {
      return
    }
    try {
      if (data === 'cut') {
        await addClipboardMutate({
          data: {
            ip: localIp,
            type: 'cut',
            rootId: selectedId,
            menus: [{ id: selectedId }],
          },
        })
      }
      await removeMenuMutate({ id: selectedId })
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
            <h3>Menu definition</h3>
          </div>
          <div className="flex">
            <div className="flex gap-14">
              <Button variant="secondary2" onClick={handleAddClick}>
                <PlusIcon width={14} height={14} />
                Add
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-grow">
          <Grid
            ref={gridRef}
            gridOptions={gridOptions}
            columnDefs={colDefs}
            rowData={rowData}
            rowDragManaged={true}
            rowSelection="single"
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
