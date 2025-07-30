<script setup>
import { computed, useSlots, provide } from 'vue';
const props = defineProps({
  border: {
    type: Boolean,
    default: true
  },
  suffixClass: {
    type: String,
    default: ''
  },
  prefixClass: {
    type: String,
    default: ''
  },
  errorText: {
    type: String,
    default: ''
  },
  helperText: {
    type: String,
    default: ''
  },
  horizontal: {
    type: Boolean,
    default: false
  },
  gap: {
    type: String,
    default: 'md'
  },
  label: {
    type: String,
    default: ''
  },
  labelId: {
    type: String,
    default: ''
  },
  labelFor: {
    type: String,
    default: ''
  },
  labelLeft: {
    type: Boolean,
    default: true
  },
  labelWidth: {
    type: String,
    default: 'w-1/4'
  },
  inputWidth: {
    type: String,
    default: 'w-3/4'
  },
});
const slots = useSlots();
provide('error', props.errorText?.length || slots.error);

const showError = computed(() => {
  return props.errorText?.length || slots.error;
});

const showHelper = computed(() => {
  return props.helperText || slots.helper;
});

const gapXSize = computed(() => ({
  'xs': 'gap-x-0.5',
  'sm': 'gap-x-1',
  'md': 'gap-x-2',
  'lg': 'gap-x-2.5',
  'xl': 'gap-x-3',
  '2xl': 'gap-x-4',
}));

const gapYSize = computed(() => ({
  'xs': 'gap-y-0.5',
  'sm': 'gap-y-1',
  'md': 'gap-y-2',
  'lg': 'gap-y-2.5',
  'xl': 'gap-y-3',
  '2xl': 'gap-y-4',
}));
</script>

<template>
  <div
    :class="{
      'space-y-2': !horizontal,
    }"
  >
    <div
      :class="[
        'flex',
        {
          'flex-col': !horizontal,
          'flex-row items-center': horizontal
        },
        horizontal ? gapXSize[gap] : gapYSize[gap]
      ]"
    >
      <slot name="label">
        <div
          v-if="label"
          :class="[
            horizontal ? labelWidth : ''
          ]"
        >
          <label
            :id="labelId"
            class="font-medium text-xs"
            :class="[
              showError ? 'text-red-600' : 'text-gray-700',
              {
                'text-right': !labelLeft,
              }
            ]"
            :for="labelFor"
          >
            {{ label }}
          </label>
        </div>
      </slot>

      <div
        :class="[
          horizontal ? inputWidth : ''
        ]"
      >
        <div
          class="flex relative rounded-md isac-from-group"
        >
          <div
            v-if="slots.prefix"
            class="absolute inset-y-0 left-0 flex items-center justify-center w-10"
            :class="[
              {
                'border-r': border,
              },
              prefixClass
            ]"
          >
            <slot name="prefix" />
          </div>
          <div
            class="w-full"
            :class="{
              'prefix': slots.prefix,
              'suffix': slots.suffix,
            }"
          >
            <slot />
          </div>
          <div
            v-if="slots.suffix"
            class="absolute inset-y-0 right-0 flex items-center justify-center w-10"
            :class="[
              {
                'border-l': border
              },
              suffixClass
            ]"
          >
            <slot name="suffix" />
          </div>
        </div>
      </div>
    </div>

    <p
      v-if="showError"
      class="text-sm text-red-600"
      :class="{
        'text-right': horizontal,
      }"
    >
      <slot name="error">
        {{ errorText }}
      </slot>
    </p>
    <p
      v-if="showHelper"
      class="text-sm text-gray-500"
      :class="{
        'text-right': horizontal,
      }"
    >
      <slot name="helper">
        {{ helperText }}
      </slot>
    </p>
  </div>
</template>

<style lang="scss">
.isac-from-group {
  .prefix {
    input {
      padding-left: 3rem;
    }
  }

  .suffix {
    input {
      padding-right: 3rem;
    }
  }
}
</style>
