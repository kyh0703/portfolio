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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import {
  CHOICE_CALL_OPTIONS,
  END_METHOD_OPTIONS,
  RETRY_INDEX_OPTIONS,
} from '@/constants/options'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import useAutocomplete from '@/hooks/use-autocomplete'
import { MentColumnType, MentInfo } from '@/models/property/common'
import { useModalStore } from '@/store/modal'
import { Separator } from '@/ui/separator'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { useMemo, useRef } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'
import MentInfoModal from './ment-info-modal'

export default function BeginnerMentInfoTab(props: NodePropertyTabProps) {
  const { nodeType, tabName } = props
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const ment = getValues(tabName) as MentInfo | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const openModal = useModalStore((state) => state.openModal)
  const gridRef = useRef<AgGridReact<MentColumnType>>(null)
  const gridOptions = useGridOption<MentColumnType>()
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
  } = useGridNodeHook<MentColumnType>(gridRef, {
    data: ment?.ment,
    onRowChanged: () => {
      setValue('ment.ment', getRows())
    },
  })
  const [contextMenu, setContextMenu, onCellContextMenu] = useGridContext()

  const cdrEncryptDisable = useMemo(
    () =>
      ['GetDigit', 'VoiceRecognize', 'RequestVR', 'ResponseVR'].includes(
        nodeType,
      ),
    [nodeType],
  )

  const colDefs: ColDef<MentColumnType>[] = useMemo(() => {
    const baseColDefs: ColDef<MentColumnType>[] = [
      {
        headerName: 'Expression',
        field: 'expression',
        filter: false,
        minWidth: 180,
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
      },
      {
        headerName: 'Type',
        field: 'type',
        filter: true,
        minWidth: 100,
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
      },
      {
        headerName: 'Country',
        field: 'ttsInfo.country',
        filter: true,
        minWidth: 150,
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
      },
      {
        headerName: 'Speaker ID',
        field: 'ttsInfo.speakerId',
        filter: true,
        minWidth: 150,
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
      },
      {
        field: 'ttsInfo.ttsName',
        hide: true,
      },
      {
        field: 'clearDigit',
        hide: true,
      },
      {
        field: 'ignoreDtmf',
        hide: true,
      },
      {
        field: 'tracking',
        hide: true,
      },
      {
        field: 'async',
        hide: true,
      },
      {
        headerName: 'Condition',
        field: 'condition',
        filter: true,
        minWidth: 150,
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
      },
    ]

    if (nodeType === 'NLURequest') {
      baseColDefs.unshift({
        headerName: 'Kind',
        field: 'kind',
        filter: false,
        minWidth: 150,
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: true,
        rowDrag: true,
      })
    } else {
      baseColDefs[0].rowDrag = true
    }
    return baseColDefs
  }, [nodeType])

  const handleRowDoubleClicked = (
    event: RowDoubleClickedEvent<MentColumnType>,
  ) => {
    openModal('property-modal', {
      mode: 'update',
      data: event.data,
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    data: MentColumnType,
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
      <Modal id="property-modal" title="Ment">
        <MentInfoModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div className="space-y-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <h3>Ment</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openModal('property-modal', { mode: 'create' })}
          >
            <AddIcon size={20} />
          </Button>
        </div>
        <div className="h-[400px]">
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
      <Separator />
      <div className="space-y-3 p-6">
        <h2>Common</h2>
        <div className="space-y-6">
          <div className="flex flex-col space-y-3">
            <div className="flex gap-3">
              <Checkbox
                id="allTracking"
                checked={ment?.common.allTracking}
                onCheckedChange={(checked) =>
                  setValue('ment.common.allTracking', !!checked)
                }
              />
              <Label htmlFor="allTracking">Ment list all tracking</Label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="ttsFailure"
                checked={ment?.common.ttsFailure}
                onCheckedChange={(checked) =>
                  setValue('ment.common.ttsFailure', !!checked)
                }
              />
              <Label htmlFor="ttsFailure">TTS Failure behavior</Label>
            </div>
            {cdrEncryptDisable && (
              <div className="flex gap-3">
                <Checkbox
                  id="cdrWrite"
                  checked={ment?.common.cdrWrite}
                  disabled={ment?.common.encrypt}
                  onCheckedChange={(checked) =>
                    setValue('ment.common.cdrWrite', !!checked)
                  }
                />
                <Label htmlFor="allTracking">CDR Write</Label>
              </div>
            )}
            {cdrEncryptDisable && (
              <div className="flex gap-3">
                <Checkbox
                  id="encrypt"
                  checked={ment?.common.encrypt}
                  disabled={!ment?.common.cdrWrite}
                  onCheckedChange={(checked) =>
                    setValue('ment.common.encrypt', !!checked)
                  }
                />
                <Label htmlFor="encrypt">Encrypt</Label>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <h3>Choice Call</h3>
            <Autocomplete
              name="ment.common.choiceCall"
              value={ment?.common.choiceCall}
              options={options}
              selectOptions={CHOICE_CALL_OPTIONS}
              onChange={setValue}
              onValueChange={onValueChange}
            />
          </div>
          {(nodeType === 'GetDigit' || nodeType === 'NLURequest') && (
            <div className="space-y-3">
              <h3>Retry Index</h3>
              <Select
                value={ment?.common.retryIndex}
                onValueChange={(value) =>
                  setValue('ment.common.retryIndex', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RETRY_INDEX_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {nodeType === 'Play' && (
            <div className="space-y-3">
              <h3>End Method</h3>
              <Select
                value={ment?.common.endMethod}
                onValueChange={(value) =>
                  setValue('ment.common.endMethod', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {END_METHOD_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ment?.common?.endMethod && (
                <span className="error-msg">
                  {errors.ment.common.endMethod.message}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
