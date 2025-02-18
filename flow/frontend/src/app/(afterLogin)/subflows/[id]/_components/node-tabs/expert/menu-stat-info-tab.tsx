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
import { CatList, UserMenuStatInfo } from '@/models/property/tracking'
import { useModalStore } from '@/store/modal'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'
import MenuStatInfoModal from './menu-stat-info-modal'
import { NodePropertyTabProps } from '../../node-properties/types'

const colDefs: ColDef<CatList>[] = [
  {
    headerName: 'Category ID',
    field: 'id',
    filter: false,
    minWidth: 200,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'Category Name',
    field: 'name',
    filter: true,
    minWidth: 150,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Value1',
    field: 'valueList.0',
    filter: true,
    minWidth: 100,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Value2',
    field: 'valueList.1',
    filter: true,
    minWidth: 100,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Value3',
    field: 'valueList.2',
    filter: true,
    minWidth: 100,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Value4',
    field: 'valueList.3',
    filter: true,
    minWidth: 100,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Value5',
    field: 'valueList.4',
    filter: true,
    minWidth: 100,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Value6',
    field: 'valueList.5',
    filter: true,
    minWidth: 100,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Value7',
    field: 'valueList.6',
    filter: true,
    minWidth: 100,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Value8',
    field: 'valueList.7',
    filter: true,
    minWidth: 100,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Value9',
    field: 'valueList.8',
    filter: true,
    minWidth: 100,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Condition',
    field: 'condition',
    filter: true,
    minWidth: 130,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function MenuStatInfoTab(props: NodePropertyTabProps) {
  const { getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as UserMenuStatInfo | undefined

  const openModal = useModalStore((state) => state.openModal)
  const gridRef = useRef<AgGridReact<CatList>>(null)
  const gridOptions = useGridOption<CatList>()
  const {
    rowData,
    addRow,
    getRows,
    updateRowByRowIndex,
    onRowDragEnd,
    onKeyDown,
    copy,
    cut,
    paste,
    remove,
  } = useGridNodeHook<CatList>(gridRef, {
    data: info?.catList,
    onRowChanged: () => {
      setValue('info.catList', getRows())
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<CatList>) => {
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    data: CatList,
    rowIndex?: number,
  ) => {
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
      <Modal id="property-modal" title="Stat Data">
        <MenuStatInfoModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div className="flex h-full flex-col space-y-3 p-6">
        <div className="flex items-center justify-between">
          <h3>Menu Stat Data</h3>
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
      </div>
    </div>
  )
}
