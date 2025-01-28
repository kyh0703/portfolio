export type DefineScope = 'common' | 'global'

export type DefineType =
  | 'var'
  | 'ment'
  | 'packet'
  | 'intent'
  | 'log'
  | 'userfunc'
  | 'cdr'
  | 'track'
  | 'service'
  | 'string'
  | 'menustat'

export type DefineList<T> = {
  id: number
  defineId: string
  scope: DefineScope
  property: T
}
