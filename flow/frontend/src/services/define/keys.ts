import type { DefineType } from '@/types/define'

export const defineKeys = {
  all: (type: DefineType) => ['define', type] as const,
  detail: (defineId: number) => ['define', defineId] as const,
  detailByString: (defineId: string) => ['define', defineId] as const,
}
