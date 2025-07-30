<script setup>
import { Bars3Icon } from "@heroicons/vue/24/outline";

const sidebar = useSidebarStore();
const workingSpaceData = useTabsStore();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const emit = defineEmits(['toggle'])

const logout = async () => {
  const {success} = authStore.logout();
  if (success) {
    useTabsStore().clearAllTabs();
    await navigateTo('/auth/login');
  }
}
</script>

<template>
  <div class="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-x-4 border-b border-black bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
    <button
      type="button"
      class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
      @click="sidebar.openMobileSidebar()"
    >
      <span class="sr-only">Open sidebar</span>
      <Bars3Icon
        class="h-6 w-6"
        aria-hidden="true"
      />
    </button>

    <!-- Separator -->
    <div
      class="h-14 w-px bg-black lg:hidden"
      aria-hidden="true"
    />

    <div class="lg:hidden pb-1.5 -mx-2">
      <AppLogo
        class="h-8 w-auto"
      />
    </div>

    <div class="hidden lg:block -mx-3">
      <p class="text-black">
        <span class="text-gray-400 font-extralight ml-1">eCommerce Fulfillment Automation</span>
      </p>
    </div>

    <div class="flex flex-1 gap-x-5 justify-end items-center lg:gap-x-5">
      <div class="flex items-center justify-end space-x-3">
        <!-- Profile dropdown -->
        <div v-if="user">
          <p
            class="flex items-center cursor-pointer"
          >
            <span class="sr-only">Open user menu</span>
            <span class="hidden lg:flex lg:items-center">
              <span
                class="mr-4 text-sm font-semibold leading-6 text-gray-900"
                aria-hidden="true"
              >
                {{ user.USER_DISP_NAME }}
              </span>
            </span>
            <!-- <img
              v-tooltip="{
                content: 'Profile',
                placement: 'bottom',
                trigger: 'hover',
                distance: 10,
                delay: 100,
                popperClass: 'bg-black text-white rounded-md text-sm'
              }"
              src="/assets/img/icons/profile.svg"
              alt="Profile"
            > -->
          </p>
        </div>

        <!-- Help -->
        <!--<div>
          <a
            href="https://help.cgk-isac.com"
            target="_blank"
            class="cursor-pointer"
          >
            <img
              v-tooltip="{
                content: 'Help',
                placement: 'bottom',
                trigger: 'hover',
                distance: 10,
                delay: 100,
                popperClass: 'bg-black text-white rounded-md text-sm'
              }"
              src="/assets/img/icons/help.svg"
              alt="Help"
            >
          </a>
        </div>-->

        <!-- Support -->
        <div>
          <a
            href="http://988.co.kr/isware"
            target="_blank"
            class="cursor-pointer"
          >
            <img
              v-tooltip="{
                content: 'Support',
                placement: 'bottom',
                trigger: 'hover',
                distance: 10,
                delay: 100,
                popperClass: 'bg-black text-white rounded-md text-sm'
              }"
              src="/assets/img/icons/support.svg"
              alt="Support"
            >
          </a>
        </div>
      </div>

      <div class="flex items-center justify-end space-x-3">
        <!-- Notifications dropdown 
        <div class="relative">
          <p
            class="flex items-center relative text-gray-400 hover:text-gray-500 cursor-pointer"
            @click="workingSpaceData.addTab({
              name: 'Notice',
              key: 'notice',
              href: '/app/',
              component: 'RF000300',
              group:'sa-group',
            })"
          >
            <span class="sr-only">View Notice</span>
            <img
              v-tooltip="{
                content: 'Notice',
                placement: 'bottom',
                trigger: 'hover',
                distance: 10,
                delay: 100,
                popperClass: 'bg-black text-white rounded-md text-sm'
              }"
              src="/assets/img/icons/notification.svg"
              alt="Notifications"
            >-->

        <!-- Notification badge -->
        <!--  <span class="flex absolute h-3 w-3 -top-0.5 right-0">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
          </p>
        </div>
        -->
        <!-- Full screen -->
        <div
          class="cursor-pointer"
          @click="emit('toggle')"
        >
          <img
            v-tooltip="{
              content: 'Full Screen',
              placement: 'bottom',
              trigger: 'hover',
              distance: 10,
              delay: 100,
              popperClass: 'bg-black text-white rounded-md text-sm'
            }"
            src="/assets/img/icons/fullscreen.svg"
            alt="Full Screen"
          >
        </div>

        <!-- Logout -->
        <div
          class="cursor-pointer"
          @click="logout"
        >
          <img
            v-tooltip="{
              content: 'Logout',
              placement: 'bottom',
              trigger: 'hover',
              distance: 10,
              delay: 100,
              popperClass: 'bg-black text-white rounded-md text-sm'
            }"
            src="/assets/img/icons/logout.svg"
            alt="Logout"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
