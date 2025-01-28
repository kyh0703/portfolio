'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import { Checkbox } from '@/app/_components/checkbox'
import Grid from '@/app/_components/grid'
import { AddIcon } from '@/app/_components/icon'
import Label from '@/app/_components/label'
import { Modal } from '@/app/_components/modal'
import {
  DTMF_LENGTH_OPTIONS,
  SELECT_CONDITION_OPTIONS,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import useAutocomplete from '@/hooks/use-autocomplete'
import { MenuChangeInfo, MenuData } from '@/models/property/flow'
import { useQueryMenus } from '@/services/menu'
import { useModalStore } from '@/store/modal'
import { Separator } from '@/ui/separator'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useMemo, useRef } from 'react'
import SetMenuModal from '../node-modals/set-menu-modal'
import { NodePropertyTabProps } from '../node-property/types'

const colDefs: ColDef<MenuData>[] = [
  {
    headerName: 'DTMF',
    field: 'dtmf',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'VR Value',
    field: 'vrValue',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Menu ID',
    field: 'menuId',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function SetMenuInfoTab(props: NodePropertyTabProps) {
  const { getValues, setValue } = useNodePropertiesContext()
  const menuInfo = getValues(props.tabName) as MenuChangeInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const openModal = useModalStore((state) => state.openModal)

  const gridRef = useRef<AgGridReact<MenuData>>(null)
  const gridOptions = useGridOption<MenuData>()
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
  } = useGridNodeHook<MenuData>(gridRef, {
    data: menuInfo?.menuData,
    onRowChanged: () => {
      setValue('assignList', getRows())
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const { data: menuList } = useSuspenseQuery(useQueryMenus())
  const menuOptions = useMemo(
    () => menuList.map((ment) => ment.property.id),
    [menuList],
  )

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<MenuData>) => {
    openModal('property-modal', { mode: 'update', data: event.data })
  }

  const handleModalSubmit = (mode: 'create' | 'update', data: MenuData) => {
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
      <Modal id="property-modal" title="Menu Data">
        <SetMenuModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>Top Menu</h3>
          <Autocomplete
            name="menuInfo.topMenu"
            value={menuInfo?.topMenu}
            options={options}
            selectOptions={menuOptions}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>Up Menu</h3>
          <Autocomplete
            name="menuInfo.upMenu"
            value={menuInfo?.upMenu}
            options={options}
            selectOptions={menuOptions}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>Top Key</h3>
          <Autocomplete
            name="menuInfo.topKey"
            value={menuInfo?.topKey}
            options={options}
            selectOptions={SELECT_CONDITION_OPTIONS}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>Up Key</h3>
          <Autocomplete
            name="menuInfo.upKey"
            value={menuInfo?.upKey}
            options={options}
            selectOptions={SELECT_CONDITION_OPTIONS}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>DTMF Length</h3>
          <Autocomplete
            name="menuInfo.dtmfLen"
            value={menuInfo?.dtmfLen}
            options={options}
            selectOptions={DTMF_LENGTH_OPTIONS}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-3 p-6">
        <div className="flex gap-3">
          <Checkbox
            id="variableUse"
            checked={menuInfo?.variableUse}
            onCheckedChange={(checked) =>
              setValue('menuInfo.variableUse', !!checked)
            }
          />
          <Label htmlFor="variableUse">Using a Variable</Label>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3>Change Menu Data</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openModal('property-modal', { mode: 'create' })}
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
    </div>
  )
}
