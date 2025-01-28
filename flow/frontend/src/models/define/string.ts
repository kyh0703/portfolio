export interface StringFormat {
  type: string
  name: string
  length?: string
  cntName?: string
  trim?: string
  desc?: string
}

export interface DefineString {
  id: string
  name: string
  comFormat?: boolean
  common?: string
  trim?: string
  stringPart?: StringFormat[]
  rptPart?: StringFormat[]
}
