<script setup>

const claimManagement = useClaimManagementStore()
const commonData = useCommonDataStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const { currentTab } = storeToRefs(useTabsStore())

const { loading, toggleLoading } = useLoading()
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? '', 'POP00240', 'POP00250', 'POP00020'])
const { summaryList, filters, currentSummaryTab } = storeToRefs(useClaimManagementStore())

onMounted(async () => {
  togglePageLoading()
  await commonData.fetchOU040100CommonData();
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00240')
  await pageLoader.fetchPageLoadData('POP00230')
  await pageLoader.fetchPageLoadData('POP00020')
  await pageLoader.fetchPageLoadData('POP00250')
  await claimManagement.fetchSummaryList()
  await fetchCSList(currentSummaryTab.value?.CS_TYPE_CODE)
  togglePageLoading()
})

const onClickRefresh = async () => {
  filters.value.FLT_USER_ONLY_YN = onlyLoggedUser.value ? '1' : '0'
  toggleLoading()
  await claimManagement.fetchSummaryList(true)
  toggleLoading()
}

const onlyLoggedUser = ref(true)

const tabContentComponentName = computed(() => {
  return `${currentTab.value?.component}CS${currentSummaryTab.value?.CS_TYPE_CODE}`
})

const fetchCSList = async (code) => {
  filters.value.FLT_CS_TYPE_CODE = [code]
  filters.value.FLT_CS_STATUS_CODE = ["0010","0020"]
  claimManagement.clearCsList()
  claimManagement.clearCommentList()
  await claimManagement.fetchCsList()
}

const onClickTab = (tab) => {
  claimManagement.setCurrentSummaryTab(tab)
  fetchCSList(tab.CS_TYPE_CODE)
}
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-6">
        <FormGroup
          :label="getComponentData('OU040100_LBL01002', 'caption') "
          horizontal
        >
          <FormTextInput
            v-model="filters.FLT_KEY_WORD"
          />
        </FormGroup>


        <div class="col-span-4 text-end">
          <div class="flex space-x-6 items-center justify-end">
            <FormCheckbox
              id="PA000400_CHK00001"
              v-model="onlyLoggedUser"
              :label="getComponentData('OU040100_LBL01001', 'caption') "
            />

            <Button
              id="OU040100_BTN01001"
              variant="gray"
              rounded
              size="sm"
              :disabled="loading"
              :loading="loading"
              @click="onClickRefresh"
            >
              {{ getComponentData('OU040100_BTN01001', 'caption', 'Refresh') }}
            </Button>
          </div>
        </div>
      </div>
    </template>

    <div class="my-3">
      <div class="grid grid-cols-6 gap-x-3 mb-3">
        <div
          v-for="tab in summaryList"
          :key="tab.CS_TYPE_CODE"
          class="cursor-pointer"
        >
          <div
            class="flex space-y-3 justify-center items-center px-3 py-2 h-10 rounded-md border hover:border-gray-500"
            :class="{
              'isac-bg-gray' : tab.CS_TYPE_CODE === currentSummaryTab.CS_TYPE_CODE,
              'bg-gray-100' : tab.CS_TYPE_CODE !== currentSummaryTab.CS_TYPE_CODE,
            }"
            @click="onClickTab(tab)"
          >
            <span
              class="text-xs font-medium"
              :class="{
                'text-white' : tab.CS_TYPE_CODE === currentSummaryTab.CS_TYPE_CODE,
                'text-gray-700' : tab.CS_TYPE_CODE !== currentSummaryTab.CS_TYPE_CODE,
              }"
            >
              {{ tab.CS_TYPE_FNAME }} <span v-if="tab.CS_COUNT">({{ tab.CS_COUNT }})</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="summaryList.length">
      <component :is="tabContentComponentName" />
    </div>
  </AppContent>
</template>

<style scoped>

</style>
