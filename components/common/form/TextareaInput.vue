<script setup>
import {inject, onMounted, ref} from 'vue';

defineProps({
  modelValue: {
    type: String,
    default: null
  },
  rows: {
    type: Number,
    default: 3
  }
});

defineEmits(['update:modelValue']);

const input = ref(null);

onMounted(() => {
  if (input.value.hasAttribute('autofocus')) {
    input.value.focus();
  }
});

defineExpose({ focus: () => input.value.focus() });

const error = inject('error', false);
</script>

<template>
  <textarea
    ref="input"
    class="py-1.5 rounded-md shadow-sm text-sm block w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
    :class="[error ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 border-red-300' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 placeholder:text-gray-400']"
    :value="modelValue"
    :rows="rows"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped>
textarea {
  resize: none;
}
</style>
