const ERROR_VARIABLE_NAME_MESSAGE =
  '영문 대소문자, 한글, _(언더바)로 시작해야 하며 .와 _이외의 특수문자는 사용할 수 없습니다.'
const ERROR_FIRST_VARIABLE_NAME_MESSAGE =
  '첫 글자는 영문 대문자 또는 한글, _(언더바)만 입력해주세요.'
const ERROR_MIDDLE_VARIABLE_NAME_MESSAGE =
  '중간 문자는 영문 대소문자, 한글, 숫자, .과 _(언더바)만 입력해주세요.'
const ERROR_VERSION_MESSAGE =
  '잘못된 형식입니다. 1.0.0과 같은 형식으로 버전명을 입력하세요.'
const ERROR_DEFINE_VARIABLE_NAME_MESSAGE = '변수 정의 형식이 올바르지 않습니다.'
const ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE =
  '허용되지 않는 예약어가 포함되어 있습니다.'

export {
  ERROR_DEFINE_VARIABLE_NAME_MESSAGE,
  ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
  ERROR_FIRST_VARIABLE_NAME_MESSAGE,
  ERROR_MIDDLE_VARIABLE_NAME_MESSAGE,
  ERROR_VARIABLE_NAME_MESSAGE,
  ERROR_VERSION_MESSAGE,
}
