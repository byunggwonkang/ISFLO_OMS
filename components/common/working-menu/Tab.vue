<script setup>
import {XMarkIcon} from "@heroicons/vue/24/outline";

const workingSpaceData = useTabsStore();
const { currentTab } = storeToRefs(workingSpaceData);

const props = defineProps({
  tab: {
    type: Object,
    required: true
  },
  hideCloseButton: {
    type: Boolean,
    default: false
  },
  defaultActive: {
    type: Boolean,
    default: false
  }
})

const goToRoute = () => {
  workingSpaceData.setCurrentTab(props.tab)
}
</script>

<template>
  <div
    :class="[
      {
        'pb-1.5 bg-white isac-menu-active': currentTab.component === tab.component,
        'pb-1 isac-menu-not-active' : currentTab.component !== tab.component
      },
      'mt-3 px-4 pt-2 text-base font-normal cursor-pointer text-center relative rounded-t',
      'flex justify-between items-center isac-menu-tab',
    ]"
    :aria-current="currentTab.component === tab.component ? 'page' : undefined"
  >
    <span
      :class="[
        currentTab.component === tab.component ? 'text-gray-800 text-extrabold' : 'text-white w-auto max-w-[110px]',
        'truncate leading-6 isac-menu-name text-xs'
      ]"
      @click="goToRoute"
    >
      {{ tab.name }}
    </span>

    <span
      v-if="!hideCloseButton"
      class="inline-flex items-center rounded-md font-medium isac-menu-close-tab"
      :class="[currentTab.component === tab.component ? 'text-gray-800' : 'text-white']"
      @click="(e) => {
        e.stopPropagation();
        workingSpaceData.removeTab(tab)
      }"
    >
      <XMarkIcon
        class="h-4 w-4 hover:text-red-500"
        aria-hidden="true"
      />
    </span>
  </div>
</template>

<style scoped lang="scss">
.isac-menu-tab {
  transition: all 0.1s ease-in-out;

  .isac-menu-close-tab {
    margin-left: 0;
    width: 0;
    transition: all 0.1s ease-in-out;
  }

  .isac-menu-name {
    transition: all 0.05s ease-in-out;
  }

  &.isac-menu-active {
    &:hover {
      background: #FFF !important;
    }
  }

  &.isac-menu-not-active {
    &:hover {
      background: rgba(255, 255, 255, 0.30) !important;
    }
  }

  &:hover {
    .isac-menu-name {
      max-width: 100%;
      width: 100%;
    }

    .isac-menu-close-tab {
      margin-left: 1rem;
      width: 1rem;
    }
  }
}
</style>
