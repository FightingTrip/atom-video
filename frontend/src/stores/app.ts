import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useAppStore = defineStore('app', {
  state: () => ({
    isSidebarCollapsed: useStorage('sidebar-collapsed', false),
    isDrawerOpen: false,
  }),

  actions: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen;
    },
  },
});
