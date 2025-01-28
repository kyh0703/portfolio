'use client'

import Label from '@/app/_components/label'
import { RadioGroup, RadioGroupItem } from '@/app/_components/radio-group'
import { useDefineStore } from '@/store/define'
import type { DefineScope } from '@/types/define'
import { useRouter } from 'next/navigation'
import { useShallow } from 'zustand/react/shallow'
import { commonItems, globalItems } from './items'

export default function DefineScopeButton() {
  const router = useRouter()
  const [scope, setScope, page, resetPage] = useDefineStore(
    useShallow((state) => [
      state.scope,
      state.setScope,
      state.page,
      state.resetPage,
    ]),
  )

  const handleChange = (value: string) => {
    const scope = value as DefineScope
    setScope(scope)
    switch (scope) {
      case 'common':
        if (commonItems.includes(page)) {
          router.push(`/defines/${scope}/${page}`)
        } else {
          router.push(`/defines/${scope}/ment`)
          resetPage(scope)
        }
        break
      case 'global':
        if (globalItems.includes(page)) {
          router.push(`/defines/${scope}/${page}`)
        } else {
          router.push(`/defines/${scope}/var`)
          resetPage(scope)
        }
        break
    }
  }

  return (
    <RadioGroup
      className="flex flex-col gap-3"
      defaultValue={scope}
      onValueChange={handleChange}
    >
      <div className="flex gap-3">
        <RadioGroupItem id="common" value="common" />
        <Label htmlFor="common" className="text-truncate">
          Tenant Dependent
        </Label>
      </div>
      <div className="flex gap-3">
        <RadioGroupItem id="global" value="global" />
        <Label htmlFor="global" className="text-truncate">
          Service Dependent
        </Label>
      </div>
    </RadioGroup>
  )
}
