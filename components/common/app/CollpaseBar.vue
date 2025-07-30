<script setup>
defineProps({
  hideHeaderBar: {
    type: Boolean,
    default: false,
  },
  hideToggleSidebar: {
    type: Boolean,
    default: false,
  },
})
const sidebar = useSidebarStore();
</script>

<template>
  <div class="relative">
    <div class="flex flex-col">
      <div
        v-if="!hideHeaderBar"
        class="h-11"
      >
        <div class="h-full flex items-center justify-end px-3">
          <svg
            class="cursor-pointer"
            :class="{
              'transform rotate-180': sidebar.isDesktopSidebarOpen
            }"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            @click="sidebar.toggleDesktopSidebar()"
          >
            <path
              d="M6.26868 0.000725897C6.15482 0.00521704 6.0472 0.0539353 5.96879 0.136533L0.348982 6.11306C-0.116327 6.60844 -0.116327 7.39292 0.348982 7.8883L5.96879 13.8613C6.04819 13.9463 6.15814 13.9961 6.27446 13.9998C6.39066 14.0035 6.50355 13.9607 6.58822 13.8811L7.83838 12.7056C7.92324 12.6261 7.97304 12.5162 7.97675 12.3999C7.98047 12.2837 7.93769 12.1708 7.85801 12.0862L3.07117 6.9972L7.85801 1.91495C7.93769 1.8303 7.98046 1.71744 7.97675 1.60125C7.97304 1.48497 7.92324 1.37504 7.83838 1.29565L6.58822 0.11674C6.5018 0.0364871 6.38647 -0.0053976 6.26871 0.000558438L6.26868 0.000725897ZM12.2917 0.00160458V0.00150695C12.1776 0.00580264 12.0696 0.0546189 11.991 0.137411L6.3719 6.11394C5.90659 6.60932 5.90659 7.3938 6.3719 7.88918L11.991 13.8622V13.8621C12.0703 13.9463 12.1797 13.9956 12.2954 13.9993C12.411 14.0029 12.5233 13.9607 12.6078 13.8817L13.8613 12.7063C13.9462 12.6268 13.9958 12.5168 13.9993 12.4005C14.0029 12.2843 13.96 12.1714 13.8802 12.087L9.09083 6.99798L13.8802 1.91573C13.9602 1.83118 14.0033 1.71812 13.9998 1.60176C13.9963 1.48528 13.9465 1.37515 13.8613 1.29558L12.6113 0.117448C12.5247 0.037293 12.4095 -0.0045917 12.2918 0.00126686L12.2917 0.00160458Z"
              fill="black"
            />
          </svg>
        </div>
      </div>

      <div
        class="flex gap-1 pl-3"
        :class="{
          'border-t border-black': !hideHeaderBar
        }"
      >
        <div class="w-6 shrink-0 relative">
          <nav class="flex py-2 rotate-90">
            <slot name="vertical-menus" />
          </nav>
        </div>
        <div class="isac-bg-gray w-full">
          <nav
            class="flex flex-col h-screen mx-auto pb-32"
            :class="{
              'overflow-y-auto': !sidebar.isDesktopSidebarOpen,
            }"
          >
            <slot name="horizontal-menus" />
          </nav>
        </div>
      </div>
    </div>

    <div
      v-if="!hideToggleSidebar"
      class="isac-bg-gray fixed h-10 bottom-0 z-50 transition-all duration-300"
      :class="[
        sidebar.isDesktopSidebarOpen ? 'ml-10 w-[5rem]' : 'lg:ml-10 lg:w-[13.5rem] 2xl:w-[14.5rem]'
      ]"
    >
      <div class="border-t border-r border-gray-500 h-full">
        <div class="h-full flex items-center justify-end pb-1 px-3">
          <svg
            class="cursor-pointer"
            :class="{
              'transform rotate-180': sidebar.isDesktopSidebarOpen
            }"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            @click="sidebar.toggleDesktopSidebar()"
          >
            <path
              d="M6.26868 0.000725897C6.15482 0.00521704 6.0472 0.0539353 5.96879 0.136533L0.348982 6.11306C-0.116327 6.60844 -0.116327 7.39292 0.348982 7.8883L5.96879 13.8613C6.04819 13.9463 6.15814 13.9961 6.27446 13.9998C6.39066 14.0035 6.50355 13.9607 6.58822 13.8811L7.83838 12.7056C7.92324 12.6261 7.97304 12.5162 7.97675 12.3999C7.98047 12.2837 7.93769 12.1708 7.85801 12.0862L3.07117 6.9972L7.85801 1.91495C7.93769 1.8303 7.98046 1.71744 7.97675 1.60125C7.97304 1.48497 7.92324 1.37504 7.83838 1.29565L6.58822 0.11674C6.5018 0.0364871 6.38647 -0.0053976 6.26871 0.000558438L6.26868 0.000725897ZM12.2917 0.00160458V0.00150695C12.1776 0.00580264 12.0696 0.0546189 11.991 0.137411L6.3719 6.11394C5.90659 6.60932 5.90659 7.3938 6.3719 7.88918L11.991 13.8622V13.8621C12.0703 13.9463 12.1797 13.9956 12.2954 13.9993C12.411 14.0029 12.5233 13.9607 12.6078 13.8817L13.8613 12.7063C13.9462 12.6268 13.9958 12.5168 13.9993 12.4005C14.0029 12.2843 13.96 12.1714 13.8802 12.087L9.09083 6.99798L13.8802 1.91573C13.9602 1.83118 14.0033 1.71812 13.9998 1.60176C13.9963 1.48528 13.9465 1.37515 13.8613 1.29558L12.6113 0.117448C12.5247 0.037293 12.4095 -0.0045917 12.2918 0.00126686L12.2917 0.00160458Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
