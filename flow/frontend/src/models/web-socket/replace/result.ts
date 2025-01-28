export interface ReplaceResult {
  query: string
  replace: string
  status: 'success' | 'failure'
  errorCode: number
  errorMessage: string
}
