<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { XMarkIcon } from "@heroicons/vue/24/outline";

const workingSpaceData = useTabsStore();
const router = useRouter();
const route = useRoute();

const goToRoute = (tab) => {
  workingSpaceData.setCurrentTab(tab)
  router.push(tab.href)
}

const checkIfTabIsOverflow = (tab) => {
  return workingSpaceData.getOverflowTabs.some((overflowTab) => {
    return overflowTab.key === tab.key
  })
}
</script>

<template>
  <div class="max-w-screen relative isac-bg-gray">
    <!-- Tabs -->
    <div
      ref="workingSpaceMenuBar"
      class="flex px-4 h-11 gap-x-1"
      role="tablist"
      aria-label="Tabs"
    >
      <WorkingMenuTab
        hide-close-button
        :tab="{
          name: 'Home',
          href: '/app/',
          key: 'home',
          component: 'Dashboard',
          group: 'home'
        }"
      />

      <WorkingMenuTab
        v-if="checkIfTabIsOverflow(workingSpaceData.getCurrentTab)"
        :tab="workingSpaceData.getCurrentTab"
      />

      <WorkingMenuTab
        v-for="tab in workingSpaceData.getOpenTabs.filter((tab) => tab !== 'Dashboard')"
        :id="tab.key"
        :key="tab.key"
        ref="workingSpaceMenuTabs"
        :tab="tab"
      />
    </div>

    <div
      v-if="workingSpaceData.getOpenTabs.length"
      class="fixed right-8 top-14 mt-3 inline-flex space-x-2"
    >
      <!-- Overflow Tabs -->
      <Menu
        v-if="workingSpaceData.getOverflowTabs.length"
        as="div"
        class="relative inline-block text-left"
      >
        <div>
          <MenuButton class="flex items-center divide-x divide-black align-middle gap-x-2 content-between bg-white px-2 py-1 text-base font-normal cursor-pointer text-center relative rounded-t">
            <span class="leading-0 text-sm">
              {{ workingSpaceData.getOverflowTabs.length }}+
            </span>

            <ChevronDownIcon
              class="h-6 w-6"
              aria-hidden="true"
            />
          </MenuButton>
        </div>
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <MenuItems
            class="absolute right-0 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
          >
            <div class="px-1 py-1">
              <MenuItem
                v-for="tab in workingSpaceData.getOverflowTabs"
                :key="tab.key"
                as="div"
                class="flex justify-between items-center"
              >
                <button
                  :class="[
                    'group flex w-full items-center rounded-md px-2 py-2 text-xs hover:text-blue-600',
                    {
                      'isac-text-blue': route.path === tab.href,
                    }
                  ]"
                  @click="(e) => {
                    e.stopPropagation();
                    goToRoute(tab)
                  }"
                >
                  {{ tab.name }}
                </button>

                <span
                  class="inline-flex items-center rounded-md font-medium isac-text-blue mr-2 cursor-pointer"
                  @click="(e) => {
                    e.stopPropagation();
                    workingSpaceData.removeFromOverflowTabs(tab)
                  }"
                >
                  <XMarkIcon
                    class="h-4 w-4 hover:text-red-500"
                    aria-hidden="true"
                  />
                </span>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>

      <!-- Close All Tabs -->
      <div
        class="flex items-center px-2 py-1 rounded-t bg-white cursor-pointer"
        title="Close All Tabs"
        @click="workingSpaceData.clearAllTabs()"
      >
        <XMarkIcon
          class="h-6 w-5 hover:text-red-500"
          title="Close All Tabs"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
