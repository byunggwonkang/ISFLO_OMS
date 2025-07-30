<script setup>
defineProps({
  disableClickable: {
    type: Boolean,
    default: false,
  },
  hideCheckbox: {
    type: Boolean,
    default: false,
  },
})

import { inject } from 'vue'
const striped = inject('striped', false)
const verticalLine = inject('verticalLine', false)
const clickable = inject('clickable', false)
const checkable = inject('checkable', false)
</script>

<template>
  <tr
    :class="{
      'even:bg-gray-50': striped,
      'divide-x divide-gray-200': verticalLine,
      'cursor-pointer hover:bg-gray-100': clickable && !disableClickable,
    }"
  >
    <TableCell v-if="checkable && !hideCheckbox">
      <slot name="checkbox">
        <FormCheckbox />
      </slot>
    </TableCell>
    <slot />
  </tr>
</template>

<style scoped>

</style>
