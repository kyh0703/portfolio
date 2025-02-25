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
import useParseDocument from '@/hooks/use-parse-document'
import type { ParamList, RequestPageInfo } from '@/models/property/iweb'
import { useModalStore } from '@/store/modal'
import { Separator } from '@/ui/separator'
import logger from '@/utils/logger'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { ChangeEventHandler, useRef, useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'
import HtmlInfoModal from './html-info-modal'
import InputObjectModal from './input-object-modal'

const colParameterDefs: ColDef<ParamList>[] = [
  {
    headerName: 'Object ID',
    field: 'objectId',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'Value',
    field: 'value',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Type',
    field: 'type',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

const colInputObjectDefs: ColDef<string>[] = [
  {
    headerName: 'Object ID',
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

export default function HTMLInfoTab(props: NodePropertyTabProps) {
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const info = getValues('info') as RequestPageInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const submitButtonRef = useRef<HTMLButtonElement>(null)
  // NOTE: html,jsp와 json 파일을 읽는 input을 따로 만든 이유는 accept태그에서 파일 확장자를 지정할 수 없기 때문
  const htmlFileInputRef = useRef<HTMLInputElement>(null)
  const jsonFileInputRef = useRef<HTMLInputElement>(null)

  const fileType = useRef<'HTML/JSP' | 'JSON'>()
  const [modalType, setModalType] = useState<'parameter' | 'inputObject'>()

  // NOTE: 파일 선택 시 input value를 초기화하기 위해 사용, 같은 파일에 대해서는 onChange가 트리거 되지 않는다.
  const [fileInputValue, setFileInputValue] = useState('')

  // NOTE: 읽어온 파일 내용을 'Previous Browser' 버튼 클릭 시 새 창에 띄우기 위해 저장
  const [fileContent, setFileContent] = useState('')

  const { parseHtmlJsp, parseJson } = useParseDocument()
  const openModal = useModalStore((state) => state.openModal)

  const gridParameterRef = useRef<AgGridReact<ParamList>>(null)
  const gridParameterOptions = useGridOption<ParamList>()
  const {
    rowData: parameterRowData,
    addRow: addParameterRow,
    getRows: getParameterRows,
    setRows: setParameterRows,
    updateRowByRowIndex: updateParameterRowByRowIndex,
    onKeyDown: onKeyDownParameter,
    cut: cutParameter,
    copy: copyParameter,
    paste: pasteParameter,
    remove: removeParameter,
  } = useGridNodeHook<ParamList>(gridParameterRef, {
    data: info?.paramList,
    onRowChanged: () => {
      setValue('info.paramList', getParameterRows())
    },
  })
  const [
    parameterContextMenu,
    setParameterContextMenu,
    onParameterCellContextMenu,
  ] = useGridContext()

  const gridInputObjectRef = useRef<AgGridReact<string>>(null)
  const gridInputObjectOptions = useGridOption<string>()
  const {
    rowData: inputObjectRowData,
    addRow: addInputObjectRow,
    getRows: getInputObjectRows,
    setRows: setInputObjectRows,
    updateRowByRowIndex: updateInputObjectRowByRowIndex,
    onKeyDown: onKeyDownInputObject,
    cut: cutInputObject,
    copy: copyInputObject,
    paste: pasteInputObject,
    remove: removeInputObject,
  } = useGridNodeHook<string>(gridInputObjectRef, {
    data: info?.inputObjectList,
    onRowChanged: () => {
      setValue('info.inputObjectList', getInputObjectRows())
    },
  })
  const [
    inputObjectContextMenu,
    setInputObjectContextMenu,
    onInputObjectCellContextMenu,
  ] = useGridContext()

  const handleRowDataUpdated = () => {
    submitButtonRef.current?.click()
  }

  const handleRowDoubleClicked = (
    event: RowDoubleClickedEvent<ParamList>,
    type: 'parameter' | 'inputObject',
  ) => {
    setModalType(type)
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleParameterModalSubmit = (
    mode: 'create' | 'update',
    data: ParamList,
    rowIndex?: number,
  ) => {
    if (mode === 'create') {
      addParameterRow(data)
    } else {
      updateParameterRowByRowIndex(data, rowIndex)
    }
    submitButtonRef.current?.click()
  }

  const handleInputObjectModalSubmit = (
    mode: 'create' | 'update',
    data: string,
    rowIndex?: number,
  ) => {
    if (mode === 'create') {
      addInputObjectRow(data)
    } else {
      updateInputObjectRowByRowIndex(data, rowIndex)
    }
    submitButtonRef.current?.click()
  }

  const handleOpenModalClick = (type: 'parameter' | 'inputObject') => {
    setModalType(type)
    openModal('property-modal', { mode: 'create' })
  }

  const handleFileSelected: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]

      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target!.result as string
        setFileContent(text)
        const { parameterList, inputObjectList } =
          fileType.current === 'HTML/JSP' ? parseHtmlJsp(text) : parseJson(text)
        setParameterRows(parameterList)
        setInputObjectRows(inputObjectList)
      }
      reader.onerror = (e) => {
        e.target && logger.error('File reading failed:', e.target.error)
      }

      reader.readAsText(file)
    }
    setFileInputValue('')
  }

  const handleImportFileButtonClick = (type: 'HTML/JSP' | 'JSON') => {
    fileType.current = type
    const ref = type === 'HTML/JSP' ? htmlFileInputRef : jsonFileInputRef
    ref.current?.click()
  }

  const handlePreviousButtonClick = () => {
    const newWindow = window.open('', '_blank')
    if (fileContent && newWindow) {
      try {
        if (fileType.current === 'HTML/JSP') {
          newWindow.document.write(fileContent)
          return
        }
        if (fileType.current === 'JSON') {
          const content = JSON.stringify(JSON.parse(fileContent), null, 2)
          newWindow.document.write(`<pre>${content}</pre>`)
        }
      } catch (e) {
        newWindow.document.write('Error parsing JSON content')
      }
    }
  }

  const handleParameterContextMenuClick = async (item: string) => {
    const actions: Record<string, () => void> = {
      delete: removeParameter,
      cut: cutParameter,
      copy: copyParameter,
      paste: pasteParameter,
    }
    actions[item]?.()
  }

  const handleInputObjectContextMenuClick = async (item: string) => {
    const actions: Record<string, () => void> = {
      delete: removeInputObject,
      cut: cutInputObject,
      copy: copyInputObject,
      paste: pasteInputObject,
    }
    actions[item]?.()
  }

  return (
    <div className="flex h-full w-full flex-col">
      {parameterContextMenu && (
        <GridContextMenu
          {...parameterContextMenu}
          onItemClick={handleParameterContextMenuClick}
          onClick={() => setParameterContextMenu(null)}
        />
      )}
      {inputObjectContextMenu && (
        <GridContextMenu
          {...inputObjectContextMenu}
          onItemClick={handleInputObjectContextMenuClick}
          onClick={() => setInputObjectContextMenu(null)}
        />
      )}
      <Modal id="property-modal" title="Expression Detail Code">
        {modalType === 'parameter' && (
          <HtmlInfoModal
            tabProps={props}
            onSubmit={handleParameterModalSubmit}
          />
        )}
        {modalType === 'inputObject' && (
          <InputObjectModal
            tabProps={props}
            onSubmit={handleInputObjectModalSubmit}
          />
        )}
      </Modal>
      <div className="space-y-6 p-6">
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
          <h3>Transaction ID</h3>
          <Autocomplete
            name="info.transId"
            value={info?.transId}
            options={options}
            selectOptions={
              // TODO: 운영관리에(SWAT 등) 등록된 iWeb Adaptor 목록
              []
            }
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.info?.transId && (
            <span className="error-msg">{errors.info.transId.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between">
            <h3>File Name</h3>
            <div>
              <input
                ref={htmlFileInputRef}
                type="file"
                className="hidden"
                value={fileInputValue}
                onChange={handleFileSelected}
                accept=".html, .jsp"
              />
              <input
                ref={jsonFileInputRef}
                type="file"
                className="hidden"
                value={fileInputValue}
                onChange={handleFileSelected}
                accept=".json"
              />
              <button
                className="mr-2 inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                type="button"
                onClick={() => handleImportFileButtonClick('HTML/JSP')}
              >
                HTML/JSP
              </button>
              <button
                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                type="button"
                onClick={() => handleImportFileButtonClick('JSON')}
              >
                JSON
              </button>
            </div>
          </div>
          <Autocomplete
            name="info.fileName"
            value={info?.fileName}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.info?.fileName && (
            <span className="error-msg">{errors.info.fileName.message}</span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Real HTML Name</h3>
          <Autocomplete
            name="info.realName"
            value={info?.realName}
            options={options}
            onChange={setValue}
            onValueChange={onValueChange}
          />
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="bargeIn"
            checked={info?.bargeIn}
            onCheckedChange={(checked) => setValue('info.bargeIn', !!checked)}
          />
          <Label htmlFor="bargeIn">Barge-in</Label>
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h3>Parameter List</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenModalClick('parameter')}
          >
            <AddIcon size={20} />
          </Button>
        </div>
        <div className="h-60">
          <Grid
            ref={gridParameterRef}
            gridOptions={gridParameterOptions}
            columnDefs={colParameterDefs}
            rowData={parameterRowData}
            rowDragManaged={true}
            pagination={false}
            onRowDoubleClicked={(e) => handleRowDoubleClicked(e, 'parameter')}
            onRowDataUpdated={handleRowDataUpdated}
            onRowDragEnd={handleRowDataUpdated}
            onKeyDown={onKeyDownParameter}
            onCellContextMenu={onParameterCellContextMenu}
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h3>Input Object List</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenModalClick('inputObject')}
          >
            <AddIcon size={20} />
          </Button>
        </div>
        <div className="h-60">
          <Grid
            ref={gridInputObjectRef}
            gridOptions={gridInputObjectOptions}
            columnDefs={colInputObjectDefs}
            rowData={inputObjectRowData}
            rowDragManaged={true}
            pagination={false}
            onRowDoubleClicked={(e) => handleRowDoubleClicked(e, 'inputObject')}
            onRowDataUpdated={handleRowDataUpdated}
            onRowDragEnd={handleRowDataUpdated}
            onKeyDown={onKeyDownInputObject}
            onCellContextMenu={onInputObjectCellContextMenu}
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
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
        <button
          className="float-end mb-2 me-2 inline-flex items-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          type="button"
          onClick={handlePreviousButtonClick}
        >
          Previous Browser
        </button>
      </div>
    </div>
  )
}
