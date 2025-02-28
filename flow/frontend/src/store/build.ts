import {
  BuildProgress,
  BuildResult,
  MessageLog,
  StatusLog,
} from '@/models/build'
import { createStore } from './store'

interface BuildState {
  build: {
    isBuilding: boolean
    isStopping: boolean
    messages: (BuildProgress<MessageLog> | BuildResult)[]
    status: BuildProgress<StatusLog> | null
  }
  compile: {
    isCompiling: boolean
    messages: (BuildProgress<MessageLog> | BuildResult)[]
  }
  startBuild: (resetMessage: boolean) => void
  startBuildStop: () => void
  resetBuildMessage: () => void
  appendBuildMessages: (message: BuildProgress<MessageLog>) => void
  doneBuild: (result: BuildResult) => void
  setBuildStatus: (status: BuildProgress<StatusLog>) => void
  startCompile: () => void
  resetCompileMessage: () => void
  appendCompileMessages: (message: BuildProgress<MessageLog>) => void
  doneCompile: (result: BuildResult) => void
}

export const useBuildStore = createStore<BuildState>(
  (set) => ({
    build: {
      isBuilding: false,
      isStopping: false,
      messages: [],
      status: null,
    },
    compile: {
      isCompiling: false,
      messages: [],
    },
    startBuild: (resetMessage: boolean) =>
      set((state) => ({
        build: {
          ...state.build,
          isBuilding: true,
          messages: resetMessage ? [] : state.build.messages,
        },
      })),
    startBuildStop: () =>
      set((state) => {
        state.build.isStopping = true
      }),
    resetBuildMessage: () =>
      set((state) => {
        state.build.messages = []
      }),
    appendBuildMessages: (message) =>
      set((state) => {
        state.build.messages.push(message)
      }),
    doneBuild: (result: BuildResult) =>
      set((state) => {
        state.build = {
          ...state.build,
          isBuilding: false,
          isStopping: false,
          messages: [...state.build.messages, result],
        }
      }),
    setBuildStatus: (status) =>
      set((state) => ({
        build: {
          ...state.build,
          status,
        },
      })),
    startCompile: () => set({ compile: { isCompiling: true, messages: [] } }),
    resetCompileMessage: () =>
      set((state) => {
        state.compile.messages = []
      }),
    appendCompileMessages: (message) =>
      set((state) => {
        state.compile.messages.push(message)
      }),
    doneCompile: (result: BuildResult) =>
      set((state) => {
        state.compile = {
          isCompiling: false,
          messages: [...state.compile.messages, result],
        }
      }),
  }),
  {
    name: 'buildStore',
  },
)
