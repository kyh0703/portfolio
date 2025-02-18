'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import Grid from '@/app/_components/grid'
import { AddIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import {
  CHAT_INFO_GET_DIGIT_CATEGORY_OPTIONS,
  CHAT_INFO_NLU_CATEGORY_OPTIONS,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import useAutocomplete from '@/hooks/use-autocomplete'
import type { ChatInfo, CodeData } from '@/models/property/common'
import { useModalStore } from '@/store/modal'
import { Separator } from '@/ui/separator'
import { type ColDef, type RowDoubleClickedEvent } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useMemo, useRef, useState } from 'react'
import type { NodePropertyTabProps } from '../../node-properties/types'
import ChatInfoModal from './chat-info-modal'

const colDefs: ColDef<CodeData>[] = [
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
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Condition',
    field: 'condition',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function BeginnerChatInfoTab(props: NodePropertyTabProps) {
  const { tabName } = props
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const [tabValue, setTabValue] = useState(0)
  const chat = getValues(tabName) as ChatInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const categories = useMemo(() => {
    if (props.nodeType === 'GetDigit') {
      return CHAT_INFO_GET_DIGIT_CATEGORY_OPTIONS
    } else if (props.nodeType === 'NLURequest') {
      return CHAT_INFO_NLU_CATEGORY_OPTIONS
    } else {
      return []
    }
  }, [props.nodeType])

  const openModal = useModalStore((state) => state.openModal)
  const gridRef = useRef<AgGridReact<CodeData>>(null)
  const gridOptions = useGridOption<CodeData>()
  const {
    rowData,
    addRow,
    getRows,
    updateRowByRowIndex,
    onRowDragEnd,
    onKeyDown,
    cut,
    copy,
    paste,
    remove,
  } = useGridNodeHook<CodeData>(gridRef, {
    data: chat?.output.category[tabValue].codeData,
    onRowChanged: () => {
      setValue(`chat.output.category.${tabValue}.codeData`, getRows())
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const handleValueChange = (value: string) => {
    const index = chat!.output.category.findIndex(
      (category) => category.categoryName === value,
    )
    setTabValue(index)
  }

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<CodeData>) => {
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    data: CodeData,
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
      <Modal id="property-modal" title="Expression Detail Code">
        <ChatInfoModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div>
        <div className="space-y-3 p-6">
          <h2>Output</h2>
          <div className="space-y-6">
            {(props.nodeType === 'GetDigit' ||
              props.nodeType === 'NLURequest') &&
              categories && (
                <div className="space-y-3">
                  <h3>Sentence Category</h3>
                  <Select
                    defaultValue={categories[0]}
                    onValueChange={handleValueChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a CategoryName" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            <div className="space-y-3">
              <h3>Expression Code</h3>
              <Autocomplete
                name={`chat.output.category.${tabValue}.expressionCode`}
                value={chat?.output.category[tabValue].expressionCode}
                options={options}
                selectOptions={
                  // 의된 Chat Code 와 연동이 가능하다면 콤보박스 버튼을 누르면 Chat Code 리스팅
                  []
                }
                onChange={setValue}
                onValueChange={onValueChange}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3>Expression Code Detail</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    openModal('property-modal', { mode: 'create' })
                  }
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
            </div>
          </div>
        </div>
        {props.nodeType !== 'Play' && props.nodeType !== 'RequestVR' && (
          <>
            <Separator />
            <div className="space-y-3 p-6">
              <h2>Input</h2>
              <div className="space-y-3">
                <h3>Timeout</h3>
                <div className="flex items-center space-y-3">
                  <Autocomplete
                    name="chat.input.timeout"
                    value={chat?.input.timeout}
                    options={options}
                    onChange={setValue}
                    onValueChange={onValueChange}
                  />
                  <h3>(Second)</h3>
                </div>
                {errors.chat?.input?.timeout && (
                  <span className="error-msg">
                    {errors.chat.input.timeout.message}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
