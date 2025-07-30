<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

import moment from "moment";

const { pageLoading, togglePageLoading } = usePageLoading();
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()
const promotionStatus = usePromotionStatusStore()
const { currentTab } = storeToRefs(useTabsStore())

const { promotionList, filters, brandList, userGroupChannelList } = storeToRefs(promotionStatus)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(promotionList, perPage.value);
const { loading, toggleLoading } = useLoading()

const brand = ref({})
const channel = ref([])
const promotionType = ref([])

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const fetchPromotionList = async () => {
  await promotionStatus.fetchPromotionList()
}

onBeforeUnmount(() => {
  promotionStatus.clearPromotionList()
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await commonData.fetchOU060200CommonData();
  await pageLoader.fetchPageLoadData(currentTab.value?.component)
  await pageLoader.fetchPageLoadData('POP00200')
  await promotionStatus.fetchBrandList()
  await promotionStatus.fetchUserGroupChannelList()

  brand.value = {
    name: 'All',
    value: '',
  };
  isloading.isLoading = false
  togglePageLoading()
})

const search = async () => {
  filters.value.FLT_PROM_BRAND_CODE = brand.value?.value ?? ''
  filters.value.FLT_PROM_CHANNEL_CODE = channel.value.map((item) => item.value) ?? [];
  filters.value.FLT_PROM_TYPE_CODE = promotionType.value.map((item) => item.value) ?? []
  filters.value.FLT_PROM_STATUS_CODE = []
  filters.value.FLT_PROM_DATE_START = moment(filters.value.FLT_PROM_DATE_START).format('YYYY-MM-DD')
  filters.value.FLT_PROM_DATE_END = moment(filters.value.FLT_PROM_DATE_END).format('YYYY-MM-DD')

  toggleLoading()
  isloading.isLoading = true
  await fetchPromotionList()
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const promotionListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU060200_GRD00001')
})

const openPromotionDetailsModal = ref(false)
const promotionItemData = ref({})

const onClickItemRow = (item) => {
  promotionItemData.value = item
  openPromotionDetailsModal.value = true
}
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-y-3 gap-x-12">
        <FormGroup
          :label="getComponentData('OU060200_LBL00006', 'caption', 'Select Brand')"
          label-id="OU060200_LBL00006"
          label-for="OU060200_CMB00006"
          horizontal
        >
          <FormCombobox
            id="OU060200_CMB00006"
            v-model="brand"
            :options="brandList.map((item) => ({
              name: decrypt(item.BRAND_FNAME),
              value: decrypt(item.BRAND_CODE),
            }))"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU060200_LBL00001', 'caption', 'Select Channel')"
          label-id="OU060200_LBL00001"
          label-for="OU060200_CMB00001"
          horizontal
        >
          <FormSelect
            id="OU060200_CMB00001"
            v-model="channel"
            :options="userGroupChannelList.map((channel) => ({
              name: decrypt(channel.USER_CHANNEL_DESCR),
              value: decrypt(channel.USER_CHANNEL_CODE),
            }))"
            :max-items="4"
            multiple
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU060200_LBL00004', 'caption', 'Effective Date')"
          label-id="OU060200_LBL00004"
          horizontal
        >
          <div class="flex items-center sm:flex-col lg:flex-row sm:space-y-3 sm:space-x-0 lg:space-x-3 lg:space-y-0 w-full ml-3">
            <FormDatePicker
              v-model.string="filters.FLT_PROM_DATE_START"
              placeholder="Select a date"
              mode="date"
            />

            <FormDatePicker
              v-model.string="filters.FLT_PROM_DATE_END"
              placeholder="Select a date"
              mode="date"
            />
          </div>
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU060200_LBL00002', 'caption', 'Promotion Type')"
          label-id="OU060200_LBL00002"
          label-for="OU060200_CMB00002"
          horizontal
        >
          <FormSelect
            id="OU060200_CMB00002"
            v-model="promotionType"
            :options="commonData.getPromotionTypeOptions"
            :max-items="4"
            multiple
          />
        </FormGroup>

        <div>
          <FormCheckbox
            id="OU060200_CHK00001"
            :label="getComponentData('OU060200_LBL00005', 'caption', 'Include Closed')"
            value="1"
          />
        </div>

        <FormGroup
          label-id="OU060200_LBL00003"
          :label="getComponentData('OU060200_LBL00003', 'caption')"
          horizontal
        >
          <FormTextInput
            v-model="filters.FLT_PROM_TITLE"
          />
        </FormGroup>

        <div class="col-span-4 text-end">
          <Button
            id="OU060200_BTN00001"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="search"
          >
            {{ getComponentData('OU060200_BTN00001', 'caption', 'Search') }}
          </Button>
        </div>
      </div>
    </template>

    <div class="flex justify-between items-center mt-2">
      <p>
        {{ getGridData('OU060200_GRD00001', 'caption', 'Search Result') }}
      </p>
    </div>

    <Table
      id="OU060200_GRD00001"
      border
      class="overflow-x-auto"
      header-variant="secondary"
      clickable
      :columns="promotionListTableFields"
      :items="paginatedData"
      @on-row-click="onClickItemRow"
    />

    <!-- Pagination -->
    <div
      v-if="promotionList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? promotionList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ promotionList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="promotionList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>

    <Modal
      :show="openPromotionDetailsModal"
      divider
      size="7xl"
      @close="() => {
        openPromotionDetailsModal = false
        isCreate = false
        promotionItemData = {}
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00200_LBL01001', 'caption', 'Promotion Status') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00200'"
          :promotion-item-data="promotionItemData"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
