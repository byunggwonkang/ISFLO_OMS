import { defineStore } from 'pinia';

interface Tab {
  name: string;
  key: string;
  href: string;
  component: string;
  group?: string;
}

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    openTabs: [] as Tab[],
    currentTab: {} as Tab,
    overflowTabs: [] as Tab[],
    maxTabs: 9,
  }),
  getters: {
    getOpenTabs: (state: { openTabs: Tab[] }) => state.openTabs,
    getCurrentTab: (state: { currentTab: Tab }) => state.currentTab,
    getOverflowTabs: (state: { overflowTabs: Tab[] }) => state.overflowTabs,
  },
  actions: {
    // Add a new tab to openTabs or overflowTabs based on the maxTabs limit
    addTab(tab: Tab) {
      this.setCurrentTab(tab);
      if (!this.checkTab(tab)) {
        if (this.openTabs.length >= this.maxTabs) {
          this.overflowTabs.push(tab);
        } else {
          this.openTabs.push(tab);
        }
      }
    },
    // Set the current tab
    setCurrentTab(tab: Tab) {
      this.currentTab = tab;
    },
    // Remove a tab from openTabs or overflowTabs
    removeTab(tab: Tab) {
      this.removeFromTabs(tab, this.openTabs);

      if (this.checkCurrentTab(tab)) {
        this.setCurrentTab(this.openTabs[this.openTabs.length - 1]);
      }

      if (this.openTabs.length < 1) {
        this.setHomeTab()
      }
    },
    // Remove a tab from the specified CS array
    removeFromTabs(tab: Tab, tabs: Tab[]) {
      const index = tabs.findIndex((t) => t.key === tab.key);
      if (index !== -1) {
        tabs.splice(index, 1);
        // If openTabs is below maxTabs, move a tab from overflowTabs to openTabs
        if (tabs === this.openTabs && this.openTabs.length < this.maxTabs && this.overflowTabs.length > 0) {
          const overflowTab = this.overflowTabs.shift();
          this.openTabs.push(overflowTab!);
        }
      }
    },
    // Check if a tab is in openTabs or overflowTabs
    checkTab(tab: Tab) {
      return this.openTabs.some((t: Tab) => t.key === tab.key) || this.overflowTabs.some((t: Tab) => t.key === tab.key);
    },
    // Check if the provided tab is the current tab
    checkCurrentTab(tab: Tab) {
      return this.getCurrentTab.key === tab.key;
    },
    // Set the maxTabs value and recheck CS to comply with the new limit
    setMaxTabs(maxTabs: number) {
      this.maxTabs = maxTabs;
      this.recheckTabs();
    },
    // Recheck CS based on the updated maxTabs
    recheckTabs() {
      // Check if there are overflowTabs and openTabs is below maxTabs
      while (this.openTabs.length < this.maxTabs && this.overflowTabs.length > 0) {
        const overflowTab = this.overflowTabs.shift();
        this.openTabs.push(overflowTab!);
      }

      // Check if openTabs exceeds maxTabs, move excess CS to overflowTabs
      while (this.openTabs.length > this.maxTabs) {
        const overflowTab = this.openTabs.pop();
        if (overflowTab) {
          this.overflowTabs.unshift(overflowTab);
        }
      }
    },
    // Remove a tab from overflowTabs
    removeFromOverflowTabs(tab: Tab) {
      this.removeFromTabs(tab, this.overflowTabs);
      if (this.checkCurrentTab(tab) && this.overflowTabs.length > 0) {
        this.setCurrentTab(this.overflowTabs[this.overflowTabs.length - 1]);
      } else {
        this.setCurrentTab(this.openTabs[this.openTabs.length - 1]);
      }
    },
    // Remove all CS from openTabs and overflowTabs
    clearAllTabs() {
      this.openTabs = [];
      this.overflowTabs = [];
      // this.currentTab = {} as Tab;

      this.setHomeTab()
    },
    setHomeTab() {
      this.setCurrentTab({
        name: 'Home',
        href: '/app/',
        key: 'home',
        component: 'Dashboard',
        group: 'home'
      })
    }
  }
});
