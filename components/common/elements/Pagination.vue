<script setup>
import { computed } from "vue";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/20/solid/index.js";

const props = defineProps({
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  activeVariant: {
    type: String,
    default: 'gray'
  },
  rounded: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md'
  }
})

const colorVariants = computed(() => ({
  'primary': 'isac-bg-blue text-white ',
  'secondary': 'bg-gray-100 text-gray-900',
  'success': 'bg-green-600 text-white',
  'danger': 'bg-red-600 text-white',
  'warning': 'bg-yellow-600 text-white',
  'info': 'bg-blue-600 text-white',
  'gray': 'isac-bg-gray text-white',
}));

const sizeClass = computed(() => ({
  'xs': 'px-1.5 py-1 text-xs',
  'sm': 'px-2.5 py-1.5 text-xs',
  'md': 'px-4 py-2 text-sm',
  'lg': 'px-5 py-2.5 text-base',
  'xl': 'px-6 py-3 text-base',
}));

const nextPrevSizeClass = computed(() => ({
  'xs': 'px-1',
  'sm': 'px-1.5',
  'md': 'px-2',
  'lg': 'px-3',
  'xl': 'px-4',
}));

const emit = defineEmits([
  'pageChanged'
])

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage);
})

const hasMorePages = computed(() => {
  return props.currentPage < totalPages.value;
})

const isFirstPage = computed(() => {
  return props.currentPage === 1;
})

const isLastPage = computed(() => {
  return props.currentPage === totalPages.value;
})

const onClickPrevious = () => {
  if (props.currentPage > 1) {
    emit('pageChanged', props.currentPage - 1);
  }
}

const onClickPage = (page) => {
  if (page === '...') return;
  emit('pageChanged', page);
}

const onClickNext = () => {
  if (hasMorePages.value) {
    emit('pageChanged', props.currentPage + 1);
  }
}

const pages = computed(() => {
  const pages = [];
  const totalPPages = totalPages.value;
  const currentPage = props.currentPage;

  if (totalPPages <= 7) {
    for (let i = 1; i <= totalPPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPPages);
    } else if (currentPage > totalPPages - 4) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPPages - 4; i <= totalPPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPPages);
    }
  }

  return pages;
})
</script>

<template>
  <nav
    v-if="totalItems > 0"
    class="isolate inline-flex -space-x-px shadow-sm"
    :class="{
      'rounded-md': rounded
    }"
    aria-label="Pagination"
  >
    <a
      class="relative inline-flex items-center text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      :class="[
        {
          'cursor-not-allowed bg-gray-50': isFirstPage,
          'cursor-pointer': !isFirstPage,
          'rounded-l-md': rounded
        },
        nextPrevSizeClass[size]
      ]"
      @click="onClickPrevious"
    >
      <slot name="previous">
        <span class="sr-only">Previous</span>
        <ChevronLeftIcon
          class="h-5 w-5"
          aria-hidden="true"
        />
      </slot>
    </a>
    <a
      v-for="page in pages"
      :key="page"
      :class="[
        'relative z-10 inline-flex items-center text-sm font-semibold cursor-pointer',
        sizeClass[size],
        {
          'focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600': page === currentPage,
          'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0': page !== currentPage,
        },
        [ page === currentPage ? colorVariants[activeVariant] : '']
      ]"
      @click="onClickPage(page)"
    >
      <slot
        name="page"
        :page="page"
        :active="currentPage === page"
      >
        <span v-if="page === '...'">...</span>
        <span v-else>{{ page }}</span>
      </slot>
    </a>

    <a
      class="relative inline-flex items-center px-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      :class="[
        {
          'cursor-not-allowed bg-gray-50': isLastPage,
          'cursor-pointer': !isLastPage,
          'rounded-r-md': rounded
        },
        nextPrevSizeClass[size]
      ]"
      @click="onClickNext"
    >
      <slot name="next">
        <span class="sr-only">Next</span>
        <ChevronRightIcon
          class="h-5 w-5"
          aria-hidden="true"
        />
      </slot>
    </a>
  </nav>
</template>

