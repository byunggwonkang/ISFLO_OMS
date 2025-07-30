<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import {PlusIcon} from "@heroicons/vue/24/solid";
import moment from "moment";

const { pageLoading, togglePageLoading } = usePageLoading();
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()
const promotionManagement = usePromotionManagementStore()
const { currentTab } = storeToRefs(useTabsStore())

const { promotionList, filters, brandList, channelList } = storeToRefs(promotionManagement)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(promotionList, perPage.value);
const { loading, toggleLoading } = useLoading()

const brand = ref({})
const channel = ref([])
const promotionType = ref([])
const promotionStatus = ref([])

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const fetchPromotionList = async () => {
  await promotionManagement.fetchPromotionList()
}

watch(brand, async (newValue) => {
  filters.value.FLT_PROM_BRAND_CODE = newValue?.value ?? ''
  channel.value = [];
  await promotionManagement.fetchChannelList()
});

onBeforeUnmount(() => {
  promotionManagement.clearPromotionList()
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData('POP00190')
  await pageLoader.fetchPageLoadData('POP00200')
  await pageLoader.fetchPageLoadData('POP00210')
  await pageLoader.fetchPageLoadData('POP00220')
  await pageLoader.fetchPageLoadData('POP00270')
  await commonData.fetchOU060100CommonData();
  await pageLoader.fetchPageLoadData(currentTab.value?.component)
  await promotionManagement.fetchBrandList()
  //await promotionManagement.fetchChannelList()

  brand.value = {
    name: 'All',
    value: '',
  };
  isloading.isLoading = false

  togglePageLoading()
})

const search = async (showLoading = true) => {
  filters.value.FLT_PROM_BRAND_CODE = brand.value?.value ?? ''
  filters.value.FLT_PROM_CHANNEL_CODE = channel.value.map((item) => item.value) ?? [];
  filters.value.FLT_PROM_TYPE_CODE = promotionType.value.map((item) => item.value) ?? []
  filters.value.FLT_PROM_STATUS_CODE = promotionStatus.value.map((item) => item.value) ?? []
  filters.value.FLT_PROM_DATE_START = moment(filters.value.FLT_PROM_DATE_START).format('YYYY-MM-DD')
  filters.value.FLT_PROM_DATE_END = moment(filters.value.FLT_PROM_DATE_END).format('YYYY-MM-DD')

  if (showLoading) toggleLoading()
  isloading.isLoading = true
  await fetchPromotionList()
  isloading.isLoading = false
  if (showLoading) toggleLoading()

  resetPage()
}

const promotionListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU060100_GRD00001')
})

const openPromotionCreateModal = ref(false)
const openPromotionDetailsModal = ref(false)
const isCreate = ref(false)

const promotionItemData = ref({})
const onClickItemRow = (item) => {
  promotionItemData.value = item
  isCreate.value = false
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
          :label="getComponentData('OU060100_LBL00006', 'caption', 'Select Brand')"
          label-id="OU060100_LBL00006"
          label-for="OU060100_CMB00006"
          horizontal
        >
          <FormCombobox
            id="OU060100_CMB00006"
            v-model="brand"
            :options="brandList.map((item) => ({
              name: decrypt(item.BRAND_FNAME),
              value: decrypt(item.BRAND_CODE),
            }))"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU060100_LBL00001', 'caption', 'Select Channel')"
          label-id="OU060100_LBL00001"
          label-for="OU060100_CMB00001"
          horizontal
        >
          <FormSelect
            id="OU060100_CMB00001"
            v-model="channel"
            :options="channelList.map((item) => ({
              name: decrypt(item.CHANNEL_FNAME),
              value: decrypt(item.CHANNEL_CODE),
            }))"
            :max-items="4"
            multiple
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU060100_LBL00004', 'caption', 'Effective Date')"
          label-id="OU060100_LBL00004"
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
          :label="getComponentData('OU060100_LBL00002', 'caption', 'Promotion Type')"
          label-id="OU060100_LBL00002"
          label-for="OU060100_CMB00002"
          horizontal
        >
          <FormSelect
            id="OU060100_CMB00002"
            v-model="promotionType"
            :options="commonData.getPromotionTypeOptions"
            :max-items="4"
            multiple
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU060100_LBL00005', 'caption', 'Status')"
          label-id="OU060100_LBL00005"
          label-for="OU060100_CMB00005"
          horizontal
        >
          <FormSelect
            id="OU060100_CMB00005"
            v-model="promotionStatus"
            :options="commonData.getPromotionStatusOptions"
            :max-items="4"
            multiple
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU060100_LBL00003', 'caption', 'Promotion Title')"
          label-id="OU060100_LBL00003"
          horizontal
        >
          <FormTextInput
            v-model="filters.FLT_PROM_TITLE"
          />
        </FormGroup>

        <div class="col-span-4 text-end">
          <Button
            id="OU060100_BTN00001"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="search"
          >
            {{ getComponentData('OU060100_BTN00001', 'caption', 'Search') }}
          </Button>
        </div>
      </div>
    </template>

    <div class="flex justify-between items-center mt-2">
      <p>
        {{ getGridData('OU060100_GRD00001', 'caption', 'Search Result') }}
      </p>

      <Button
        rounded
        variant="white"
        border
        size="xs"
        @click="() => {
          openPromotionCreateModal = true
          isCreate = true
        }"
      >
        <PlusIcon class="w-5 h-5" />
      </Button>
    </div>

    <Table
      id="OU060100_GRD00001"
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
      :show="openPromotionCreateModal"
      divider
      size="7xl"
      @close="() => {
        openPromotionCreateModal = false
        isCreate = false
        promotionItemData = {}
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00190_LBL01001', 'caption', 'Promotion Details') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00190'"
          :promotion-item-data="promotionItemData"
          :create="true"
          @promotion-saved="() => {
            fetchPromotionList()
            openPromotionCreateModal = false
            isCreate = false
            promotionItemData = {}
          }"
        />
      </template>
    </Modal>

    <Modal
      :show="openPromotionDetailsModal"
      divider
      size="7xl"
      @close="() => {
        openPromotionDetailsModal = false
        isCreate = false
        promotionItemData = {}
        search(false)
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00200_LBL01001', 'caption', 'Promotion Status') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00190'"
          :promotion-item-data="promotionItemData"
          :create="isCreate"
          @promotion-saved="() => {
            openPromotionDetailsModal = false
            search(false)
          }"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
