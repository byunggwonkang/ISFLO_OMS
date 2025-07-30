<script setup>
defineProps({
  create: {
    type: Boolean,
    default: false,
  },
  promotionItemData: {
    type: Object,
    default: () => ({}),
  },
})

const pageLoader = usePageLoaderStore()
onMounted(async () => {
  await pageLoader.fetchPageLoadData('POP00200')
  await pageLoader.fetchPageLoadData('POP00020')
})

const tabs = [
  {
    name: 'Promotion Details',
    key: 'DETAILS',
  },
  {
    name: 'Order History',
    key: 'ORDER_HISTORY',
  }
]

const selectedTab = ref(tabs[0])
const onTabClick = (tab) => {
  selectedTab.value = tab
}

</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-x-3 border-b">
      <div
        v-for="(tab, tabIndex) in tabs"
        :key="tabIndex"
        :class="[
          'cursor-pointer py-1 px-4 ml-2 z-10 bg-white',
          {
            'border border-b-0 border-grey rounded-t-md -mb-0.5': tab.key === selectedTab.key,
          },
        ]"
        :aria-current="tab.value === selectedTab.value ? 'page' : undefined"
        @click="onTabClick(tab)"
      >
        <span class="text-sm font-bold">{{ tab.name }}</span>
      </div>
    </div>

    <component
      :is="'POP00200-PROMOTION-DETAILS'"
      v-if="selectedTab.key === 'DETAILS'"
      :promotion-item-data="promotionItemData"
    />

    <component
      :is="'POP00200-ORDER-HISTORY'"
      v-if="selectedTab.key === 'ORDER_HISTORY'"
      :promotion-item-data="promotionItemData"
    />
  </div>
</template>

<style scoped>

</style>
