export interface CodeData {
  name: string
  expression: string
  condition: string
}

export interface Category {
  categoryName: string
  expressionCode: string
  codeData: CodeData[]
}

export interface Output {
  category: Category[]
}

export interface Input {
  timeout: string
}

export interface ChatInfo {
  output?: Output
  input?: Input
}
