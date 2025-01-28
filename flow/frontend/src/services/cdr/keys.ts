import { CdrType } from '@/constants/options'

export const cdrKeys = {
  all: (type: CdrType) => ['cdr', type] as const,
}
