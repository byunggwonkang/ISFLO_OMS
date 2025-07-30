<script setup>
import { ref } from 'vue';
import { DatePicker } from 'v-calendar';

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD'
  },
});

const masks = ref({
  modelValue: props.format,
})
</script>

<template>
  <DatePicker
    v-if="!disabled"
    v-bind="$attrs"
    :masks="masks"
    :disabled="disabled"
  >
    <template #default="{ inputValue, togglePopover }">
      <FormTextInput
        :value="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @click="togglePopover"
      />
    </template>
  </DatePicker>
  <FormTextInput
    v-else
    disabled
  />
</template>

<style scoped>

</style>
