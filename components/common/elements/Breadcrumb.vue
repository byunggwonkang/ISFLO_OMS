<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid'

defineProps({
  pages: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <nav
    class="flex bg-white"
    aria-label="Breadcrumb"
  >
    <ol
      role="list"
      class="flex w-full max-w-screen-xl space-x-4"
    >
      <li
        v-for="(page, index) in pages"
        :key="page.name"
        class="flex"
      >
        <div class="flex items-center">
          <ChevronRightIcon
            v-if="index !== 0"
            class="h-5 w-5 flex-shrink-0 text-gray-400"
            aria-hidden="true"
          />
          <span
            class="text-sm font-medium text-gray-500 hover:text-gray-700"
            :class="{
              'ml-4 ' : index !== 0
            }"
          >
            {{ page.name }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<style scoped>

</style>
