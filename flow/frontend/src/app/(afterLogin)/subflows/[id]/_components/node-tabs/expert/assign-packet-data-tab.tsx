'use client'

import { GridContextMenu } from '@/app/(afterLogin)/_components/grid-context-menu'
import { Button } from '@/app/_components/button'
import ConfirmModal from '@/app/_components/confirm-modal'
import Grid from '@/app/_components/grid'
import { AddIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridContext from '@/hooks/aggrid/use-grid-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import { DefinePacket } from '@/models/define'
import type { PacketCallInfo, PacketData } from '@/models/property/packet'
import { getAllDefine } from '@/services/define'
import { useModalStore } from '@/store/modal'
import { DefineList } from '@/types/define'
import logger from '@/utils/logger'
import type { ColDef, RowDoubleClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useCallback, useRef } from 'react'
import { toast } from 'react-toastify'
import type { NodePropertyTabProps } from '../../node-properties/types'
import AssignPacketDataModal from './assign-packet-data-modal'

const colDefs: ColDef<PacketData>[] = [
  {
    headerName: 'Name',
    field: 'name',
    filter: false,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    rowDrag: true,
  },
  {
    headerName: 'Len',
    field: 'len',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
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

export default function AssignPacketDataTab(props: NodePropertyTabProps) {
  const { getValues, setValue } = useNodePropertiesContext()
  const packetData = getValues(props.tabName) as PacketData[] | undefined
  const packetInfo = getValues('packetInfo') as PacketCallInfo | undefined

  const openModal = useModalStore((state) => state.openModal)
  const gridRef = useRef<AgGridReact<PacketData>>(null)
  const gridOptions = useGridOption<PacketData>()
  const {
    rowData,
    getRows,
    addRow,
    addRows,
    clearRows,
    updateRowByRowIndex,
    onRowDragEnd,
    onKeyDown,
    cut,
    copy,
    remove,
  } = useGridNodeHook<PacketData>(gridRef, {
    data: packetData,
    onRowChanged: () => {
      setValue('packetData', getRows())
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

  const handleClearClick = () => {
    clearRows()
  }

  const handleLoadClick = useCallback(
    async (isIncludeCommon: boolean) => {
      const getPacketData = (
        packet: DefineList<DefinePacket>,
      ): PacketData[] => {
        return (
          packet.property.sndPart
            ?.filter((item) => !item.type.includes('Repeat'))
            .map((item) => ({
              name: item.name,
              len: item.length!,
              expression: '',
              condition: '1',
            })) || []
        )
      }

      const getCommonPacketData = (
        packets: DefineList<DefinePacket>[],
        commonPacketId: string,
      ): PacketData[] => {
        const commonPacket = packets.find(
          (packet) => packet.defineId === commonPacketId,
        )
        if (!commonPacket) return []

        return (
          commonPacket.property.sndPart
            ?.filter((item) => !item.type.includes('Repeat'))
            .map((item) => ({
              name: `${item.name}*`,
              len: item.length!,
              expression: '',
              condition: '1',
            })) || []
        )
      }

      const mergePacketData = (
        rows: PacketData[],
        newPacketData: PacketData[],
      ): PacketData[] => {
        const packetDataMap = new Map(
          newPacketData.map((packet) => [packet.name, packet]),
        )

        const updatedRows = rows.filter((row) => {
          if (packetDataMap.has(row.name) && row.expression !== '') {
            packetDataMap.delete(row.name)
            return true
          }
          return false
        })

        const remainingPacketData = Array.from(packetDataMap.values())
        return [...updatedRows, ...remainingPacketData]
      }

      try {
        const packets = await getAllDefine<DefinePacket>('packet')
        const packet = packets.find(
          (packet) => packet.defineId === packetInfo!.packetId,
        )
        if (!packet) {
          toast.warn('Packet 정보를 찾을 수 없습니다.')
          return
        }

        let newPacketData: PacketData[] = getPacketData(packet)

        if (isIncludeCommon) {
          const commonPacketId = packet.property.common

          if (commonPacketId) {
            const commonPacketData = getCommonPacketData(
              packets,
              commonPacketId,
            )
            newPacketData = [...commonPacketData, ...newPacketData]
          }
        }

        const rows = getRows()
        clearRows()
        const mergedData = mergePacketData(rows, newPacketData)
        addRows(mergedData)
      } catch (error) {
        logger.error('Failed to load packet data', error)
      }
    },
    [addRows, clearRows, getRows, packetInfo],
  )

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<PacketData>) => {
    openModal('property-modal', {
      mode: 'update',
      data: {
        ...event.data,
        name: event.data!.name.replace(/\*$/, ''),
      },
      rowIndex: event.rowIndex,
    })
  }

  const handleModalSubmit = (
    mode: 'create' | 'update',
    data: PacketData,
    rowIndex?: number,
  ) => {
    let currentName = data.name
    const splitName = data.name.split(':')

    if (splitName.length > 1) {
      currentName = `${splitName[1]}${splitName[0].includes('common') ? '*' : ''}`
    }

    const newData = { ...data, name: currentName }

    if (mode === 'create') {
      const hasPacket = getRows().some((row) => row.name === currentName)
      if (hasPacket) {
        toast.warn(`Duplicate packet filed name "${currentName}"`)
        return
      }
      addRow(newData)
    } else {
      updateRowByRowIndex(newData, rowIndex)
    }
  }

  const handleContextMenuClick = async (item: string) => {
    const actions: Record<string, () => void> = {
      delete: remove,
      cut: cut,
      copy: copy,
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
        <AssignPacketDataModal
          tabProps={props}
          packetId={packetInfo?.packetId}
          onSubmit={handleModalSubmit}
        />
      </Modal>
      <Modal id="confirm-modal">
        <ConfirmModal
          content="공통 패킷이 존재합니다. 패킷을 가져오시겠습니까?"
          onConfirm={() => handleLoadClick(true)}
          onCancel={() => handleLoadClick(false)}
        />
      </Modal>
      <div className="flex h-full flex-col space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h3>Send Packet Data</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openModal('property-modal', { mode: 'create' })}
          >
            <AddIcon size={20} />
          </Button>
        </div>
        <div className="flex-grow">
          <Grid
            ref={gridRef}
            gridOptions={gridOptions}
            columnDefs={colDefs}
            rowData={rowData}
            rowDragManaged={true}
            pagination={false}
            onRowDoubleClicked={handleRowDoubleClicked}
            onRowDragEnd={onRowDragEnd}
            onCellContextMenu={onCellContextMenu}
            onKeyDown={onKeyDown}
          />
        </div>
        <div className="flex gap-1.5">
          <Button variant="secondary3" onClick={handleClearClick}>
            Clear
          </Button>
          <Button
            variant="secondary3"
            disabled={!packetInfo?.packetId}
            onClick={() => openModal('confirm-modal', null)}
          >
            Load
          </Button>
        </div>
      </div>
    </div>
  )
}
