export type ManagementType = 'options' | 'commonflow-edit' | 'import-export'

export type ExportVariables = {
  exportInfo: { flow: boolean; subFlow: boolean; define: boolean }
  subFlows: number[]
  defines: string[]
}

export interface Option {
  build: BuildOption
  snapShot: SnapShotOption
  multiMent: MultiMentOption
  mentPlay: MentPlayOption
  menuFilter: MenuFilterOption
}

export interface BuildOption {
  encode: string
  logOpt: {
    information: boolean
    notice: boolean
    unlinkedDigit: boolean
    unlinkedDefaultDigit: boolean
    unlinkedNext: boolean
    timeWrite: boolean
    level: string
  }
  buildOpt: {
    ignoreErrorNotDefVar: boolean
    ignoreErrorPktHeadAndBodyFieldDup: boolean
    allowPrevCdrKeyToBeUsed: boolean
    ignoreVarCreateOrderCheckArraySubsVar: boolean
  }
  tagOpt: {
    stopDgtInAtPrmtPlayErrInGetdigit: boolean
    vrStartWaitTm: number
  }
}

export interface SnapShotOption {
  use: boolean
}

export interface MultiMentOption {
  mt1: string
  mt2: string
  mt3: string
  mt4: string
  mt5: string
}

export interface MentPlayOption {
  path: string
}

export interface MenuFilterOption {
  filter1: string
  filter2: string
  filter3: string
  filter4: string
  filter5: string
  filter6: string
  filter7: string
  filter8: string
  filter9: string
  filter10: string
}
