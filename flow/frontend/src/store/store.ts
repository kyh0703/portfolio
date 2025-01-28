import { create, StateCreator } from 'zustand'
import {
  devtools,
  persist,
  type DevtoolsOptions,
  type PersistOptions,
} from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export const createStore = <T extends object>(
  initializer: StateCreator<
    T,
    [['zustand/devtools', never], ['zustand/immer', never]]
  >,
  options: DevtoolsOptions,
) =>
  create<T, [['zustand/devtools', never], ['zustand/immer', never]]>(
    devtools(immer(initializer), options),
  )

export const createPersistStore = <T extends object, U = T>(
  initializer: StateCreator<
    T,
    [
      ['zustand/devtools', never],
      ['zustand/immer', never],
      ['zustand/persist', unknown],
    ]
  >,
  options: PersistOptions<T, U>,
) =>
  create<
    T,
    [
      ['zustand/devtools', never],
      ['zustand/immer', never],
      ['zustand/persist', unknown],
    ]
  >(
    devtools(immer(persist(initializer, options)), {
      ...options,
    }),
  )
