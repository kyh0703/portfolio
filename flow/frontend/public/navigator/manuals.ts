interface Navigator {
  url: string
  title: string
  children?: Navigator[]
}

const navigator: Navigator[] = [
  {
    url: '/manuals/overviews/overview.md',
    title: '개요 및 목적',
  },
  {
    url: '/manuals/overviews/systemrequirement.md',
    title: '시스템 요구사항',
  },
  {
    url: '/manuals/getstarted/gettingstarted.md',
    title: '시작하기',
  },
  {
    url: '/manuals/navigation/navigationbar.md',
    title: '네비게이션바',
  },
  {
    url: '/manuals/editwindow/editwindow.md',
    title: '편집창',
  },
  {
    url: '/manuals/buildandinfo/buildandinfowindow.md',
    title: '빌드/정보창',
  },
  {
    url: '/manuals/funcctrl/functioncontrol.md',
    title: '기능제어 및 표시창',
  },
  {
    url: '/manuals/definitions/definitions.md',
    title: '정의속성',
    children: [
      {
        url: '/manuals/definitions/define-var.md',
        title: 'Var',
      },
      {
        url: '/manuals/definitions/define-menu.md',
        title: 'Menu',
      },
      {
        url: '/manuals/definitions/define-ment.md',
        title: 'Ment',
      },
      {
        url: '/manuals/definitions/define-packet.md',
        title: 'Packet',
      },
      {
        url: '/manuals/definitions/define-intent.md',
        title: 'Intent',
      },
      {
        url: '/manuals/definitions/define-log.md',
        title: 'Log',
      },
      {
        url: '/manuals/definitions/define-userfunc.md',
        title: 'UserFunc',
      },
      {
        url: '/manuals/definitions/define-cdr.md',
        title: 'CDR',
      },
      {
        url: '/manuals/definitions/define-track.md',
        title: 'Track',
      },
      {
        url: '/manuals/definitions/define-service.md',
        title: 'Service',
      },
      {
        url: '/manuals/definitions/define-string.md',
        title: 'String',
      },
      {
        url: '/manuals/definitions/define-menustat.md',
        title: 'MenuStat',
      },
    ],
  },
  {
    url: '/manuals/nodes/nodes.md',
    title: '노드속성',
    children: [
      {
        url: '/manuals/nodes/base/group-base.md',
        title: 'Base',
        children: [
          {
            url: '/manuals/nodes/base/node-start.md',
            title: 'Start',
          },
          {
            url: '/manuals/nodes/base/edge.md',
            title: 'Edge',
          },
        ],
      },
      {
        url: '/manuals/nodes/telephony/group-telephony.md',
        title: 'Telephony',
        children: [
          {
            url: '/manuals/nodes/telephony/node-play.md',
            title: 'Play',
          },
          {
            url: '/manuals/nodes/telephony/node-getdigit.md',
            title: 'GetDigit',
          },
          {
            url: '/manuals/nodes/telephony/node-waitinbound.md',
            title: 'WaitInbound',
          },
          {
            url: '/manuals/nodes/telephony/node-waitoutbound.md',
            title: 'WaitOutbound',
          },
          {
            url: '/manuals/nodes/telephony/node-disconnect.md',
            title: 'Disconnect',
          },
          {
            url: '/manuals/nodes/telephony/node-record.md',
            title: 'Record',
          },
          {
            url: '/manuals/nodes/telephony/node-abort.md',
            title: 'Abort',
          },
          {
            url: '/manuals/nodes/telephony/node-switch.md',
            title: 'Switch',
          },
          {
            url: '/manuals/nodes/telephony/node-disswitch.md',
            title: 'DisSwitch',
          },
          {
            url: '/manuals/nodes/telephony/node-transfer.md',
            title: 'Transfer',
          },
          {
            url: '/manuals/nodes/telephony/node-makecall.md',
            title: 'MakeCall',
          },
          {
            url: '/manuals/nodes/telephony/node-getchannel.md',
            title: 'GetChannel',
          },
          {
            url: '/manuals/nodes/telephony/node-cticall.md',
            title: 'CtiCall',
          },
          {
            url: '/manuals/nodes/telephony/node-pushtone.md',
            title: 'PushTone',
          },
          {
            url: '/manuals/nodes/telephony/node-choicement.md',
            title: 'ChoiceMent',
          },
          {
            url: '/manuals/nodes/telephony/node-choicecall.md',
            title: 'ChoiceCall',
          },
          {
            url: '/manuals/nodes/telephony/node-tonedetect.md',
            title: 'ToneDetect',
          },
        ],
      },
      {
        url: '/manuals/nodes/vr/group-vr.md',
        title: 'VR',
        children: [
          {
            url: '/manuals/nodes/vr/node-voicerecognize.md',
            title: 'VoiceRecognize',
          },
          {
            url: '/manuals/nodes/vr/node-openvr.md',
            title: 'OpenVR',
          },
          {
            url: '/manuals/nodes/vr/node-closevr.md',
            title: 'CloseVR',
          },
          {
            url: '/manuals/nodes/vr/node-requestvr.md',
            title: 'RequestVR',
          },
          {
            url: '/manuals/nodes/vr/node-responsevr.md',
            title: 'ResponseVR',
          },
        ],
      },
      {
        url: '/manuals/nodes/iweb/group-iweb.md',
        title: 'iWeb',
        children: [
          {
            url: '/manuals/nodes/iweb/node-requestpage.md',
            title: 'RequestPage',
          },
          {
            url: '/manuals/nodes/iweb/node-getpagedata.md',
            title: 'GetPagedata',
          },
          {
            url: '/manuals/nodes/iweb/node-registserver.md',
            title: 'RegistServer',
          },
          {
            url: '/manuals/nodes/iweb/node-unregistserver.md',
            title: 'UnregistServer',
          },
          {
            url: '/manuals/nodes/iweb/node-waitwebinblund.md',
            title: 'WaitWebInbound',
          },
          {
            url: '/manuals/nodes/iweb/node-disconnectweb.md',
            title: 'DisconnectWeb',
          },
        ],
      },
      {
        url: '/manuals/nodes/ai/group-ai.md',
        title: 'AI',
        children: [
          {
            url: '/manuals/nodes/ai/node-nlurequest.md',
            title: 'NLURequest',
          },
          {
            url: '/manuals/nodes/ai/node-intentcall.md',
            title: 'IntentCall',
          },
          {
            url: '/manuals/nodes/ai/node-entitycall.md',
            title: 'EntityCall',
          },
        ],
      },
      {
        url: '/manuals/nodes/route/group-route.md',
        title: 'Route',
        children: [
          {
            url: '/manuals/nodes/route/node-routeskill.md',
            title: 'RouteSkill',
          },
          {
            url: '/manuals/nodes/route/node-routegroup.md',
            title: 'RouteGroup',
          },
          {
            url: '/manuals/nodes/route/node-routeskillgroup.md',
            title: 'RouteSkillGroup',
          },
          {
            url: '/manuals/nodes/route/node-userdata.md',
            title: 'UserData',
          },
          {
            url: '/manuals/nodes/route/node-routeacd.md',
            title: 'RouteACD',
          },
          {
            url: '/manuals/nodes/route/node-routequeuerule.md',
            title: 'RouteQueueRule',
          },
        ],
      },
      {
        url: '/manuals/nodes/flow/group-flow.md',
        title: 'Flow',
        children: [
          {
            url: '/manuals/nodes/flow/node-if.md',
            title: 'If',
          },
          {
            url: '/manuals/nodes/flow/node-select.md',
            title: 'Select',
          },
          {
            url: '/manuals/nodes/flow/node-assign.md',
            title: 'Assign',
          },
          {
            url: '/manuals/nodes/flow/node-menucall.md',
            title: 'MenuCall',
          },
          {
            url: '/manuals/nodes/flow/node-menureturn.md',
            title: 'MenuReturn',
          },
          {
            url: '/manuals/nodes/flow/node-subcall.md',
            title: 'SubCall',
          },
          {
            url: '/manuals/nodes/flow/node-return.md',
            title: 'Return',
          },
          {
            url: '/manuals/nodes/flow/node-changeservice.md',
            title: 'ChangeService',
          },
          {
            url: '/manuals/nodes/flow/node-menuchange.md',
            title: 'MenuChange',
          },
          {
            url: '/manuals/nodes/flow/node-sleep.md',
            title: 'Sleep',
          },
          {
            url: '/manuals/nodes/flow/node-setlabel.md',
            title: 'SetLabel',
          },
          {
            url: '/manuals/nodes/flow/node-gotolabel.md',
            title: 'GotoLabel',
          },
        ],
      },
      {
        url: '/manuals/nodes/data/group-data.md',
        title: 'Data',
        children: [
          {
            url: '/manuals/nodes/data/node-cdr.md',
            title: 'Cdr',
          },
          {
            url: '/manuals/nodes/data/node-cdrctrl.md',
            title: 'CdrCtrl',
          },
          {
            url: '/manuals/nodes/data/node-userenv.md',
            title: 'UserEnv',
          },
          {
            url: '/manuals/nodes/data/node-stringparser.md',
            title: 'StringParser',
          },
        ],
      },
      {
        url: '/manuals/nodes/userfunc/group-userfunc.md',
        title: 'UserFunc',
        children: [
          {
            url: '/manuals/nodes/userfunc/node-userfunccall.md',
            title: 'UserFuncCall',
          },
        ],
      },
      {
        url: '/manuals/nodes/packet/group-packet.md',
        title: 'Packet',
        children: [
          {
            url: '/manuals/nodes/packet/node-packetcall.md',
            title: 'packetCall',
          },
          {
            url: '/manuals/nodes/packet/node-packetsize.md',
            title: 'PacketSize',
          },
          {
            url: '/manuals/nodes/packet/node-packetjson.md',
            title: 'PacketJson',
          },
          {
            url: '/manuals/nodes/packet/node-requesthttp.md',
            title: 'RequestHttp',
          },
        ],
      },
      {
        url: '/manuals/nodes/database/group-database.md',
        title: 'Database',
        children: [
          {
            url: '/manuals/nodes/database/node-dbquery.md',
            title: 'DBQuery',
          },
        ],
      },
      {
        url: '/manuals/nodes/log/group-log.md',
        title: 'Log',
        children: [
          {
            url: '/manuals/nodes/log/node-logwrite.md',
            title: 'LogWrite',
          },
        ],
      },
      {
        url: '/manuals/nodes/event/group-event.md',
        title: 'Event',
        children: [
          {
            url: '/manuals/nodes/event/node-setevent.md',
            title: 'SetEvent',
          },
          {
            url: '/manuals/nodes/event/node-waitevent.md',
            title: 'WaitEvent',
          },
        ],
      },
      {
        url: '/manuals/nodes/tracking/group-tracking.md',
        title: 'Tracking',
        children: [
          {
            url: '/manuals/nodes/tracking/node-tracking.md',
            title: 'Tracking',
          },
          {
            url: '/manuals/nodes/tracking/node-consumermonit.md',
            title: 'ConsumerMonit',
          },
          {
            url: '/manuals/nodes/tracking/node-usermenustat.md',
            title: 'UserMenuStat',
          },
        ],
      },
      {
        url: '/manuals/nodes/etc/group-etc.md',
        title: 'etc',
        children: [
          {
            url: '/manuals/nodes/etc/node-memo.md',
            title: 'Memo',
          },
          {
            url: '/manuals/nodes/etc/node-group.md',
            title: 'Group',
          },
        ],
      },
    ],
  },
  {
    url: '/manuals/covfeature/conveniencefeatures.md',
    title: '편의기능',
  },
  {
    url: '/manuals/simulation/simulation.md',
    title: '시뮬레이션',
  },
  {
    url: '/manuals/varandconst/variablesandconstants.md',
    title: '변수와 상수',
  },
  {
    url: '/manuals/operators/operators.md',
    title: '연산자',
  },
  {
    url: '/manuals/innerfunc/innerfunction.md',
    title: '내장함수',
  },
  { url: '/manuals/glossary.md', title: '용어설명' },
  {
    url: '/manuals/tipsandtricks.md',
    title: '팁과 트릭',
  },
]

export { navigator }
