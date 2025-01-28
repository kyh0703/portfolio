const REG_EX_VARIABLE_NAME = /^[ㄱ-ㅎ가-힣a-zA-Z_][ㄱ-ㅎ가-힣a-zA-Z0-9._]*$/
const REG_EX_FIRST_VARIABLE_NAME = /^[가-힣A-Za-z_]/
const REG_EX_MIDDLE_VARIABLE_NAME = /^[가-힣A-Za-z0-9._]*$/
const REG_EX_VERSION = /^\d+\.\d+\.\d+$/

export {
  REG_EX_FIRST_VARIABLE_NAME,
  REG_EX_MIDDLE_VARIABLE_NAME,
  REG_EX_VARIABLE_NAME,
  REG_EX_VERSION,
}
