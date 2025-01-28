import {
  ERROR_FIRST_VARIABLE_NAME_MESSAGE,
  ERROR_MIDDLE_VARIABLE_NAME_MESSAGE,
} from '@/constants/error-message'
import {
  REG_EX_FIRST_VARIABLE_NAME,
  REG_EX_MIDDLE_VARIABLE_NAME,
} from '@/constants/regex'
import { SUBFLOW_SYSTEM_RESERVE } from '@/constants/reserve'
import { toast } from 'react-toastify'

export default function useValidate() {
  const validateVar = (variable: string) => {
    if (!variable) {
      toast.warn('A file or folder name must be provided')
      return false
    }

    if (!REG_EX_FIRST_VARIABLE_NAME.test(variable[0])) {
      toast.warn(ERROR_FIRST_VARIABLE_NAME_MESSAGE)
      return false
    }

    if (!REG_EX_MIDDLE_VARIABLE_NAME.test(variable.slice(1))) {
      toast.warn(ERROR_MIDDLE_VARIABLE_NAME_MESSAGE)
      return false
    }

    return true
  }

  const validateSubFlow = (subFlowName: string) => {
    // 예약어 검사
    const reservedWordsPattern = new RegExp(
      `\\b(${SUBFLOW_SYSTEM_RESERVE.join('|')})\\b`,
      'g',
    )
    if (subFlowName.match(reservedWordsPattern)) {
      toast.warn('GLOBAL, RESERVED는 예약어로 사용할 수 없습니다.')
      return false
    }

    // 이름 형식 검사
    const validNamePattern = /^[a-zA-Z가-힣_][a-zA-Z가-힣0-9._]*$/
    if (!validNamePattern.test(subFlowName)) {
      toast.warn(
        '이름은 영문자, 한글, 또는 밑줄로 시작해야 하며, 영문자, 한글, 숫자, 점, 밑줄만 포함할 수 있습니다.',
      )
      return false
    }

    return true
  }

  return { validateVar, validateSubFlow }
}
