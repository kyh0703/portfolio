'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import { Checkbox } from '@/app/_components/checkbox'
import Grid from '@/app/_components/grid'
import { AddIcon } from '@/app/_components/icon'
import { Input } from '@/app/_components/input'
import Label from '@/app/_components/label'
import { Modal } from '@/app/_components/modal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { CONTENT_TYPE_OPTIONS, METHOD_OPTIONS } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import useAutocomplete from '@/hooks/use-autocomplete'
import { HeaderList, HttpData } from '@/models/property/packet'
import { useModalStore } from '@/store/modal'
import { Separator } from '@/ui/separator'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef } from 'react'
import HttpDataModal from './http-data-modal'
import { NodePropertyTabProps } from '../../node-properties/types'

const colDefs: ColDef<HeaderList>[] = [
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
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function HttpDataTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const httpData = getValues(props.tabName) as HttpData | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const openModal = useModalStore((state) => state.openModal)
  const gridHeadRef = useRef<AgGridReact<HeaderList>>(null)
  const gridHeadOptions = useGridOption<HeaderList>()
  const {
    rowData: rowHeadData,
    addRow: addHeadRow,
    getRows: getHeadRows,
    updateRowByRowIndex: updateHeadRowByRowIndex,
    onKeyDown: handleHeadKeyDown,
    onRowDragEnd: onHeadRowDragEnd,
    copy: copyHeadRow,
    cut: cutHeadRow,
    paste: pasteHeadRow,
    remove: removeHeadRow,
  } = useGridNodeHook<HeaderList>(gridHeadRef, {
    data: httpData?.headerList,
    onRowChanged: () => setValue('httpData.headerList', getHeadRows()),
  })
  const [headContextMenu, setHeadContextMenu, onHeadCellContextMenu] =
    useGridContext()

  const gridBodyRef = useRef<AgGridReact<HeaderList>>(null)
  const gridBodyOptions = useGridOption<HeaderList>()
  const {
    rowData: rowBodyData,
    addRow: addBodyRow,
    getRows: getBodyRows,
    updateRowByRowIndex: updateBodyRowByRowIndex,
    onKeyDown: handleBodyKeyDown,
    onRowDragEnd: onBodyRowDragEnd,
    copy: copyBodyRow,
    cut: cutBodyRow,
    paste: pasteBodyRow,
    remove: removeBodyRow,
  } = useGridNodeHook<HeaderList>(gridBodyRef, {
    data: httpData?.bodyList,
    onRowChanged: () => setValue('httpData.bodyList', getBodyRows()),
  })
  const [bodyContextMenu, setBodyContextMenu, onBodyCellContextMenu] =
    useGridContext()

  const handleAddClick = (type: 'head' | 'body') => {
    openModal('property-modal', { mode: 'create', type })
  }

  const handleRowDoubleClicked = (
    event: RowDoubleClickedEvent<HeaderList>,
    type: 'head' | 'body',
  ) => {
    if (httpData?.useExpression) return
    openModal('property-modal', {
      mode: 'update',
      type,
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    type: 'head' | 'body',
    data: HeaderList,
    rowIndex?: number,
  ) => {
    if (type === 'head' && mode === 'create') addHeadRow(data)
    else if (type === 'head' && mode === 'update')
      updateHeadRowByRowIndex(data, rowIndex)
    else if (type === 'body' && mode === 'create') addBodyRow(data)
    else if (type === 'head' && mode === 'update')
      updateBodyRowByRowIndex(data, rowIndex)
  }

  const handleViewButtonClick = (type: 'head' | 'body') => {
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      try {
        const rowData = type === 'head' ? getHeadRows() : getBodyRows()
        const mapperJson = rowData.map((row) => ({ [row.name]: row.value }))
        const content = JSON.stringify(mapperJson, null, 2)
        newWindow.document.write(`<pre>${content}</pre>`)
      } catch (e) {
        newWindow.document.write('Error parsing JSON content')
      }
    }
  }

  const handleHeadContextMenuClick = (item: string) => {
    const actions: Record<string, () => void> = {
      delete: removeHeadRow,
      cut: cutHeadRow,
      copy: copyHeadRow,
      paste: pasteHeadRow,
    }
    actions[item]?.()
  }

  const handleBodyContextMenuClick = (item: string) => {
    const actions: Record<string, () => void> = {
      delete: removeBodyRow,
      cut: cutBodyRow,
      copy: copyBodyRow,
      paste: pasteBodyRow,
    }
    actions[item]?.()
  }

  return (
    <div className="flex h-full w-full flex-col">
      {headContextMenu && (
        <GridContextMenu
          {...headContextMenu}
          onItemClick={handleHeadContextMenuClick}
          onClick={() => setHeadContextMenu(null)}
        />
      )}
      {bodyContextMenu && (
        <GridContextMenu
          {...bodyContextMenu}
          onItemClick={handleBodyContextMenuClick}
          onClick={() => setBodyContextMenu(null)}
        />
      )}
      <Modal id="property-modal" title="Assign RequestHTTP Data">
        <HttpDataModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h3>URL</h3>
          <Autocomplete
            name="httpData.url"
            value={httpData?.url}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.httpData?.url && (
            <span className="error-msg">{errors.httpData.url.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Method</h3>
          <Select
            value={httpData?.method}
            onValueChange={(value) => setValue('httpData.method', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METHOD_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <h3>Contents Type</h3>
          <Select
            value={httpData?.contentType}
            onValueChange={(value) => setValue('httpData.contentType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <h3>Connection Timeout</h3>
          <div className="flex items-center space-x-3">
            <Autocomplete
              name="httpData.connTimeout"
              value={httpData?.connTimeout}
              options={options}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <h3>(ms)</h3>
          </div>
          {errors.httpData?.connTimeout && (
            <span className="error-msg">
              {errors.httpData.connTimeout.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Response Timeout</h3>
          <div className="flex items-center space-x-3">
            <Autocomplete
              name="httpData.respTimeout"
              value={httpData?.respTimeout}
              options={options}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <h3>(ms)</h3>
          </div>
          {errors.httpData?.respTimeout && (
            <span className="error-msg">
              {errors.httpData.respTimeout.message}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="verifyCert"
            checked={httpData?.verifyCert}
            onCheckedChange={(checked) =>
              setValue('httpData.verifyCert', !!checked)
            }
          />
          <Label htmlFor="verifyCert">Verify Certification</Label>
        </div>
      </div>
      <Separator />
      <div className="flex h-full flex-col gap-3 p-6">
        <div className="flex items-center justify-between">
          <h3>Head</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleAddClick('head')}
          >
            <AddIcon size={20} />
          </Button>
        </div>
        <div className="h-60">
          <Grid
            ref={gridHeadRef}
            gridOptions={gridHeadOptions}
            columnDefs={colDefs}
            rowData={rowHeadData}
            rowDragManaged={true}
            pagination={false}
            onRowDoubleClicked={(e) => handleRowDoubleClicked(e, 'head')}
            onRowDragEnd={onHeadRowDragEnd}
            onKeyDown={handleHeadKeyDown}
            onCellContextMenu={onHeadCellContextMenu}
          />
        </div>
        <div className="flex justify-end">
          <Button
            variant="secondary3"
            onClick={() => handleViewButtonClick('head')}
          >
            View
          </Button>
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <div className="flex gap-3">
            <Checkbox
              id="useExpression"
              checked={httpData?.useExpression}
              onCheckedChange={(checked) =>
                setValue('httpData.useExpression', !!checked)
              }
            />
            <Label htmlFor="useExpression">Using Expression</Label>
          </div>
          <Input
            value={httpData?.variable}
            disabled={!httpData?.useExpression}
            onChange={(event) =>
              setValue('httpData.variable', event.target.value)
            }
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3>Body</h3>
            <Button
              className="float-end"
              variant="ghost"
              size="icon"
              onClick={() => handleAddClick('body')}
              disabled={httpData?.useExpression}
            >
              <AddIcon size={20} />
            </Button>
          </div>
          <div className="h-60">
            <Grid
              ref={gridBodyRef}
              gridOptions={gridBodyOptions}
              columnDefs={colDefs}
              rowData={rowBodyData}
              rowDragManaged={!httpData?.useExpression}
              pagination={false}
              onRowDoubleClicked={(e) => handleRowDoubleClicked(e, 'body')}
              onRowDragEnd={onBodyRowDragEnd}
              onKeyDown={handleBodyKeyDown}
              onCellContextMenu={onBodyCellContextMenu}
            />
          </div>
          <Button
            className="float-end"
            variant="secondary3"
            onClick={() => handleViewButtonClick('body')}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  )
}
