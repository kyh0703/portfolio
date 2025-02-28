export type FlowType = 'ivr' | 'route'

export type FlowMode = 'beginner' | 'expert'

export interface Flow {
  id: number
  tenantId: string
  serviceId: string
  version: string
  name: string
  type: FlowType
  mode: FlowMode
  desc?: string
}
