'use client'

import {
  DEFAULT_COMMAND_NODE_HEIGHT,
  DEFAULT_COMMAND_NODE_WIDTH,
} from '@/constants/xyflow'
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
import { useAddNode, useUpdateNodes } from '@/services/subflow'
import { useSubFlowStore } from '@/store/sub-flow'
import { colors } from '@/themes'
import { isAllowTarget, isTargetGroup, isTargetPane, toPoints } from '@/utils'
import logger from '@/utils/logger'
import { getCursorMode } from '@/utils/xyflow/cursor-mode'
import { getNodePositionInsideParent } from '@/utils/xyflow/dynamic-grouping'
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
  type NodeMouseHandler,
  type OnConnect,
  type OnConnectStart,
  type OnInit,
  type OnNodeDrag,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
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
import {
  hasParentNode,
  hasPropertyNode,
  isValidConnection,
} from './tools/validator'

type FlowMainProps = {
  subFlowId: number
  initialNodes: AppNode[]
  initialEdges: AppEdge[]
  focusNode?: string
}

export default function FlowMain({
  subFlowId,
  initialNodes,
  initialEdges,
  focusNode,
}: FlowMainProps) {
  const searchParams = useSearchParams()

  const flowRef = useRef<HTMLDivElement>(null)
  const connectionRef = useRef<Connection | null>()
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
        state.history[subFlowId]?.viewPort,
        state.history[subFlowId]?.selectedNode,
        state.setSelectedNode,
      ]),
    )

  const [init, setInit] = useState(false)
  const [nodes, setNodes, onNodesChange, horizontalLine, verticalLine] =
    useNodesStateSynced(subFlowId, initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesStateSynced(
    subFlowId,
    initialEdges,
  )
  const [cursors, onMouseMove] = useCursorStateSynced(subFlowId)
  const [nodeContextMenu, setNodeContextMenu] =
    useState<NodeContextMenuProps | null>(null)
  const [edgeMenu, setEdgeMenu] = useState<EdgeMenuProps | null>(null)

  useInitialize(subFlowId)
  const { nodeFactory, getNodeType, getGhostNodesBySource, focusingNode } =
    useNodes()
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
  const { saveHistory } = useUndoRedo(subFlowId)

  const { mutateAsync: addNodeMutate } = useAddNode()
  const updateNodesMutation = useUpdateNodes()

  const handleInit: OnInit<AppNode, AppEdge> = useCallback(() => {
    setInit(true)
  }, [])

  const handleNodeDragStart: OnNodeDrag<AppNode> = useCallback(
    (event, node, nodes) => {
      saveHistory('update', nodes, [])
      updateNodesMutation.reset()
    },
    [saveHistory, updateNodesMutation],
  )

  const handleNodeDragStop: OnNodeDrag<AppNode> = useCallback(
    async (event, node, dragNodes) => {
      logger.debug('onNodeDragStop', node, nodes)
      dragNodes.map((dragNode) => {
        if (!hasParentNode(dragNode.type!)) {
          return dragNode
        }

        const groupNodes = getIntersectingNodes(dragNode).filter(
          (node) => node.type === 'Group',
        )
        if (groupNodes.length === 0) {
          return dragNode
        }

        const groupNode = groupNodes[groupNodes.length - 1]
        if (dragNode.type === 'Group') {
          const topGroupNode = groupNodes[0]
          if (
            topGroupNode.parentId === dragNode.id ||
            groupNodes.some((node) => node.parentId === dragNode.id)
          ) {
            return dragNode
          }
        }

        if (dragNode.parentId !== groupNode.id) {
          dragNode.position = getNodePositionInsideParent(
            dragNode,
            groupNodes,
          ) ?? {
            x: 0,
            y: 0,
          }
          dragNode.parentId = groupNode.id
          dragNode.dragging = false
          dragNode.extent = 'parent'
          dragNode.expandParent = true
        }

        return dragNode
      })
      setNodes((nodes) => [...nodes, ...dragNodes])
      updateNodesMutation.mutate({ nodes: dragNodes })
    },
    [getIntersectingNodes, nodes, setNodes, updateNodesMutation],
  )

  const handleNodeClick: NodeMouseHandler<AppNode> = useCallback(
    (_, node) => {
      if (editMode === 'grab') {
        if (!hasPropertyNode(node.type!)) {
          setNodeContextMenu(null)
        } else {
          setSelectedNode(subFlowId, {
            subFlowId,
            databaseId: node.data.databaseId!,
            nodeId: node.id,
            nodeType: node.type as CustomNodeType,
          })
        }
      }
    },
    [editMode, setNodeContextMenu, setSelectedNode, subFlowId],
  )

  const handleNodesDelete: OnNodesDelete<AppNode> = useCallback(
    (deletes) => {
      if (deletes.some((node) => node.id === selectedNode?.nodeId)) {
        setSelectedNode(subFlowId, null)
      }
    },
    [selectedNode?.nodeId, setSelectedNode, subFlowId],
  )

  const handleConnectStart: OnConnectStart = useCallback(
    (_, { nodeId }) => {
      logger.debug('onConnectStart', nodeId, connectingInfoRef.current)
      if (nodeId && !nodeId.includes('Ghost')) {
        // 타겟 노드에서 타겟 노드가 만든 고스트노드들을 삭제 하는 경우
        const ghostNodes = getGhostNodesBySource(nodeId)
        // 다른 노드가 만든 고스트노드를 삭제하는 경우
        if (
          connectingInfoRef.current.origin &&
          nodeId !== connectingInfoRef.current.origin
        ) {
          const nodes = getGhostNodesBySource(connectingInfoRef.current.origin)
          ghostNodes.push(...nodes)
        }
        if (ghostNodes.length > 0) {
          deleteElements({ nodes: ghostNodes })
        }
        connectingInfoRef.current.origin = nodeId
      }
      connectingInfoRef.current.latest = nodeId
    },
    [deleteElements, getGhostNodesBySource],
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

      const edgeType = getNodeType(sourceNodeId) as CustomEdgeType
      if (isMenuEdge(edgeType as CustomEdgeType)) {
        return
      }

      connectingInfoRef.current.origin = null
      connectingInfoRef.current.latest = null

      try {
        const oldEdge = getEdgeBySource(sourceNodeId)
        const ghostNodes = getGhostNodesBySource(sourceNodeId)
        const points = toPoints(ghostNodes)
        deleteElements({ nodes: ghostNodes })

        if (oldEdge) {
          saveHistory('update', [], [oldEdge])
          oldEdge.data!.points = points
          await updateEdgeConnectionToDB(oldEdge, connection)
        } else {
          const newEdge = edgeFactory(
            subFlowId,
            connection,
            getNode(sourceNodeId)!.type,
            'next',
            points,
          )
          if (!newEdge) {
            return
          }
          const databaseId = await addEdgeToDB(subFlowId, newEdge)
          newEdge.data!.databaseId = databaseId
          saveHistory('create', [], [newEdge])
        }
      } catch (error) {
        logger.error('Failed to add edge', error)
      }
    },
    [
      getNodeType,
      isMenuEdge,
      getGhostNodesBySource,
      getEdgeBySource,
      deleteElements,
      saveHistory,
      updateEdgeConnectionToDB,
      edgeFactory,
      subFlowId,
      getNode,
      addEdgeToDB,
    ],
  )

  const handleConnectEnd: OnConnectEnd = useCallback(
    async (event) => {
      logger.debug('onConnectEnd')
      if (!(event instanceof MouseEvent)) {
        return
      }

      const connection = connectionRef.current!
      connectionRef.current = null

      if (isAllowTarget(event)) {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })
        const newNode = nodeFactory(subFlowId, position, 'Ghost')
        const connection: Connection = {
          source: connectingInfoRef.current.latest!,
          target: newNode.id,
          sourceHandle: null,
          targetHandle: null,
        }
        const newEdge = edgeFactory(subFlowId, connection, 'Ghost')
        if (!newEdge) {
          return
        }
        setNodes((nodes) => [...nodes, newNode])
        setEdges((edges) => addEdge(newEdge, edges))
        return
      }

      if (!connection) {
        return
      }

      const edgeType = getNodeType(connection.source!) as CustomEdgeType
      if (isMenuEdge(edgeType as CustomEdgeType)) {
        setEdgeMenu({
          connection,
          mouse: {
            x: event.clientX,
            y: event.clientY,
          },
        })
      }
    },
    [
      edgeFactory,
      getNodeType,
      isMenuEdge,
      nodeFactory,
      screenToFlowPosition,
      setEdges,
      setNodes,
      subFlowId,
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

    const newNode = nodeFactory(subFlowId, position, nodeType)
    const groupNodes = getIntersectingNodes({ ...newNode }).filter(
      (node) => node.type === 'Group',
    )
    const groupNode = groupNodes[groupNodes.length - 1]
    if (groupNode && hasParentNode(newNode.type!)) {
      newNode.position = getNodePositionInsideParent(
        {
          position,
          height: DEFAULT_COMMAND_NODE_HEIGHT,
          width: DEFAULT_COMMAND_NODE_WIDTH,
        },
        groupNodes,
      ) ?? { x: 0, y: 0 }
      newNode.parentId = groupNode?.id
      newNode.extent = 'parent'
      newNode.expandParent = true
    }

    try {
      const response = await addNodeMutate({ subFlowId, node: newNode })
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
    setSelectedNode(subFlowId, null)
  }, [setSelectedNode, subFlowId])

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
    (event: ReactMouseEvent<Element, MouseEvent>, node: AppNode) => {
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
    setSelectedNode(subFlowId, {
      subFlowId,
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
    subFlowId,
  ])

  // pane을 dragging 중에는 nodeProperty를 열지 않는다.
  useEffect(() => {
    const handleMouseDown = () => {
      if (selectedNode) {
        unselectNode(selectedNode.nodeId)
        setSelectedNode(subFlowId, null)
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
  }, [selectedNode, setSelectedNode, subFlowId, unselectNode])

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
          onNodeDragStop={handleNodeDragStop}
          onNodeClick={handleNodeClick}
          onNodesChange={onNodesChange}
          onNodesDelete={handleNodesDelete}
          onEdgesChange={onEdgesChange}
          onConnectStart={handleConnectStart}
          onConnect={handleConnect}
          onConnectEnd={handleConnectEnd}
          onReconnect={handleReconnect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDoubleClick={handleDoubleClick}
          onPointerMove={onMouseMove}
          onPaneClick={handleDeselect}
          onPaneContextMenu={handlePaneContextMenu}
          onNodeContextMenu={handleNodeContextMenu}
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
            <IconToolbar subFlowId={subFlowId} />
          </Panel>
          {nodeContextMenu && (
            <NodeContextMenu {...nodeContextMenu} onClick={handleDeselect} />
          )}
          {edgeMenu && <EdgeMenu {...edgeMenu} onClick={handleDeselect} />}
          {process.env.NODE_ENV === 'development' && <DevTools />}
        </ReactFlow>
      </div>
    </div>
  )
}
