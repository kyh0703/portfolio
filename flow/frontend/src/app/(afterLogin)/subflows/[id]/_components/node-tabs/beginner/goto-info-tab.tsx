'use client'

import Autocomplete from '@/app/_components/autocomplete'
import { Input } from '@/app/_components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/select'
import { REQUEST_DELAY_TIME } from '@/constants/delay'
import useAutocomplete from '@/hooks/use-autocomplete'
import { useEdges, useId, useNodes, useUndoRedo } from '@/hooks/xyflow'
import { useUpdateNode } from '@/services/subflow'
import { colors } from '@/themes'
import logger from '@/utils/logger'
import { AppNode, MarkerType, useReactFlow, type AppEdge } from '@xyflow/react'
import debounce from 'lodash-es/debounce'
import { useCallback, useMemo, useState } from 'react'
import { NodePropertyTabProps } from '../../node-properties/types'

export default function BeginnerGotoInfoTab(props: NodePropertyTabProps) {
  const { subFlowId, nodeId, nodeType, tabName } = props
  const [options, _, onValueChange] = useAutocomplete({ ...props })

  const { getNode, getNodes } = useReactFlow<AppNode, AppEdge>()
  const { issueEdgeId } = useId()
  const { setLabel, focusingNode } = useNodes()
  const { addEdgeToDB, removeEdgeToDB, getEdgeBySource } = useEdges()
  const { saveHistory } = useUndoRedo(subFlowId)

  const node = getNode(nodeId)!
  const setLabelNodes = getNodes().filter((node) => node.type === 'SetLabel')
  const [tagName, setTagName] = useState(node.data.label)
  const edge = getEdgeBySource(nodeId)
  const [labelOption, setLabelOption] = useState(edge ? edge.target : '\u0A00')

  const updateNodeMutation = useUpdateNode()

  const fetchLabelName = debounce((label) => {
    updateNodeMutation.mutate(
      {
        nodeId: node.data.databaseId!,
        node: {
          ...node,
          data: { ...node.data, label },
        },
      },
      { onError: () => updateNodeMutation.reset() },
    )
  }, REQUEST_DELAY_TIME)

  const handleLabelNameChange = (name: string, value: string) => {
    setTagName(value)
    setLabel(nodeId, value)
    fetchLabelName(value)
  }

  const setLabelNodeOptions = useMemo(
    () =>
      [{ label: `\u00A0`, value: '\u00A0' }].concat(
        setLabelNodes.map((node) => ({
          label: `${node.id}${node.data.label ? `-${node.data.label}` : ''}`,
          value: node.id,
        })),
      ),
    [setLabelNodes],
  )

  const handleSetLabelNodeChange = useCallback(
    async (value: string) => {
      try {
        setLabelOption(value)
        const edge = getEdgeBySource(nodeId)
        if (edge) {
          await removeEdgeToDB(edge)
        }
        if (value === '\u00A0') {
          return
        }
        const newEdge: AppEdge = {
          id: issueEdgeId(),
          source: nodeId,
          sourceHandle: null,
          target: value,
          targetHandle: null,
          type: nodeType,
          hidden: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 12,
            height: 12,
            color: colors.foreground,
          },
          data: {
            subFlowId,
            condition: 'next',
            points: [],
          },
        }
        const databaseId = await addEdgeToDB(subFlowId, newEdge)
        newEdge.data!.databaseId = databaseId
        saveHistory('create', [], [newEdge])
      } catch (error) {
        logger.error(error)
      }
    },
    [
      addEdgeToDB,
      getEdgeBySource,
      issueEdgeId,
      nodeId,
      nodeType,
      removeEdgeToDB,
      saveHistory,
      subFlowId,
    ],
  )

  return (
    <div className="flex h-full w-full flex-col space-y-6 p-6">
      <div className="space-y-3">
        <h3>Tag Name</h3>
        <Autocomplete
          name="info.tagName"
          value={tagName}
          options={options}
          onChange={handleLabelNameChange}
          onValueChange={onValueChange}
        />
      </div>
      <div className="space-y-3">
        <h3>Label ID</h3>
        <div className="flex gap-1.5">
          <div className="flex-grow">
            <Select
              value={labelOption}
              onValueChange={handleSetLabelNodeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {setLabelNodeOptions.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            type="button"
            className="me-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100"
            disabled={labelOption === '\u00A0'}
            onClick={() => focusingNode(labelOption!)}
          >
            Goto
          </button>
        </div>
        <Input
          defaultValue={labelOption === '\u0A00' ? '' : labelOption}
          readOnly={true}
        />
      </div>
    </div>
  )
}
