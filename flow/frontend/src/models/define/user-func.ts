import { UserfuncType } from '@/constants/options'

export interface DefineUserFunc {
  name: string
  file: string
  type?: UserfuncType
  desc?: string
}
