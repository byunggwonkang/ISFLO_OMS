<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'secondary',
  },
  pill: {
    type: Boolean,
    default: false,
  },
  flat: {
    type: Boolean,
    default: false,
  },
  dot: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
});

const colorVariants = computed(() => ({
  'primary': props.flat ? 'bg-indigo-100 text-indigo-700 ring-indigo-400' : 'bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-300/50',
  'secondary': props.flat ? 'bg-gray-100 text-gray-700 ring-gray-400' : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-300/50',
  'success': props.flat ? 'bg-green-100 text-green-700 ring-green-400' : 'bg-green-50 text-green-600 ring-1 ring-inset ring-green-300/50',
  'danger': props.flat ? 'bg-red-100 text-red-700 ring-red-400' : 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-300/50',
  'warning': props.flat ? 'bg-yellow-100 text-yellow-700 ring-yellow-400' : 'bg-yellow-50 text-yellow-600 ring-1 ring-inset ring-yellow-300/50',
  'info': props.flat ? 'bg-blue-100 text-blue-700 ring-blue-400' : 'bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-300/50',
}));

const dotColorVariants = computed(() => ({
  'primary': 'fill-indigo-400',
  'secondary': 'fill-gray-400',
  'success': 'fill-green-400',
  'danger': 'fill-red-400',
  'warning': 'fill-yellow-400',
  'info': 'fill-blue-400',
}));

const badgeClasses = computed(() => [
  'inline-flex items-center gap-x-1.5',
  props.pill ? 'rounded-full' : 'rounded-md',
  colorVariants.value[props.variant],
  `px-2 py-1`,
  'text-xs font-medium',
]);
</script>

<template>
  <span
    :class="badgeClasses"
  >
    <slot
      v-if="dot"
      name="dot"
    >
      <svg
        class="h-1.5 w-1.5"
        :class="dotColorVariants[color]"
        viewBox="0 0 6 6"
        aria-hidden="true"
      >
        <circle
          cx="3"
          cy="3"
          r="3"
        />
      </svg>
    </slot>
    <slot>
      {{ label }}
    </slot>
  </span>
</template>

<style scoped>

</style>
