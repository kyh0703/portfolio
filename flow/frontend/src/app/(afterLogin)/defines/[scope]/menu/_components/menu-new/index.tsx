'use client'

import { Button } from '@/app/_components/button'
import { Modal } from '@/app/_components/modal'
import type { MenuCheckOption } from '@/models/define'
import { useModalStore } from '@/store/modal'
import { Separator } from '@/ui/separator'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import MenuForm from '../menu-form'
import MenuOptionsModal from '../menu-option-modal'
import {
  defaultControlOption,
  defaultTrackingOption,
} from '../menu-option-modal/constants'

export default function MenuNew({ scope }: { scope: string }) {
  const router = useRouter()
  const openModal = useModalStore((state) => state.openModal)
  const [checkOption, setCheckOption] = useState<MenuCheckOption>({
    ...defaultTrackingOption,
    ...defaultControlOption,
  })

  const handleSubmitOptions = (options: MenuCheckOption) => {
    setCheckOption(options)
  }

  return (
    <>
      <Modal id="menu-modal" title="Menu check Options">
        <MenuOptionsModal
          checkOption={checkOption}
          onSubmit={handleSubmitOptions}
        />
      </Modal>
      <div className="flex h-full w-full flex-col">
        <div className="flex w-full items-start justify-between p-6">
          <h2 className="flex-1">Menu definition - Menu Tree</h2>
          <div className="flex gap-14">
            <div>
              <Button
                variant="secondary3"
                size="full"
                onClick={() => openModal('menu-modal', null)}
              >
                Menu Options
              </Button>
            </div>
            <Button variant="secondary2" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex h-full w-full overflow-hidden">
          <div className="flex h-full w-[300px] p-10">
            <Button
              className="flex w-full justify-start text-2xl text-blue-700"
              variant="link"
            >
              Create Menu
            </Button>
          </div>
          <Separator orientation="vertical" />
          <div className="flex h-full w-full overflow-hidden">
            <MenuForm scope={scope} checkOption={checkOption} rootId={0} />
          </div>
        </div>
      </div>
    </>
  )
}
