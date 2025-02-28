import type { FlowMode, FlowType } from "./flow"

export interface Token {
  tenantId: string
  serviceId: string
  version: string
  id: number
  name: string
  desc: string
  type: FlowType

  mode: FlowMode
  user: {
    userName: string
    userLevel: string
  }
  url: string
  authKey: string
}
