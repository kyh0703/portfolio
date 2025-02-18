'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import Grid from '@/app/_components/grid'
import { Modal } from '@/app/_components/modal'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import useAutocomplete from '@/hooks/use-autocomplete'
import { SubCallInfo } from '@/models/property/flow'
import { getSubFlow, useQueryAllInFlow } from '@/services/flow'
import { useModalStore } from '@/store/modal'
import { removeMainOrEndFlows } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import type { NodePropertyTabProps } from '../../node-properties/types'
import ArgumentInfoModal from './argument-info-modal'

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

const colViewDefs: ColDef<string>[] = [
  {
    headerName: 'Name',
    valueGetter: (params) => params.data,
    valueSetter: (params) => {
      params.data = params.newValue
      return true
    },
    filter: false,
    suppressHeaderMenuButton: false,
    suppressHeaderFilterButton: false,
    rowDrag: false,
  },
]

export default function ArgumentInfoTab(props: NodePropertyTabProps) {
  const router = useRouter()
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as SubCallInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const openModal = useModalStore((state) => state.openModal)

  const gridInRef = useRef<AgGridReact<string>>(null)
  const gridInOptions = useGridOption<string>()
  const {
    rowData: inRowData,
    getRows: getInRows,
    setRows: setInRows,
    addRow: addInRow,
    updateRowByRowIndex: updateInRowByRowIndex,
    onRowDragEnd: onInRowDragEnd,
    onKeyDown: onInKeyDown,
    cut: cutInRow,
    copy: copyInRow,
    paste: pasteInRow,
    remove: removeInRow,
  } = useGridNodeHook<string>(gridInRef, {
    data: info?.in.arg,
    onRowChanged: () => {
      setValue('info.in.arg', getInRows())
    },
  })

  const gridOutRef = useRef<AgGridReact<string> | null>(null)
  const gridOutOptions = useGridOption<string>()
  const {
    rowData: outRowData,
    getRows: getOutRows,
    setRows: setOutRowData,
    addRow: addOutRow,
    updateRowByRowIndex: updateOutRowByRowIndex,
    onRowDragEnd: onOutRowDragEnd,
    onKeyDown: onOutKeyDown,
    cut: cutOutRow,
    copy: copyOutRow,
    paste: pasteOutRow,
    remove: removeOutRow,
  } = useGridNodeHook<string>(gridOutRef, {
    data: info?.out.arg,
    onRowChanged: () => {
      setValue('info.out.arg', getOutRows())
    },
  })

  const [inContextMenu, setInContextMenu, onInCellContextMenu] =
    useGridContext()
  const [outContextMenu, setOutContextMenu, onOutCellContextMenu] =
    useGridContext()
  const [outParamRowDataView, setOutRowDataView] = useState<string[]>([])
  const [inParamRowDataView, setInRowDataView] = useState<string[]>([])

  const { data: inflows } = useSuspenseQuery({
    ...useQueryAllInFlow(),
    select: (data) => removeMainOrEndFlows(data.flow),
  })

  const handleModalSubmit = (payload: {
    mode: 'create' | 'update'
    type: 'in' | 'out'
    data: string
    rowIndex?: number
  }) => {
    const { mode, type, data, rowIndex } = payload
    if (mode === 'create' && type === 'in') {
      addInRow(data)
      return
    }
    if (mode === 'create' && type === 'out') {
      addOutRow(data)
      return
    }
    if (mode === 'update' && type === 'in') {
      updateInRowByRowIndex(data, rowIndex)
      return
    }
    if (mode === 'update' && type === 'out') {
      updateOutRowByRowIndex(data, rowIndex)
      return
    }
  }

  const handleAddButtonClick = (type: 'in' | 'out') => {
    openModal('property-modal', { mode: 'create', type })
  }

  const handleInParamButtonClick = async (type: 'get' | 'view') => {
    const filterSubFlow = inflows.find(
      (flow) => flow.name === info?.subFlowName,
    )
    if (!filterSubFlow) return

    const subFlow = await getSubFlow(filterSubFlow.id)
    const inParams = subFlow.args.in.param.map(
      ({ name, value }) => `${name}${value ? `=${value}` : ''}`,
    )
    type === 'view' ? setInRowDataView(inParams) : setInRows(inParams)
  }

  const handleOutParamButtonClick = async (type: 'get' | 'view') => {
    const filterSubFlow = inflows.find(
      (flow) => flow.name === info?.subFlowName,
    )
    if (!filterSubFlow) return

    const subFlow = await getSubFlow(filterSubFlow.id)
    const outParams = subFlow.args.out.arg
    type === 'view' ? setOutRowDataView(outParams) : setOutRowData(outParams)
  }

  const handleRowDoubleClicked = (
    event: RowDoubleClickedEvent<string>,
    type: 'in' | 'out',
  ) => {
    openModal('property-modal', {
      mode: 'update',
      type,
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleOpenFlow = () => {
    const subFlow = inflows.find((flow) => flow.name === info?.subFlowName)
    if (subFlow) {
      router.push(`/subflows/${subFlow.id}`)
    }
  }

  const handleInContextMenuClick = async (item: string) => {
    const actions: Record<string, () => void> = {
      delete: removeInRow,
      cut: cutInRow,
      copy: copyInRow,
      paste: pasteInRow,
    }
    actions[item]?.()
  }

  const handleOutContextMenuClick = async (item: string) => {
    const actions: Record<string, () => void> = {
      delete: removeOutRow,
      cut: cutOutRow,
      copy: copyOutRow,
      paste: pasteOutRow,
    }
    actions[item]?.()
  }

  return (
    <div className="flex h-full w-full flex-col">
      {inContextMenu && (
        <GridContextMenu
          {...inContextMenu}
          onItemClick={handleInContextMenuClick}
          onClick={() => setInContextMenu(null)}
        />
      )}
      {outContextMenu && (
        <GridContextMenu
          {...outContextMenu}
          onItemClick={handleOutContextMenuClick}
          onClick={() => setOutContextMenu(null)}
        />
      )}
      <Modal id="property-modal" title="Argument">
        <ArgumentInfoModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>Name</h3>
          <Autocomplete
            name="info.name"
            value={info?.name}
            options={options}
            autoFocus
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.info?.name && (
            <span className="error-msg">{errors.info.name.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Sub Flow</h3>
          <div className="flex gap-1.5">
            <div className="flex-grow">
              <Autocomplete
                name="info.subFlowName"
                value={info?.subFlowName}
                options={options}
                selectOptions={inflows.map((opt) => opt.name)}
                onChange={setValue}
                onValueChange={onValueChange}
              />
            </div>
            <Button
              className="flex-shrink"
              variant="secondary3"
              onClick={handleOpenFlow}
            >
              Open
            </Button>
          </div>
          {errors.info?.subFlowName && (
            <span className="error-msg">{errors.info.subFlowName.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <h3>Argument [In]</h3>
            <div className="flex gap-1.5">
              <Button
                className="w-24"
                variant="secondary3"
                disabled={!info?.subFlowName}
                onClick={() => handleInParamButtonClick('get')}
              >
                Get Param
              </Button>
              <Button
                className="w-5"
                variant="secondary3"
                onClick={() => handleAddButtonClick('in')}
              >
                +
              </Button>
            </div>
            <Button
              className="w-24"
              variant="secondary3"
              disabled={!info?.subFlowName}
              onClick={() => handleInParamButtonClick('view')}
            >
              View Param
            </Button>
          </div>
          <div className="flex h-[300px] gap-1.5">
            <Grid
              ref={gridInRef}
              gridOptions={gridInOptions}
              columnDefs={colDefs}
              rowData={inRowData}
              rowDragManaged={true}
              pagination={false}
              onRowDoubleClicked={(e) => handleRowDoubleClicked(e, 'in')}
              onRowDragEnd={onInRowDragEnd}
              onCellContextMenu={onInCellContextMenu}
              onKeyDown={onInKeyDown}
            />
            <Grid
              columnDefs={colViewDefs}
              rowData={inParamRowDataView}
              rowDragManaged={false}
              pagination={false}
            />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <h3>Argument [In/Out]</h3>
            <div className="flex gap-1.5">
              <Button
                className="w-24"
                variant="secondary3"
                disabled={!info?.subFlowName}
                onClick={() => handleOutParamButtonClick('get')}
              >
                Get Param
              </Button>
              <Button
                className="w-5"
                variant="secondary3"
                onClick={() => handleAddButtonClick('out')}
              >
                +
              </Button>
            </div>
            <Button
              className="w-24"
              variant="secondary3"
              disabled={!info?.subFlowName}
              onClick={() => handleOutParamButtonClick('view')}
            >
              View Param
            </Button>
          </div>
          <div className="flex h-[300px] gap-1.5">
            <Grid
              ref={gridOutRef}
              gridOptions={gridOutOptions}
              columnDefs={colDefs}
              rowData={outRowData}
              rowDragManaged={true}
              pagination={false}
              onRowDoubleClicked={(e) => handleRowDoubleClicked(e, 'out')}
              onRowDragEnd={onOutRowDragEnd}
              onCellContextMenu={onOutCellContextMenu}
              onKeyDown={onOutKeyDown}
            />
            <Grid
              columnDefs={colViewDefs}
              rowData={outParamRowDataView}
              rowDragManaged={false}
              pagination={false}
              width="70%"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
