'use client'

import { ModalProvider } from '@/contexts/modal-context'
import { useModalStore } from '@/store/modal'
import { cn } from '@/utils/cn'
import { Suspense, useEffect, type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { useShallow } from 'zustand/react/shallow'
import { Button } from '../button'
import { XIcon } from '../icon'
import Spinner from '../spinner'

type ModalProps = {
  id: string
  title?: string
  className?: string
} & PropsWithChildren

const Modal = ({ id, title = '', className, children }: ModalProps) => {
  const [isOpen, closeModal] = useModalStore(
    useShallow((state) => [state.modal[id], state.closeModal]),
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal(id)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [id, closeModal])

  return isOpen
    ? createPortal(
        <ModalProvider id={id}>
          <section className="fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-dialog-overlay animate-in fade-in-10">
            <div
              className={cn(
                'w-2/6',
                'flex flex-col items-center justify-center gap-5',
                'bg-dialog p-7 text-dialog-foreground',
                'rounded-sm',
                className,
              )}
            >
              <div className="flex w-full items-center justify-between">
                <h1 className={cn('font-poppins text-xl font-semibold')}>
                  {title}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => closeModal(id)}
                >
                  <XIcon />
                </Button>
              </div>
              <div className="w-full">
                <Suspense fallback={<Spinner />}>{children}</Suspense>
              </div>
            </div>
          </section>
        </ModalProvider>,
        document.body,
      )
    : null
}

const ModalContent = ({ children }: PropsWithChildren) => (
  <div className="z-10 h-full max-h-[440px] w-full overflow-y-scroll whitespace-pre-line rounded-sm bg-[#F9F9F9] p-5 dark:bg-[#272C31]">
    {children}
  </div>
)

const ModalAction = ({ children }: PropsWithChildren) => (
  <div className="mt-5 flex w-full justify-end gap-4">{children}</div>
)

export { Modal, ModalAction, ModalContent }
