interface SearchResult {
  query: string
  filters: {
    subFlowId: number
    nodeKind?: string
    propertyName?: string
    useMatchWholeWord: boolean
    useMatchCase: boolean
  }
  status: 'success' | 'failure'
  errorCode: number
  errorMessage: string
}
