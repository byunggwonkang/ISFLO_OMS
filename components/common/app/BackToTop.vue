<script setup lang="ts">
import { ArrowUpIcon } from "@heroicons/vue/24/solid";
import { TransitionRoot } from '@headlessui/vue'

defineProps({
  color: {
    type: String,
    default: 'gray',
  },
})

const show = ref(false);
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", () => {
    show.value = window.scrollY > 100;
  });
});
</script>

<template>
  <div class="fixed bottom-12 right-0 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
    <TransitionRoot
      :show="show"
      as="button"

      enter="transition ease-out duration-100"
      enter-from="transform opacity-0 scale-95"
      enter-to="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leave-from="transform opacity-100 scale-100"
      leave-to="transform opacity-0 scale-95"

      class="rounded-md p-2 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
      :class="[
        `isac-bg-gray hover:bg-${color}-500 focus-visible:outline-${color}-600`
      ]"
      @click="scrollToTop"
    >
      <slot name="icon">
        <ArrowUpIcon
          class="h-5 w-5"
          aria-hidden="true"
        />
      </slot>
    </TransitionRoot>
  </div>
</template>

<style scoped>

</style>
