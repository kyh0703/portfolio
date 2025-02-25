'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Button } from '@/app/_components/button'
import Grid from '@/app/_components/grid'
import { AddIcon } from '@/app/_components/icon'
import { Modal } from '@/app/_components/modal'
import { useNodePropertiesContext } from '@/contexts/node-properties-context'
import useGridNodeHook from '@/hooks/aggrid/use-grid-node-hook'
import useGridOption from '@/hooks/aggrid/use-grid-option'
import useAutocomplete from '@/hooks/use-autocomplete'
import { useEdges as useCustomEdges, useUndoRedo } from '@/hooks/xyflow'
import { Link, type SelectLink } from '@/models/property/flow'
import { useRemoveEdges } from '@/services/subflow'
import { useQueryVariables } from '@/services/variable/queries/use-query-variables'
import { useModalStore } from '@/store/modal'
import logger from '@/utils/logger'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  useEdges,
  useReactFlow,
  type AppEdge,
  type AppNode,
} from '@xyflow/react'
import {
  RowDoubleClickedEvent,
  RowSelectedEvent,
  type ColDef,
  type RowClickedEvent,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type KeyboardEventHandler,
} from 'react'
import { toast } from 'react-toastify'
import { NodePropertyTabProps } from '../../node-properties/types'
import ConditionAndLinkModal from './condition-and-link-modal'

