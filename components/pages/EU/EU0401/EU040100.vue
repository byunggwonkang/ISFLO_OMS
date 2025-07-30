<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

import { ArrowPathIcon } from "@heroicons/vue/24/solid/index.js";

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const returnList = useReturnListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { returnStatusList, currentReturnStatus } = storeToRefs(returnList)

const { loading, toggleLoading } = useLoading()
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? '', 'POP00020'])

watch(currentReturnStatus, () => {
  returnList.resetReturnDetailList()
  // returnStatus.resetFilters()
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await commonData.fetchEU040100CommonData()
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00290')
  await returnList.fetchReturnStatusList()
  isloading.isLoading = false
  togglePageLoading()
})

const onClickRefresh = async () => {
  toggleLoading()
  isloading.isLoading = true
  await Promise.all([
    returnList.fetchReturnStatusList(),
    returnList.fetchReturnSummaryList(),
  ])
  isloading.isLoading = false
  toggleLoading()
}

const tabContentComponentName = computed(() => {
  return `${currentTab.value?.component}RL${decrypt(currentReturnStatus.value?.RET_STATUS_CODE)}`
})

const openReturnDetailModal = ref(false)
const returnDetailData = ref({})
</script>

<template>
  <AppContent :loading="pageLoading">
    <div class="flex justify-items-stretch -mt-3">
      <div class="w-44 flex-none space-y-3 border-r border-gray-200 pt-3 pr-3">
        <div class="flex justify-between items-center">
          <span class="font-black text-md">
            {{ getComponentData('EU040100_BTN00001', 'caption', 'Refresh') }}
          </span>

          <Button
            id="EU040100_BTN00001"
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
            v-if="returnStatusList.length === 0"
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
            v-for="list in returnStatusList"
            :key="list.RET_STATUS_CODE"
            class="cursor-pointer"
            @click="returnList.setCurrentReturnStatus(list)"
          >
            <div
              class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-20 border hover:border-gray-500"
              :class="{
                'isac-bg-gray' : currentReturnStatus?.RET_STATUS_CODE === list.RET_STATUS_CODE,
                'bg-gray-100' : currentReturnStatus?.RET_STATUS_CODE !== list.RET_STATUS_CODE,
              }"
            >
              <span
                class="text-xs font-medium"
                :class="{
                  'text-white' : currentReturnStatus?.RET_STATUS_CODE === list.RET_STATUS_CODE,
                  'text-gray-700' : currentReturnStatus?.RET_STATUS_CODE !== list.RET_STATUS_CODE,
                }"
              >
                {{ decrypt(list.RET_STATUS_FNAME) }}
              </span>
              <span
                class="text-2xl font-black"
                :class="{
                  'text-white' : currentReturnStatus?.RET_STATUS_CODE === list.RET_STATUS_CODE,
                  'text-gray-700' : currentReturnStatus?.RET_STATUS_CODE !== list.RET_STATUS_CODE,
                }"
              >
                {{ decrypt(list.RET_STATUS_VALUE) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="returnStatusList.length"
        class="w-5/6 flex-auto pt-3"
      >
        <keep-alive>
          <component
            :is="tabContentComponentName"
            @on-click-return-detail="(item) => {
              openReturnDetailModal = true;
              returnDetailData = item;
            }"
          />
        </keep-alive>

        <Modal
          :show="openReturnDetailModal"
          size="11xl"
          divider
          body-class="p-0"
          @close="() => {
            openReturnDetailModal = false;
            returnDetailData = {};
          }"
        >
          <template #header>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ getComponentData('POP00290_LBL01001', 'caption', 'Return Details') }}
            </h3>
          </template>

          <template #body>
            <component
              :is="`POP00290`"
              :return-detail-data="returnDetailData"
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
