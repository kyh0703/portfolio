'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import { Button } from '@/app/_components/button'
import Grid from '@/app/_components/grid'
import { AddIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import type {
  ArgumentInfo,
  InParams,
  ParameterInfo,
} from '@/models/property/common'
import { useModalStore } from '@/store/modal'
import { type ColDef, type RowDoubleClickedEvent } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useRef, useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'
import BeginnerParameterInfoModal from './parameter-info-modal'

const inColDefs: ColDef<InParams>[] = [
  {
    headerName: 'Name',
    field: 'name',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'Expression',
    field: 'value',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

const outColDefs: ColDef<string>[] = [
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

export default function BeginnerParameterInfoTab(props: NodePropertyTabProps) {
  const { getValues, setValue } = useNodePropertiesContext()
  const parameterInfo = getValues('in') as ParameterInfo | undefined
  const argumentInfo = getValues('out') as ArgumentInfo | undefined

  const openModal = useModalStore((state) => state.openModal)
  const [modalType, setModalType] = useState<'in' | 'out'>('in')

  const inGridRef = useRef<AgGridReact<InParams>>(null)
  const inGridOptions = useGridOption<InParams>()
  const {
    rowData: rowInData,
    getRows: getInRows,
    addRow: addInRow,
    updateRowByRowIndex: updateInRowByRowIndex,
    onRowDragEnd: onInRowDragEnd,
    onKeyDown: onInKeyDown,
    copy: copyIn,
    cut: cutIn,
    paste: pasteIn,
    remove: removeIn,
  } = useGridNodeHook<InParams>(inGridRef, {
    data: parameterInfo?.param,
    onRowChanged: () => setValue('in.param', getInRows()),
  })
  const [inContextMenu, setInContextMenu, onInCellContextMenu] =
    useGridContext()

  const outGridRef = useRef<AgGridReact<string>>(null)
  const outGridOptions = useGridOption<{ name: string }>()
  const {
    rowData: rowOutData,
    getRows: getOutRows,
    addRow: addOutRow,
    updateRowByRowIndex: updateOutRowByRowIndex,
    onRowDragEnd: onOutRowDragEnd,
    onKeyDown: onOutKeyDown,
    copy: copyOut,
    cut: cutOut,
    paste: pasteOut,
    remove: removeOut,
  } = useGridNodeHook<string>(outGridRef, {
    data: argumentInfo?.arg,
    onRowChanged: () => setValue('out.arg', getOutRows()),
  })
  const [outContextMenu, setOutContextMenu, onOutCellContextMenu] =
    useGridContext()

  const handleInRowDoubleClicked = (event: RowDoubleClickedEvent<InParams>) => {
    setModalType('in')
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleInOutRowDoubleClicked = (
    event: RowDoubleClickedEvent<string>,
  ) => {
    setModalType('out')
    openModal('property-modal', {
      mode: 'update',
      data: { name: event.data },
      rowIndex: event.rowIndex,
    })
  }

  const handleInModalClick = () => {
    setModalType('in')
    openModal('property-modal', { mode: 'create' })
  }

  const handleInoutModalClick = () => {
    setModalType('out')
    openModal('property-modal', { mode: 'create' })
  }

  const handleInModalSubmit = (
    mode: 'create' | 'update',
    data: InParams,
    rowIndex?: number,
  ) => {
    switch (modalType) {
      case 'in':
        const inParams = data as InParams
        if (mode === 'create') {
          addInRow(inParams)
        } else {
          updateInRowByRowIndex(inParams, rowIndex)
        }
        break
      case 'out':
        const inOutParams = data as InParams
        if (mode === 'create') {
          addOutRow(inOutParams.name)
        } else {
          updateOutRowByRowIndex(inOutParams.name, rowIndex)
        }
        break
    }
  }

  const handleInContextMenuClick = (item: string) => {
    const actions: Record<string, () => void> = {
      delete: removeIn,
      cut: cutIn,
      copy: copyIn,
      paste: pasteIn,
    }
    actions[item]?.()
  }

  const handleOutContextMenuClick = (item: string) => {
    const actions: Record<string, () => void> = {
      delete: removeOut,
      cut: cutOut,
      copy: copyOut,
      paste: pasteOut,
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
      <Modal id="property-modal" title="Parameter Info">
        <BeginnerParameterInfoModal
          tabProps={props}
          type={modalType}
          onSubmit={handleInModalSubmit}
        />
      </Modal>
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3>Parameter [In]</h3>
            <Button variant="ghost" size="icon" onClick={handleInModalClick}>
              <AddIcon size={20} />
            </Button>
          </div>
          <div className="h-60">
            <Grid
              ref={inGridRef}
              gridOptions={inGridOptions}
              columnDefs={inColDefs}
              rowData={rowInData}
              rowDragManaged={true}
              onRowDoubleClicked={handleInRowDoubleClicked}
              pagination={false}
              onRowDragEnd={onInRowDragEnd}
              onKeyDown={onInKeyDown}
              onCellContextMenu={onInCellContextMenu}
            />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3>Parameter [In/Out]</h3>
            <Button variant="ghost" size="icon" onClick={handleInoutModalClick}>
              <AddIcon size={20} />
            </Button>
          </div>
          <div className="h-60">
            <Grid
              ref={outGridRef}
              gridOptions={outGridOptions}
              columnDefs={outColDefs}
              rowData={rowOutData}
              pagination={false}
              onRowDoubleClicked={handleInOutRowDoubleClicked}
              onRowDragEnd={onOutRowDragEnd}
              onKeyDown={onOutKeyDown}
              onCellContextMenu={onOutCellContextMenu}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
