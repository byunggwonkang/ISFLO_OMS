<script setup>
import { inject } from "vue";

defineProps({
  value: {
    type: String,
    required: false,
    default: null
  }
});

const error = inject('error', false);
</script>

<template>
  <label
    class="block font-medium text-sm"
    :class="[error ? 'text-red-600' : 'text-gray-700']"
  >
    <span v-if="value">{{ value }}</span>
    <span v-else><slot /></span>
  </label>
</template>
