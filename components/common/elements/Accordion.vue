<script setup>
import { computed } from 'vue';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/vue'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'

defineProps({
  border: {
    type: Boolean,
    default: false,
  },
  headerClass: {
    type: String,
    default: 'p-3 inline-flex items-center justify-between w-full',
  },
  bodyClass: {
    type: String,
    default: 'p-3',
  },
  divider: {
    type: Boolean,
    default: false,
  },
  headerVariant: {
    type: String,
    default: 'white',
  },
  defaultOpen: {
    type: Boolean,
    default: false,
  },
})

const headerColorVariants = computed(() => ({
  'primary': 'bg-indigo-600 text-white',
  'secondary': 'bg-gray-200 text-gray-600',
  'success': 'bg-green-600 text-white',
  'danger': 'bg-red-600 text-white',
  'warning': 'bg-yellow-600 text-white',
  'info': 'bg-blue-600 text-white',
  'light': 'bg-gray-100 text-gray-600',
  'dark': 'bg-gray-800 text-white',
  'white': 'bg-white text-gray-600',
}))
</script>

<template>
  <Disclosure
    v-slot="{ open }"
    :default-open="defaultOpen"
    as="div"
    :class="[
      {
        'overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg': border,
        'divide divide-y divide-gray-200': !divider,
      }
    ]"
  >
    <DisclosureButton
      :class="[headerClass, headerColorVariants[headerVariant]]"
    >
      <slot name="header" />

      <slot
        name="icon"
      >
        <ChevronRightIcon
          class="w-5 h-5"
          :class="open && 'rotate-90 transform'"
        />
      </slot>
    </DisclosureButton>

    <DisclosurePanel :class="bodyClass">
      <slot />
    </DisclosurePanel>
  </Disclosure>
</template>

<style scoped>

</style>
