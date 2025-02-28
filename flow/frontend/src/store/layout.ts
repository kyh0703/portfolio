import { createJSONStorage } from 'zustand/middleware'
import { createPersistStore } from './store'

export type NavigationItem =
  | 'component'

type LeftSidebar = {
  open: boolean
  width: number
}

type Footer = {
  action: 'up' | 'down'
  trigger: boolean
}

export type FooterTab = 'log'

interface LayoutState {
  nav: NavigationItem
  footer: Footer
  leftSidebar: LeftSidebar
  footerTab: FooterTab
  setNav(nav: NavigationItem): void
  toggleLeftSidebar(): void
  setLeftSidebarWidth(width: number): void
  triggerFooter: (action: 'up' | 'down') => void
  setFooterTab: (tab: FooterTab) => void
}

export const useLayoutStore = createPersistStore<LayoutState>(
  (set) => ({
    nav: 'component',
    footer: {
      action: 'down',
      trigger: false,
    },
    leftSidebar: {
      open: true,
      width: 0,
    },
    footerTab: 'log',
    setNav(nav) {
      set({ nav })
    },
    toggleLeftSidebar: () =>
      set((state) => ({
        leftSidebar: { ...state.leftSidebar, open: !state.leftSidebar.open },
      })),
    setLeftSidebarWidth: (width: number) =>
      set((state) => ({
        leftSidebar: { ...state.leftSidebar, width },
      })),
    triggerFooter: (action) =>
      set((state) => ({
        footer: {
          action,
          trigger: !state.footer.trigger,
        },
      })),
    setFooterTab: (tab) => set({ footerTab: tab }),
  }),
  {
    name: 'layoutStore',
    storage: createJSONStorage(() => sessionStorage),
  },
)
