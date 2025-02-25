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
import { DefineVar } from '@/models/define'
import { BranchList, ExpandMenuInfo } from '@/models/property/flow'
import { useQueryDefines } from '@/services/define'
import { getInFlows } from '@/services/flow'
import { getMenu, getMenus } from '@/services/menu'
import { useModalStore } from '@/store/modal'
import { Separator } from '@/ui/separator'
import { removeDuplicateDefines } from '@/utils/options'
import { getMenuPath, getSubFlowPath } from '@/utils/route-path'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import ExpandMenuInfoMenu from '../../grid-row-menu/expand-menu-info-menu'
import { NodePropertyTabProps } from '../../node-properties/types'
import ExpandMenuInfoModal from './expand-menu-info-modal'

export default function ExpandMenuInfoTab(props: NodePropertyTabProps) {
  const router = useRouter()
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const openModal = useModalStore((state) => state.openModal)

  const [hasDefault, setHasDefault] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const gridRef = useRef<AgGridReact<BranchList>>(null)
  const gridOptions = useGridOption<BranchList>()

  const expandMenuInfo = getValues('expandMenuInfo') as
    | ExpandMenuInfo
    | undefined
  const enable = expandMenuInfo?.expand
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const colDefs: ColDef<BranchList>[] = [
    { field: 'branchType', hide: true },
    {
      headerName: 'Condition',
      field: 'comCondition',
      filter: false,
      minWidth: 170,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      rowDrag: true,
    },
    {
      headerName: 'Name',
      field: 'name',
      filter: true,
      minWidth: 150,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    },
    {
      field: 'useExpression',
      hide: true,
    },
    {
      headerName: 'Menu ID',
      field: 'menuId',
      filter: true,
      minWidth: 130,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    },
    {
      field: 'condition',
      hide: true,
    },
    {
      minWidth: 60,
      maxWidth: 60,
      cellRendererSelector: (params) => {
        return {
          component: ExpandMenuInfoMenu,
          params: {
            moveMenuPage: () => moveMenuPage(params.data.menuId),
            openFlowPage: () => openFlowPage(params.data.menuId),
          },
        }
      },
    } as ColDef,
  ]

  const {
    rowData,
    addRow,
    getRows,
    getSelectedRows,
    updateRowByRowIndex,
    onRowDragEnd,
    onKeyDown,
    cut,
    copy,
    paste,
    remove,
  } = useGridNodeHook<BranchList>(gridRef, {
    data: expandMenuInfo?.branchList,
    onRowChanged: () => {
      const newRows = getRows()
      const tempHasDefault = newRows.some((row) => row.branchType === 'Default')
      setHasDefault(tempHasDefault)
      setValue('expandMenuInfo.branchList', getRows())
    },
    onKeyDown: (event) => {
      if (event.key === 'c') {
        if (event.ctrlKey || event.metaKey) {
          const selectedRows = getSelectedRows()
          if (selectedRows) {
            const includedDefault = selectedRows.some(
              (row) => row.data?.branchType === 'Default',
            )
            if (includedDefault) {
              throw new Error('Default는 복사할 수 없습니다')
            }
          }
        }
      }
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const { data: vars } = useSuspenseQuery({
    ...useQueryDefines<DefineVar>('var'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    const tempHasDefault = expandMenuInfo?.branchList.some(
      (item) => item.branchType === 'Default',
    )
    if (tempHasDefault) setHasDefault(tempHasDefault)
  }, [expandMenuInfo?.branchList])

  const moveMenuPage = async (menuId: string) => {
    const menus = await getMenus()
    const selectedMenu = menus.find((menu) => menu.property.id === menuId)
    if (!selectedMenu) {
      toast.warn('Menu 정보를 찾을 수 없습니다.')
      return
    }

    router.push(getMenuPath(selectedMenu.id))
  }

  const openFlowPage = async (menuId: string) => {
    const menus = await getMenus()
    const selectedMenu = menus.find((menu) => menu.property.id === menuId)
    if (!selectedMenu) {
      toast.warn('Menu 정보를 찾을 수 없습니다.')
      return
    }

    const menuInfo = await getMenu(selectedMenu.id)
    if (!menuInfo) {
      toast.warn('Menu 정보를 찾을 수 없습니다.')
      return
    }

    const subFlowName = menuInfo.property.subFlowName
    if (!subFlowName) {
      toast.warn('Flow 정보를 찾을 수 없습니다.')
      return
    }

    const { flow } = await getInFlows()
    const subFlow = flow.find(({ name }) => name === subFlowName)
    if (!subFlow) {
      toast.warn('SubFlow 정보를 찾을 수 없습니다.')
      return
    }
    router.push(getSubFlowPath(subFlow.id))
  }

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<BranchList>) => {
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    data: BranchList,
    rowIndex?: number,
  ) => {
    if (mode === 'create') {
      addRow(data)
    } else {
      updateRowByRowIndex(data, rowIndex)
    }
    buttonRef.current?.click()
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
      <Modal id="property-modal" title="Menu Branching">
        <ExpandMenuInfoModal
          tabProps={props}
          disable={hasDefault}
          onSubmit={handleModalSubmit}
        />
      </Modal>
      <div className="flex items-center space-x-2 p-6">
        <Checkbox
          id="expand"
          checked={expandMenuInfo?.expand}
          onCheckedChange={(checked) =>
            setValue('expandMenuInfo.expand', !!checked)
          }
        />
        <Label htmlFor="expand">Use Expand Menu Info</Label>
      </div>
      <Separator />
      <div className="flex h-full flex-grow flex-col space-y-6 p-6">
        <div className="space-y-3">
          <h3>Conditional Expression</h3>
          <Autocomplete
            name="expandMenuInfo.condExpression"
            value={expandMenuInfo?.condExpression}
            options={options}
            selectOptions={vars.map((item) => item.defineId)}
            disabled={!enable}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.expandMenuInfo?.condExpression && (
            <span className="error-msg">
              {errors.expandMenuInfo.condExpression.message}
            </span>
          )}
        </div>
        <div className="flex flex-grow flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3>Conditional Branching</h3>
            <Button
              variant="ghost"
              size="icon"
              disabled={!enable}
              onClick={() => openModal('property-modal', { mode: 'create' })}
            >
              <AddIcon size={20} />
            </Button>
          </div>
          <div className="h-full flex-grow">
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
                    onRowDragEnd,
                    onKeyDown,
                  }
                : null)}
              onCellContextMenu={onCellContextMenu}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
