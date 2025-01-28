export type Message<T> = {
  type: string
  data: T
  timestamp: Date
}
