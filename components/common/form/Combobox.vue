<script setup>
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot
} from "@headlessui/vue";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/vue/20/solid";
import {computed, ref} from "vue";

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select an option',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  notFoundText: {
    type: String,
    default: 'Nothing found',
  },
})


const query = ref('')

const filteredOptions = computed(() =>
  query.value === ''
    ? props.options
    : props.options.filter((option) =>
          option.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(query.value.toLowerCase().replace(/\s+/g, ''))
    )
)
</script>

<template>
  <Combobox>
    <div class="relative">
      <div
        class="relative border border-gray-300 w-full cursor-default overflow-hidden rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
      >
        <ComboboxInput
          class="w-full border-none py-1.5 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
          :class="{
            'cursor-not-allowed bg-gray-50': disabled,
          }"
          :display-value="(option) => option.name"
          :disabled="disabled"
          :placeholder="placeholder"
          @change="query = $event.target.value"
        />
        <ComboboxButton
          :disabled="disabled"
          class="absolute inset-y-0 right-0 flex items-center pr-2"
          :class="{
            'cursor-not-allowed opacity-50': disabled,
          }"
        >
          <ChevronUpDownIcon
            class="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>
      </div>
      <TransitionRoot
        leave="transition ease-in duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          v-if="options.length > 0"
          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-20"
        >
          <div
            v-if="filteredOptions.length === 0 && query !== ''"
            class="relative cursor-default select-none px-4 py-2 text-gray-700"
          >
            {{ notFoundText }}
          </div>

          <ComboboxOption
            v-for="option in filteredOptions"
            :key="option.value"
            v-slot="{ selected, active }"
            as="template"
            :value="option"
          >
            <li
              class="cursor-default select-none py-2 flex justify-between items-center px-4"
              :class="{
                'isac-bg-gray text-white': active,
                'text-gray-900': !active,
              }"
            >
              <span
                class="block truncate"
                :class="{
                  'font-medium': selected,
                  'font-normal': !selected
                }"
              >
                {{ option.name }}
              </span>
              <span
                v-if="selected"
                :class="{
                  'text-white': active,
                  'text-teal-600': !active
                }"
              >
                <CheckIcon
                  class="h-5 w-5"
                  aria-hidden="true"
                />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<style scoped>

</style>
