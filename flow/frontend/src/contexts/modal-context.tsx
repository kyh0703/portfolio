'use client'

import { createContext, useContext, type PropsWithChildren } from 'react'

type ModalState = {
  id: string
}

const ModalContext = createContext<ModalState | null>(null)

type ModalProviderProps = {
  id: string
} & PropsWithChildren

export const ModalProvider = ({ id, children }: ModalProviderProps) => {
  return (
    <ModalContext.Provider value={{ id }}>{children}</ModalContext.Provider>
  )
}

export const useModalId = () => {
  const state = useContext(ModalContext)
  if (!state) {
    throw new Error('useModalId must be used within a ModalProvider')
  }
  return state?.id
}
