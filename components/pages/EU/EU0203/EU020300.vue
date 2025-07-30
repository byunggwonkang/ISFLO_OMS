<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import {PlusIcon} from "@heroicons/vue/24/solid";

const { pageLoading, togglePageLoading } = usePageLoading();

const pageLoader = usePageLoaderStore()
const StockOutbound = useStockOutbound()
const { currentTab } = storeToRefs(useTabsStore())

const { OutboundList, filters, WHList, VendorList,StoreList } = storeToRefs(StockOutbound)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(OutboundList, perPage.value);
const { loading, toggleLoading } = useLoading()

const isCreate = ref(false)
const isOutboundSID = ref("")

const isStore = ref(true)
const isVendor = ref(true)

const whData = ref({})
const StoreData = ref({})
const OutboundStatus = ref({})
const VendorData = ref({})

const getOutboundStatus = ref([{
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

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const fetchOutboundList = async () => {
  await StockOutbound.fetchOutboundList()
}

onBeforeUnmount(() => {
  StockOutbound.clearOutboundList()
})

const openStockDetailsModal = ref(false)

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00330')
  await StockOutbound.fetchWHList()  
  await StockOutbound.fetchVendorList()

  whData.value = {
    name: 'All',
    value: '',
  };
  StoreData.value = {
    name: 'All',
    value: '',
  };
  OutboundStatus.value = {
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
    const selectedChannel = WHList.value.find((channel) => decrypt(channel.WH_CODE) === value?.value.value)
    filters.value.FLT_OUTBOUND_BRAND_FNAME = selectedChannel?.WH_BRAND_FNAME ? decrypt(selectedChannel?.WH_BRAND_FNAME) : ''
    if(value?.value.value == '')
    {
      StockOutbound.clearStoreList()
    }
    else
    {
      StockOutbound.fetchStoreList(selectedChannel?.WH_BRAND_CODE)
    }
    
  }
}, { deep: true })

const search = async (showLoading = true) => {
  filters.value.FLT_OUTBOUND_STATUS_CODE = OutboundStatus.value?.value
  filters.value.FLT_OUTBOUND_VENDOR_SID = VendorData.value?.value
  filters.value.FLT_OUTBOUND_STORE_SID = StoreData.value?.value
  if (showLoading) toggleLoading()
  isloading.isLoading = true
  await fetchOutboundList()
  isloading.isLoading = false
  if (showLoading) toggleLoading()

  resetPage()
}

const onClickItemDetailRow = (item) => {
  isCreate.value = false
  isOutboundSID.value = item.OUTBOUND_SID  
  openStockDetailsModal.value = true
}

const OutboundListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU020300_GRD00001')
})

