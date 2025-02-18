'use client'

import Label from '@/app/_components/label'
import { RadioGroup, RadioGroupItem } from '@/app/_components/radio-group'
import { useUserContext } from '@/store/context'
import { useDefineStore } from '@/store/define'
import type { DefineScope } from '@/types/define'
import { useRouter } from 'next/navigation'
import { useShallow } from 'zustand/react/shallow'
import { defineItems } from './types'

export default function DefineScopeButton() {
  const router = useRouter()
  const { type: flowType } = useUserContext()
  const [scope, setScope, page, resetPage] = useDefineStore(
    useShallow((state) => [
      state.scope,
      state.setScope,
      state.page,
      state.resetPage,
    ]),
  )

  const handleChange = (value: string) => {
    const defaultPage: Record<DefineScope, string> = {
      common: 'ment',
      global: 'var',
    }

    const scope = value as DefineScope
    setScope(scope)

    const matchedItem = defineItems.find(
      (item) => item.scope === scope && item.name.toLowerCase() === page,
    )

    const targetPage = matchedItem
      ? matchedItem.name.toLocaleLowerCase()
      : defaultPage[scope]

    router.push(`/defines/${scope}/${targetPage}`)
    if (!matchedItem) {
      resetPage(scope)
    }
  }

  return (
    <RadioGroup
      className="flex flex-col gap-3"
      defaultValue={scope}
      onValueChange={handleChange}
    >
      {flowType === 'ivr' && (
        <div className="flex gap-3">
          <RadioGroupItem id="common" value="common" />
          <Label htmlFor="common" className="text-truncate">
            Tenant Dependent
          </Label>
        </div>
      )}
      <div className="flex gap-3">
        <RadioGroupItem id="global" value="global" />
        <Label htmlFor="global" className="text-truncate">
          Service Dependent
        </Label>
      </div>
    </RadioGroup>
  )
}
