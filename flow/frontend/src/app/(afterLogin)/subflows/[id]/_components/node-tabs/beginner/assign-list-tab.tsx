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
import type { AssignList } from '@/models/property/flow'
import { useModalStore } from '@/store/modal'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'
import type { NodePropertyTabProps } from '../../node-properties/types'
import AssignListModal from './assign-list-modal'

const colDefs: ColDef<AssignList>[] = [
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
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Condition',
    field: 'condition',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function BeginnerAssignListTab(props: NodePropertyTabProps) {
  const { getValues, setValue } = useNodePropertiesContext()
  const assignList = getValues(props.tabName) as AssignList[] | undefined

  const openModal = useModalStore((state) => state.openModal)
  const gridRef = useRef<AgGridReact<AssignList>>(null)
  const gridOptions = useGridOption<AssignList>()
  const {
    rowData,
    getRows,
    addRow,
    updateRowByRowIndex,
    onRowDragEnd,
    onKeyDown,
    cut,
    copy,
    paste,
    remove,
  } = useGridNodeHook<AssignList>(gridRef, {
    data: assignList,
    onRowChanged: () => {
      setValue('assignList', getRows())
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<AssignList>) => {
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    data: AssignList,
    rowIndex?: number,
  ) => {
    if (mode === 'create') {
      addRow(data)
    } else {
      updateRowByRowIndex(data, rowIndex)
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
      <Modal id="property-modal" title="Assign Variable">
        <AssignListModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div className="flex h-full flex-col space-y-3 p-6">
        <div className="flex items-center justify-between">
          <h3>Assign Variable</h3>
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
            onCellContextMenu={onCellContextMenu}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    </div>
  )
}
