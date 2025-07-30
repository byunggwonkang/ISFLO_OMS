<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import {PlusIcon} from "@heroicons/vue/24/solid";

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const StockInbound = useStockInbound()
const { currentTab } = storeToRefs(useTabsStore())

const { InboundList, filters, WHList, VendorList } = storeToRefs(StockInbound)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(InboundList, perPage.value);
const { loading, toggleLoading } = useLoading()

const isCreate = ref(false)
const isInboundSID = ref("")

const getInboundStatus = ref([{
  name: 'All',
  value: '',
},
{
  name: 'Created',
  value: '0010',
},
{
  name: 'Confirmed',
  value: '0060',
}])

const whData = ref({})
const InboundStatus = ref({})
const VendorData = ref({})

const openStockDetailsModal = ref(false)
const itemDetailData = ref({})

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const fetchInboundList = async () => {
  await StockInbound.fetchInboundList()
}

onBeforeUnmount(() => {
  StockInbound.clearInboundList()
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00320')
  await StockInbound.fetchWHList()
  await StockInbound.fetchVendorList()

  whData.value = {
    name: 'All',
    value: '',
  };
  InboundStatus.value = {
    name: 'All',
    value: '',
  };  
  VendorData.value = {
    name: 'All',
    value: '',
  };  
  isloading.isLoading = false
  togglePageLoading()
})

watch(() => whData, (value) => {
  if (value) {
    const selectedChannel = WHList.value.find((channel) => encrypt(channel.WH_CODE) === value?.value.value)
    filters.value.FLT_INBOUND_BRAND_FNAME = selectedChannel?.WH_BRAND_FNAME ? decrypt(selectedChannel?.WH_BRAND_FNAME) : ''
  }
}, { deep: true })

const search = async (showLoading = true) => {
  filters.value.FLT_INBOUND_STATUS_CODE = InboundStatus.value?.value
  filters.value.FLT_INBOUND_VENDOR_SID = VendorData.value?.value
  if (showLoading) toggleLoading()
  isloading.isLoading = true
  await fetchInboundList()
  isloading.isLoading = false
  if (showLoading) toggleLoading()

  resetPage()
}

const onClickItemDetailRow = (item) => {
  isCreate.value = false
  isInboundSID.value = item.INBOUND_SID  
  openStockDetailsModal.value = true
}

const StockListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU020200_GRD00001')
})

const StockInboundModal = async () => {
  isCreate.value = true
  isInboundSID.value = ''  
  openStockDetailsModal.value = true
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
          :label="getComponentData('EU020200_LBL00001', 'caption', 'Wearhouse')"
          label-id="EU020200_LBL00001"
          label-for="EU020200_CMB00001"
          horizontal
          label-width="w-1/4"
          input-width="w-3/4"
        >
          <FormCombobox 
            id="EU020200_CMB00001"
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
          :label="getComponentData('EU020200_LBL00002', 'caption', 'Brand')"
          label-id="EU020200_LBL00002"
          label-for="EU020200_TXT00001"
          horizontal
        >
          <FormTextInput
            id="EU020200_TXT00001"
            v-model="filters.FLT_INBOUND_BRAND_FNAME"
            disabled
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU020200_LBL00003', 'caption', 'Inbound QTY From')"
          label-id="EU020200_LBL00003"
          horizontal
        >
          <div class="inline-flex items-center space-x-2">
            <FormTextInput
              id="EU020200_TXT00002"
              v-model="filters.FLT_INBOUND_QTY_FROM"
            />
            <FormGroup
              :label="getComponentData('EU020200_LBL00004', 'caption', 'To')"
              label-id="EU020200_LBL00004"
              horizontal
            />
            <FormTextInput
              id="EU020200_TXT00003"
              v-model="filters.FLT_INBOUND_QTY_TO"
            />
          </div>          
        </FormGroup>  
        <FormGroup />
        <FormGroup />
        <FormGroup
          :label="getComponentData('EU020200_LBL00005', 'caption', 'Inbound Date')"
          label-id="EU020200_LBL00005"
          horizontal
        >
          <div class="inline-flex items-center space-x-2">
            <FormDatePicker
              id="EU020200_DAT00001"
              v-model.string="filters.FLT_INBOUND_DATE_FROM"
              placeholder="Select a date"
              mode="date"
            />

            <FormDatePicker
              id="EU020200_DAT00002"
              v-model.string="filters.FLT_INBOUND_DATE_TO"
              placeholder="Select a date"
              mode="date"
            />
          </div>
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU020200_LBL00006', 'caption', 'Status')"
          label-id="EU020200_LBL00006"
          label-for="EU020200_CMB00002"
          horizontal
        >
          <FormSelect
            id="EU020200_CMB00002"
            v-model="InboundStatus"
            :options="getInboundStatus"
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU020200_LBL00007', 'caption', 'Vendor')"
          label-id="EU020200_LBL00007"
          label-for="EU020200_CMB00003"
          horizontal
        >
          <FormSelect
            id="EU020200_CMB00003"
            v-model="VendorData"
            :options="[
              {
                name: 'All',
                value: '',
              },
              ...VendorList.map((item) => ({
                name: decrypt(item.VENDER_FNAME),
                value: decrypt(item.VENDOR_SID),
              }))
            ]"
          />
        </FormGroup>
        <FormGroup />
        <FormGroup />
        <FormGroup
          :label="getComponentData('EU020200_LBL00008', 'caption', 'Key Word')"
          label-id="EU020200_LBL00008"
          horizontal         
        >
          <FormTextInput
            id="EU020200_TXT00004"
            v-model="filters.FLT_KEY_WORD"
          />
        </FormGroup>
        <div class="col-span-1 text-start">
          <Button
            id="EU020200_BTN00001"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="search"
          >
            {{ getComponentData('EU020200_BTN00001', 'caption', 'Search') }}
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
        <div class="flex justify-between items-center">
          <p>
            {{ getGridData('EU020200_GRD00001', 'caption', 'Search Result') }}
          </p>
          <Button
            id="EU020200_BTN00002"
            v-tooltip="{
              content: 'Add New',
              placement: 'left',
              trigger: 'hover',
              distance: 10,
              delay: 100,
              popperClass: 'bg-black text-white rounded-md'
            }"
            rounded
            variant="white"
            border
            size="xs"
            @click="StockInboundModal(true)"
          >
            <PlusIcon class="w-5 h-5" />
          </Button>
        </div>
      </template>

          
      <Table
        id="EU020200_GRD00001"
        header-variant="secondary"
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
      :show="openStockDetailsModal"
      size="8xl"
      divider
      @close="() => {
        openStockDetailsModal = false;        
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00320_LBL00001', 'caption', 'Item Inbound') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00320`"
          :create="isCreate"
          :inboundsid="isInboundSID"
          @stock-saved="() => {
            openStockDetailsModal = false
            search(false)
          }"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
