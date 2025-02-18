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
import { GramList, RecognizeInfo } from '@/models/property/common'
import { useModalStore } from '@/store/modal'
import { Separator } from '@/ui/separator'
import { CustomNodeType } from '@xyflow/react'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useMemo, useRef } from 'react'
import RecognizeInfoModal from './recognize-info-modal'
import { NodePropertyTabProps } from '../../node-properties/types'

const colDefs: ColDef<GramList>[] = [
  {
    headerName: 'Grammar',
    field: 'grammar',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'Description',
    field: 'desc',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function RecognizeInfoTab(props: NodePropertyTabProps) {
  const { nodeType } = props
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const recognizeInfo = getValues(props.tabName) as RecognizeInfo | undefined
  const enable = useMemo(
    () => (nodeType === 'GetDigit' ? recognizeInfo?.enable : true),
    [nodeType, recognizeInfo?.enable],
  )
  const [options, _, onValueChange] = useAutocomplete({ ...props })
  const openModal = useModalStore((state) => state.openModal)
  const gridRef = useRef<AgGridReact<GramList>>(null)
  const gridOptions = useGridOption<GramList>()
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
  } = useGridNodeHook<GramList>(gridRef, {
    data: recognizeInfo?.data.gramList,
    onRowChanged: () => {
      setValue('recognizeInfo.data.gramList', getRows())
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<GramList>) => {
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    data: GramList,
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

      <Modal id="property-modal" title="Grammar">
        <RecognizeInfoModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      {nodeType === 'GetDigit' && (
        <>
          <div className="flex items-center space-x-2 p-6">
            <Checkbox
              id="requestOnly"
              checked={recognizeInfo?.enable}
              onCheckedChange={(checked) =>
                setValue('recognizeInfo.enable', !!checked)
              }
            />
            <Label htmlFor="enable">Use Recognize Info</Label>
          </div>
          <Separator />
        </>
      )}
      {nodeType === 'VoiceRecognize' && (
        <>
          <div className="space-y-6 p-6">
            <div className="space-y-3">
              <h3>Name</h3>
              <Autocomplete
                name="recognizeInfo.data.name"
                value={recognizeInfo?.data.name}
                options={options}
                disabled={!enable}
                onChange={setValue}
                onValueChange={onValueChange}
              />
              {errors.recognizeInfo?.data?.name && (
                <span className="error-msg">
                  {errors.recognizeInfo.data.name.message}
                </span>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2>Grammar</h2>
          <Button
            variant="ghost"
            size="icon"
            disabled={!enable}
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
        {(
          [
            'VoiceRecognize',
            'RequestVR',
            'NLURequest',
            'EntityCall',
          ] as CustomNodeType[]
        ).includes(nodeType) && (
          <div className="space-y-3">
            <h3 className="overflow-hidden text-wrap">
              Sequence variable used in grammar
            </h3>
            <Autocomplete
              name="recognizeInfo.data.sequence"
              value={recognizeInfo?.data.sequence}
              options={options}
              disabled={!enable}
              onChange={setValue}
              onValueChange={onValueChange}
            />
          </div>
        )}
        <div className="flex flex-col space-y-3">
          <div className="flex gap-3">
            <Checkbox
              id="bargeIn"
              checked={recognizeInfo?.data.bargeIn}
              disabled={!enable}
              onCheckedChange={(checked) =>
                setValue('recognizeInfo.data.bargeIn', !!checked)
              }
            />
            <Label htmlFor="bargeIn">Barge-In</Label>
          </div>
          {nodeType !== 'MenuChange' && (
            <div className="flex gap-3">
              <Checkbox
                id="confirm"
                checked={recognizeInfo?.data.confirm}
                disabled={!enable}
                onCheckedChange={(checked) =>
                  setValue('recognizeInfo.data.confirm', !!checked)
                }
              />
              <Label htmlFor="confirm">Confirm</Label>
            </div>
          )}
          {nodeType !== 'MenuChange' && (
            <div className="flex gap-3">
              <Checkbox
                id="ignoreDtmf"
                checked={recognizeInfo?.data.ignoreDtmf}
                disabled={!enable}
                onCheckedChange={(checked) =>
                  setValue('recognizeInfo.data.ignoreDtmf', !!checked)
                }
              />
              <Label htmlFor="ignoreDtmf">Ignore DTMF</Label>
            </div>
          )}
          {['NLURequest', 'EntityCall'].includes(nodeType) && (
            <>
              <div className="flex gap-3">
                <Checkbox
                  id="cdrWrite"
                  checked={recognizeInfo?.data.cdrWrite}
                  disabled={recognizeInfo?.data.encrypt}
                  onCheckedChange={(checked) =>
                    setValue('recognizeInfo.data.cdrWrite', !!checked)
                  }
                />
                <Label htmlFor="cdrWrite">CDR Write</Label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  id="encrypt"
                  checked={recognizeInfo?.data.encrypt}
                  disabled={!recognizeInfo?.data.cdrWrite}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue('recognizeInfo.data.encrypt', true)
                      setValue('recognizeInfo.data.cdrWrite', true)
                    } else {
                      setValue('recognizeInfo.data.encrypt', false)
                    }
                  }}
                />
                <Label htmlFor="encrypt">CDR Encrypt</Label>
              </div>
            </>
          )}
          {nodeType === 'NLURequest' && (
            <div className="flex gap-3">
              <Checkbox
                id="tracking"
                checked={recognizeInfo?.data.tracking}
                onCheckedChange={(checked) =>
                  setValue('recognizeInfo.data.tracking', !!checked)
                }
              />
              <Label htmlFor="tracking">Tracking</Label>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <h3>STT Name</h3>
          <Autocomplete
            name="recognizeInfo.data.sttName"
            value={recognizeInfo?.data.sttName}
            options={options}
            selectOptions={
              // 운영관리에(SWAT 등) 등록된 STT 서버 목록
              []
            }
            disabled={!enable}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.recognizeInfo?.data?.sttName && (
            <span className="error-msg">
              {errors.recognizeInfo.data.sttName.message}
            </span>
          )}
        </div>
      </div>
      <Separator />
      <div className="space-y-6 p-6">
        <div className="flex gap-3">
          <Checkbox
            id="startTimer"
            checked={recognizeInfo?.data.startTimer}
            disabled={!enable}
            onCheckedChange={(checked) =>
              setValue('recognizeInfo.data.startTimer', !!checked)
            }
          />
          <Label htmlFor="startTimer">Set Timer</Label>
        </div>
        <div className="space-y-3">
          <h3>No Voice Timeout</h3>
          <div className="flex items-center space-x-3">
            <Autocomplete
              name="recognizeInfo.data.noVoiceTimeout"
              value={recognizeInfo?.data.noVoiceTimeout}
              options={options}
              disabled={!enable}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <h3>(ms)</h3>
          </div>
          {errors.recognizeInfo?.data?.noVoiceTimeout && (
            <span className="error-msg">
              {errors.recognizeInfo.data.noVoiceTimeout.message}
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h3>Max Timeout</h3>
          <div className="flex items-center space-x-3">
            <Autocomplete
              name="recognizeInfo.data.maxTimeout"
              value={recognizeInfo?.data.maxTimeout}
              options={options}
              disabled={!enable}
              onChange={setValue}
              onValueChange={onValueChange}
            />
            <h3>(ms)</h3>
          </div>
          {errors.recognizeInfo?.data?.maxTimeout && (
            <span className="error-msg">
              {errors.recognizeInfo.data.maxTimeout.message}
            </span>
          )}
        </div>
      </div>
      {['VoiceRecognize', 'RequestVR'].includes(nodeType) && (
        <>
          <Separator />
          <div className="space-y-6 p-6">
            <div className="space-y-3">
              <h3>Condition</h3>
              <Autocomplete
                name="recognizeInfo.data.condition"
                value={recognizeInfo?.data.condition}
                options={options}
                onChange={setValue}
                onValueChange={onValueChange}
              />
              {errors.recognizeInfo?.data?.condition && (
                <span className="error-msg">
                  {errors.recognizeInfo.data.condition.message}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
