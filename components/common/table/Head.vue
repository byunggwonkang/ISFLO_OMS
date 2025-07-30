<script setup>
import {inject} from "vue";
const verticalLine = inject('verticalLine', false)
const checkable = inject('checkable', false)
defineProps({
  hideCheckbox: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <thead>
    <tr
      :class="{
        'divide-x divide-gray-200': verticalLine,
      }"
    >
      <TableHeadCell v-if="checkable && !hideCheckbox">
        <slot name="checkbox">
          <FormCheckbox />
        </slot>
      </TableHeadCell>
      <slot />
    </tr>
  </thead>
</template>

<style scoped>

</style>
