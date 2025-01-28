'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import { Checkbox } from '@/app/_components/checkbox'
import Grid from '@/app/_components/grid'
import { AddIcon } from '@/app/_components/icon'
import Label from '@/app/_components/label'
import { Modal } from '@/app/_components/modal'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { DataList, VisualARSInfo } from '@/models/property/common'
import { useModalStore } from '@/store/modal'
import { Separator } from '@/ui/separator'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'
import VisualARSModal from '../node-modals/visual-ars-modal'
import { NodePropertyTabProps } from '../node-property/types'

const colDefs: ColDef<DataList>[] = [
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
    field: 'expression',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function VisualARSTab(props: NodePropertyTabProps) {
  const { nodeType, tabName } = props

  const { getValues, setValue } = useNodePropertiesContext()
  const vars = getValues(tabName) as VisualARSInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const enable = vars?.enable
  const openModal = useModalStore((state) => state.openModal)

  const gridRef = useRef<AgGridReact<DataList>>(null)
  const gridOptions = useGridOption<DataList>()
  const {
    rowData,
    getSelectedRow,
    getRows,
    addRow,
    updateRowByRowIndex,
    onRowDragEnd,
    onKeyDown,
    copy,
    cut,
    paste,
    remove,
  } = useGridNodeHook<DataList>(gridRef, {
    data: vars?.inputData.dataList,
    onRowChanged: () => {
      setValue('vars.inputData.dataList', getRows())
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<DataList>) => {
    openModal('property-modal', { mode: 'update', data: event.data })
  }

  const handleModalSubmit = (mode: 'create' | 'update', data: DataList) => {
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
    <div className="flex h-full w-full flex-col">
      {contextMenu && (
        <GridContextMenu
          {...contextMenu}
          onItemClick={handleContextMenuClick}
          onClick={() => setContextMenu(null)}
        />
      )}
      <Modal id="property-modal" title="Json">
        <VisualARSModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div>
        <div className="flex items-center space-x-2 p-6">
          <Checkbox
            id="enable"
            checked={vars?.enable}
            onCheckedChange={(checked) => setValue('vars.enable', !!checked)}
          />
          <Label htmlFor="enable">Use AR Action</Label>
        </div>
        <Separator />
        <div className="space-y-3 p-6">
          <h2>Input (Send)</h2>
          <div className="space-y-6">
            <div className="space-y-3">
              <h3>Transaction ID</h3>
              <Autocomplete
                name="vars.inputData.transactionId"
                value={vars?.inputData.transactionId}
                options={options}
                selectOptions={
                  // TODO: 운영관리 Adaptor 목록과 연동된다면 콤보박스 버튼을 누르면 리스팅
                  []
                }
                disabled={!enable}
                onChange={setValue}
                onValueChange={onValueChange}
              />
            </div>
            <div className="flex flex-col space-y-3">
              <div className="flex gap-3">
                <Checkbox
                  id="clearDigit"
                  checked={vars?.inputData.clearDigit}
                  disabled={!enable}
                  onCheckedChange={(checked) =>
                    setValue('vars.inputData.clearDigit', !!checked)
                  }
                />
                <Label htmlFor="clearDigit">Clear Digit</Label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  id="tracking"
                  checked={vars?.inputData.tracking}
                  disabled={!enable}
                  onCheckedChange={(checked) =>
                    setValue('vars.inputData.tracking', !!checked)
                  }
                />
                <Label htmlFor="tracking">Tracking</Label>
              </div>
              {nodeType === 'GetDigit' && (
                <div className="flex gap-3">
                  <Checkbox
                    id="skipFirst"
                    checked={vars?.inputData.skipFirst}
                    disabled={!enable}
                    onCheckedChange={(checked) =>
                      setValue('vars.inputData.skipFirst', !!checked)
                    }
                  />
                  <Label htmlFor="skipFirst">Skip 1st Try</Label>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex justify-end space-y-3">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!enable}
                  onClick={() =>
                    openModal('property-modal', { mode: 'create' })
                  }
                >
                  <AddIcon width={20} height={20} />
                </Button>
              </div>
              <div className="h-60">
                <Grid
                  ref={gridRef}
                  gridOptions={gridOptions}
                  columnDefs={colDefs}
                  rowData={rowData}
                  rowDragManaged={enable}
                  pagination={false}
                  {...(enable
                    ? {
                        onRowDoubleClicked: handleRowDoubleClicked,
                        onCellContextMenu: onCellContextMenu,
                        onRowDragEnd,
                        onKeyDown,
                      }
                    : null)}
                />
              </div>
            </div>
          </div>
        </div>
        <Separator />
        {nodeType === 'GetDigit' && (
          <div className="space-y-3 p-6">
            <h2>Output (Receive)</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3>Page Name</h3>
                <Autocomplete
                  name="vars.outputData.pageName"
                  value={vars?.outputData.pageName}
                  options={options}
                  disabled={!enable}
                  onChange={setValue}
                  onValueChange={onValueChange}
                />
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Checkbox
                    id="useTimeout"
                    checked={vars?.outputData.useTimeout}
                    disabled={!enable}
                    onCheckedChange={(checked) =>
                      setValue('vars.outputData.useTimeout', !!checked)
                    }
                  />
                  <Label htmlFor="useTimeout">Use Time</Label>
                </div>
                <div className="flex items-center">
                  <div className="flex-grow">
                    <Autocomplete
                      name="vars.outputData.timeout"
                      value={vars?.outputData.timeout}
                      options={options}
                      disabled={!enable || !vars?.outputData.useTimeout}
                      onChange={setValue}
                      onValueChange={onValueChange}
                    />
                  </div>
                  <div className="pl-1">(Second)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