const colDefs: ColDef<Link>[] = [
  {
    headerName: 'Condition',
    field: 'condition',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    headerName: 'Target Node',
    field: 'target',
    filter: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
]

export default function ConditionAndLinkTab(props: NodePropertyTabProps) {
  const { subFlowId, nodeId, tabName } = props
  const { errors, getValues, setValue } = useNodePropertiesContext()
  const select = getValues(tabName) as SelectLink | undefined
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const gridRef = useRef<AgGridReact<Link>>(null)
  const animatedEdgeRef = useRef('')
  const selectedRowRef = useRef<Link>()

  const { setEdges, deleteElements } = useReactFlow<AppNode, AppEdge>()
  const { getEdgesBySource, setAnimated } = useCustomEdges()
  const edgeList = useEdges()
  const { syncSaveHistory } = useUndoRedo(subFlowId)
  const openModal = useModalStore((state) => state.openModal)
  const gridOptions = useGridOption<Link>()
  const {
    getRows,
    addRow,
    updateRowByRowIndex,
    removeSelectedRows,
    onRowDragEnd,
  } = useGridNodeHook<Link>(gridRef, {
    data: select?.link,
    onRowChanged: () => {
      setValue('select.link', getRows())
    },
  })

  const { mutateAsync: removeEdgesMutate } = useRemoveEdges()
  const { data: variableOptions } = useSuspenseQuery(
    useQueryVariables(subFlowId),
  )

  const filterLinks = useMemo(() => {
    const edges = getEdgesBySource(nodeId)
    const uniqueConditions = new Set()

    if (!select) return
    const link = select.link
      .map((link) => ({
        ...link,
        target:
          edges.find((edge) => edge.data!.condition! === link.condition)
            ?.target ?? '',
      }))
      .filter((link) => {
        if (uniqueConditions.has(link.condition)) {
          return false
        }
        uniqueConditions.add(link.condition)
        return true
      })

    const connectedEdges = edges
      .map((edge) => ({
        condition: edge.data!.condition!,
        target: edge.target,
      }))
      .filter((edge) => {
        if (uniqueConditions.has(edge.condition)) {
          return false
        }
        uniqueConditions.add(edge.condition)
        return true
      })

    // NOTE: 첫 렌더링에서 node property 업데이트 해야함.
    // flow에서 edge를 연결한 이후 property 창을 열고 edge를 지우면 row는 남아있고 target만 지워져야함.
    const newRows = [...link, ...connectedEdges]
    setValue('select.link', newRows)
    return newRows
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edgeList, getEdgesBySource, nodeId, select])

  useEffect(() => {
    return () => {
      if (animatedEdgeRef.current) {
        setAnimated(animatedEdgeRef.current, false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleModalSubmit = (mode: 'create' | 'update', data: Link) => {
    if (!isConditionValid(mode, data)) {
      toast.warn('이미 존재하는 Condition입니다.')
      return
    }
    if (mode === 'create') {
      addRow({ ...data, target: '' })
    } else {
      const selectedRow = selectedRowRef.current
      if (!selectedRow) {
        return
      }
      if (selectedRow.target) {
        updateLinkRow(data, selectedRow.condition)
        updateEdgeCondition(data, selectedRow.condition)
      } else {
        const rows = getRows()
        const rowIndex = rows.findIndex(
          (row) => row.condition === selectedRow.condition,
        )
        updateRowByRowIndex(data, rowIndex)
      }
    }
  }

  // NOTE: edge가 바뀌므로 filterLinks가 호출되는데 이때 사용되는 select.link가 변경되어야 함
  const updateLinkRow = useCallback(
    (data: Link, condition: string) => {
      if (select?.link) {
        const tempLink = [...select.link]
        const rowIndex = tempLink.findIndex(
          (row) => row.condition === condition,
        )
        if (rowIndex !== -1) {
          tempLink.splice(rowIndex, 1, data)
          setValue('select.link', tempLink)
        }
      }
    },
    [select, setValue],
  )

  const updateEdgeCondition = useCallback(
    (data: Link, condition: string) => {
      setEdges((edges) =>
        edges.map((edge) => {
          if (edge.source === nodeId && edge.data?.condition === condition) {
            return {
              ...edge,
              data: { ...edge.data, condition: data.condition },
            }
          }
          return edge
        }),
      )
    },
    [nodeId, setEdges],
  )

  // NOTE: condition은 unique해야 함
  const isConditionValid = (mode: 'create' | 'update', data: Link) => {
    if (
      mode === 'update' &&
      data.condition === selectedRowRef.current?.condition
    ) {
      return true
    }

    const hasCondition = getRows().some(
      (row) => row.condition === data.condition,
    )
    return !hasCondition
  }

  const handleRowClick = (event: RowClickedEvent<Link>) => {
    const edges = getEdgesBySource(nodeId)
    const edge = edges.find(
      (edge) => edge.data!.condition === event.data!.condition,
    )
    if (animatedEdgeRef.current) {
      setAnimated(animatedEdgeRef.current, false)
    }
    if (edge) {
      animatedEdgeRef.current = edge.id
      setAnimated(edge.id, true)
    }
  }

  const handleRowSelected = (event: RowSelectedEvent<Link>) => {
    selectedRowRef.current = event.data
  }

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent<Link>) => {
    if (event.data?.condition === 'default') {
      return
    }
    openModal('property-modal', { mode: 'update', data: event.data })
  }

  const deleteEdgeConnection = useCallback(
    async (condition: string) => {
      const edges = getEdgesBySource(nodeId)
      try {
        const removeEdge = edges.find(
          (edge) => condition === edge.data?.condition,
        )
        if (!removeEdge) {
          return
        }
        await syncSaveHistory('delete', [], [removeEdge])
        await removeEdgesMutate([{ id: removeEdge.data?.databaseId! }])
        deleteElements({ edges: [removeEdge] })
      } catch (error) {
        logger.error('Error removing edge', error)
      }
    },
    [
      deleteElements,
      getEdgesBySource,
      nodeId,
      removeEdgesMutate,
      syncSaveHistory,
    ],
  )

  const deleteLinkRow = useCallback(
    (condition: string) => {
      const rowIndex = getRows().findIndex((row) => row.condition === condition)
      const tempLinks = [...select!.link]
      tempLinks.splice(rowIndex, 1)
      setValue('select.link', tempLinks)
    },
    [getRows, select, setValue],
  )

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    async (event) => {
      event.preventDefault()
      event.stopPropagation()

      switch (event.key) {
        case 'Delete':
          const selectedRow = selectedRowRef.current
          if (!selectedRow) {
            return
          }

          if (selectedRow.target) {
            deleteEdgeConnection(selectedRow.condition)
            deleteLinkRow(selectedRow.condition)
          } else {
            removeSelectedRows()
          }

          break
        default:
          break
      }
    },
    [deleteEdgeConnection, deleteLinkRow, removeSelectedRows],
  )

  return (
    <div className="flex h-full w-full flex-col">
      <Modal id="property-modal" title="Expression Detail Code">
        <ConditionAndLinkModal tabProps={props} onSubmit={handleModalSubmit} />
      </Modal>
      <div className="flex h-full flex-col space-y-6 p-6">
        <div className="space-y-3">
          <h3 className="mb-[10px] inline-block">Conditional Expression</h3>
          <Autocomplete
            name="select.condition"
            value={select?.condition}
            options={options}
            selectOptions={variableOptions}
            onChange={setValue}
            onValueChange={onValueChange}
          />
          {errors.select?.condition && (
            <span className="error-msg">{errors.select.condition.message}</span>
          )}
        </div>
        <div className="flex flex-grow flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3>Conditional branching</h3>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openModal('property-modal', { mode: 'create' })}
              >
                <AddIcon size={20} />
              </Button>
            </div>
          </div>
          <div className="flex-grow">
            <Grid
              ref={gridRef}
              gridOptions={gridOptions}
              columnDefs={colDefs}
              rowData={filterLinks}
              rowDragManaged={true}
              pagination={false}
              suppressContextMenu={true}
              onRowClicked={handleRowClick}
              onRowDoubleClicked={handleRowDoubleClicked}
              onRowDragEnd={onRowDragEnd}
              onKeyDown={handleKeyDown}
              onRowSelected={handleRowSelected}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
