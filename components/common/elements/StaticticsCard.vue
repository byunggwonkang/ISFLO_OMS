<script setup>
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'gray'
  },
})

const colorVariants = computed(() => ({
  'gray': 'isac-bg-gray',
  'primary': 'isac-bg-blue',
  'success': 'bg-green-600',
  'danger': 'bg-red-600',
  'warning': 'bg-yellow-600',
  'info': 'bg-blue-600',
  'white': 'bg-white',
  'black': 'bg-black',
}));

const cardClass = computed(() => [
  'rounded-md flex items-center justify-between p-3',
  colorVariants.value[props.variant],
]);

const slots = useSlots()
</script>

<template>
  <div :class="cardClass">
    <div>
      <p class="text-sm text-white">
        {{ label }}
      </p>
      <p class="text-4xl font-bold text-white">
        {{ value }}
      </p>
    </div>
    <div
      v-if="slots.chart"
      class="chart"
    >
      <slot name="chart" />
    </div>
  </div>
</template>

<style>
.chart > canvas {
  width: 50px !important;
  height: 50px !important;
}
</style>
