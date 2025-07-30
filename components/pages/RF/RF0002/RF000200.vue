<script setup>
import { ChevronLeftIcon, ChevronRightIcon} from '@heroicons/vue/20/solid'
import { ref } from 'vue'
const contents = [
  {
    id: 1,
    title: 'Allison',
    date: '12 Oct, 2023',
    user: 'Lindsay Walton'
  },
  {
    id: 2,
    title: 'Angela',
    date: '12 Oct, 2023',
    user: 'Lindsay Walton'
  }
]

const date = ref(null)
</script>

<template>
  <AppContent
    title="Contents"
    description="A list of all contents including title, register date and user."
  >
    <template #button>
      <button
        type="button"
        class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        New Content
      </button>
    </template>

    <div class="flex justify-between gap-x-8">
      <div class="w-1/2">
        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2 sm:items-center">
          <FormInputLabel
            for="date"
            value="Category"
          />
          <div
            class="sm:col-span-2 sm:mt-0"
          >
            <FormCombobox />
          </div>
        </div>
        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2 sm:items-center">
          <FormInputLabel
            for="keyword"
            value="Key Word"
          />
          <FormTextInput
            id="keyword"
            type="text"
            class="sm:col-span-2 sm:mt-0"
          />
        </div>
      </div>
      <div class="w-1/2">
        <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-2 sm:items-center">
          <FormInputLabel
            for="date"
            value="Register Date"
          />
          <div class="sm:col-span-2 sm:mt-0 ">
            <FormDatePicker
              v-model="date"
            />
          </div>
        </div>
        <div class="flex justify-end py-2">
          <button
            type="button"
            class="block rounded-md bg-indigo-600 px-3 py-2 w-40 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Search
          </button>
        </div>
      </div>
    </div>

    <div class="low-root">
      <div class="inline-block min-w-full py-2 align-middle">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table class="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th
                  scope="col"
                  class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                >
                  No
                </th>
                <th
                  scope="col"
                  class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                >
                  Title
                </th>
                <th
                  scope="col"
                  class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                >
                  Register Date
                </th>
                <th
                  scope="col"
                  class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                >
                  Register User
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(content, contentIdx) in contents"
                :key="content.id"
              >
                <td :class="[contentIdx !== contents.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8']">
                  {{ content.id }}
                </td>
                <td :class="[contentIdx !== contents.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell']">
                  {{ content.title }}
                </td>
                <td :class="[contentIdx !== contents.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell']">
                  {{ content.date }}
                </td>
                <td :class="[contentIdx !== contents.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap px-3 py-4 text-sm text-gray-500']">
                  {{ content.user }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-10 flex justify-end">
          <nav
            class="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <a
              href="#"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span class="sr-only">Previous</span>
              <ChevronLeftIcon
                class="h-5 w-5"
                aria-hidden="true"
              />
            </a>
            <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
            <a
              href="#"
              aria-current="page"
              class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >1</a>
            <a
              href="#"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >2</a>
            <a
              href="#"
              class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
            >3</a>
            <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
            <a
              href="#"
              class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
            >8</a>
            <a
              href="#"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >9</a>
            <a
              href="#"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >10</a>
            <a
              href="#"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span class="sr-only">Next</span>
              <ChevronRightIcon
                class="h-5 w-5"
                aria-hidden="true"
              />
            </a>
          </nav>
        </div>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
