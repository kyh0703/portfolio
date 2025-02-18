import {
  ERROR_DEFINE_VARIABLE_NAME_MESSAGE,
  ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
} from '@/constants/error-message'
import { validateVarDefine, validateVarExpression } from '@/utils'
import * as Yup from 'yup'

const ABORT_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    lineNo: Yup.string()
      .required('Line No. is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const ARGUMENT_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    subFlowName: Yup.string()
      .required('Sub Flow is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const CALL_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    to: Yup.string()
      .required('To is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    toneDialTimeout: Yup.string()
      .required('Tone Dial Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    toneTimeout: Yup.string()
      .required('Tone Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    mediaType: Yup.string()
      .required('Media Type is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const CDR_CONTROL_TAB_SCHEMA = Yup.object().shape({
  ctrlInfo: Yup.object().shape({
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const CHANNEL_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    dnGroupName: Yup.string()
      .required('Dn Group Name is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const CHAT_INFO_TAB_SCHEMA = Yup.object().shape({
  chat: Yup.object().shape({
    input: Yup.object().shape({
      timeout: Yup.string()
        .required('Timeout is required')
        .test(
          'expression',
          ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
          validateVarExpression,
        ),
    }),
  }),
})

const CONDITION_AND_LINK_TAB_SCHEMA = Yup.object().shape({
  select: Yup.object().shape({
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const CONDITION_TAB_SCHEMA = Yup.object().shape({
  condition: Yup.string()
    .required('Condition is required')
    .test(
      'expression',
      ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
      validateVarExpression,
    ),
})

const CONSUMER_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    type: Yup.string()
      .required('Type is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const CTI_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    command: Yup.string()
      .required('Command is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    service: Yup.string()
      .required('Service is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const DETECT_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    detectType: Yup.string()
      .required('Detect Type Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    timeout: Yup.string()
      .required('Tone Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const DIGIT_INFO_TAB_SCHEMA = Yup.object().shape({
  digit: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    interTimeout: Yup.string()
      .required('Inter Digit Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const DISCONNECT_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    type: Yup.string()
      .required('Type is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const ENVIRONMENT_DATA_TAB_SCHEMA = Yup.object().shape({
  envData: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    file: Yup.string()
      .required('File is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    service: Yup.string()
      .required('Service is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    value: Yup.string()
      .required('Value is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const EXPAND_MENU_INFO_TAB_SCHEMA = Yup.object().shape({
  expandMenuInfo: Yup.object().shape({
    condExpression: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const HTML_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    transId: Yup.string()
      .required('Transaction ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    fileName: Yup.string()
      .required('File Name is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const HTTP_DATA_TAB_SCHEMA = Yup.object().shape({
  httpData: Yup.object().shape({
    url: Yup.string()
      .required('URL is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    connTimeout: Yup.string()
      .required('Connection Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    respTimeout: Yup.string()
      .required('Response Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const INTENT_INFO_TAB_SCHEMA = Yup.object().shape({
  intentInfo: Yup.object().shape({
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const INTENT_NLU_INTO_TAB_SCHEMA = Yup.object().shape({
  entityInfo: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    intentId: Yup.string()
      .required('Intent ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    nluInfo: Yup.object().shape({
      transId: Yup.string()
        .required('Transaction ID is required')
        .test(
          'expression',
          ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
          validateVarExpression,
        ),
      modelName: Yup.string()
        .required('Model Name is required')
        .test(
          'expression',
          ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
          validateVarExpression,
        ),
    }),
  }),
})

const INBOUND_INFO_TAB_SCHEMA = Yup.object().shape({
  inboundInfo: Yup.object().shape({
    ani: Yup.string()
      .required('ANI is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    dnis: Yup.string()
      .required('DNIS is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    usrData: Yup.string()
      .required('User Data is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    trkData: Yup.string()
      .required('Trunk User Data is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    ringTime: Yup.string().matches(/^\d+$/, '숫자만 입력 가능합니다.'),
  }),
})

const LOG_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    id: Yup.string()
      .required('Log ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    expression: Yup.string().test(
      'expression',
      ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
      validateVarExpression,
    ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const MENT_TYPE_TAB_SCHEMA = Yup.object().shape({
  mentType: Yup.object().shape({
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const MENU_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    menuId: Yup.string()
      .required('Menu ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const MENU_RETURN_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    type: Yup.string()
      .required('Return Type is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    menuId: Yup.string()
      .required('Menu ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const NLU_INFO_TAB_SCHEMA = Yup.object().shape({
  nluInfo: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    transId: Yup.string()
      .required('Transaction ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    modelName: Yup.string()
      .required('Model Name is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    threshold: Yup.string()
      .required('Threshold is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    retry: Yup.string()
      .required('Retry is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    endMethod: Yup.string()
      .required('End Method is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    intentId: Yup.string().when('setIntent', {
      is: (setIntent: boolean) => setIntent,
      then: (schema) =>
        schema
          .required('Intent ID is required')
          .test(
            'expression',
            ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
            validateVarExpression,
          ),
      otherwise: (schema) => schema,
    }),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const OBJECT_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    transId: Yup.string()
      .required('Transaction ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    reqPage: Yup.string()
      .required('Request Page is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    timeout: Yup.string().when('useTimeout', {
      is: (useTimeout: boolean) => useTimeout,
      then: (schema) =>
        schema
          .required('Timeout is required')
          .test(
            'expression',
            ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
            validateVarExpression,
          ),
      otherwise: (schema) => schema,
    }),
    endMethod: Yup.string()
      .required('End Method is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const OPEN_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    sttName: Yup.string().test(
      'expression',
      ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
      validateVarExpression,
    ),
  }),
})

const PACKET_CALL_INFO_TAB_SCHEMA = Yup.object().shape({
  packetInfo: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    transId: Yup.string()
      .required('Transaction ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    packetId: Yup.string()
      .required('Packet ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    type: Yup.string()
      .required('Packet Type is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    choiceCall: Yup.string().test(
      'expression',
      ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
      validateVarExpression,
    ),
    bgm: Yup.string().test(
      'expression',
      ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
      validateVarExpression,
    ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const PACKET_JSON_INFO_TAB_SCHEMA = Yup.object().shape({
  packetInfo: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    transId: Yup.string()
      .required('Transaction ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const PACKET_SIZE_INFO_TAB_SCHEMA = Yup.object().shape({
  packetInfo: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    packetId: Yup.string()
      .required('Packet ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const PARSE_INFO_TAB_SCHEMA = Yup.object().shape({
  parserInfo: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    formatId: Yup.string()
      .required('Format ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    delimiter: Yup.string()
      .required('Delimiter is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    parsingData: Yup.string()
      .required('Parsing Data is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const PROCEDURE_INFO_TAB_SCHEMA = Yup.object().shape({
  procInfo: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    argList: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one value is required'),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const QUERY_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    transId: Yup.string()
      .required('Transaction ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    queryData: Yup.string()
      .required('Query Text is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    procName: Yup.string()
      .required('Procedure Name is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    argList: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one value is required'),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const RECOGNIZE_INFO_TAB_SCHEMA = Yup.object().shape({
  recognizeInfo: Yup.object().shape({
    data: Yup.object().shape({
      name: Yup.string()
        .required('Name is required')
        .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
      sttName: Yup.string().test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
      noVoiceTimeout: Yup.string()
        .required('No Voice Timeout is required')
        .test(
          'expression',
          ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
          validateVarExpression,
        ),
      maxTimeout: Yup.string()
        .required('Max Timeout is required')
        .test(
          'expression',
          ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
          validateVarExpression,
        ),
      condition: Yup.string()
        .required('Condition is required')
        .test(
          'expression',
          ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
          validateVarExpression,
        ),
    }),
  }),
})

const RECORD_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    fileName: Yup.string()
      .required('File Name is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    noVoice: Yup.string()
      .required('No Voice is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    maxTime: Yup.string()
      .required('Max Time is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    maxSilence: Yup.string()
      .required('Max Silence is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    termKey: Yup.string()
      .required('Termination is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const REG_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    transId: Yup.string()
      .required('Transaction ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const REQUEST_INFO_TAB_SCHEMA = Yup.object().shape({
  requestInfo: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const RESULT_INFO_TAB_SCHEMA = Yup.object().shape({
  result: Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .test('define', ERROR_DEFINE_VARIABLE_NAME_MESSAGE, validateVarDefine),
    maxTimeout: Yup.string()
      .required('Max Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const RETURN_INFO_TAB_SCHEMA = Yup.object().shape({
  value: Yup.string()
    .required('Return Value is required')
    .test(
      'expression',
      ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
      validateVarExpression,
    ),
})

const ROUTE_ACD_TAB_SCHEMA = Yup.object().shape({
  routeInfo: Yup.object().shape({
    target: Yup.string()
      .required('ACD Target is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    routeType: Yup.string()
      .required('Route Type is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    priority: Yup.string()
      .required('Route Priority is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const ROUTE_GROUP_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    priority: Yup.string()
      .required('Priority is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const ROUTE_INFO_TAB_SCHEMA = Yup.object().shape({
  routeInfo: Yup.object().shape({
    priority: Yup.string()
      .required('Route Priority is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const ROUTE_QUEUE_RULE_TAB_SCHEMA = Yup.object().shape({
  routeInfo: Yup.object().shape({
    priority: Yup.string()
      .required('Route Priority is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const SERVICE_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    service: Yup.string()
      .required('Service is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    ani: Yup.string()
      .required('ANI is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    dnis: Yup.string()
      .required('DNIS is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const SET_EVENT_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    to: Yup.string()
      .required('To is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    eventId: Yup.string()
      .required('Event ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    data: Yup.string().test(
      'expression',
      ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
      validateVarExpression,
    ),
  }),
})

const SET_TIME_TAB_SCHEMA = Yup.object().shape({
  timeInfo: Yup.object().shape({
    sleepTime: Yup.string()
      .required('Sleep Time is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    kind: Yup.string()
      .required('Second is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const SWITCH_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    to: Yup.string()
      .required('To is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const TONE_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    toneString: Yup.string()
      .required('Tone String is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const TRACKING_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    id: Yup.string()
      .required('Track ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const TRACKING_TAB_SCHEMA = Yup.object().shape({
  tracking: Yup.object().shape({
    enable: Yup.boolean(),
    info: Yup.object().when('enable', {
      is: (enable: boolean) => enable,
      then: (schema) =>
        schema.shape({
          id: Yup.string().required('Track ID is required'),
        }),
      otherwise: (schema) => schema,
    }),
  }),
})

const TRANSFER_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    to: Yup.string()
      .required('To is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const UNREG_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    transId: Yup.string()
      .required('Transaction ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const USER_INFO_TAB_SCHEMA = Yup.object().shape({
  userInfo: Yup.object().shape({
    name: Yup.string().when('update', {
      is: (update: boolean) => !update,
      then: (schema) =>
        schema
          .required('Name is required')
          .test(
            'expression',
            ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
            validateVarExpression,
          ),
      otherwise: (schema) => schema,
    }),
    key: Yup.string()
      .required('Key is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    default: Yup.string().when('update', {
      is: (update: boolean) => !update,
      then: (schema) => schema.required('Default is required'),
      otherwise: (schema) => schema,
    }),
    value: Yup.string().when('update', {
      is: (update: boolean) => update,
      then: (schema) => schema.required('Value is required'),
      otherwise: (schema) => schema,
    }),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const WAIT_EVENT_INFO_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    eventId: Yup.string()
      .required('Event ID is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    data: Yup.string().test(
      'expression',
      ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
      validateVarExpression,
    ),
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

const WAIT_WEB_INBOUND_TAB_SCHEMA = Yup.object().shape({
  info: Yup.object().shape({
    timeout: Yup.string()
      .required('Timeout is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
    condition: Yup.string()
      .required('Condition is required')
      .test(
        'expression',
        ERROR_EXPRESSION_VARIABLE_NAME_MESSAGE,
        validateVarExpression,
      ),
  }),
})

export {
  ABORT_INFO_TAB_SCHEMA,
  ARGUMENT_INFO_TAB_SCHEMA,
  CALL_INFO_TAB_SCHEMA,
  CDR_CONTROL_TAB_SCHEMA,
  CHANNEL_INFO_TAB_SCHEMA,
  CHAT_INFO_TAB_SCHEMA,
  CONDITION_AND_LINK_TAB_SCHEMA,
  CONDITION_TAB_SCHEMA,
  CONSUMER_INFO_TAB_SCHEMA,
  CTI_INFO_TAB_SCHEMA,
  DETECT_INFO_TAB_SCHEMA,
  DIGIT_INFO_TAB_SCHEMA,
  DISCONNECT_INFO_TAB_SCHEMA,
  ENVIRONMENT_DATA_TAB_SCHEMA,
  EXPAND_MENU_INFO_TAB_SCHEMA,
  HTML_INFO_TAB_SCHEMA,
  HTTP_DATA_TAB_SCHEMA,
  INBOUND_INFO_TAB_SCHEMA,
  INTENT_INFO_TAB_SCHEMA,
  INTENT_NLU_INTO_TAB_SCHEMA,
  LOG_INFO_TAB_SCHEMA,
  MENT_TYPE_TAB_SCHEMA,
  MENU_INFO_TAB_SCHEMA,
  MENU_RETURN_INFO_TAB_SCHEMA,
  NLU_INFO_TAB_SCHEMA,
  OBJECT_INFO_TAB_SCHEMA,
  OPEN_INFO_TAB_SCHEMA,
  PACKET_CALL_INFO_TAB_SCHEMA,
  PACKET_JSON_INFO_TAB_SCHEMA,
  PACKET_SIZE_INFO_TAB_SCHEMA,
  PARSE_INFO_TAB_SCHEMA,
  PROCEDURE_INFO_TAB_SCHEMA,
  QUERY_INFO_TAB_SCHEMA,
  RECOGNIZE_INFO_TAB_SCHEMA,
  RECORD_INFO_TAB_SCHEMA,
  REG_INFO_TAB_SCHEMA,
  REQUEST_INFO_TAB_SCHEMA,
  RESULT_INFO_TAB_SCHEMA,
  RETURN_INFO_TAB_SCHEMA,
  ROUTE_ACD_TAB_SCHEMA,
  ROUTE_GROUP_INFO_TAB_SCHEMA,
  ROUTE_INFO_TAB_SCHEMA,
  ROUTE_QUEUE_RULE_TAB_SCHEMA,
  SERVICE_INFO_TAB_SCHEMA,
  SET_EVENT_INFO_TAB_SCHEMA,
  SET_TIME_TAB_SCHEMA,
  SWITCH_INFO_TAB_SCHEMA,
  TONE_INFO_TAB_SCHEMA,
  TRACKING_INFO_TAB_SCHEMA,
  TRACKING_TAB_SCHEMA,
  TRANSFER_INFO_TAB_SCHEMA,
  UNREG_INFO_TAB_SCHEMA,
  USER_INFO_TAB_SCHEMA,
  WAIT_EVENT_INFO_TAB_SCHEMA,
  WAIT_WEB_INBOUND_TAB_SCHEMA,
}
