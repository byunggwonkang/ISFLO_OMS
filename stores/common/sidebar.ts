import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    mobileSidebarOpen: false,
    desktopSidebarOpen: false,
  }),
  getters: {
    isMobileSidebarOpen: (state) => state.mobileSidebarOpen,
    isDesktopSidebarOpen: (state) => state.desktopSidebarOpen,
  },
  actions: {
    toggleMobileSidebar() {
      this.mobileSidebarOpen = !this.mobileSidebarOpen
    },
    closeMobileSidebar() {
      this.mobileSidebarOpen = false
    },
    openMobileSidebar() {
      this.mobileSidebarOpen = true
    },
    toggleDesktopSidebar() {
      this.desktopSidebarOpen = !this.desktopSidebarOpen
    },
    closeDesktopSidebar() {
      this.desktopSidebarOpen = false
    },
    openDesktopSidebar() {
      this.desktopSidebarOpen = true
    },
  },
});
