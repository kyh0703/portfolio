import {
  ChatInfoGetDigitCategory,
  ChatInfoNluCategory,
} from '@/constants/options'

export interface CodeData {
  name: string
  expression?: string
  condition: string
}

export interface Category {
  categoryName: ChatInfoNluCategory | ChatInfoGetDigitCategory
  expressionCode: string
  codeData: CodeData[]
}

export interface ChatInfo {
  output: {
    category: Category[]
  }
  input: {
    timeout: string
  }
}