const StockOutboundModal = async () => {
  isCreate.value = true
  isOutboundSID.value = ''  
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
          :label="getComponentData('EU020300_LBL00001', 'caption', 'Wearhouse')"
          label-id="EU020300_LBL00001"
          label-for="EU020300_CMB00001"
          horizontal
          label-width="w-1/4"
          input-width="w-3/4"
        >
          <FormCombobox
            id="EU020300_CMB00001"
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
          :label="getComponentData('EU020300_LBL00002', 'caption', 'Brand')"
          label-id="EU020300_LBL00002"
          label-for="EU020300_TXT00001"
          horizontal
        >
          <FormTextInput
            id="EU020300_TXT00001"
            v-model="filters.FLT_OUTBOUND_BRAND_FNAME"
            disabled
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU020300_LBL00003', 'caption', 'Outbound QTY From')"
          label-id="EU020300_LBL00003"
          horizontal
        >
          <div class="inline-flex items-center space-x-2">
            <FormTextInput
              id="EU020300_TXT00002"
              v-model="filters.FLT_OUTBOUND_QTY_FROM"
            />
            <FormGroup
              :label="getComponentData('EU020300_LBL00004', 'caption', 'To')"
              label-id="EU020300_LBL00004"
              horizontal
            />
            <FormTextInput
              id="EU020300_TXT00003"
              v-model="filters.FLT_OUTBOUND_QTY_TO"
            />
          </div>          
        </FormGroup>  
        <FormGroup
          :label="getComponentData('EU020300_LBL00005', 'caption', 'Outbound Date')"
          label-id="EU020300_LBL00005"
          horizontal
        >
          <div class="inline-flex items-center space-x-2">
            <FormDatePicker
              id="EU020300_DAT00001"
              v-model.string="filters.FLT_OUTBOUND_DATE_FROM"
              placeholder="Select a date"
              mode="date"
            />

            <FormDatePicker
              id="EU020300_DAT00002"
              v-model.string="filters.FLT_OUTBOUND_DATE_TO"
              placeholder="Select a date"
              mode="date"
            />
          </div>
        </FormGroup>
        <FormGroup />        
        <FormGroup
          :label="getComponentData('EU020300_LBL00006', 'caption', 'Status')"
          label-id="EU020300_LBL00006"
          label-for="EU020300_CMB00002"
          horizontal
        >
          <FormSelect
            id="EU020300_CMB00002"
            v-model="OutboundStatus"
            :options="getOutboundStatus"
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU020300_LBL00007', 'caption', 'Store')"
          label-id="EU020300_LBL00007"
          label-for="EU020300_CMB00003"
          horizontal
          prefix-class="z-10"
        >
          <template #prefix>
            <FormCheckbox
              v-model="isStore"
            />
          </template>
          <FormCombobox
            id="EU020300_CMB00003"
            v-model="StoreData"
            :options="[
              {
                name: 'All',
                value: '',
              },  
              ...StoreList.map((item) => ({
                name: decrypt(item.STORE_FNAME),
                value: decrypt(item.STORE_SID),
              }))
            ]"
            :disabled="!isStore"
          />           
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU020300_LBL00007', 'caption', 'Vendor')"
          label-id="EU020300_LBL00007"
          label-for="EU020300_CMB00003"
          horizontal
          prefix-class="z-10"
        >
          <template #prefix>
            <FormCheckbox
              v-model="isVendor"
            />
          </template>
          <FormCombobox
            id="EU020300_CMB00003"
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
            :disabled="!isVendor"
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU020300_LBL00008', 'caption', 'Key Word')"
          label-id="EU020300_LBL00008"
          horizontal         
        >
          <FormTextInput
            id="EU020300_TXT00004"
            v-model="filters.FLT_KEY_WORD"
          />
        </FormGroup>
        <div class="col-span-1 text-start">
          <Button
            id="EU020300_BTN00001"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="search"
          >
            {{ getComponentData('EU020300_BTN00001', 'caption', 'Search') }}
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
            {{ getGridData('EU020300_GRD00001', 'caption', 'Search Result') }}
          </p>
          <Button
            id="EU020300_BTN00002"
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
            @click="StockOutboundModal(true)"
          >
            <PlusIcon class="w-5 h-5" />
          </Button>
        </div>
      </template>

          
      <Table
        id="EU020300_GRD00001"
        header-variant="secondary"
        clickable
        :columns="OutboundListTableFields"
        :items="paginatedData"
        @on-row-click="onClickItemDetailRow"
      />
      <!-- Pagination -->
      <div
        v-if="OutboundList?.length"
        class="flex justify-between items-center"
      >
        <p class="text-sm text-gray-700">
          Showing
          <span class="mx-1">
            {{ (currentPage - 1) * perPage + 1 }}
          </span>
          to
          <span class="mx-1">
            {{ isLastPage ? OutboundList?.length : currentPage * perPage }}
          </span>
          of
          <span class="mx-1">
            {{ OutboundList?.length }}
          </span>
          results
        </p>

        <Pagination
          :total-items="OutboundList?.length"
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
          {{ getComponentData('POP00330_LBL00001', 'caption', 'Item Outbound') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00330`"
          :create="isCreate"
          :outboundsid="isOutboundSID"
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
