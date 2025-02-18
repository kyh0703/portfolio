import type { DefineScope } from '@/types/define'

export type DefineItem = {
  scope: DefineScope
  name: string
  supportRoute?: boolean
  supportBeginner?: boolean
}

export const defineItems: DefineItem[] = [
  {
    scope: 'common',
    name: 'Ment',
    supportBeginner: true,
  },
  {
    scope: 'common',
    name: 'Packet',
  },
  {
    scope: 'global',
    name: 'Var',
    supportRoute: true,
    supportBeginner: true,
  },
  {
    scope: 'global',
    name: 'Menu',
    supportBeginner: true,
  },
  {
    scope: 'global',
    name: 'Ment',
    supportBeginner: true,
  },
  {
    scope: 'global',
    name: 'Packet',
  },
  {
    scope: 'global',
    name: 'Intent',
    supportBeginner: true,
  },
  {
    scope: 'global',
    name: 'Log',
    supportRoute: true,
  },
  {
    scope: 'global',
    name: 'UserFunc',
    supportRoute: true,
    supportBeginner: true,
  },
  {
    scope: 'global',
    name: 'CDR',
  },
  {
    scope: 'global',
    name: 'Track',
    supportBeginner: true,
  },
  {
    scope: 'global',
    name: 'Service',
  },
  {
    scope: 'global',
    name: 'String',
    supportRoute: true,
  },
  {
    scope: 'global',
    name: 'MenuStat',
  },
]
