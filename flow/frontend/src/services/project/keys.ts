export const flowKeys = {
  flow: ['flow'] as const,
  detail: (flowId: number) => [flowKeys.flow, flowId] as const,
}
