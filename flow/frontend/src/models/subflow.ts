import { ArgumentInfo, ParameterInfo } from './property/common'

export interface SubFlow {
  id: number
  name: string
  version: string
  args: {
    in: ParameterInfo
    out: ArgumentInfo
  }
  desc: string
  updateDate: Date
}
