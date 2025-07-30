<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

import { ArrowPathIcon } from "@heroicons/vue/24/solid/index.js";

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const exchangelist = useExchangeListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { exchangeStatusList, currentExchangeStatus } = storeToRefs(exchangelist)

const { loading, toggleLoading } = useLoading()
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? '', 'POP00020'])

watch(currentExchangeStatus, () => {
  exchangelist.resetExchangeDetailList()
  // returnStatus.resetFilters()
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await commonData.fetchEU050100CommonData()
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00300')
  await exchangelist.fetchExchangeStatusList()
  isloading.isLoading = false
  togglePageLoading()
})

const onClickRefresh = async () => {
  toggleLoading()
  isloading.isLoading = true
  await Promise.all([
    exchangelist.fetchExchangeStatusList(),
    exchangelist.fetchExchangeSummaryList(),
  ])
  isloading.isLoading = false
  toggleLoading()
}

const tabContentComponentName = computed(() => {
  return `${currentTab.value?.component}EL${decrypt(currentExchangeStatus.value?.EXC_STATUS_CODE)}`
})

const openExchangeDetailModal = ref(false)
const exchangeDetailData = ref({})
</script>

<template>
  <AppContent :loading="pageLoading">
    <div class="flex justify-items-stretch -mt-3">
      <div class="w-44 flex-none space-y-3 border-r border-gray-200 pt-3 pr-3">
        <div class="flex justify-between items-center">
          <span class="font-black text-md">
            {{ getComponentData('EU050100_LBL00001', 'caption', 'Refresh') }}
          </span>

          <Button
            id="EU050100_BTN00001"
            rounded
            variant="white"
            border
            size="xs"
            @click="onClickRefresh"
          >
            <ArrowPathIcon
              class="w-4 h-5 font-bold"
              :class="{
                'animate-spin': loading
              }"
            />
          </Button>
        </div>

        <div
          class="flex flex-1 flex-col space-y-3"
          aria-label="Sidebar"
        >
          <ul
            v-if="exchangeStatusList.length === 0"
            role="list"
            class="space-y-3"
          >
            <li
              v-for="(i) in [0, 1, 2, 3, 4, 5]"
              :key="i"
              class="h-20"
            >
              <SkeletonLoader class="w-full h-full rounded" />
            </li>
          </ul>

          <div
            v-for="list in exchangeStatusList"
            :key="list.EXC_STATUS_CODE"
            class="cursor-pointer"
            @click="exchangelist.setCurrentExchangeStatus(list)"
          >
            <div
              class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-20 border hover:border-gray-500"
              :class="{
                'isac-bg-gray' : currentExchangeStatus?.EXC_STATUS_CODE === list.EXC_STATUS_CODE,
                'bg-gray-100' : currentExchangeStatus?.EXC_STATUS_CODE !== list.EXC_STATUS_CODE,
              }"
            >
              <span
                class="text-xs font-medium"
                :class="{
                  'text-white' : currentExchangeStatus?.EXC_STATUS_CODE === list.EXC_STATUS_CODE,
                  'text-gray-700' : currentExchangeStatus?.EXC_STATUS_CODE !== list.EXC_STATUS_CODE,
                }"
              >
                {{ decrypt(list.EXC_STATUS_FNAME) }}
              </span>
              <span
                class="text-2xl font-black"
                :class="{
                  'text-white' : currentExchangeStatus?.EXC_STATUS_CODE === list.EXC_STATUS_CODE,
                  'text-gray-700' : currentExchangeStatus?.EXC_STATUS_CODE !== list.EXC_STATUS_CODE,
                }"
              >
                {{ decrypt(list.EXC_STATUS_VALUE) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="exchangeStatusList.length"
        class="w-5/6 flex-auto pt-3"
      >
        <keep-alive>
          <component
            :is="tabContentComponentName"
            @on-click-exchange-detail="(item) => {
              openExchangeDetailModal = true;
              exchangeDetailData = item;
            }"
          />
        </keep-alive>

        <Modal
          :show="openExchangeDetailModal"
          size="11xl"
          divider
          body-class="p-0"
          @close="() => {
            openExchangeDetailModal = false;
            exchangeDetailData = {};
          }"
        >
          <template #header>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ getComponentData('POP00300_LBL01001', 'caption', 'Exchange Details') }}
            </h3>
          </template>

          <template #body>
            <component
              :is="`POP00300`"
              :exchange-detail-data="exchangeDetailData"
            />
          </template>
        </Modal>
      </div>
      <div
        v-else
        class="w-5/6 flex-auto space-y-1 pt-3 pl-3"
      >
        <SkeletonLoader class="w-full h-28 rounded" />
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
