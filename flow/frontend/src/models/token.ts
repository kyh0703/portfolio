export interface Token {
  tenantId: string
  serviceId: string
  version: string
  id: number
  name: string
  desc: string
  type: string
  user: {
    userName: string
    userLevel: string
  }
  url: string
  authKey: string
}
