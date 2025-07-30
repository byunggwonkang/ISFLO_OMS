<script setup lang="ts">
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon, FunnelIcon } from '@heroicons/vue/20/solid'

defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  divider: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const slots = useSlots()
</script>

<template>
  <div class="p-3">
    <!-- Header section -->
    <div
      v-if="slots.button"
      class="sm:flex sm:items-center"
    >
      <!-- Button slot section -->
      <div
        v-if="slots.button"
        class="inline-flex items-center gap-x-2"
      >
        <slot name="button" />
      </div>
    </div>

    <!-- Loading skeleton loader -->
    <div
      v-if="loading"
      class="h-screen p-3 space-y-3"
    >
      <SkeletonLoader
        v-if="slots.filtersInDropdown || slots.filters"
        class="w-full h-14 rounded"
      />
      <SkeletonLoader class="w-full h-96 rounded" />
    </div>

    <!-- Main content section -->
    <div
      v-else
      class="flow-root mb-12 h-fit"
      :class="{
        'mt-6': slots.button,
        'divide-y divide-gray-200': divider,
        'space-y-3' : !divider
      }"
    >
      <div v-if="slots.filtersInDropdown || slots.filters">
        <!-- Filters section -->
        <div
          :class="{
            'mb-3': slots.filtersInDropdown || slots.filters,
            'flex justify-between': slots.filtersInDropdown && slots.filters,
            'flex justify-end': slots.filtersInDropdown && !slots.filters
          }"
        >
          <slot name="filters" />

          <!-- Filters dropdown using Headless UI Menu component -->
          <Menu
            v-if="slots.filtersInDropdown"
            as="div"
            class="relative inline-block text-left"
          >
            <div>
              <!-- Button to trigger the dropdown -->
              <MenuButton class="inline-flex w-full justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                <FunnelIcon class="h-5 w-5" />
                <ChevronDownIcon
                  class="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
                  aria-hidden="true"
                />
              </MenuButton>
            </div>
            <!-- Dropdown content with transition effect -->
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems class="absolute right-0 mt-2 min-w-md origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-20 w-80">
                <div class="px-1 py-1">
                  <slot name="filtersInDropdown" />
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>

      <div class="space-y-3">
        <!-- Default slot content -->
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Your scoped styles go here if needed */
</style>
