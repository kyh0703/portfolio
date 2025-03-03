'use client'

import {
  useCursorStateSynced,
  useEdges,
  useEdgesStateSynced,
  useInitialize,
  useNodes,
  useNodesStateSynced,
  useSelect,
  useUndoRedo,
} from '@/hooks/xyflow'
import { useAddNode, useUpdateNodes } from '@/services/flow'
import { useSubFlowStore } from '@/store/flow'
import { colors } from '@/themes'
import { isTargetGroup, isTargetPane, toPoints } from '@/utils'
import logger from '@/utils/logger'
import { getCursorMode } from '@/utils/xyflow/cursor-mode'
import {
  Background,
  BackgroundVariant,
  ColorMode,
  Connection,
  Controls,
  MiniMap,
  OnConnectEnd,
  OnNodesDelete,
  Panel,
  ReactFlow,
  addEdge,
  useReactFlow,
  type AppEdge,
  type AppNode,
  type CustomEdgeType,
  type CustomNodeType,
  type EdgeMouseHandler,
  type NodeMouseHandler,
  type OnConnect,
  type OnConnectStart,
  type OnInit,
  type OnNodeDrag,
} from '@xyflow/react'
import { useTheme } from 'next-themes'
import { useSearchParams } from 'next/navigation'
import {
  DragEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEventHandler,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { twJoin } from 'tailwind-merge'
import { useShallow } from 'zustand/react/shallow'
import DevTools from './dev/dev-tool'
import { edgeTypes } from './edge'
import EdgeMenu, { type EdgeMenuProps } from './edge/menu'
import MiniMapNode from './minimap'
import { NodeContextMenu, nodeTypes, type NodeContextMenuProps } from './node'
import { defaultEdgeOptions, fitViewOptions, proOptions } from './options'
import { IconToolbar } from './toolbar'
import { ConnectionLine, Cursors, HelperLines } from './tools'
import { isValidConnection } from './tools/validator'

import '@xyflow/react/dist/style.css'
import { EdgeContextMenu, type EdgeContextMenuProps } from './edge/context-menu'

type FlowMainProps = {
  flowId: number
  initialNodes: AppNode[]
  initialEdges: AppEdge[]
  focusNode?: string
}

export default function FlowMain({
  flowId,
  initialNodes,
  initialEdges,
  focusNode,
}: FlowMainProps) {
  const searchParams = useSearchParams()

  const flowRef = useRef<HTMLDivElement>(null)
  const connectionRef = useRef<Connection | null>(null)
  const connectingInfoRef = useRef<{
    origin: string | null
    latest: string | null
  }>({
    origin: null,
    latest: null,
  })

  const { theme } = useTheme()
  const [editMode, setEditMode, viewPort, selectedNode, setSelectedNode] =
    useSubFlowStore(
      useShallow((state) => [
        state.editMode,
        state.setEditMode,
        state.history[flowId]?.viewPort,
        state.history[flowId]?.selectedNode,
        state.setSelectedNode,
      ]),
    )

  const [init, setInit] = useState(false)
  const [nodes, setNodes, onNodesChange, horizontalLine, verticalLine] =
    useNodesStateSynced(flowId, initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesStateSynced(
    flowId,
    initialEdges,
  )
  const [cursors, onMouseMove] = useCursorStateSynced(flowId)
  const [nodeContextMenu, setNodeContextMenu] =
    useState<NodeContextMenuProps | null>(null)
  const [edgeContextMenu, setEdgeContextMenu] =
    useState<EdgeContextMenuProps | null>(null)
  const [edgeMenu, setEdgeMenu] = useState<EdgeMenuProps | null>(null)

  useInitialize(flowId)
  const { nodeFactory, getNodeType, focusingNode } = useNodes()
  const {
    edgeFactory,
    isMenuEdge,
    addEdgeToDB,
    updateEdgeConnectionToDB,
    getEdgeBySource,
  } = useEdges()
  const {
    getNode,
    getNodes,
    getIntersectingNodes,
    screenToFlowPosition,
    deleteElements,
  } = useReactFlow<AppNode, AppEdge>()
  const { selectNode, unselectNode } = useSelect()
  const { saveHistory } = useUndoRedo(flowId)

  const { mutateAsync: addNodeMutate } = useAddNode()
  const { mutateAsync: updateNodesMutate } = useUpdateNodes()

  const handleInit: OnInit<AppNode, AppEdge> = useCallback(() => {
    setInit(true)
  }, [])

  const handleNodeDragStart: OnNodeDrag<AppNode> = useCallback(
    (event, dragNode, dragNodes) => {
      logger.debug('onNodeDragStart', dragNodes)
      saveHistory('update', dragNodes, [])
    },
    [saveHistory],
  )

  const handleNodeClick: NodeMouseHandler<AppNode> = useCallback(
    (_, node) => {
      if (editMode === 'grab') {
        setSelectedNode(flowId, {
          flowId,
          databaseId: node.data.databaseId!,
          nodeId: node.id,
          nodeType: node.type as CustomNodeType,
        })
      }
    },
    [editMode, flowId, setSelectedNode],
  )

  const handleNodesDelete: OnNodesDelete<AppNode> = useCallback(
    (deletes) => {
      if (deletes.some((node) => node.id === selectedNode?.nodeId)) {
        setSelectedNode(flowId, null)
      }
    },
    [flowId, selectedNode?.nodeId, setSelectedNode],
  )

  const handleConnect: OnConnect = useCallback(
    async (connection) => {
      logger.debug('onConnect', connection)
      connectionRef.current = connection

      let sourceNodeId = connectingInfoRef.current.origin
      if (sourceNodeId) {
        connection.source = sourceNodeId
      } else {
        sourceNodeId = connection.source
      }

      connectingInfoRef.current.origin = null
      connectingInfoRef.current.latest = null

      try {
        const oldEdge = getEdgeBySource(sourceNodeId)

        if (oldEdge) {
          saveHistory('update', [], [oldEdge])
          oldEdge.data!.points = points
          await updateEdgeConnectionToDB(oldEdge, connection)
        } else {
          const newEdge = edgeFactory(
            flowId,
            connection,
            getNode(sourceNodeId)!.type,
            'next',
            points,
          )
          if (!newEdge) {
            return
          }
          const databaseId = await addEdgeToDB(flowId, newEdge)
          newEdge.data!.databaseId = databaseId
          saveHistory('create', [], [newEdge])
        }
      } catch (error) {
        logger.error('Failed to add edge', error)
      }
    },
    [
      getEdgeBySource,
      saveHistory,
      updateEdgeConnectionToDB,
      edgeFactory,
      flowId,
      getNode,
      addEdgeToDB,
    ],
  )

  const handleReconnect = useCallback(
    async (oldEdge: AppEdge, newConnection: Connection) => {
      logger.debug('onReconnect', oldEdge, newConnection)
      saveHistory('update', [], [oldEdge])
      try {
        await updateEdgeConnectionToDB(oldEdge, newConnection)
      } catch (error) {
        logger.error('Failed to reconnect edge', error)
      }
    },
    [saveHistory, updateEdgeConnectionToDB],
  )

  const handleDrop: DragEventHandler<HTMLDivElement> = async (event) => {
    logger.debug('onDrop', event)
    event.preventDefault()

    const reactData = event.dataTransfer.getData('application/reactflow')
    if (reactData.length === 0) {
      return
    }
    const nodeType = reactData as CustomNodeType
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    })

    try {
      const newNode = nodeFactory(flowId, position, nodeType)
      const response = await addNodeMutate({ flowId, data: newNode })
      newNode.data.databaseId = response.id
      setNodes((nodes) => [...nodes, newNode])
      saveHistory('create', [newNode], [])
    } catch (error) {
      logger.error('Failed to add node', error)
    }
  }

  const handleDragOver: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },
    [],
  )

  const handleDoubleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      logger.debug('onDoubleClick', event)
      if (isTargetPane(event) || isTargetGroup(event)) {
        editMode === 'grab' && setEditMode('link')
      }
    },
    [editMode, setEditMode],
  )

  const handleDeselect = useCallback(() => {
    setNodeContextMenu(null)
    setEdgeMenu(null)
    setEdgeContextMenu(null)
    setSelectedNode(flowId, null)
  }, [setSelectedNode, flowId])

  const handleNodeContextMenu: NodeMouseHandler<AppNode> = useCallback(
    (event, node) => {
      event.preventDefault()
      event.stopPropagation()
      setNodeContextMenu({
        id: node.id,
        mouse: {
          x: event.clientX,
          y: event.clientY,
        },
      })
    },
    [],
  )

  const handleEdgeContextMenu: EdgeMouseHandler<AppEdge> = useCallback(
    (event, edge) => {
      event.preventDefault()
      event.stopPropagation()
      if (edge.type === 'Ghost') {
        return
      }

      setEdgeContextMenu({
        id: edge.id,
        mouse: {
          x: event.clientX,
          y: event.clientY,
        },
      })
    },
    [],
  )

  const handlePaneContextMenu = useCallback(
    (event: ReactMouseEvent | MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      if (editMode === 'link') {
        setEditMode('grab')
      }
      let ghostNodes: AppNode[] = []
      if (connectingInfoRef.current.origin) {
        ghostNodes = getGhostNodesBySource(connectingInfoRef.current.origin)
      } else {
        ghostNodes = getNodes().filter((node) => node.type === 'Ghost')
      }
      deleteElements({ nodes: ghostNodes })
      setNodeContextMenu(null)
      setEdgeMenu(null)
    },
    [deleteElements, editMode, getGhostNodesBySource, getNodes, setEditMode],
  )

  const handleContextMenu: MouseEventHandler = useCallback(
    (event) => {
      event.preventDefault()

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const intersections = getIntersectingNodes({
        x: position.x,
        y: position.y,
        width: 1,
        height: 1,
      })
      if (intersections.length === 0) {
        return
      }

      const targetNode = intersections[intersections.length - 1]
      setNodeContextMenu({
        id: targetNode.id,
        mouse: {
          x: event.clientX,
          y: event.clientY,
        },
      })
    },
    [getIntersectingNodes, screenToFlowPosition],
  )

  const handleMiniMapNodeClick = useCallback(
    (_: ReactMouseEvent<Element, MouseEvent>, node: AppNode) => {
      if (node.parentId) {
        return
      }
      focusingNode(node.id)
    },
    [focusingNode],
  )

  // focusNode searchParams 처리
  useEffect(() => {
    if (!init) {
      return
    }
    if (!focusNode) {
      return
    }
    const node = getNode(focusNode)
    if (!node) {
      return
    }
    focusingNode(node.id)
    selectNode(node.id)
    setSelectedNode(flowId, {
      flowId,
      databaseId: node.data.databaseId!,
      nodeId: node.id,
      nodeType: node.type as CustomNodeType,
    })
  }, [
    focusingNode,
    focusNode,
    getNode,
    init,
    searchParams,
    selectNode,
    setSelectedNode,
    flowId,
  ])

  // pane을 dragging 중에는 nodeProperty를 열지 않는다.
  useEffect(() => {
    const handleMouseDown = () => {
      if (selectedNode) {
        unselectNode(selectedNode.nodeId)
        setSelectedNode(flowId, null)
      }
    }

    const pane = flowRef.current?.querySelector('.react-flow__pane')
    if (pane) {
      pane.addEventListener('mousedown', handleMouseDown)
    }

    return () => {
      if (pane) {
        pane.removeEventListener('mousedown', handleMouseDown)
      }
    }
  }, [selectedNode, setSelectedNode, flowId, unselectNode])

  return (
    <div
      id="flow-main"
      tabIndex={0}
      className="box-border flex h-full grow overflow-hidden"
    >
      <div className={twJoin('h-full w-full', getCursorMode(editMode))}>
        <ReactFlow
          ref={flowRef}
          proOptions={proOptions}
          colorMode={theme as ColorMode}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          minZoom={0.1}
          maxZoom={3}
          fitView={!viewPort}
          fitViewOptions={fitViewOptions}
          defaultViewport={viewPort}
          deleteKeyCode={null}
          disableKeyboardA11y={true}
          selectNodesOnDrag={false}
          connectionLineComponent={ConnectionLine}
          zoomOnDoubleClick={false}
          defaultEdgeOptions={defaultEdgeOptions}
          isValidConnection={isValidConnection}
          onInit={handleInit}
          onNodeDragStart={handleNodeDragStart}
          onNodeClick={handleNodeClick}
          onNodesChange={onNodesChange}
          onNodesDelete={handleNodesDelete}
          onEdgesChange={onEdgesChange}
          onEdgeDoubleClick={(_, edge) => alignEdge(edge)}
          onConnect={handleConnect}
          onReconnect={handleReconnect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDoubleClick={handleDoubleClick}
          onPointerMove={onMouseMove}
          onPaneClick={handleDeselect}
          onPaneContextMenu={handlePaneContextMenu}
          onNodeContextMenu={handleNodeContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu}
          onContextMenu={handleContextMenu}
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls />
          <MiniMap<AppNode>
            zoomable
            pannable
            maskColor={colors.main}
            bgColor={colors.background}
            nodeComponent={MiniMapNode}
            zoomStep={1.2}
            onNodeClick={handleMiniMapNodeClick}
          />
          <Cursors cursors={cursors} />
          <HelperLines horizontal={horizontalLine} vertical={verticalLine} />
          <Panel position="top-left">
            <IconToolbar flowId={flowId} />
          </Panel>
          {nodeContextMenu && (
            <NodeContextMenu {...nodeContextMenu} onClick={handleDeselect} />
          )}
          {edgeContextMenu && (
            <EdgeContextMenu {...edgeContextMenu} onClick={handleDeselect} />
          )}
          {edgeMenu && <EdgeMenu {...edgeMenu} onClick={handleDeselect} />}
          {process.env.NODE_ENV === 'development' && <DevTools />}
        </ReactFlow>
      </div>
    </div>
  )
}
