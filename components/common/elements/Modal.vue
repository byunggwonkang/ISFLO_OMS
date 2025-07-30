<script setup>
import { computed } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'
import { XMarkIcon } from "@heroicons/vue/24/outline";

defineProps({
  show: {
    type: Boolean,
    required: true,
    default: false,
  },
  size: {
    type: String,
    required: false,
    default: 'md',
  },
  headerClass: {
    type: String,
    required: false,
    default: 'p-3',
  },
  bodyClass: {
    type: String,
    required: false,
    default: 'p-3',
  },
  footerClass: {
    type: String,
    required: false,
    default: 'p-3',
  },
  divider: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['close'])

const slots = useSlots()

const modalSizeClasses = computed(() => ({
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  '8xl': 'max-w-8xl',
  '9xl': 'max-w-9xl',
  '10xl': 'max-w-10xl',
  '11xl': 'max-w-11xl',
  '12xl': 'max-w-12xl',
  '13xl': 'max-w-13xl',
  '14xl': 'max-w-14xl',
}));

</script>

<template>
  <TransitionRoot
    appear
    :show="show"
    as="div"
  >
    <Dialog
      as="div"
      class="relative z-50"
      @close="emit('close')"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full transform rounded bg-white text-left align-middle transition-all"
              :class="[
                modalSizeClasses[size],
                {
                  'divide-y divide-gray-200': divider
                }
              ]"
            >
              <div
                :class="[
                  'relative',
                  headerClass
                ]"
              >
                <slot name="header" />

                <div>
                  <button
                    type="button"
                    class="absolute top-3 right-3 text-gray-400 hover:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300"
                    @click="emit('close')"
                  >
                    <span class="sr-only">Close</span>
                    <XMarkIcon
                      class="h-6 w-6"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <div
                v-if="slots.body"
                :class="[
                  bodyClass
                ]"
              >
                <slot name="body" />
              </div>

              <div
                v-if="slots.footer"
                :class="[
                  footerClass
                ]"
              >
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>

</style>
