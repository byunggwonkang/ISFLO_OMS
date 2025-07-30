<script setup>
import { inject } from 'vue'
defineProps({
  makeCondensed: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
})
const condensed = inject('condensed', false)
</script>

<template>
  <td
    :class="[
      className,
      {
        'whitespace-nowrap px-3 text-sm text-gray-500': !className,
        'py-2': condensed && !className,
        'py-3': !condensed && !className,
      },
    ]"
  >
    <slot />
  </td>
</template>

<style scoped>

</style>
