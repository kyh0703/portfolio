'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import Grid from '@/app/_components/grid'
import { AddIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import useAutocomplete from '@/hooks/use-autocomplete'
import { RecognizeResultInfo } from '@/models/property/common'
import { useModalStore } from '@/store/modal'
import { Separator } from '@/ui/separator'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'
import ResultInfoModal from './result-info-modal'
import { NodePropertyTabProps } from '../../node-properties/types'

const colDefs: ColDef<string>[] = [
  {
    headerName: 'Variable',
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

export default function ResultInfoTab(props: NodePropertyTabProps) {
  const { nodeType } = props
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const result = getValues(props.tabName) as RecognizeResultInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const openModal = useModalStore((state) => state.openModal)

  const gridRef = useRef<AgGridReact<string>>(null)
  const gridOptions = useGridOption<string>()
  const {
    rowData,
    getRows,
    addRow,
    updateRowByRowIndex,
    onRowDragEnd,
    onKeyDown,
    copy,
    cut,
    paste,
    remove,
  } = useGridNodeHook<string>(gridRef, {
    data: result?.csrVariable,
    onRowChanged: () => {
      setValue('result.csrVariable', getRows())
    },
  })

  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<string>) => {
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (payload: {
    mode: 'create' | 'update'
    data: string
    rowIndex?: number
  }) => {
    const { mode, data, rowIndex } = payload
    if (mode === 'create') {
      addRow(data)
    } else {
      updateRowByRowIndex(data, rowIndex)
    }
  }

  const handleContextMenuClick = (item: string) => {
    const actions: Record<string, () => void> = {
      delete: remove,
      cut: cut,
      copy: copy,
      paste: paste,
    }
    actions[item]?.()
  }

  return (
    <div className="flex h-full w-full flex-col">
      {contextMenu && (
        <GridContextMenu
          {...contextMenu}
          onItemClick={handleContextMenuClick}
          onClick={() => setContextMenu(null)}
        />
      )}
      <Modal id="property-modal" title="Result Tag">
        <ResultInfoModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      {nodeType === 'ResponseVR' && (
        <>
          <div className="space-y-6 p-6">
            <div className="space-y-3">
              <h3>Name</h3>
              <Autocomplete
                name="result.name"
                value={result?.name}
                options={options}
                onChange={setValue}
                onValueChange={onValueChange}
              />
              {errors.result?.name && (
                <span className="error-msg">{errors.result.name.message}</span>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="overflow-hidden overflow-ellipsis">
            Continuous speech recognition result variable
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openModal('property-modal', { mode: 'create' })}
          >
            <AddIcon size={20} />
          </Button>
        </div>
        <div className="h-60">
          <Grid
            ref={gridRef}
            gridOptions={gridOptions}
            columnDefs={colDefs}
            rowData={rowData}
            rowDragManaged={true}
            pagination={false}
            onRowDoubleClicked={handleRowDoubleClicked}
            onRowDragEnd={onRowDragEnd}
            onKeyDown={onKeyDown}
            onCellContextMenu={onCellContextMenu}
          />
        </div>
      </div>
      {nodeType === 'ResponseVR' && (
        <>
          <Separator />
          <div className="space-y-6 p-6">
            <div className="space-y-3">
              <h3>Max Timeout</h3>
              <Autocomplete
                name="result.maxTimeout"
                value={result?.maxTimeout}
                options={options}
                onChange={setValue}
                onValueChange={onValueChange}
              />
              {errors.result?.maxTimeout && (
                <span className="error-msg">
                  {errors.result.maxTimeout.message}
                </span>
              )}
            </div>
          </div>
          <Separator />
          <div className="space-y-6 p-6">
            <div className="space-y-3">
              <h3>Condition</h3>
              <Autocomplete
                name="result.condition"
                value={result?.condition}
                options={options}
                onChange={setValue}
                onValueChange={onValueChange}
              />
              {errors.result?.condition && (
                <span className="error-msg">
                  {errors.result.condition.message}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
