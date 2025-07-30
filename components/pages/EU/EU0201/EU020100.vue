<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const StockManagement = useStockManagement()
const { currentTab } = storeToRefs(useTabsStore())

const { StockList, filters, WHList } = storeToRefs(StockManagement)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(StockList, perPage.value);
const { loading, toggleLoading } = useLoading()

const whData = ref({})

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const fetchStockList = async () => {
  await StockManagement.fetchStockList()
}

onBeforeUnmount(() => {
  StockManagement.clearStockList()
})

const openItemDetailsModal = ref(false)
const itemDetailData = ref({})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00090')
  await StockManagement.fetchWHList()

  whData.value = {
    name: 'All',
    value: '',
  };
  isloading.isLoading = false
  togglePageLoading()
})

watch(() => whData, (value) => {
  if (value) {
    const selectedChannel = WHList.value.find((channel) => decrypt(channel.WH_CODE) === value?.value.value)
    filters.value.WH_BRAND_FNAME = selectedChannel?.WH_BRAND_FNAME ? decrypt(selectedChannel?.WH_BRAND_FNAME) : ''
  }
}, { deep: true })

const search = async (showLoading = true) => {

  filters.value.FLT_WH_CODE = whData.value?.value
  if (showLoading) toggleLoading()
  isloading.isLoading = true
  await fetchStockList()
  isloading.isLoading = false
  if (showLoading) toggleLoading()

  resetPage()
}

const onClickItemDetailRow = (item) => {
  Object.entries(item).forEach(([key, value]) => {
    if ( key =='QUANTITIES')
    itemDetailData.value[`${key}`] = value
    else if (value != null)
    itemDetailData.value[`${key}`] = decrypt(value)
  })  
  openItemDetailsModal.value = true
}

const StockListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU020100_GRD00001')
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
      <div class="grid grid-cols-5 gap-y-3 gap-x-12">
        <FormGroup
          :label="getComponentData('EU020100_LBL00001', 'caption', 'Wearhouse')"
          label-id="EU020100_LBL00001"
          label-for="EU020100_CMB00001"
          horizontal
        >
          <FormCombobox
            id="EU020100_CMB00001"
            v-model="whData"
            :options="[
              {
                name: 'All',
                value: '',
              },
              ...WHList.map((item) => ({
                name: decrypt(item.WH_FNAME),
                value: decrypt(item.WH_CODE),
              }))
            ]"
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU020100_LBL00002', 'caption', 'Brand')"
          label-id="EU020100_LBL00002"
          label-for="EU020100_TXT00001"
          horizontal
        >
          <FormTextInput
            id="EU020100_TXT00001"
            v-model="filters.WH_BRAND_FNAME"
            disabled
          />
        </FormGroup>
        <FormGroup />
        <FormGroup />
        <FormGroup />
        <FormGroup
          :label="getComponentData('EU020100_LBL00003', 'caption', 'From QTY')"
          label-id="EU020100_LBL00003"
          horizontal
        >
          <FormTextInput
            id="EU020100_TXT00002"
            v-model="filters.FLT_STOCK_FROM"
            type="number"
            :min="1"
            @input="handleInput_FROM"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('EU020100_LBL00004', 'caption', 'To QTY')"
          label-id="EU020100_LBL00004"
          horizontal
        >
          <FormTextInput
            id="EU020100_TXT00003"
            v-model="filters.FLT_STOCK_TO"
            type="number"
            @input="handleInput_TO"
          />
        </FormGroup>
        <FormGroup />
        <FormGroup />
        <FormGroup />
        <FormGroup
          :label="getComponentData('EU020100_LBL00005', 'caption', 'Key Word')"
          label-id="EU020100_LBL00005"
          horizontal
        >
          <FormTextInput
            id="EU020100_TXT00004"
            v-model="filters.FLT_KEY_WORD"
          />
        </FormGroup>
        <FormGroup />
        <FormGroup />
        <FormGroup />
        <div class="col-span-1 text-end">
          <Button
            id="EU020100_BTN00001"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="search"
          >
            {{ getComponentData('EU020100_BTN00001', 'caption', 'Search') }}
          </Button>
        </div>
      </div>
    </template>
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-2 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>
        <p class="leading-6 font-medium text-sm text-gray-900">
          {{ getGridData('EU020100_GRD00001', 'caption', 'Search Result') }}
        </p>       
      </template>          
      <Table
        id="EU020100_GRD00001"
        header-variant="secondary"
        class="overflow-x-auto mt-3"
        clickable
        :columns="StockListTableFields"
        :items="paginatedData"
        @on-row-click="onClickItemDetailRow"
      />
      <!-- Pagination -->
      <div
        v-if="StockList?.length"
        class="flex justify-between items-center"
      >
        <p class="text-sm text-gray-700">
          Showing
          <span class="mx-1">
            {{ (currentPage - 1) * perPage + 1 }}
          </span>
          to
          <span class="mx-1">
            {{ isLastPage ? StockList?.length : currentPage * perPage }}
          </span>
          of
          <span class="mx-1">
            {{ StockList?.length }}
          </span>
          results
        </p>

        <Pagination
          :total-items="StockList?.length"
          :items-per-page="perPage"
          :current-page="currentPage"
          rounded
          active-variant="gray"
          @page-changed="currentPage = $event"
        />
      </div>
    </Card> 
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
