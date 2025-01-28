interface SearchRequest {
  query: string
  filters?: {
    subFlowId?: number
    nodeKind?: string
    nodeType?: 'define' | 'node'
    propertyName?: string
    useMatchWholeWord: boolean
    useMatchCase: boolean
  }
}
