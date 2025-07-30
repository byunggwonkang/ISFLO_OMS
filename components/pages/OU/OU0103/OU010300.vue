<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const stockOfOriginalItems = useStockOfOriginalItemsStore();

const { currentTab } = storeToRefs(useTabsStore())
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);

const { filters, userGroupBrandList, warehouseList, itemList } = storeToRefs(stockOfOriginalItems)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(itemList, perPage.value);
const { loading, toggleLoading } = useLoading()

const brand = ref({})
const warehouse = ref({})

watch(brand, async () => {
  await stockOfOriginalItems.fetchWarehouseList()

  warehouse.value = {
    name: decrypt(warehouseList.value[0]?.WH_FNAME) ?? '',
    value: decrypt(warehouseList.value[0]?.WH_CODE) ?? '',
  }
})

const fetchItemList = async () => {
  filters.value.FLT_BRAND_CODE = brand.value?.value ?? ''
  await stockOfOriginalItems.fetchItemList()
}

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00090')
  await stockOfOriginalItems.fetchUserGroupBrandList()

  brand.value = {
    name: decrypt(userGroupBrandList.value[0]?.USER_BRAND_FNAME) ?? '',
    value: parseInt(decrypt(userGroupBrandList.value[0]?.USER_BRAND_CODE)).toString() ?? '',
  }
  isloading.isLoading = false
  togglePageLoading()
})

onBeforeUnmount(() => {
  stockOfOriginalItems.clearItemList()
})

const onClickSearch = async () => {
  toggleLoading()
  isloading.isLoading = true
  await fetchItemList()
  isloading.isLoading = false
  toggleLoading()
  resetPage()
}

const openItemDetailsModal = ref(false)
const itemDetailData = ref({})

const onClickItemDetailRow = (item) => {
  Object.entries(item).forEach(([key, value]) => {
    if ( key =='QUANTITIES')
    itemDetailData.value[`${key}`] = value
    else if (value != null)
    itemDetailData.value[`${key}`] = decrypt(value)
  })
  openItemDetailsModal.value = true
}

const itemsListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU010300_GRD00001')
})

function handleInput_FROM(e) {
  if (filters.value.FLT_STOCK_FROM < 1) {
    filters.value.FLT_STOCK_FROM  = 1
  }
}

function handleInput_TO(e) {
  if (filters.value.FLT_STOCK_TO < 1) {
    filters.value.FLT_STOCK_TO  = ''
  }
}
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-x-12">
        <FormGroup
          :label="getComponentData('OU010300_LBL00001', 'caption')"
          label-id="OU010300_LBL00001"
          label-for="OU010300_CMB00001"
          horizontal
        >
          <FormSelect
            id="OU010300_CMB00001"
            v-model="brand"
            :options="userGroupBrandList.map((brand) => ({
              name: decrypt(brand.USER_BRAND_FNAME),
              value: parseInt(decrypt(brand.USER_BRAND_CODE)).toString(),
            }))"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU010300_LBL00003', 'caption')"
          label-id="OU010300_LBL00003"
          label-for="OU010300_TXT00001"
          horizontal
        >
          <FormTextInput
            id="OU010300_TXT00001"
            v-model="filters.FLT_STOCK_FROM"
            type="number"
            :placeholder="getComponentData('OU010300_TXT00001', 'placeholder')"
            :min="1"
            @input="handleInput_FROM"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU010300_LBL00004', 'caption')"
          label-id="OU010300_LBL00004"
          label-for="OU010300_TXT00002"
          horizontal
        >
          <FormTextInput
            id="OU010300_TXT00002"
            v-model="filters.FLT_STOCK_TO"
            type="number"
            :placeholder="getComponentData('OU010300_TXT00002', 'placeholder')"
            @input="handleInput_TO"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU010300_LBL00005', 'caption')"
          label-id="OU010300_LBL00005"
          label-for="OU010300_TXT00003"
          horizontal
        >
          <FormTextInput
            id="OU010300_TXT00003"
            v-model="filters.FLT_KEY_WORD"
            :placeholder="getComponentData('OU010300_TXT00003', 'placeholder')"
          />
        </FormGroup>

        <div class="flex items-center justify-between space-x-3">
          <Button
            id="OU010300_BTN00001"
            variant="gray"
            rounded
            size="sm"
            :disabled="loading"
            :loading="loading"
            @click="onClickSearch"
          >
            {{ getComponentData ('OU010300_BTN00001', 'caption') }}
          </Button>
        </div>
      </div>
    </template>

    <Table
      id="OU010300_GRD00001"
      class="overflow-x-auto mt-3"
      header-variant="secondary"
      clickable
      :columns="itemsListTableFields"
      :items="paginatedData"
      @on-row-click="onClickItemDetailRow"
    />

    <!-- Pagination -->
    <div
      v-if="itemList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? itemList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ itemList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="itemList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>

    <!-- Item Details Modal -->
    <Modal
      :show="openItemDetailsModal"
      size="4xl"
      divider
      @close="() => {
        openItemDetailsModal = false;
        itemDetailData = {};
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00090_LBL01001', 'caption', 'Item Stock') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00090`"
          :item-detail-data="itemDetailData"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
