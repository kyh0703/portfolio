'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import Grid from '@/app/_components/grid'
import { AddIcon } from '@/app/_components/icon'
import { Input } from '@/app/_components/input'
import { Modal } from '@/app/_components/modal'
import PlayButton from '@/app/_components/play-button'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineMent } from '@/models/define'
import { RouteGroupInfo, RouteGroupList } from '@/models/property/common'
import { useQueryDefines } from '@/services/define'
import { useModalStore } from '@/store/modal'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import RouteGroupInfoModal from './route-group-info-modal'
import { NodePropertyTabProps } from '../../node-properties/types'

const colDefs: ColDef<RouteGroupList>[] = [
  {
    headerName: 'Group ID',
    field: 'groupId',
    filter: false,
    minWidth: 150,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'Route Type',
    field: 'routeType',
    filter: true,
    minWidth: 150,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'BSR Route',
    field: 'bsrRoute',
    filter: true,
    minWidth: 150,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Condition',
    field: 'priority',
    filter: true,
    minWidth: 150,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function RouteGroupInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const routeInfo = getValues(props.tabName) as RouteGroupInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const openModal = useModalStore((state) => state.openModal)
  const [mentDesc, setMentDesc] = useState<string>()

  const gridRef = useRef<AgGridReact<RouteGroupList>>(null)
  const gridOptions = useGridOption<RouteGroupList>()
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
  } = useGridNodeHook<RouteGroupList>(gridRef, {
    data: routeInfo?.routeList,
    onRowChanged: () => {
      setValue('routeInfo.routeList', getRows())
    },
    onKeyDown: (event) => {
      if (event.key === 'v') {
        if (event.ctrlKey || event.metaKey) {
          if (rowData.length >= 4) {
            throw new Error('최대 4개까지 등록 가능합니다.')
          }
        }
      }
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const { data: ments } = useSuspenseQuery({
    ...useQueryDefines<DefineMent>('ment'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    const ment = ments.find((ment) => `'${ment.defineId}'` === routeInfo?.bgm)
    setMentDesc(ment?.property.desc || '')
  }, [ments, routeInfo?.bgm])

  const handleRowDoubleClicked = (
    event: RowDoubleClickedEvent<RouteGroupList>,
  ) => {
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    data: RouteGroupList,
    rowIndex?: number,
  ) => {
    if (mode === 'create') {
      addRow(data)
    } else {
      updateRowByRowIndex(data, rowIndex)
    }
  }

  const handleOpenModal = () => {
    if (rowData.length >= 4) {
      toast.warn('최대 4개까지 등록 가능합니다.')
      return
    }
    openModal('property-modal', { mode: 'create' })
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
      <Modal id="property-modal" title="Route">
        <RouteGroupInfoModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2>Route List</h2>
          <Button variant="ghost" size="icon" onClick={handleOpenModal}>
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
        <div className="space-y-3">
          <h3>Priority</h3>
          <Autocomplete
            name="routeInfo.priority"
            value={routeInfo?.priority}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.routeInfo?.priority && (
            <span className="error-msg">
              {errors.routeInfo.priority.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Timeout</h3>
          <div className="flex items-center space-x-3">
            <Autocomplete
              name="routeInfo.timeout"
              value={routeInfo?.timeout}
              options={options}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            {errors.routeInfo?.timeout && (
              <span className="error-msg">
                {errors.routeInfo.timeout.message}
              </span>
            )}
            <h3>(s)</h3>
          </div>
        </div>
        <div className="space-y-3">
          <h3>BGM</h3>
          <div className="flex gap-1.5">
            <Autocomplete
              name="routeInfo.bgm"
              value={routeInfo?.bgm}
              options={options}
              selectOptions={ments.map((ment) => ({
                label: `'${ment.defineId}' - "${ment.property.desc}"`,
                value: `'${ment.defineId}'`,
              }))}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <PlayButton disabled={!routeInfo?.bgm} />
          </div>
          <Input value={mentDesc} readOnly={true} onChange={() => {}} />
        </div>
        <div className="space-y-3">
          <h3>Condition</h3>
          <Autocomplete
            name="routeInfo.condition"
            value={routeInfo?.condition}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.routeInfo?.condition && (
            <span className="error-msg">
              {errors.routeInfo.condition.message}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
