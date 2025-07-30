<script setup>
import { computed } from 'vue'
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  labelPosition: {
    type: String,
    default: 'right',
  },
  value: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])
const model = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emit('update:modelValue', val)
  },
})
</script>

<template>
  <label
    class="flex items-center gap-x-2"
    :class="{
      'cursor-not-allowed opacity-50': disabled,
      'flex-row': labelPosition === 'right',
      'flex-row-reverse': labelPosition === 'left',
    }"
  >
    <input
      v-model="model"
      type="radio"
      :disabled="disabled"
      :name="name"
      :value="value"
      class="h-4 w-4 border-gray-300 isac-text-blue"
    >

    <span
      v-if="label"
      class="text-sm font-medium text-gray-900 leading-6 pt-0.5"
    >
      {{ label }}
    </span>

    <slot />
  </label>
</template>

<style scoped>

</style>
