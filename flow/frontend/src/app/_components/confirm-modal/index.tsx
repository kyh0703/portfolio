'use client'

import { ModalAction, ModalContent } from '@/app/_components/modal'
import { useModalId } from '@/contexts/modal-context'
import { useModalStore } from '@/store/modal'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '../button'

type ConfirmModalProps = {
  content: string
  onConfirm?: (data?: any) => void
  onCancel?: () => void
}

export default function ConfirmModal({
  content,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const id = useModalId()
  const [data, closeModal] = useModalStore(
    useShallow((state) => [state.data, state.closeModal]),
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        closeModal(id)
        onConfirm?.(data)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, closeModal])

  const handleOKClick = () => {
    closeModal(id)
    onConfirm?.(data)
  }

  const handleCancelClick = () => {
    closeModal(id)
    onCancel?.()
  }

  return (
    <>
      <ModalContent>{content}</ModalContent>
      <ModalAction>
        <Button variant="error" onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button onClick={handleOKClick}>OK</Button>
      </ModalAction>
    </>
  )
}
