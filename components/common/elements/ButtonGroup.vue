<script setup>
defineProps({
  rounded: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <span
    :class="[
      'isolate inline-flex shadow-sm isac-btn-group',
      {
        'isac-rounded': rounded,
        'divide-x divide-gray-200': border
      }
    ]"
  >
    <slot />
  </span>
</template>

<style lang="scss">
.isac-btn-group {
  &.isac-rounded {
    :first-child {
      border-top-left-radius: 0.375rem;
      border-bottom-left-radius: 0.375rem;
    }

    :last-child {
      border-top-right-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
  }
}
</style>
