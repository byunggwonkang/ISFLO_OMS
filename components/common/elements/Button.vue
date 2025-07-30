<script setup>
import { computed } from 'vue'
const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'gray'
  },
  size: {
    type: String,
    default: 'sm'
  },
  rounded: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  border: {
    type: Boolean,
    default: false
  },
})

const roundedClass = computed(() => ({
  'xs': 'rounded',
  'sm': 'rounded',
  'md': 'rounded-md',
  'lg': 'rounded-md',
  'xl': 'rounded-md',
}));

const sizeClass = computed(() => ({
  'xs': 'px-2.5 py-1.5 text-xs',
  'sm': 'px-3 py-2 text-sm leading-4',
  'md': 'px-4 py-2 text-sm',
  'lg': 'px-4 py-2 text-base',
  'xl': 'px-6 py-3 text-base',
}));

const colorVariants = computed(() => ({
  'secondary': 'text-gray-800 bg-gray-100 hover:bg-gray-200 focus:ring-gray-400',
  'primary': 'text-white isac-bg-blue hover:bg-indigo-500 focus:ring-indigo-400',
  'success': 'text-white bg-green-600 hover:bg-green-500 focus:ring-green-400',
  'danger': 'text-white bg-red-600 hover:bg-red-500 focus:ring-red-400',
  'warning': 'text-white bg-yellow-600 hover:bg-yellow-500 focus:ring-yellow-400',
  'info': 'text-white bg-blue-600 hover:bg-blue-500 focus:ring-blue-400',
  'white': 'text-gray-800 bg-white hover:bg-gray-50 focus:ring-gray-400',
  'gray': 'text-white isac-bg-gray hover:bg-gray-600 focus:ring-gray-400',
}));

const disabledColorVariants = computed(() => ({
  'secondary': 'text-gray-400 bg-gray-100 cursor-not-allowed disabled:opacity-50',
  'primary': 'text-white bg-indigo-400 cursor-not-allowed disabled:opacity-50',
  'success': 'text-white bg-green-400 cursor-not-allowed disabled:opacity-50',
  'danger': 'text-white bg-red-400 cursor-not-allowed disabled:opacity-50',
  'warning': 'text-white bg-yellow-400 cursor-not-allowed disabled:opacity-50',
  'info': 'text-white bg-blue-400 cursor-not-allowed disabled:opacity-50',
  'white': 'text-white bg-gray-400 cursor-not-allowed disabled:opacity-50',
  'gray': 'text-white isac-bg-gray cursor-not-allowed disabled:opacity-50',
}));

const loadingColorVariants = computed(() => ({
  'secondary': 'text-gray-400 bg-gray-100 cursor-wait',
  'primary': 'text-white bg-indigo-400 cursor-wait',
  'success': 'text-white bg-green-400 cursor-wait',
  'danger': 'text-white bg-red-400 cursor-wait',
  'warning': 'text-white bg-yellow-400 cursor-wait',
  'info': 'text-white bg-blue-400 cursor-wait',
  'white': 'text-white bg-gray-400 cursor-wait',
  'gray': 'text-white isac-bg-gray cursor-wait',
}));

const borderColorVariants = computed(() => ({
  'secondary': 'ring-1 ring-inset ring-gray-300',
  'primary': 'ring-1 ring-inset ring-indigo-600',
  'success': 'ring-1 ring-inset ring-green-600',
  'danger': 'ring-1 ring-inset ring-red-600',
  'warning': 'ring-1 ring-inset ring-yellow-600',
  'info': 'ring-1 ring-inset ring-blue-600',
  'white': 'ring-1 ring-inset ring-gray-300',
  'gray': 'ring-1 ring-inset ring-gray-300',
}));

const buttonClasses = computed(() => [
  'inline-flex justify-center items-center gap-x-1.5 font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50',
  props.rounded ? roundedClass.value[props.size] : '',
  colorVariants.value[props.variant],
  props.disabled ? disabledColorVariants.value[props.value] : '',
  props.loading ? loadingColorVariants.value[props.value] : '',
  sizeClass.value[props.size],
  props.border ? borderColorVariants.value[props.variant] : '',
]);
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
  >
    <slot
      v-if="loading"
      name="loading"
    >
      <svg
        class="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </slot>

    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<style scoped>

</style>
