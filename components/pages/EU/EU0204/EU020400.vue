<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import {PlusIcon} from "@heroicons/vue/24/solid";

const { pageLoading, togglePageLoading } = usePageLoading();
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()
const StockAdjust = useStockAdjustment()
const { currentTab } = storeToRefs(useTabsStore())

const { AdjustmentList, filters, WHList, VendorList,StoreList } = storeToRefs(StockAdjust)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(AdjustmentList, perPage.value);
const { loading, toggleLoading } = useLoading()

const isCreate = ref(false)
const isAdjustSID = ref("")
const isAdjustWH = ref("")
const isAdjustCode = ref("")

const isAdjustInc = ref(true)
const isAdjustDec = ref(true)
const isWHTransIn = ref(true)
const isWHTransOut = ref(true)
const isRetFromStore = ref(true)
const isRetFromVendor = ref(true)
const isRetToVendor = ref(true)

const whData = ref({})
const AdjustInc = ref({})
const AdjustDec = ref({})
const FromWhData = ref({})
const ToWhData = ref({})
const FromStoreData = ref({})
const AdjustmentStatus = ref({})
const FromVendorData = ref({})
const ToVendorData = ref({})

const getAdjustmentStatus = ref([{
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

const fetchAdjustmentList = async () => {
  await StockAdjust.fetchAdjustmentList()
}

onBeforeUnmount(() => {
  StockAdjust.clearAdjustmentList()
})

const openStockAdjustModal = ref(false)

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00370')
  await pageLoader.fetchPageLoadData('POP00210')
  await StockAdjust.fetchWHList()  
  await StockAdjust.fetchVendorList()
  await commonData.fetchEU020400CommonData();

  whData.value = {
    name: decrypt(WHList.value[0].WH_FNAME),
    value: decrypt(WHList.value[0].WH_CODE),
  };
  AdjustmentStatus.value = {
    name: 'All',
    value: '',
  };  


  AdjustInc.value = {
    name: 'All',
    value: '',
  };
  AdjustDec.value = {
    name: 'All',
    value: '',
  };
  FromWhData.value = {
    name: 'All',
    value: '',
  };
  ToWhData.value = {
    name: 'All',
    value: '',
  };
  FromStoreData.value = {
    name: 'All',
    value: '',
  };
  FromVendorData.value = {
    name: 'All',
    value: '',
  };  
  ToVendorData.value = {
    name: 'All',
    value: '',
  };
  isloading.isLoading = false
  togglePageLoading()
})

watch(() => whData, (value) => {
  if (value) {
    const selectedChannel = WHList.value.find((channel) => decrypt(channel.WH_CODE) === value?.value.value)
    filters.value.FLT_ADJUST_BRAND_FNAME = selectedChannel?.WH_BRAND_FNAME ? decrypt(selectedChannel?.WH_BRAND_FNAME) :''
    if(value?.value.value == '')
    {
      StockAdjust.clearStoreList()
    }
    else
    {
      StockAdjust.fetchStoreList(selectedChannel?.WH_BRAND_CODE)
    }
    
  }
}, { deep: true })

const search = async (showLoading = true) => {
  filters.value.FLT_ADJUST_WH_CODE = whData.value?.value
  filters.value.FLT_ADJUST_STATUS_CODE = AdjustmentStatus.value?.value
  
  filters.value.FLT_ADJUST_TRANS_10_YN = isAdjustInc.value  ? '1' : '' 
  filters.value.FLT_ADJUST_TRANS_10_REASON_CODE = isAdjustInc.value  ? AdjustInc.value?.value : '' 

  filters.value.FLT_ADJUST_TRANS_20_YN = isAdjustDec.value  ? '1' : '' 
  filters.value.FLT_ADJUST_TRANS_20_REASON_CODE = isAdjustDec.value  ? AdjustDec.value?.value : '' 

  filters.value.FLT_ADJUST_TRANS_30_YN = isWHTransIn.value  ? '1' : '' 
  filters.value.FLT_ADJUST_TRANS_30_FROM_WH_CODE = isWHTransIn.value  ? FromWhData.value?.value : '' 

  filters.value.FLT_ADJUST_TRANS_40_YN = isWHTransOut.value  ? '1' : '' 
  filters.value.FLT_ADJUST_TRANS_40_TO_WH_CODE = isWHTransOut.value  ? ToWhData.value?.value : '' 

  filters.value.FLT_ADJUST_TRANS_50_YN = isRetFromStore.value  ? '1' : '' 
  filters.value.FLT_ADJUST_TRANS_50_FROM_STORE_SID = isRetFromStore.value  ? FromStoreData.value?.value : '' 

  filters.value.FLT_ADJUST_TRANS_60_YN = isRetFromVendor.value  ? '1' : '' 
  filters.value.FLT_ADJUST_TRANS_60_FROM_VENDOR_SID = isRetFromVendor.value  ? FromVendorData.value?.value : '' 

  filters.value.FLT_ADJUST_TRANS_70_YN = isRetToVendor.value  ? '1' : '' 
  filters.value.FLT_ADJUST_TRANS_70_TO_VENDOR_SID = isRetToVendor.value  ? ToVendorData.value?.value : '' 

  if (showLoading) toggleLoading()
  isloading.isLoading = true
  await fetchAdjustmentList()
  isloading.isLoading = false
  if (showLoading) toggleLoading()

  resetPage()
}

const onClickItemDetailRow = (item) => {
  isCreate.value = false
  isAdjustSID.value = item.ADJUST_SID  
  isAdjustWH.value = item.ADJUST_WH_CODE  
  isAdjustCode.value = item.ADJUST_TRANS_CODE  
  openStockAdjustModal.value = true
}

const AdjustmentListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU020400_GRD00001')
})

