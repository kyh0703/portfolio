import { useReactFlow, type AppEdge, type AppNode } from '@xyflow/react'
import { useCallback } from 'react'

export function useSelect() {
  const { getNodes, setNodes, getEdges, setEdges } = useReactFlow<
    AppNode,
    AppEdge
  >()

  const selectAll = useCallback(() => {
    setNodes((nodes) => nodes.map((node) => ({ ...node, selected: true })))
    setEdges((edges) => edges.map((edge) => ({ ...edge, selected: true })))
  }, [setEdges, setNodes])

  const selectNode = useCallback(
    (id: string) => {
      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          selected: node.id === id,
        })),
      )
    },
    [setNodes],
  )

  const unselectNode = useCallback(
    (id: string) => {
      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          selected: node.id === id ? false : node.selected,
        })),
      )
    },
    [setNodes],
  )

  const isSelected = useCallback(() => {
    return (
      getNodes().some((node) => node.selected) ||
      getEdges().some((edge) => edge.selected)
    )
  }, [getEdges, getNodes])

  return { selectAll, selectNode, unselectNode, isSelected }
}
