<script setup>
import {computed, inject, ref} from 'vue'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  sortable: {
    type: Boolean,
    default: false
  },
})

const sort = ref('asc')

const emit = defineEmits([
  'sortChanged'
])

const onClick = () => {
  if (!props.sortable) return

  if (sort.value === 'asc') {
    sort.value = 'desc'
  } else {
    sort.value = 'asc'
  }
  emit('sortChanged', sort.value)
}

const sticky = inject('sticky', false)
const condensed = inject('condensed', false)
const headerVariant = inject('headerVariant', 'white')

const headerColorVariants = computed(() => ({
    'primary': 'bg-indigo-600 text-white',
    'secondary': 'bg-gray-200 text-gray-600',
    'success': 'bg-green-600 text-white',
    'danger': 'bg-red-600 text-white',
    'warning': 'bg-yellow-600 text-white',
    'info': 'bg-blue-600 text-white',
    'light': 'isac-bg-lighter text-gray-600',
    'dark': 'bg-gray-800 text-white',
    'white': 'bg-white text-gray-600',
}))
</script>

<template>
  <th
    scope="col"
    class="px-3 text-left text-sm font-semibold"
    :class="[
      headerColorVariants[headerVariant],
      {
        'sticky top-0 z-10': sticky,
        'py-2': !condensed,
        'py-1': condensed,
      }
    ]"
    @click="onClick"
  >
    <slot v-if="!sortable" />

    <div
      v-if="sortable"
      :class="{
        'group inline-flex cursor-pointer': sortable,
      }"
    >
      <slot />

      <slot
        v-if="sortable"
        name="sortIcon"
      >
        <span class="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
          <ChevronDownIcon
            v-if="sort === 'asc'"
            class="h-5 w-5"
            aria-hidden="true"
          />
          <ChevronUpIcon
            v-else-if="sort === 'desc'"
            class="h-5 w-5"
            aria-hidden="true"
          />
        </span>
      </slot>
    </div>
  </th>
</template>

<style scoped>

</style>
