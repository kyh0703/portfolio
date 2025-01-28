'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import AlertModal from '@/app/_components/alert-modal'
import { Button } from '@/app/_components/button'
import FormGrid from '@/app/_components/form-grid'
import FormInput from '@/app/_components/form-input'
import { PlusIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import { ERROR_VARIABLE_NAME_MESSAGE } from '@/constants/error-message'
import { REG_EX_VARIABLE_NAME } from '@/constants/regex'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridHook from '@/hooks/aggrid/use-grid-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import type { DefineMenuStat } from '@/models/define'
import { useAddDefine } from '@/services/define'
import { useModalStore } from '@/store/modal'
import type { DefineScope } from '@/types/define'
import { Separator } from '@/ui/separator'
import { yupResolver } from '@hookform/resolvers/yup'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState, type KeyboardEventHandler } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import MenuStatModal from '../menu-stat-modal'

const colDefs: ColDef<string>[] = [
  {
    headerName: 'Name',
    valueGetter: (params) => params.data,
    valueSetter: (params) => {
      params.data = params.newValue
      return true
    },
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
]

const schema = Yup.object().shape({
  id: Yup.string()
    .required('ID를 입력해주세요.')
    .matches(REG_EX_VARIABLE_NAME, ERROR_VARIABLE_NAME_MESSAGE),
})

export default function MenuStatRegisterForm({
  scope,
}: {
  scope: DefineScope
}) {
  const router = useRouter()
  const openModal = useModalStore((state) => state.openModal)

  const gridRef = useRef<AgGridReact<string>>(null)
  const gridOptions = useGridOption<string>()
  const {
    getRows,
    getSelectedRow,
    addRow,
    updateRowByRowIndex,
    deselectAll,
    selectAll,
    getSelectedRows,
    removeSelectedRows,
  } = useGridHook<string>(gridRef)
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState<string[]>([])

  const addMutation = useAddDefine<DefineMenuStat>('menustat')

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DefineMenuStat>({
    defaultValues: {
      id: '',
      desc: '',
      name: [],
    },
    resolver: yupResolver(schema),
  })

  const cut = useCallback(() => {
    setSelectedRow(removeSelectedRows()?.remove.map((row) => row.data!) || [])
  }, [removeSelectedRows])

  const copy = useCallback(() => {
    const selectedRows = getSelectedRows()
    setSelectedRow(selectedRows?.map((row) => row.data!) || [])
  }, [getSelectedRows])

  const paste = useCallback(() => {
    if (getRows().length + selectedRow.length > 9) {
      openModal('alert-modal', '메뉴는 9개까지만 설정 할 수 있습니다.')
    } else {
      selectedRow.map((row) => addRow(row))
    }
  }, [addRow, getRows, openModal, selectedRow])

  const remove = useCallback(() => {
    removeSelectedRows()
  }, [removeSelectedRows])

  const onSubmit = (data: DefineMenuStat) => {
    addMutation.mutate(
      {
        scope,
        type: 'menustat',
        defineId: data.id,
        data,
      },
      {
        onSuccess: () => {
          router.push(`/defines/${scope}/menustat`)
        },
      },
    )
  }

  const handleAddClick = () => {
    if (getRows().length >= 9) {
      openModal('alert-modal', null)
    } else {
      openModal('form-modal', { mode: 'create' })
    }
  }

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<string>) => {
    openModal('form-modal', { mode: 'update', data: { name: event.data } })
  }

  const handleModalSubmit = (mode: 'create' | 'update', data: string) => {
    if (mode === 'create') {
      addRow(data)
    } else {
      updateRowByRowIndex(data, getSelectedRow()?.rowIndex)
    }
  }

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      switch (event.key) {
        case 'a':
          if (event.ctrlKey || event.metaKey) {
            selectedRow.length === getRows().length
              ? deselectAll()
              : selectAll()
          }
          break
        case 'x':
          if (event.ctrlKey || event.metaKey) {
            cut()
          }
          break
        case 'c':
          if (event.ctrlKey || event.metaKey) {
            copy()
          }
          break
        case 'v':
          if (event.ctrlKey || event.metaKey) {
            paste()
          }
          break
        case 'Delete':
          remove()
          break
      }
    },
    [
      copy,
      cut,
      deselectAll,
      getRows,
      paste,
      remove,
      selectAll,
      selectedRow.length,
    ],
  )

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
      <form className="h-full w-full" onSubmit={handleSubmit(onSubmit)}>
        <Modal id="form-modal" title="Edit Menu Stat">
          <MenuStatModal onSubmit={handleModalSubmit} />
        </Modal>
        <Modal id="alert-modal" title="Edit Menu Stat">
          <AlertModal />
        </Modal>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 py-4">
            <h2>Menu Stat Definition</h2>
            <div className="flex gap-3">
              <Button variant="error" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary2">
                OK
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex h-full flex-col gap-6 p-6">
            <div>
              <h2 className="text-base">Category</h2>
            </div>
            <div className="flex gap-7">
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3>ID</h3>
                  {errors.id && (
                    <span className="error-msg">{errors.id.message}</span>
                  )}
                </div>
                <FormInput
                  control={control}
                  name="id"
                  type="text"
                  maxLength={20}
                />
              </div>
              <div className="flex-1 space-y-3">
                <h3>Description</h3>
                <FormInput control={control} name="desc" />
              </div>
            </div>
            <Separator />
            <div className="flex h-full flex-col space-y-3">
              <div className="flex justify-end">
                <Button
                  className="flex items-center justify-between"
                  variant="secondary2"
                  onClick={handleAddClick}
                >
                  <PlusIcon width={20} height={20} />
                  Add
                </Button>
              </div>
              <div className="flex-grow">
                <FormGrid
                  ref={gridRef}
                  control={control}
                  name="name"
                  gridOptions={gridOptions}
                  columnDefs={colDefs}
                  rowData={rowData}
                  rowDragManaged={true}
                  pagination={false}
                  onRowDoubleClicked={handleRowDoubleClicked}
                  onCellContextMenu={onCellContextMenu}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
