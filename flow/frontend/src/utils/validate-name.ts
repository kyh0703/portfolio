import {
  IVM_DEFINES,
  IVM_EXPRESSIONS,
  SYSTEM_RESERVE,
} from '@/constants/reserve'

export const validateVar = (variable?: string) => {
  if (!variable) {
    return true
  }

  if (!/^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]/.test(variable[0]) || variable.endsWith('.')) {
    return false
  }

  const stack = []
  for (let i = 0; i < variable.length; i++) {
    const char = variable[i]
    if (char === '[') {
      stack.push(i)
    } else if (char === ']') {
      if (stack.length > 0) {
        if (i < variable.length - 1 && variable[i + 1] === '[') {
          return false
        }
        stack.pop()
      } else {
        return false
      }
    } else if (
      stack.length === 0 &&
      !/^[a-zA-Z0-9_.ㄱ-ㅎㅏ-ㅣ가-힣]$/.test(char)
    ) {
      return false
    }
  }

  if (stack.length > 0) {
    return false
  }

  const insideBrackets = /\[([^\]]*)\]/g
  let match
  while ((match = insideBrackets.exec(variable)) !== null) {
    const inside = match[1]
    if (inside.includes('[') || inside.includes(']')) {
      return false
    }
    if (/[^a-zA-Z0-9_\.]/.test(inside)) {
      return false
    }
    if (/([a-zA-Z_]+)\.\.[a-zA-Z_]+/.test(inside)) {
      return false
    }
  }

  return true
}

export const validateVarDefine = (variable?: string) => {
  if (!variable) {
    return true
  }
  const validateReserved = IVM_DEFINES.concat(SYSTEM_RESERVE)
  const pattern = new RegExp(`\\b(${validateReserved.join('|')})\\b`, 'g')
  const matches = variable.match(pattern)
  return matches === null
}

export const validateVarExpression = (variable?: string) => {
  if (!variable) {
    return true
  }
  const withoutQuotedText = variable.replace(/'[^']*'/g, '')

  const validateReserved = IVM_EXPRESSIONS.concat(SYSTEM_RESERVE)
  const pattern = new RegExp(`\\b(${validateReserved.join('|')})\\b`, 'g')
  const matches = withoutQuotedText.match(pattern)

  return matches === null
}
