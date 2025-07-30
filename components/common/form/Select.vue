<script setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  modelValue: {
    type: [Object, Array],
    default: () => null
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Select option'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  maxItems: {
    type: Number,
    default: 5
  },
  dropUp: {
    type: Boolean,
    default: false,
  },
  visibleRows: { 
    type: Number, 
    default: null 
  },
});

const emit = defineEmits(['update:modelValue']);

const getSelectedItemsName = (items) => {
  if (items.length > props.maxItems) {
      return `${items.length} items selected`;
  }

  return items.map((item) => item.name).join(', ');
};
</script>

<template>
  <Listbox
    as="div"
    class="relative w-full"
    :multiple="multiple"
    :disabled="disabled"
    :model-value="modelValue"
    by="value"
    @update:model-value="value => emit('update:modelValue', value)"
  >
    <ListboxButton
      :disabled="disabled"
      class="relative w-full cursor-default rounded-md py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      :class="{
        'cursor-not-allowed bg-gray-50 text-gray-600': disabled,
        'bg-white text-gray-900 ': !disabled,
      }"
    >
      <slot name="placeholder">
        <div
          v-if="!multiple"
          class="overflow-x-auto"
        >
          <span class="block truncate">
            {{ modelValue?.name || placeholder }}
          </span>
        </div>
        <div
          v-if="multiple"
          class="overflow-x-auto"
        >
          <span class="block truncate">
            {{ modelValue?.length ? getSelectedItemsName(modelValue) : placeholder }}
          </span>
        </div>
      </slot>
      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronUpDownIcon
          class="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </span>
    </ListboxButton>

    <transition
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ListboxOptions 
        :class="[
          'absolute z-20 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
          dropUp ? 'bottom-full mb-1' : 'top-full mt-1'
        ]"
        :style="visibleRows ? { maxHeight: `${visibleRows * 2.5}rem` } : {}"
      >
        <ListboxOption
          v-for="(option, index) in options"
          :key="index"
          v-slot="{ active, selected }"
          as="template"
          :value="option"
        >
          <li
            :class="[
              active ? 'isac-bg-gray text-white' : 'text-gray-900',
              'relative cursor-default select-none py-2 pl-3 pr-9',
              {
                'flex gap-x-3 items-center' : multiple
              }
            ]"
          >
            <slot
              v-if="multiple"
              name="checkbox"
              :selected="selected"
            >
              <FormCheckbox
                :model-value="selected"
              />
            </slot>

            <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ option.name }}</span>

            <span
              v-if="selected && !multiple"
              :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']"
            >
              <CheckIcon
                class="h-5 w-5"
                aria-hidden="true"
              />
            </span>
          </li>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>

<style scoped>

</style>
