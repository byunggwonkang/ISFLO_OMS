<script setup>
import { DocumentIcon } from "@heroicons/vue/24/solid";
const { currentTab } = storeToRefs(useTabsStore())
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? ''])
</script>

<template>
  <div class="space-y-3">
    <div
      id="drop-zone"
      class="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 z-50"
    >
      <div class="text-center">
        <DocumentIcon
          class="mx-auto h-12 w-12 text-gray-300"
          aria-hidden="true"
        />
        <div class="mt-4 flex text-sm leading-6 text-gray-600">
          <label
            for="file-upload"
            class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
          >
            <span>
              Upload a file
            </span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              class="sr-only"
            >
          </label>
          <p class="pl-1">
            or drag and drop
          </p>
        </div>
        <p class="text-sm leading-5 text-gray-600 font-black">
          Only .xlsx files are allowed
        </p>
      </div>
    </div>

    <div class="flex justify-between items-center pb-1">
      <p class="text-sm">
        {{ currentTab.component }}
      </p>

      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-30"
        disabled
      >
        {{ getComponentData('POP00100_BTN01001', 'caption', 'Upload') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
