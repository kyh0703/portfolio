import { Button } from '@/app/_components/button'
import { ModalAction, ModalContent } from '@/app/_components/modal'
import { useModalId } from '@/contexts/modal-context'
import { useModalStore } from '@/store/modal'
import { AlertTriangle } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

type ConfirmModalProps = {
  onSubmit: () => void
}

export default function ConfirmModal({ onSubmit }: ConfirmModalProps) {
  const id = useModalId()
  const closeModal = useModalStore(useShallow((state) => state.closeModal))
  const handleCancelClick = () => {
    closeModal(id)
  }

  const handleSubmit = () => {
    closeModal(id)
    onSubmit && onSubmit()
  }

  return (
    <>
      <ModalContent>
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-center gap-4 text-destructive">
            <AlertTriangle className="h-8 w-8" />
            <h2 className="text-lg font-semibold">
              flowName version에 import하시는게 맞습니까?
            </h2>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            데이터가 중복으로 들어갈 수 있으니 주의해야 합니다.
          </p>
        </div>
      </ModalContent>
      <ModalAction>
        <Button variant="error" onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          OK
        </Button>
      </ModalAction>
    </>
  )
}
