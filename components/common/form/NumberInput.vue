<script setup>
import InputNumber from 'primevue/inputnumber';
import {computed, inject, ref} from "vue";

defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md'
  },
});

const input = ref(null);

const inputSizes = computed(() => ({
  '2xl': 'py-4 text-2xl',
  'xl': 'py-3 text-base',
  'lg': 'py-2 text-sm',
  'md': 'py-2 text-xs',
  'sm': 'py-1 text-xs',
  'xs': 'py-0.5 text-xs',
}));

const error = inject('error', false);
</script>

<template>
  <InputNumber
    ref="input"
    class="w-full"
    :input-class="[
      'rounded-md shadow-sm block w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100',
      error ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 border-red-300' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 placeholder:text-gray-400',
      inputSizes[size],
    ]"
    :aria-invalid="error"
    :disabled="disabled"
    :aria-disabled="disabled"
  />
</template>

<style scoped>

</style>
