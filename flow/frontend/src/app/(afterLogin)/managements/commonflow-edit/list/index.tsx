'use client'

import AlertModal from '@/app/_components/alert-modal'
import { Button } from '@/app/_components/button'
import ConfirmModal from '@/app/_components/confirm-modal'
import Grid from '@/app/_components/grid'
import { PlusIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import { SubFlowList } from '@/models/subflow-list'
import {
  getCommonFlowInUse,
  useAddCommonFlow,
  useRemoveCommonFlow,
  useReplicateCommonFlow,
  useUpdateCommonFlow,
} from '@/services/flow'
import { useQueryCommonFlows } from '@/services/flow/queries'
import { useModalStore } from '@/store/modal'
import { Separator } from '@/ui/separator'
import { cn } from '@/utils/cn'
import logger from '@/utils/logger'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ColDef } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'
import CommonFlowModal from '../modal'
import CommonFlowListMenu from './menu-context'

export default function CommonFlowList() {
  const colDefs: ColDef<SubFlowList>[] = [
    { field: 'id', hide: true },
    {
      headerName: 'Name',
      flex: 3,
      field: 'name',
    },
    { headerName: 'Version', flex: 2, field: 'version' },
    { headerName: 'Description', flex: 4, field: 'desc' },
    {
      flex: 1,
      cellRendererSelector: (params) => {
        return {
          component: CommonFlowListMenu,
          params: {
            moveReplicate: () => handleClickReplicate(params.data),
            moveEdit: () => handleClickEdit(params.data),
            moveDelete: () => handleClickDelete(params.data),
          },
        }
      },
    } as ColDef,
  ]
  const gridRef = useRef<AgGridReact<SubFlowList>>(null)
  const openModal = useModalStore((state) => state.openModal)
  const gridOptions = useGridOption<SubFlowList>()

  const selectedRow = useRef<SubFlowList>()

  const addMutation = useAddCommonFlow()
  const updateMutation = useUpdateCommonFlow()
  const removeMutation = useRemoveCommonFlow()
  const replicateMutation = useReplicateCommonFlow()

  const {
    data: { flow },
  } = useSuspenseQuery(useQueryCommonFlows())

  const handleClickReplicate = (data: SubFlowList) => {
    replicateMutation.reset()
    openModal('form-modal', {
      mode: 'deplicate',
      data,
    })
  }

  const handleClickEdit = (data: SubFlowList) => {
    removeMutation.reset()
    openModal('form-modal', {
      mode: 'update',
      data,
    })
  }

  const handleClickDelete = (data: SubFlowList) => {
    updateMutation.reset()
    selectedRow.current = data
    openModal('confirm-modal', null)
  }

  const handleCreate = () => {
    addMutation.reset()
    openModal('form-modal', { mode: 'create' })
  }

  const handleCheckInUseFlow = async (id: number) => {
    const { flow: flows } = await getCommonFlowInUse(id)
    if (flows.length === 0) {
      return false
    }
    openModal(
      'alert-modal',
      flows.map((flow) => `Flow: ${flow.name} v.${flow.version}\n`),
    )
    return true
  }

  const handleSubmit = async (
    mode: 'create' | 'update' | 'deplicate',
    { id, name, version, desc }: SubFlowList,
  ) => {
    switch (mode) {
      case 'create':
        addMutation.mutate({
          name,
          version,
          desc,
          args: {
            in: {
              param: [],
            },
            out: { arg: [] },
          },
          updateDate: new Date(),
        })
        break
      case 'update':
        const inUse = await handleCheckInUseFlow(id)
        if (!inUse) {
          updateMutation.mutate({
            commonFlowId: id,
            updateCommonFlow: {
              name,
              version,
              desc,
            },
          })
        }
        break
      case 'deplicate':
        replicateMutation.mutate({
          commonFlowId: id,
          commonFlow: {
            name,
            version,
            desc,
            args: {
              in: {
                param: [],
              },
              out: { arg: [] },
            },
            updateDate: new Date(),
          },
        })
        break
      default:
        logger.error('잘못된 접근입니다: ' + mode)
    }
  }

  const handleConfirm = async () => {
    const id = selectedRow.current?.id!
    const inUse = await handleCheckInUseFlow(id)

    if (!inUse) {
      selectedRow.current &&
        removeMutation.mutate({ flowId: selectedRow.current.id })
    }
  }

  return (
    <>
      <Modal id="form-modal" title="Edit Common SubFlow">
        <CommonFlowModal onSubmit={handleSubmit} />
      </Modal>
      <Modal id="confirm-modal" title="Delete common SubFlow">
        <ConfirmModal
          content="정말 삭제하시겠습니까?"
          onConfirm={handleConfirm}
        />
      </Modal>
      <Modal id="alert-modal" title="Already In Use">
        <AlertModal />
      </Modal>
      <div className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between gap-6 p-4">
          <h2 className={cn('text-gray-550')}>Common SubFlow Editing</h2>
          <Button variant="secondary2" type="submit" onClick={handleCreate}>
            <PlusIcon />
            New
          </Button>
        </div>
        <Separator />
        <div className="h-full p-6">
          <Grid
            ref={gridRef}
            gridOptions={gridOptions}
            columnDefs={colDefs}
            rowData={flow}
            rowDragManaged={true}
            pagination={false}
          />
        </div>
      </div>
    </>
  )
}
