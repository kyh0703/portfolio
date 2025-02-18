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
import type { JsonData } from '@/models/property/packet'
import { useModalStore } from '@/store/modal'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useCallback, useRef } from 'react'
import JsonDataModal from './json-data-modal'
import { NodePropertyTabProps } from '../../node-properties/types'

const colDefs: ColDef<JsonData>[] = [
  {
    headerName: 'Key',
    field: 'key',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'Value',
    field: 'value',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function BeginnerJsonDataTab(props: NodePropertyTabProps) {
  const { getValues, setValue } = useNodePropertiesContext()
  const jsonData = getValues('jsonData') as JsonData[] | undefined

  const { openModal } = useModalStore()

  const gridRef = useRef<AgGridReact<JsonData>>(null)
  const gridOptions = useGridOption<JsonData>()
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
  } = useGridNodeHook<JsonData>(gridRef, {
    data: jsonData,
    onRowChanged: () => {
      setValue('jsonData', getRows())
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<JsonData>) => {
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    data: JsonData,
    rowIndex?: number,
  ) => {
    if (mode === 'create') {
      addRow(data)
    } else {
      updateRowByRowIndex(data, rowIndex)
    }
  }

  const handleViewButtonClick = useCallback(() => {
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      try {
        const mapperJson = getRows().map((row) => ({ [row.key]: row.value }))
        const content = JSON.stringify(mapperJson, null, 2)
        newWindow.document.write(`<pre>${content}</pre>`)
      } catch (e) {
        newWindow.document.write('Error parsing JSON content')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <Modal id="property-modal" title="Json Packet Data">
        <JsonDataModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div className="flex h-full flex-col space-y-6 p-6">
        <div className="flex items-center justify-between gap-3">
          <h3>Send Json Packet Data</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openModal('property-modal', { mode: 'create' })}
          >
            <AddIcon size={20} />
          </Button>
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
            onRowDragEnd={onRowDragEnd}
            onKeyDown={onKeyDown}
            onCellContextMenu={onCellContextMenu}
          />
        </div>
        <div className="flex items-center justify-end">
          <Button variant="secondary3" onClick={handleViewButtonClick}>
            View
          </Button>
        </div>
      </div>
    </div>
  )
}
