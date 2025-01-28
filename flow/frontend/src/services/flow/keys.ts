export const flowKeys = {
  subFlows: ['subFlows'] as const,
  inFlows: ['inFlows'] as const,
  subFlowTree: ['subFlowsTree'] as const,
  commonFlowTree: ['commonFlowTree'] as const,
  commonFlows: ['commonFlows'] as const,
  commonInFlows: ['commonInFlows'] as const,
  subFlowDetail: (subFlowId: number) => [flowKeys.subFlows, subFlowId] as const,
  commonFlowDetail: (commonFlowId: number) =>
    [flowKeys.commonFlows, commonFlowId] as const,
  build: ['build'] as const,
}
