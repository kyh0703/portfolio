import type { DefineMenu } from '@/models/define'

const defaultValues: DefineMenu = {
  id: '',
  name: '',
  rootId: 0,
  parentId: 0,
  svcCode: '',
  dtmf: '',
  custom: false,
  capMent: {
    ment: '',
    type: 'MentID',
    tracking: false,
    ttsInfo: {
      country: '',
      speakerId: '',
      name: '',
    },
  },
  choiceMent: {
    ment: '',
    type: 'MentID',
    tracking: false,
    ttsInfo: {
      country: '',
      speakerId: '',
      name: '',
    },
  },
  subFlowName: '',
  dtmfMask: '',
  length: '1',
  playIndex: '',
  retryDtmf: '',
  condition: '1',
  menuOpt: {
    topKey: '*',
    upKey: '#',
    timeout: '5',
    retry: '3',
    errorInfo: {
      clearDigit: true,
      tracking: false,
      timeout: {
        ment: '',
        tracking: false,
      },
      input: {
        ment: '',
        tracking: false,
      },
      retry: {
        ment: '',
        tracking: false,
      },
    },
    termFlowId: '',
    menuFilter: '0,0,0,0,0,0,0,0,0,0',
  },
  vrInfo: {
    voice: '',
    gramList: [],
    seq: '',
    bargeIn: true,
    sttName: '',
    startTimer: false,
    noVoiceTimeout: '5000',
    maxTimeout: '10000',
  },
  vrAct: {
    recog: {
      highScore: '',
      lowScore: '',
      proDTMF: false,
      subFlowName: '',
    },
    errorInfo: {
      clearDigit: false,
      tracking: false,
      timeout: {
        ment: '',
        tracking: false,
      },
      input: {
        ment: '',
        tracking: false,
      },
      retry: {
        ment: '',
        tracking: false,
      },
    },
  },
  chat: {
    output: {
      category: [
        { categoryName: 'CAPTION', expressionCode: '', codeData: [] },
        { categoryName: 'CHOICE', expressionCode: '', codeData: [] },
        { categoryName: 'TIMEOUT', expressionCode: '', codeData: [] },
        { categoryName: 'INPUT', expressionCode: '', codeData: [] },
        { categoryName: 'RETRY', expressionCode: '', codeData: [] },
        { categoryName: 'VR_TIMEOUT', expressionCode: '', codeData: [] },
        { categoryName: 'VR_INPUT', expressionCode: '', codeData: [] },
        { categoryName: 'VR_RETRY', expressionCode: '', codeData: [] },
        { categoryName: 'BLOCK', expressionCode: '', codeData: [] },
      ],
    },
    input: {
      timeout: '60',
    },
  },
}

export { defaultValues }
