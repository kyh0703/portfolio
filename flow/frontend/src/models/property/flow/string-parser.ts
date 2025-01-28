import type { General } from '../common'

export interface StringParserInfo {
  name: string
  type: string
  formatId: string
  delimiter: string
  parsingData: string
  condition: string
}

export interface StringParser {
  general: General
  parserInfo: StringParserInfo
}
