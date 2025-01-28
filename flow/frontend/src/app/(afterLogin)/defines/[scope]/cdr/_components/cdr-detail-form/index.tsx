'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import { Button } from '@/app/_components/button'
import FormCheckbox from '@/app/_components/form-checkbox'
import FormGrid from '@/app/_components/form-grid'
import FormInput from '@/app/_components/form-input'
import { PlusIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import { ERROR_VARIABLE_NAME_MESSAGE } from '@/constants/error-message'
import { REG_EX_VARIABLE_NAME } from '@/constants/regex'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridHook from '@/hooks/aggrid/use-grid-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import type { DefineCDR } from '@/models/define'
import { defineKeys, useQueryDefine, useUpdateDefine } from '@/services/define'
import { useBuildStore } from '@/store/build'
import { useModalStore } from '@/store/modal'
import type { DefineScope } from '@/types/define'
import { Separator } from '@/ui/separator'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { useShallow } from 'zustand/react/shallow'
import CDRModal from '../cdr-modal'

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
  name: Yup.string()
    .required('Name을 입력해주세요.')
    .matches(REG_EX_VARIABLE_NAME, ERROR_VARIABLE_NAME_MESSAGE),
})

export default function CdrDetailForm({
  scope,
  databaseId,
}: {
  scope: DefineScope
  databaseId: number
}) {
  const router = useRouter()
  const openModal = useModalStore((state) => state.openModal)
  const isBuilding = useBuildStore(
    useShallow((state) => state.build.isBuilding),
  )

  const gridRef = useRef<AgGridReact<string>>(null)
  const gridOptions = useGridOption<string>()
  const {
    getSelectedRow,
    addRow,
    updateRowByRowIndex,
    cut,
    copy,
    paste,
    remove,
    onKeyDown,
  } = useGridHook<string>(gridRef)
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()
  const [rowData, setRowData] = useState<string[]>([])

  const { data } = useSuspenseQuery(useQueryDefine<DefineCDR>(databaseId))

  const queryClient = useQueryClient()
  const updateMutation = useUpdateDefine<DefineCDR>({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [defineKeys.detail(databaseId)],
      })
    },
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DefineCDR>({
    defaultValues: data?.property,
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    setRowData(data.property.param ?? [])
  }, [data.property.param])

  const onSubmit = (data: DefineCDR) => {
    if (isBuilding) {
      toast.warn('빌드 중에는 편집할 수 없습니다.')
      return
    }
    updateMutation.mutate(
      {
        scope,
        type: 'cdr',
        databaseId,
        defineId: data.name,
        data,
      },
      {
        onSuccess: () => {
          router.push(`/defines/${scope}/cdr`)
        },
      },
    )
  }

  const handleAddClick = () => {
    openModal('form-modal', { mode: 'create' })
  }

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<string>) => {
    updateMutation.reset()
    openModal('form-modal', { mode: 'update', data: { name: event.data } })
  }

  const handleModalSubmit = (mode: 'create' | 'update', data: string) => {
    if (mode === 'create') {
      addRow(data)
    } else {
      updateRowByRowIndex(data, getSelectedRow()?.rowIndex)
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
      <form
        className="flex h-full w-full flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Modal id="form-modal" title="Edit CDR Parameter">
          <CDRModal onSubmit={handleModalSubmit} />
        </Modal>
        <div className="flex items-center justify-between px-6 py-4">
          <h2>CDR definition</h2>
          <div className="flex gap-3">
            <Button variant="error" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">OK</Button>
          </div>
        </div>
        <Separator />
        <div className="flex flex-grow flex-col gap-6 p-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3>Name</h3>
                {errors.name && (
                  <span className="error-msg">{errors.name.message}</span>
                )}
              </div>
              <FormInput control={control} name="name" />
            </div>
            <div className="space-y-2">
              <h3>Description</h3>
              <FormInput control={control} name="desc" />
            </div>
          </div>
          <Separator />
          <div className="flex flex-1 flex-col space-y-3">
            <div className="flex justify-between">
              <FormCheckbox control={control} name="enable" label="Enable" />
              <Button
                className="flex items-center justify-between"
                variant="secondary2"
                onClick={handleAddClick}
              >
                <PlusIcon height={20} width={20} />
                Add
              </Button>
            </div>
            <div className="flex-grow">
              <FormGrid
                ref={gridRef}
                control={control}
                name="param"
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
        </div>
      </form>
    </>
  )
}
