import { createStore } from './store'

interface ModalState {
  modal: Record<string, boolean>
  data: any
  openModal: (id: string, data: any) => void
  closeModal: (id: string) => void
}

export const useModalStore = createStore<ModalState>(
  (set) => ({
    modal: {},
    data: null,
    openModal: (id, data) =>
      set((state) => ({
        modal: { ...state.modal, [id]: true },
        data,
      })),
    closeModal: (id) =>
      set((state) => ({
        modal: { ...state.modal, [id]: false },
        data: null,
      })),
  }),
  {
    name: 'modalStore',
  },
)
