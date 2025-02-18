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
import PlayButton from '@/app/_components/play-button'
import { RadioGroup, RadioGroupItem } from '@/app/_components/radio-group'
import { CHOICE_CALL_OPTIONS, TIMEOUT_OPTIONS_30 } from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import useAutocomplete from '@/hooks/use-autocomplete'
import { DefineMent } from '@/models/define'
import { DBQueryInfo } from '@/models/property/database'
import { useQueryDefines } from '@/services/define'
import { useModalStore } from '@/store/modal'
import { Separator } from '@/ui/separator'
import { removeDuplicateDefines } from '@/utils/options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from 'react'
import ArgumentInfoModal from './argument-info-modal'
import { NodePropertyTabProps } from '../../node-properties/types'

const colArgumentDataDefs: ColDef<string>[] = [
  {
    headerName: 'Name',
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

const colResultColumnDefs: ColDef<string>[] = [
  {
    headerName: 'Column',
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

export default function QueryInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues(props.tabName) as DBQueryInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const openModal = useModalStore((state) => state.openModal)

  const [mentDesc, setMentDesc] = useState<string>()
  const [modalType, setModalType] = useState<'argumentData' | 'resultColumn'>()

  const gridArgumentDataRef = useRef<AgGridReact<string>>(null)
  const gridArgumentOptions = useGridOption<string>()
  const {
    rowData: argumentRowData,
    addRow: addArgumentDataRow,
    getRows: getArgumentDataRows,
    updateRowByRowIndex: updateArgumentDataRowByRowIndex,
    onRowDragEnd: onArgumentDataDragEnd,
    onKeyDown: onArgumentDataKeyDown,
    copy: copyArgumentData,
    cut: cutArgumentData,
    paste: pasteArgumentData,
    remove: removeArgumentData,
  } = useGridNodeHook<string>(gridArgumentDataRef, {
    data: info?.argList,
    onRowChanged: () => {
      setValue('info.argList', getArgumentDataRows())
    },
  })
  const [
    argumentContextMenu,
    setArgumentContextMenu,
    onArgumentCellContextMenu,
  ] = useGridContext()

  const gridResultColumnRef = useRef<AgGridReact<string>>(null)
  const gridResultOptions = useGridOption<string>()
  const {
    rowData: resultRowData,
    addRow: addResultColumnRow,
    getRows: getResultColumnRows,
    updateRowByRowIndex: updateResultColumnRowByRowIndex,
    onRowDragEnd: onResultColumnDragEnd,
    onKeyDown: onResultColumnKeyDown,
    copy: copyResultColumn,
    cut: cutResultColumn,
    paste: pasteResultColumn,
    remove: removeResultColumn,
  } = useGridNodeHook<string>(gridResultColumnRef, {
    data: info?.resultList,
    onRowChanged: () => {
      setValue('info.resultList', getResultColumnRows())
    },
  })
  const [resultContextMenu, setResultContextMenu, onResultCellContextMenu] =
    useGridContext()
  const { data: ments } = useSuspenseQuery({
    ...useQueryDefines<DefineMent>('ment'),
    select: (data) => removeDuplicateDefines(data),
  })

  useEffect(() => {
    const ment = ments.find((ment) => `'${ment.defineId}'` === info?.bgm)
    setMentDesc(ment?.property.desc || '')
  }, [info?.bgm, ments])

  const handleArgumentDataRowDoubleClicked = (
    event: RowDoubleClickedEvent<string>,
  ) => {
    setModalType('argumentData')
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleResultColumnRowDoubleClicked = (
    event: RowDoubleClickedEvent<string>,
  ) => {
    setModalType('resultColumn')
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleArgumentDataModalSubmit = (payload: {
    mode: 'create' | 'update'
    data: string
    rowIndex?: number
  }) => {
    const { mode, data, rowIndex } = payload
    if (mode === 'create') {
      addArgumentDataRow(data)
    } else {
      updateArgumentDataRowByRowIndex(data, rowIndex)
    }
  }

  const handleResultColumnModalSubmit = (payload: {
    mode: 'create' | 'update'
    data: string
    rowIndex?: number
  }) => {
    const { mode, data, rowIndex } = payload
    if (mode === 'create') {
      addResultColumnRow(data)
    } else {
      updateResultColumnRowByRowIndex(data, rowIndex)
    }
  }

  const handleArgumentDataButtonClick = () => {
    setModalType('argumentData')
    openModal('property-modal', { mode: 'create' })
  }

  const handleResultColumnButtonClick = () => {
    setModalType('resultColumn')
    openModal('property-modal', { mode: 'create' })
  }

  const handleArgumentContextMenuClick = (item: string) => {
    const actions: Record<string, () => void> = {
      delete: removeArgumentData,
      cut: cutArgumentData,
      copy: copyArgumentData,
      paste: pasteArgumentData,
    }
    actions[item]?.()
  }

  const handleResultContextMenuClick = (item: string) => {
    const actions: Record<string, () => void> = {
      delete: removeResultColumn,
      cut: cutResultColumn,
      copy: copyResultColumn,
      paste: pasteResultColumn,
    }
    actions[item]?.()
  }

  return (
    <div className="flex h-full w-full flex-col">
      {argumentContextMenu && (
        <GridContextMenu
          {...argumentContextMenu}
          onItemClick={handleArgumentContextMenuClick}
          onClick={() => setArgumentContextMenu(null)}
        />
      )}
      {resultContextMenu && (
        <GridContextMenu
          {...resultContextMenu}
          onItemClick={handleResultContextMenuClick}
          onClick={() => setResultContextMenu(null)}
        />
      )}
      <Modal
        id="property-modal"
        title={
          modalType === 'argumentData'
            ? 'Assign Parameter Data'
            : 'Result Column'
        }
      >
        <ArgumentInfoModal
          tabProps={props}
          onSubmit={
            modalType === 'argumentData'
              ? handleArgumentDataModalSubmit
              : handleResultColumnModalSubmit
          }
        />
      </Modal>
      <div className="space-y-6 p-6">
        <div className="flex gap-3">
          <Checkbox
            id="reqOnly"
            checked={info?.reqOnly}
            onCheckedChange={(checked) => setValue('info.reqOnly', !!checked)}
          />
          <Label htmlFor="reqOnly">Request Only</Label>
        </div>
        <div className="space-y-3">
          <h3>Name</h3>
          <Autocomplete
            name="info.name"
            value={info?.name}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.info?.name && (
            <span className="error-msg">{errors.info.name.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Timeout</h3>
          <Autocomplete
            name="info.timeout"
            value={info?.timeout}
            options={options}
            selectOptions={TIMEOUT_OPTIONS_30}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.info?.timeout && (
            <span className="error-msg">{errors.info.timeout.message}</span>
          )}
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <RadioGroup
          value={info?.type}
          onValueChange={(value) => setValue('info.type', value)}
        >
          <div className="flex items-center space-x-5">
            <div className="flex gap-3">
              <RadioGroupItem value="SQL1" id="SQL1" />
              <Label htmlFor="SQL1">SQL1</Label>
            </div>
            <div className="flex gap-3">
              <RadioGroupItem value="SQL2" id="SQL2" />
              <Label htmlFor="SQL2">SQL2</Label>
            </div>
          </div>
        </RadioGroup>
        <div className="space-y-3">
          <h3>Transaction ID</h3>
          <Autocomplete
            name="info.transId"
            value={info?.transId}
            options={options}
            selectOptions={
              // TODO: 운영관리에(SWAT 등) 등록된 TB Adaptor 목록에서 원하는 ID를 입력
              []
            }
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.info?.transId && (
            <span className="error-msg">{errors.info.transId.message}</span>
          )}
        </div>
        {info?.type === 'SQL1' ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <Checkbox
                id="formatEx"
                checked={info?.formatEx}
                onCheckedChange={(checked) =>
                  setValue('info.formatEx', !!checked)
                }
              />
              <Label htmlFor="formatEx">Format Ex</Label>
            </div>
            <h3>Query Text</h3>
            <Autocomplete
              name="info.queryData"
              value={info?.queryData}
              rows={3}
              options={options}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            {errors.info?.queryData && (
              <span className="error-msg">{errors.info.queryData.message}</span>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <h3>Procedure Name</h3>
              <Autocomplete
                name="info.procName"
                value={info?.procName}
                options={options}
                onChange={setValue}
                onValueChange={onValueChange}
              />
              {errors.info?.procName && (
                <span className="error-msg">
                  {errors.info.procName.message}
                </span>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3>Argument Data</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleArgumentDataButtonClick}
                >
                  <AddIcon size={20} />
                </Button>
              </div>
              <div className="h-60">
                <Grid
                  ref={gridArgumentDataRef}
                  gridOptions={gridArgumentOptions}
                  columnDefs={colArgumentDataDefs}
                  rowData={argumentRowData}
                  rowDragManaged={true}
                  pagination={false}
                  onRowDoubleClicked={handleArgumentDataRowDoubleClicked}
                  onRowDragEnd={onArgumentDataDragEnd}
                  onKeyDown={onArgumentDataKeyDown}
                  onCellContextMenu={onArgumentCellContextMenu}
                />
              </div>
              {errors.info?.argList && (
                <span className="error-msg">{errors.info.argList.message}</span>
              )}
            </div>
          </>
        )}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3>Result Column</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleResultColumnButtonClick}
            >
              <AddIcon size={20} />
            </Button>
          </div>
          <div className="h-60">
            <Grid
              ref={gridResultColumnRef}
              gridOptions={gridResultOptions}
              columnDefs={colResultColumnDefs}
              rowData={resultRowData}
              rowDragManaged={true}
              pagination={false}
              onRowDoubleClicked={handleResultColumnRowDoubleClicked}
              onRowDragEnd={onResultColumnDragEnd}
              onKeyDown={onResultColumnKeyDown}
              onCellContextMenu={onResultCellContextMenu}
            />
          </div>
        </div>
        <div className="space-y-3">
          <h3>Choice Call, for BGM</h3>
          <Autocomplete
            name="info.choiceCall"
            value={info?.choiceCall}
            options={options}
            selectOptions={CHOICE_CALL_OPTIONS}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="space-y-3">
          <h3>BGM</h3>
          <div className="flex gap-1.5">
            <Autocomplete
              name="info.bgm"
              value={info?.bgm}
              options={options}
              selectOptions={ments.map((ment) => ({
                label: `'${ment.defineId}' - "${ment.property.desc}"`,
                value: `'${ment.defineId}'`,
              }))}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <PlayButton disabled={!info?.bgm} />
          </div>
          <Input value={mentDesc} readOnly={true} onChange={() => {}} />
        </div>
        <div className="space-y-3">
          <h3>Condition</h3>
          <Autocomplete
            name="info.condition"
            value={info?.condition}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.info?.condition && (
            <span className="error-msg">{errors.info.condition.message}</span>
          )}
        </div>
      </div>
    </div>
  )
}
