<script setup>
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  TransitionChild,
  TransitionRoot
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

const { currentWorkingSpace } = useGetCurrentWorkingSpaceFromUrl();

const auth = useAuthStore();
const menus = useMenusStore();
const sidebar = useSidebarStore();
const workingSpaceData = useTabsStore();
const navigation = menus.getUserMenus;
const { currentTab } = storeToRefs(workingSpaceData);

const selectedGroupMenus = ref([]);
const selectedMenuGroup = ref(currentWorkingSpace.value?.group || navigation[0]?.key);

const onClickMenuGroup = (key) => {
  selectedMenuGroup.value = navigation.find(item => item.key === key)?.key || navigation[0]?.key;
  selectedGroupMenus.value = navigation.find(item => item.key === key)?.children || navigation[0]?.children || [];
};

watch(currentTab, (newValue) => {
  if (!auth.isAuthenticated) {
    navigateTo('/auth/login')
  }

  if (newValue) {
    onClickMenuGroup(newValue.group);
    sidebar.closeMobileSidebar();
  }
});

onMounted(() => {
  onClickMenuGroup(currentWorkingSpace.value?.group || navigation[0]?.key);
});
</script>

<template>
  <div>
    <TransitionRoot
      as="template"
      :show="sidebar.isMobileSidebarOpen"
    >
      <Dialog
        as="div"
        class="relative z-50 lg:hidden"
        @close="sidebar.closeMobileSidebar()"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    class="-m-2.5 p-2.5"
                    @click="sidebar.closeMobileSidebar()"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon
                      class="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </TransitionChild>

              <!-- Sidebar component -->
              <div class="flex grow flex-col overflow-y-auto shadow-md bg-white">
                <div class="flex h-14 shrink-0 items-center border-b border-black px-6 pb-1.5 pt-1">
                  <AppLogo
                    class="h-8 w-auto bg-white"
                  />
                </div>

                <AppCollpaseBar
                  hide-header-bar
                  hide-toggle-sidebar
                >
                  <template #vertical-menus>
                    <ul
                      role="list"
                      class="flex min-w-full flex-none gap-x-1 text-sm font-semibold leading-6 text-gray-400"
                    >
                      <li
                        v-for="tab in navigation"
                        :key="tab.name"
                        class="rotate-180"
                      >
                        <p
                          :class="tab.key === selectedMenuGroup ? 'isac-bg-gray text-white' : 'text-gray-700 hover:bg-gray-50'"
                          class="cursor-pointer pt-1 px-4 rounded-t leading-6 -mb-1 text-xs"
                          @click="onClickMenuGroup(tab.key)"
                        >
                          {{ tab.name }}
                        </p>
                      </li>
                    </ul>
                  </template>

                  <template #horizontal-menus>
                    <ul
                      role="list"
                      class="flex flex-1 flex-col gap-y-7"
                    >
                      <li>
                        <ul
                          role="list"
                          class="space-y-1 mt-2 divide-y divide-gray-500"
                        >
                          <li
                            v-for="item in selectedGroupMenus"
                            :key="item.name"
                            class="transition-all duration-500 px-1.5 py-2"
                          >
                            <p
                              v-if="!item.children"
                              :class="['text-white hover:bg-gray-50', 'block rounded-md py-1 pr-2 pl-10 text-xs leading-6 font-semibold']"
                              @click="workingSpaceData.addTab(item)"
                            >
                              {{ item.name }}
                            </p>

                            <transition
                              enter-active-class="transition duration-100 ease-out delay-300"
                              enter-from-class="transform scale-95 opacity-0"
                              enter-to-class="transform scale-100 opacity-100"
                              leave-active-class="transition duration-75 ease-in"
                              leave-from-class="transform scale-100 opacity-100"
                              leave-to-class="transform scale-95 opacity-0"
                            >
                              <Disclosure
                                v-if="!sidebar.isDesktopSidebarOpen && item.children"
                                v-slot="{ open }"
                                as="div"
                                default-open
                                class="w-full"
                              >
                                <DisclosureButton :class="['text-gray-700', 'flex items-center w-full text-left rounded-md px-1 py-1.5 gap-x-3 text-sm leading-6 justify-between']">
                                  <div class="inline-flex gap-x-2 text-white font-black text-base">
                                    <img
                                      :src="`/icons/${item.code}.svg`"
                                      alt="Image"
                                      class="rounded-full"
                                    >
                                    <span class="truncate">
                                      {{ item.name }}
                                    </span>
                                  </div>
                                  <ChevronRightIcon
                                    :class="[open ? 'rotate-90 text-white' : 'text-white', 'h-5 w-5 shrink-0']"
                                    aria-hidden="true"
                                  />
                                </DisclosureButton>
                                <ul
                                  v-if="open"
                                  class="mt-1 pl-6"
                                >
                                  <li
                                    v-for="subItem in item.children"
                                    :key="subItem.name"
                                  >
                                    <p
                                      :class="[subItem.component === currentTab.component ? 'text-white isac-active-bg' : 'isac-text-gray hover:text-white', 'block rounded-md py-1.5 pr-2 pl-3 text-xs leading-4 font-extrabold cursor-pointer']"
                                      @click="workingSpaceData.addTab(subItem)"
                                    >
                                      {{ subItem.name }}
                                    </p>
                                  </li>
                                </ul>
                              </Disclosure>
                            </transition>

                            <transition
                              enter-active-class="transition duration-100 ease-out delay-300"
                              enter-from-class="transform scale-95 opacity-0"
                              enter-to-class="transform scale-100 opacity-100"
                              leave-active-class="transition duration-75 ease-in"
                              leave-from-class="transform scale-100 opacity-100"
                              leave-to-class="transform scale-95 opacity-0"
                            >
                              <Menu
                                v-if="sidebar.isDesktopSidebarOpen && item.children"
                                v-slot="{ open }"
                                as="div"
                                class="relative inline-block"
                              >
                                <div class="p-3">
                                  <MenuButton
                                    v-tooltip="{
                                      content: item.name,
                                      placement: 'right',
                                      trigger: 'hover',
                                      distance: 10,
                                      delay: 100,
                                      popperClass: 'bg-black text-white rounded-md'
                                    }"
                                    class="flex items-center"
                                  >
                                    <img
                                      :src="`/icons/${item.code}.svg`"
                                      alt="Image"
                                      :class="[
                                        'border rounded-full w-12',
                                        open || currentWorkingSpace.parentKey === item.key ? 'border-white' : 'border-gray-400'
                                      ]"
                                    >
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
                                    as="div"
                                    class="absolute right-0 top-2 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                                    :class="[
                                      'transform translate-x-full',
                                    ]"
                                  >
                                    <MenuItem
                                      v-for="subItem in item.children"
                                      :key="subItem.name"
                                    >
                                      <div class="p-1">
                                        <p
                                          :class="[subItem.component === currentTab.component ? 'isac-text-blue' : 'text-gray-700 hover:bg-gray-50', 'block rounded-md py-1.5 pr-2 pl-3 text-sm leading-4 cursor-pointer']"
                                          @click="workingSpaceData.addTab(subItem)"
                                        >
                                          {{ subItem.name }}
                                        </p>
                                      </div>
                                    </MenuItem>
                                  </MenuItems>
                                </transition>
                              </Menu>
                            </transition>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </template>
                </AppCollpaseBar>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div
      class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col border-r border-gray-500 transition-all duration-300"
      :class="[
        sidebar.isDesktopSidebarOpen ? 'w-30' : 'lg:w-64 2xl:w-66'
      ]"
    >
      <!-- Sidebar component -->
      <div class="flex grow flex-col shadow-md">
        <div class="flex h-14 shrink-0 items-center border-b border-black px-6 pb-1.5">
          <AppLogo class="w-auto" />
        </div>

        <AppCollpaseBar
          hide-header-bar
        >
          <template #vertical-menus>
            <ul
              role="list"
              class="flex min-w-full flex-none gap-x-1 text-sm font-semibold leading-6 text-gray-400"
            >
              <li
                v-for="tab in navigation"
                :key="tab.name"
                class="rotate-180"
              >
                <p
                  :class="tab.key === selectedMenuGroup ? 'isac-bg-gray text-white' : 'text-gray-700 hover:bg-gray-50'"
                  class="cursor-pointer pt-1 px-4 rounded-t leading-6 -mb-1 text-xs"
                  @click="onClickMenuGroup(tab.key)"
                >
                  {{ tab.name }}
                </p>
              </li>
            </ul>
          </template>

          <template #horizontal-menus>
            <ul
              role="list"
              class="flex flex-1 flex-col gap-y-7"
            >
              <li>
                <ul
                  role="list"
                  class="space-y-1 mt-2 divide-y divide-gray-500"
                >
                  <li
                    v-for="item in selectedGroupMenus"
                    :key="item.name"
                    class="transition-all duration-500 px-1.5 py-2"
                  >
                    <p
                      v-if="!item.children"
                      :class="['text-white hover:bg-gray-50', 'block rounded-md py-1 pr-2 pl-10 text-xs leading-6 font-semibold']"
                      @click="workingSpaceData.addTab(item)"
                    >
                      {{ item.name }}
                    </p>

                    <transition
                      enter-active-class="transition duration-100 ease-out delay-300"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-75 ease-in"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                      <Disclosure
                        v-if="!sidebar.isDesktopSidebarOpen && item.children"
                        v-slot="{ open }"
                        as="div"
                        default-open
                        class="w-full"
                      >
                        <DisclosureButton :class="['text-gray-700', 'flex items-center w-full text-left rounded-md px-1 py-1.5 gap-x-3 text-sm leading-6 justify-between']">
                          <div class="inline-flex gap-x-2 text-white font-black text-base">
                            <img
                              :src="`/icons/${item.code}.svg`"
                              alt="Image"
                              class="rounded-full"
                            >
                            <span class="truncate">
                              {{ item.name }}
                            </span>
                          </div>
                          <ChevronRightIcon
                            :class="[open ? 'rotate-90 text-white' : 'text-white', 'h-5 w-5 shrink-0']"
                            aria-hidden="true"
                          />
                        </DisclosureButton>
                        <ul
                          v-if="open"
                          class="mt-1 pl-6"
                        >
                          <li
                            v-for="subItem in item.children"
                            :key="subItem.name"
                          >
                            <p
                              :class="[subItem.component === currentTab.component ? 'text-white isac-active-bg' : 'isac-text-gray hover:text-white', 'block rounded-md py-1.5 pr-2 pl-3 text-xs leading-4 font-extrabold cursor-pointer']"
                              @click="workingSpaceData.addTab(subItem)"
                            >
                              {{ subItem.name }}
                            </p>
                          </li>
                        </ul>
                      </Disclosure>
                    </transition>

                    <transition
                      enter-active-class="transition duration-100 ease-out delay-300"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-75 ease-in"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                      <Menu
                        v-if="sidebar.isDesktopSidebarOpen && item.children"
                        v-slot="{ open }"
                        as="div"
                        class="relative inline-block"
                      >
                        <div class="p-3">
                          <MenuButton
                            v-tooltip="{
                              content: item.name,
                              placement: 'right',
                              trigger: 'hover',
                              distance: 10,
                              delay: 100,
                              popperClass: 'bg-black text-white rounded-md'
                            }"
                            class="flex items-center"
                          >
                            <img
                              :src="`/icons/${item.code}.svg`"
                              alt="Image"
                              :class="[
                                'border rounded-full w-12',
                                open || currentWorkingSpace.parentKey === item.key ? 'border-white' : 'border-gray-400'
                              ]"
                            >
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
                            as="div"
                            class="absolute right-0 top-2 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                            :class="[
                              'transform translate-x-full',
                            ]"
                          >
                            <MenuItem
                              v-for="subItem in item.children"
                              :key="subItem.name"
                            >
                              <div class="p-1">
                                <p
                                  :class="[subItem.component === currentTab.component ? 'isac-text-blue' : 'text-gray-700 hover:bg-gray-50', 'block rounded-md py-1.5 pr-2 pl-3 text-sm leading-4 cursor-pointer']"
                                  @click="workingSpaceData.addTab(subItem)"
                                >
                                  {{ subItem.name }}
                                </p>
                              </div>
                            </MenuItem>
                          </MenuItems>
                        </transition>
                      </Menu>
                    </transition>
                  </li>
                </ul>
              </li>
            </ul>
          </template>
        </AppCollpaseBar>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
