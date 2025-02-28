'use client'

import { ModalAction, ModalContent } from '@/app/_components/modal'
import { useModalId } from '@/contexts/modal-context'
import { useModalStore } from '@/store/modal'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '../button'

export default function AlertModal() {
  const id = useModalId()
  const [data, closeModal] = useModalStore(
    useShallow((state) => [state.data as string, state.closeModal]),
  )

  return (
    <>
      <ModalContent>{data}</ModalContent>
      <ModalAction>
        <Button onClick={() => closeModal(id)}>확인</Button>
      </ModalAction>
    </>
  )
}