const StockAdjustModal = async () => {
  isCreate.value = true
  isAdjustSID.value = ''  
  isAdjustWH.value = ''  
  isAdjustCode.value = ''  
  openStockAdjustModal.value = true
}

</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-2 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <div class="grid grid-cols-10 gap-y-3 gap-x-12">
        <div class="col-span-2 space-y-3">
          <FormGroup
            :label="getComponentData('EU020400_LBL00001', 'caption', 'Wearhouse')"
            label-id="EU020400_LBL00001"
            label-for="EU020400_CMB00001"
            horizontal
            label-width="w-1/4"
            input-width="w-3/4"
          >
            <FormSelect
              id="EU020400_CMB00001"
              v-model="whData"
              :options="WHList.map((item) => ({
                name: decrypt(item.WH_FNAME),
                value: decrypt(item.WH_CODE),
              }))"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('EU020400_LBL00002', 'caption', 'Brand')"
            label-id="EU020400_LBL00002"
            label-for="EU020400_TXT00001"
            horizontal
          >
            <FormTextInput
              id="EU020400_TXT00001"
              v-model="filters.FLT_ADJUST_BRAND_FNAME"
              disabled
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('EU020400_LBL00003', 'caption', 'Outbound Date')"
            label-id="EU020400_LBL00003"
            horizontal
          >
            <div class="inline-flex items-center space-x-2">              
              <FormDatePicker
                id="EU020400_DAT00001"
                v-model.string="filters.FLT_ADJUST_TRANS_FROM_DATE"
                placeholder="Select a date"
                mode="date"
              />

              <FormDatePicker
                id="EU020400_DAT00002"
                v-model.string="filters.FLT_ADJUST_TRANS_TO_DATE"
                placeholder="Select a date"
                mode="date"
              />
            </div>
          </FormGroup>
          <FormGroup
            :label="getComponentData('EU020400_LBL00004', 'caption', 'Status')"
            label-id="EU020400_LBL00004"
            label-for="EU020400_CMB00002"
            horizontal
          >
            <FormSelect
              id="EU020400_CMB00002"
              v-model="AdjustmentStatus"
              :options="getAdjustmentStatus"
            />
          </FormGroup> 
          <FormGroup
            :label="getComponentData('EU020400_LBL00006', 'caption', 'Barch No')"
            label-id="EU020400_LBL00006"
            horizontal         
          >
            <FormTextInput
              id="EU020400_TXT00004"
              v-model="filters.FLT_ADJUST_BATCH_NO"
            />
          </FormGroup>
        </div>
        <div class="col-span-6">
          <Card
            divider
            shadow-size="none"
            card-header-class="px-3 py-2 space-y-1"
            class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
            card-body-class="p-3 space-y-3"
          >
            <h3 class="text-md leading-6 font-medium text-gray-900 ">
              {{ getComponentData('EU020400_LBL00007', 'caption', ' Type of Working') }}
            </h3>
            <div class="grid grid-cols-6 gap-y-3 gap-x-3">
              <div class="col-span-1">
                <FormGroup
                  class="py-2"
                  :label="getComponentData('EU020400_LBL00008', 'caption','Adjustment Increase')"
                  label-id="EU020400_LBL00008"
                  label-for="EU020400_CHK00001"
                  label-width="w-10/12"
                  input-width="w-2/12"
                  horizontal
                >
                  <FormCheckbox
                    id="EU020400_CHK00001"
                    v-model="isAdjustInc"
                  />
                </FormGroup> 
              </div>
              <div class="col-span-2">
                <FormGroup
                  :label="getComponentData('EU020400_LBL00009', 'caption','reason')"
                  label-id="EU020400_LBL00009"
                  label-for="EU020400_CMB00003"
                  horizontal
                >
                  <FormCombobox
                    id="EU020400_CMB00003"
                    v-model="AdjustInc"
                    :options="[
                      {
                        name: 'All',
                        value: '',
                      },
                      ...commonData.getAdjustIncReason
                    ]"
                    :disabled="!isAdjustInc"
                  />
                </FormGroup> 
              </div> 
              <div class="col-span-1">
                <FormGroup
                  class="py-2"
                  :label="getComponentData('EU020400_LBL00016', 'caption','Return from store')"
                  label-id="EU020400_LBL00016"
                  label-for="EU020400_CHK00005"
                  label-width="w-10/12"
                  input-width="w-2/12"
                  horizontal
                >
                  <FormCheckbox
                    id="EU020400_CHK00005"
                    v-model="isRetFromStore"
                  />
                </FormGroup>
              </div>
              <div class="col-span-2">                
                <FormGroup
                  :label="getComponentData('EU020400_LBL00017', 'caption','from Store')"
                  label-id="EU020400_LBL00017"
                  label-for="EU020400_CMB00007"
                  horizontal
                >
                  <FormCombobox
                    id="EU020400_CMB00007"
                    v-model="FromStoreData"
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
                    :disabled="!isRetFromStore"
                  />
                </FormGroup> 
              </div> 
            </div>     
            <div class="grid grid-cols-6 gap-y-3 gap-x-3">
              <div class="col-span-1">
                <FormGroup
                  class="py-2"
                  :label="getComponentData('EU020400_LBL00010', 'caption','Adjustment Decrease')"
                  label-id="EU020400_LBL00009"
                  label-for="EU020400_CHK00002"
                  label-width="w-10/12"
                  input-width="w-2/12"
                  horizontal
                >
                  <FormCheckbox
                    id="EU020400_CHK00002"
                    v-model="isAdjustDec"
                  />
                </FormGroup>
              </div>
              <div class="col-span-2">
                <FormGroup
                  :label="getComponentData('EU020400_LBL00011', 'caption','reason')"
                  label-id="EU020400_LBL00011"
                  label-for="EU020400_CMB00004"
                  horizontal
                >
                  <FormCombobox
                    id="EU020400_CMB00004"
                    v-model="AdjustDec"
                    :options="[
                      {
                        name: 'All',
                        value: '',
                      },
                      ...commonData.getAdjustDecReason
                    ]"
                    :disabled="!isAdjustDec"
                  />
                </FormGroup> 
              </div> 
              <div class="col-span-1">                
                <FormGroup
                  class="py-2"
                  :label="getComponentData('EU020400_LBL00018', 'caption','Return from vendor')"
                  label-id="EU020400_LBL00018"
                  label-for="EU020400_CHK00006"
                  label-width="w-10/12"
                  input-width="w-2/12"
                  horizontal
                >
                  <FormCheckbox
                    id="EU020400_CHK00006"
                    v-model="isRetFromVendor"
                  />
                </FormGroup>
              </div>
              <div class="col-span-2">                
                <FormGroup
                  :label="getComponentData('EU020400_LBL00019', 'caption','from Vendor')"
                  label-id="EU020400_LBL00019"
                  label-for="EU020400_CMB00008"
                  horizontal
                >
                  <FormCombobox
                    id="EU020400_CMB00008"
                    v-model="FromVendorData"
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
                    :disabled="!isRetFromVendor"
                  />
                </FormGroup> 
              </div> 
            </div> 
            <div class="grid grid-cols-6 gap-y-3 gap-x-3">
              <div class="col-span-1">
                <FormGroup
                  class="py-2"
                  :label="getComponentData('EU020400_LBL00012', 'caption','WH Transfer-in')"
                  label-id="EU020400_LBL00012"
                  label-for="EU020400_CHK00003"
                  label-width="w-10/12"
                  input-width="w-2/12"
                  horizontal
                >
                  <FormCheckbox
                    id="EU020400_CHK00003"
                    v-model="isWHTransIn"
                  />
                </FormGroup>
              </div>
              <div class="col-span-2">
                <FormGroup
                  :label="getComponentData('EU020400_LBL00013', 'caption','from WH')"
                  label-id="EU020400_LBL00013"
                  label-for="EU020400_CMB00005"
                  horizontal
                >
                  <FormCombobox
                    id="EU020400_CMB00005"
                    v-model="FromWhData"
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
                    :disabled="!isWHTransIn"
                  />
                </FormGroup> 
              </div> 
              <div class="col-span-1">                
                <FormGroup
                  class="py-2"
                  :label="getComponentData('EU020400_LBL00020', 'caption','Return to vendor')"
                  label-id="EU020400_LBL00020"
                  label-for="EU020400_CHK00007"
                  label-width="w-10/12"
                  input-width="w-2/12"
                  horizontal
                >
                  <FormCheckbox
                    id="EU020400_CHK00007"
                    v-model="isRetToVendor"
                  />
                </FormGroup>
              </div>
              <div class="col-span-2">                
                <FormGroup
                  :label="getComponentData('EU020400_LBL00021', 'caption','to Vendor')"
                  label-id="EU020400_LBL00021"
                  label-for="EU020400_CMB00009"
                  horizontal
                >
                  <FormCombobox
                    id="EU020400_CMB00009"
                    v-model="ToVendorData"
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
                    :disabled="!isRetToVendor"
                  />
                </FormGroup> 
              </div> 
            </div> 
            <div class="grid grid-cols-6 gap-y-3 gap-x-3">
              <div class="col-span-1">
                <FormGroup
                  class="py-2"
                  :label="getComponentData('EU020400_LBL00014', 'caption','WH Transfer-out')"
                  label-id="EU020400_LBL00014"
                  label-for="EU020400_CHK00004"
                  label-width="w-10/12"
                  input-width="w-2/12"
                  horizontal
                >
                  <FormCheckbox
                    id="EU020400_CHK00004"
                    v-model="isWHTransOut"
                  />
                </FormGroup>
              </div>
              <div class="col-span-2">
                <FormGroup
                  :label="getComponentData('EU020400_LBL00015', 'caption','to WH')"
                  label-id="EU020400_LBL00015"
                  label-for="EU020400_CMB00006"
                  horizontal
                >
                  <FormCombobox
                    id="EU020400_CMB00006"
                    v-model="ToWhData"
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
                    :disabled="!isWHTransOut"
                  />
                </FormGroup> 
              </div> 
            </div>                  
          </Card>
        </div>
        <div class="col-span-1 text-start">
          <Button
            id="EU020400_BTN00001"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="search"
          >
            {{ getComponentData('EU020400_BTN00001', 'caption', 'Search') }}
          </Button>
        </div>
      </div>
    </Card>
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
            {{ getGridData('EU020400_GRD00001', 'caption', 'Search Result') }}
          </p>
          <Button
            id="EU020400_BTN00002"
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
            @click="StockAdjustModal(true)"
          >
            <PlusIcon class="w-5 h-5" />
          </Button>
        </div>
      </template>

          
      <Table
        id="EU020400_GRD00001"
        header-variant="secondary"
        clickable
        :columns="AdjustmentListTableFields"
        :items="paginatedData"
        @on-row-click="onClickItemDetailRow"
      />
      <!-- Pagination -->
      <div
        v-if="AdjustmentList?.length"
        class="flex justify-between items-center"
      >
        <p class="text-sm text-gray-700">
          Showing
          <span class="mx-1">
            {{ (currentPage - 1) * perPage + 1 }}
          </span>
          to
          <span class="mx-1">
            {{ isLastPage ? AdjustmentList?.length : currentPage * perPage }}
          </span>
          of
          <span class="mx-1">
            {{ AdjustmentList?.length }}
          </span>
          results
        </p>

        <Pagination
          :total-items="AdjustmentList?.length"
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
      :show="openStockAdjustModal"
      size="8xl"
      divider
      @close="() => {
        openStockAdjustModal = false;        
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00370_LBL00001', 'caption', 'Stock Adjustment') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00370`"
          :create="isCreate"
          :adjustsid="isAdjustSID"
          :adjustwh="isAdjustWH"
          :adjustcode="isAdjustCode"
          @stock-saved="() => {
            openStockAdjustModal = false
            search(false)
          }"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
