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
import { DefineIntent } from '@/models/define'
import { IntentCallInfo, IntentList } from '@/models/property/ai'
import { getAllDefine } from '@/services/define'
import { getInFlows } from '@/services/flow'
import { getMenus } from '@/services/menu'
import { useUserContext } from '@/store/context'
import { useModalStore } from '@/store/modal'
import { getDefinePath, getMenuPath, getSubFlowPath } from '@/utils/route-path'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'
import { toast } from 'react-toastify'
import IntentInfoMenu from '../../grid-row-menu/intent-info-menu'
import { NodePropertyTabProps } from '../../node-properties/types'
import IntentInfoModal from './intent-info-modal'

export default function IntentInfoTab(props: NodePropertyTabProps) {
  const colDefs: ColDef<IntentList>[] = [
    {
      headerName: 'Intent ID',
      field: 'id',
      filter: false,
      minWidth: 150,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      rowDrag: true,
    },
    {
      headerName: 'Intent Name',
      field: 'name',
      filter: false,
      minWidth: 180,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    },
    {
      field: 'menuCall',
      hide: true,
    },
    {
      field: 'subCall',
      hide: true,
    },
    {
      minWidth: 60,
      maxWidth: 60,
      cellRendererSelector: (params) => {
        return {
          component: IntentInfoMenu,
          params: {
            moveIntentPage: () => moveIntentPage(params.data.id),
            moveMenuPage: () => moveMenuPage(params.data.menuCall),
            openFlowPage: () => openFlowPage(params.data.subCall),
          },
        }
      },
    } as ColDef,
  ]
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const intentInfo = getValues('intentInfo') as IntentCallInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const router = useRouter()
  const { id: flowId } = useUserContext()
  const openModal = useModalStore((state) => state.openModal)

  const gridRef = useRef<AgGridReact<IntentList>>(null)
  const gridOptions = useGridOption<IntentList>()
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
  } = useGridNodeHook<IntentList>(gridRef, {
    data: intentInfo?.intentList,
    onRowChanged: () => {
      setValue('intentInfo.intentList', getRows())
    },
    onKeyDown: (event) => {
      if (event.key === 'v') {
        if (event.ctrlKey || event.metaKey) {
          throw new Error()
        }
      }
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<IntentList>) => {
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    data: IntentList,
    rowIndex?: number,
  ) => {
    if (mode === 'create') {
      addRow(data)
    } else {
      updateRowByRowIndex(data, rowIndex)
    }
  }

  const moveIntentPage = useCallback(async (intentId: string) => {
    if (!intentId) {
      toast.warn('Intent ID를 찾을 수 없습니다.')
      return
    }

    const intentList = await getAllDefine<DefineIntent>('intent')
    const intent = intentList.find((intent) => intent.defineId === intentId)
    if (!intent) {
      toast.warn('Intent 정보를 찾을 수 없습니다.')
      return
    }

    router.push(getDefinePath('global', 'intent', intent.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const moveMenuPage = useCallback(async (menuId: string) => {
    if (!menuId) {
      toast.warn('Menu ID를 찾을 수 없습니다.')
      return
    }

    const menuList = await getMenus()
    const menu = menuList.find((menu) => menu.property.id === menuId)
    if (!menu) {
      toast.warn('Menu 정보를 찾을 수 없습니다.')
      return
    }

    router.push(getMenuPath(menu.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openFlowPage = useCallback(async (flowName: string) => {
    if (!flowId) {
      toast.warn('Flow ID를 찾을 수 없습니다.')
      return
    }

    const flowList = await getInFlows()
    const flow = flowList.flow.find((flow) => flow.name === flowName)
    if (!flow) {
      toast.warn('Flow를 찾을 수 없습니다.')
      return
    }

    router.push(getSubFlowPath(flow.id))
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
      <Modal id="property-modal" title="Select Intent">
        <IntentInfoModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>Conditional Expression</h3>
          <Autocomplete
            name="intentInfo.condition"
            value={intentInfo?.condition}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.intentInfo?.condition && (
            <span className="error-msg">
              {errors.intentInfo.condition.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2>Intent List</h2>
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
          <div className="flex gap-3">
            <Checkbox
              id="isSleeLog"
              checked={intentInfo?.ignoreGlobalIntent}
              onCheckedChange={(checked) =>
                setValue('intentInfo.ignoreGlobalIntent', !!checked)
              }
            />
            <Label htmlFor="isSleeLog">Ignore Global Intent</Label>
          </div>
        </div>
      </div>
    </div>
  )
}
