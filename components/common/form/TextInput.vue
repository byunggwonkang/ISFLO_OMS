<script setup>
import {inject, onMounted, ref} from 'vue';

defineProps({
  modelValue: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md'
  },
  mask: {
    type: String,
    default: ''
  },
  autocomplete: {
    type: String,
    default: "on"
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

const inputSizes = computed(() => ({
  '2xl': 'py-4 text-2xl',
  'xl': 'py-3 text-base',
  'lg': 'py-2 text-sm',
  'md': 'py-2 text-xs',
  'sm': 'py-1 text-xs',
  'xs': 'py-0.5 text-xs',
}));
</script>

<template>
  <input
    ref="input"
    v-maska
    class="rounded-md shadow-sm block w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
    :class="[
      error ? 'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500 border-red-300' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 placeholder:text-gray-400',
      inputSizes[size],
    ]"
    :value="modelValue"
    :aria-invalid="error"
    :disabled="disabled"
    :aria-disabled="disabled"
    :data-maska="mask"
    :autocomplete="autocomplete"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>
