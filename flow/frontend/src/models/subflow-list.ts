export interface SubFlowList {
  id: number
  name: string
  version: string
  desc: string
  updateDate: Date
}

export interface FlowTree extends Omit<SubFlowList, 'id'> {
  id: string
  uuid: string
  type: 'folder' | 'file'
  children?: FlowTree[]
}

export interface FlowTreeData extends Omit<SubFlowList, 'id'> {
  id: string
  type: 'folder' | 'file'
  databaseId: number
  isCreated?: boolean
  children?: FlowTreeData[]
}
