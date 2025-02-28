export const subFlowKeys = {
  nodes: 'nodes' as const,
  edges: 'edges' as const,
  nodeProperty: (nodeId: number) =>
    [subFlowKeys.nodes, nodeId, 'property'] as const,
  nodePropertyByNodeId: (subFlowId: number, nodeId: string) =>
    [subFlowKeys.nodes, subFlowId, nodeId, 'property'] as const,
  nodeIdsByKind: (subFlowId: number, kind: string) =>
    ['nodeIds', subFlowId, kind] as const,
  nodeList: (subFlowId: number) => ['nodelist', subFlowId] as const,
  edgeList: (subFlowId: number) => ['edgelist', subFlowId] as const,
  propertyClipboard: (ip: string) => ['property', 'clipboard', ip] as const,
  countUndoRedo: (subFlowId: number) => ['countUndoRedo', subFlowId] as const,
}
