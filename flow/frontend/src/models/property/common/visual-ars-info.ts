export interface DataList {
  name: string
  expression?: string
}

export interface VisualARSInfo {
  enable: boolean
  inputData: {
    transactionId: string
    clearDigit: boolean
    tracking: boolean
    skipFirst: boolean
    dataList: DataList[]
  }
  outputData: {
    pageName: string
    useTimeout: boolean
    timeout: string
  }
}
