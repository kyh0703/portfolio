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
import type { DefineMent } from '@/models/define'
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
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
} from 'react'
import { useClipboardActions } from '../../../_lib/use-clipboard-action'
import MentModal from '../ment-modal'

const colDefs: ColDef<MentList>[] = [
  { field: 'id', hide: true },
  { field: 'scope', hide: true },
  { headerName: 'ID', field: 'property.id' },
  { headerName: 'File', field: 'property.file' },
  { headerName: 'Description', field: 'property.desc' },
]

type MentList = {
  id: number
  scope: DefineScope
  property: DefineMent
}

export default function MentList({ scope }: { scope: DefineScope }) {
  const gridRef = useRef<AgGridReact<MentList>>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { localIp } = useUserContext()
  const openModal = useModalStore((state) => state.openModal)

  const gridOptions = useGridOption<MentList>()
  const { copy, cut, paste, remove } = useClipboardActions<DefineMent>(
    gridRef,
    scope,
    'ment',
  )
  const {
    addRows,
    removeSelectedRows,
    getRows,
    getSelectedRows,
    exportExcel,
    importExcel,
    onKeyDown,
  } = useGridHook<MentList>(gridRef, {
    onCut: cut,
    onCopy: copy,
    onPaste: paste,
    onRemove: remove,
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData, setRowData] = useState<MentList[]>([])

  const queryClient = useQueryClient()
  const { mutateAsync: addDefinesMutate } = useAddDefines<DefineMent>('ment')
  const { mutateAsync: removeDefinesMutate } = useRemoveDefines('ment')
  const { mutateAsync: addClipboardMutate } = useAddClipboard()
  const addMutation = useAddDefine<DefineMent>('ment')
  const updateMutation = useUpdateDefine<DefineMent>({
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [defineKeys.all('ment')] }),
  })
  const { data } = useSuspenseQuery(useQueryDefines<DefineMent>('ment'))

  const filterScopeData = useMemo(() => {
    return data.filter((item) => item.scope === scope)
  }, [data, scope])

  useEffect(() => {
    setRowData(filterScopeData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setRowData(filterScopeData)
  }, [filterScopeData])

  const handleExportClick = () => {
    exportExcel()
  }

  const handleImportClick: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const columns = {
      A: 'id',
      B: 'file',
      C: 'desc',
    }

    try {
      await removeDefinesMutate({
        data: getRows().map((row) => ({ id: row.id })),
      })

      const loadData = await importExcel(columns, event)
      const rows = loadData.map((load) => ({
        scope,
        type: 'ment',
        defineId: load.id,
        ...load,
      }))

      await addDefinesMutate({ data: rows })
      addRows(
        loadData.map((load) => ({
          id: 0,
          scope,
          property: {
            id: load.id,
            file: load.file,
            desc: load.desc,
          },
        })),
      )
    } catch (error) {
      logger.error(error)
    }
    event.target.value = ''
  }

  const handleAddClick = () => {
    addMutation.reset()
    openModal('form-modal', { mode: 'create' })
  }

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<MentList>) => {
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
    data: { id?: number; property: DefineMent },
  ) => {
    if (mode === 'create') {
      addMutation.mutate({
        scope,
        type: 'ment',
        defineId: data.property.id,
        data: data.property,
      })
    } else {
      updateMutation.mutate({
        scope,
        type: 'ment',
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
      <Modal id="form-modal" title="Edit Ment">
        <MentModal onSubmit={handleSubmit} />
      </Modal>
      <Modal id="confirm-modal">
        <ConfirmModal
          content="정말 삭제하시겠습니까?"
          onConfirm={handleConfirm}
        />
      </Modal>
      <div className="flex h-full flex-col space-y-3 p-6">
        <div className="flex items-center justify-between gap-14">
          <div>
            <h3>Ment definition</h3>
          </div>
          <div className="flex-1">
            <Input
              id="filter-text-box"
              className="w-full"
              placeholder="Search"
              onInput={handleFilterTextBoxChanged}
            />
          </div>
          <div className="flex">
            <div className="flex gap-14">
              <div className="flex justify-between gap-5">
                {/* <Button variant="secondary3" onClick={handleExportClick}>
                  Export
                </Button>
                <Button
                  variant="secondary3"
                  onClick={() => inputRef.current?.click()}
                >
                  Import
                </Button> */}
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={handleImportClick}
                />
              </div>
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
