<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Array, Boolean, Object, String, Number],
    default: false,
  },
  value: {
    type: [String, Number, Boolean, Object, Array],
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  labelPosition: {
    type: String,
    default: 'right',
  },
  label: {
    type: String,
    default: '',
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);
const model = computed({
  get() {
    return props.modelValue;
  },

  set(val) {
    emit('update:modelValue', val);
  },
});
</script>

<template>
  <label
    :class="{
      'cursor-not-allowed opacity-50': disabled,
      'flex-row': labelPosition === 'right',
      'flex-row-reverse': labelPosition === 'left',
      'flex items-center gap-x-2': label
    }"
  >
    <input
      v-model="model"
      type="checkbox"
      :value="value"
      :disabled="disabled"
      :checked="checked"
      class="rounded border-gray-300 isac-text-gray shadow-sm"
    >

    <span
      v-if="label"
      class="font-medium text-xs text-gray-900 leading-6 pt-0.5"
    >
      {{ label }}
    </span>

    <slot />
  </label>
</template>
