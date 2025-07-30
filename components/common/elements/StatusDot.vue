<script setup>
import { computed } from 'vue'
defineProps({
  active: {
    type: Object,
    required: true
  },
  activeVariant: {
    type: String,
    default: 'success'
  },
  inactiveVariant: {
    type: String,
    default: 'danger'
  }
})

const colorVariants = computed(() => ({
  'primary': 'bg-indigo-700',
  'secondary': 'bg-gray-700',
  'success': 'bg-green-700',
  'danger': 'bg-red-500',
  'warning': 'bg-yellow-700',
  'info': 'bg-blue-700',
}));
</script>

<template>
  <span
    :class="[active ? colorVariants[activeVariant] : colorVariants[inactiveVariant], 'w-3 h-3 self-end rounded-full inline-block']"
  />
</template>

<style scoped>

</style>
