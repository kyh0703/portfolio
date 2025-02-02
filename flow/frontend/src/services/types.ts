import { errorMessages, type ErrorCode } from '@/constants/http-error'

export type CustomResponse = {
  code: number
  message: number
}

export type ApiResponse<T> = {
  data: T
} & CustomResponse

export class CustomError extends Error {
  public code: ErrorCode
  public message: string
  public status: number

  constructor(code: number, status: number) {
    super(errorMessages.get(code) || 'Unknown error')
    this.code = code
    this.message = errorMessages.get(code) || 'Unknown error'
    this.status = status
    this.name = 'CustomError'
  }
}
