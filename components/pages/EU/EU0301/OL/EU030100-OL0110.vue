<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const orderStatus = useOrderListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { StationList, orderSummaryList, filters0010, STATION_USER_SID } = storeToRefs(useOrderListStore())
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const orderDetailList = ref([])
const selectedList = ref([]);
const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(orderDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const selectedOrderSummaryData = ref(null)
const viewType = ref(null)
const orderType = ref(null)
const channels = ref([])
const fltStatus = ref([])
const Station = ref({})
const SelectStatus = ref("")
const Selectchannel = ref("")

const emits = defineEmits(['onClickOrderDetail','onClickPrint'])

const selectAll = ref(false);
watch(selectAll, (value) => {
  // Updating selected summary based on the selectAll checkbox
  selectedList.value = value
    ? orderDetailList.value.map((item) => ({
      ORD_SID: item.ORD_SID,
      BRAND_CODE: item.ORD_BRAND_CODE,
      CHANNEL_CODE: item.ORD_CHANNEL_CODE,
    }))
    : [];
});

const selectAll2 = ref(false);
watch(selectAll2, (value) => {
  // Updating selected summary based on the selectAll checkbox
  selectedList.value = value
    ? orderDetailList.value.map((item) => ({
      ORD_SID: item.ORD_SID,
      BRAND_CODE: item.ORD_BRAND_CODE,
      CHANNEL_CODE: item.ORD_CHANNEL_CODE,
    }))
    : [];
});

watch(() => Station, async (value) => {
  if (value) {
    STATION_USER_SID.value = value?.value.value
    await orderStatus.fetchOrderSummaryList()   
    selectAll.value = false
    selectAll2.value = false
  }
}, { deep: true })

onMounted(async () => {
  isloading.isLoading = true
  //await orderStatus.fetchOrderSummaryList()
  await orderStatus.fetchStationList()

  Station.value = {
    name: decrypt(StationList.value[0].STATION_ID),
    value: decrypt(StationList.value[0].USER_SID),
  };

  viewType.value = commonData.getOrderViewOptions[0] ?? {};
  orderType.value = commonData.getOrderSplitOptions[0] ?? {};
  isloading.isLoading = false
})

const onClickOrdSumCount = async (item, status) => {
  selectedOrderSummaryData.value = item

  SelectStatus.value = status

  Selectchannel.value = item.ORD_SUM_CHANNEL_CODE

  filters0010.value.FLT_STATUS = [status];
  filters0010.value.FLT_CHANNELS = [item.ORD_SUM_CHANNEL_CODE];
  channels.value = [item.ORD_SUM_CHANNEL_CODE];
  fltStatus.value = [status];
  filters0010.value.FLT_INCLUDE_REQSUB = "0";
  filters0010.value.FLT_ORDER_TYPES = ["O", "S"];
  filters0010.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters0010.value.FLT_SPLIT_OPT = orderType?.value.value ?? '';
  await fetchData();
}

const onClickOrderDetailRefresh = async () => {
  filters0010.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters0010.value.FLT_SPLIT_OPT = orderType?.value.value ?? '';

  await fetchData();
}

const fetchData = async () => {
  toggleLoading()
  isloading.isLoading = true

  filters0010.value.FLT_STATUS = fltStatus.value
  filters0010.value.FLT_CHANNELS = channels.value
  filters0010.value.FLT_INCLUDE_REQSUB = "0";
  filters0010.value.FLT_ORDER_TYPES = ["O", "S"];
  filters0010.value.USER_SID = Station.value?.value
  
  const { data }  = await orderStatus.fetchOrderDetailList0010()
  orderDetailList.value = data

  selectAll.value = false
  selectAll2.value = false
  isloading.isLoading = false
  toggleLoading()
  resetPage()
}

const orderSummaryTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU030100_GRD01001')
})

const orderDetailTableColumnsByOrderID = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU030100_GRD01002')
})

const orderDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU030100_GRD01003')
})

const tableId = computed(() => {
  return filters0010.value.FLT_VIEW_OPT === '0010' ? 'EU030100_GRD01002' : 'EU030100_GRD01003'
})



const updateOrderStatus = async (item) => {
  const STATUS_DATA = ref({
    FLT_TO_STATUS_CODE: item,  
    FLT_ORDERS: selectedList.value.map((item) => ({
      ORD_SID: item.ORD_SID,
      BRAND_CODE: item.ORD_BRAND_CODE,
      CHANNEL_CODE: item.ORD_CHANNEL_CODE,
    })) ,  
  })
  toggleLoading()
  isloading.isLoading = true
  const { success } = await orderStatus.fetchOrderStatusChange(STATUS_DATA.value)
  if (success) 
  {
    await orderStatus.fetchOrderSummaryList() 
    selectAll.value = false
    selectAll2.value = false
    await onClickOrderDetailRefresh() 
  }  
  isloading.isLoading = false
  toggleLoading()
}

const onClickOrderDetailRow = (item) => {
    const RowData = {}
  
  Object.entries(item).forEach(([key, value]) => {
    if (value != null)
    RowData[key] = decrypt(value)
    else
    RowData[key] = value
  })

  emits('onClickOrderDetail', RowData)
}
const onClickPrintButton = (item) => {


  const GETCHANNEL = StationList.value?.find((item) => decrypt(item.USER_SID) === Station.value?.value ?? '')
  const GETCOURIER = GETCHANNEL.STATION_CHANNEL_LIST?.find((item) => item.CHANNEL_CODE === Selectchannel.value)
  //CourierSID.value = GETCOURIER?.CHANNEL_COURIER_SID ?? ''

  emits('onClickPrint', item,selectedList.value,'',Station.value?.value,GETCOURIER?.CHANNEL_COURIER_SID ?? '')
}
</script>

<template>  
  <div class="space-y-3 pl-3">    
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-2 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>
        <div class="grid grid-cols-5 gap-y-3 gap-x-12">       
          <FormGroup
            :label="getComponentData('EU030100_LBL01001', 'caption', 'Station ID')"
            label-id="EU030100_LBL01001"
            label-for="EU030100_CMB01001"
            horizontal
          >
            <FormSelect
              id="EU030100_CMB01001"
              v-model="Station"
              :options="StationList.map((item) => ({
                name: decrypt(item.STATION_ID),
                value: decrypt(item.USER_SID),
              }))"
            />
          </FormGroup>
        </div>
      </template>
      <span class="font-black text-md">
        {{ getGridData('EU030100_GRD01001', 'caption','Order Summary') }}
      </span>

      <Table
        id="EU030100_GRD01001"
        condensed
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="orderSummaryTableColumns"
        :items="orderSummaryList"
      >
        <template #cell(ORD_SUM_COUNT_00)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickOrdSumCount(item, '30')"
          >
            {{ value ? decrypt(value) : '-' }}
          </span>
        </template>

        <template #cell(ORD_SUM_COUNT_01)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickOrdSumCount(item, '31')"
          >
            {{ value ? decrypt(value) : '-' }}
          </span>
        </template>

        <template #cell(ORD_SUM_COUNT_02)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickOrdSumCount(item, '32')"
          >
            {{ value ? decrypt(value) : '-' }}
          </span>
        </template>

        <template #cell(ORD_SUM_COUNT_03)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickOrdSumCount(item, '40')"
          >
            {{ value ? decrypt(value) : '-' }}
          </span>
        </template>

        <template #cell(ORD_SUM_COUNT_04)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickOrdSumCount(item, '50')"
          >
            {{ value ? decrypt(value) : '-' }}
          </span>
        </template>

        <template #cell(ORD_SUM_COUNT_05)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickOrdSumCount(item, decrypt(value))"
          >
            {{ value ? decrypt(value) : '-' }}
          </span>
        </template>

        <template #cell(ORD_SUM_COUNT_06)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickOrdSumCount(item, decrypt(value))"
          >
            {{ value ? decrypt(value) : '-' }}
          </span>
        </template>

        <template #cell(ORD_SUM_COUNT_07)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickOrdSumCount(item, decrypt(value))"
          >
            {{ value ? decrypt(value) : '-' }}
          </span>
        </template>

        <template #cell(ORD_SUM_COUNT_08)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickOrdSumCount(item, decrypt(value))"
          >
            {{ value ? decrypt(value) : '-' }}
          </span>
        </template>

        <template #cell(ORD_SUM_COUNT_09)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickOrdSumCount(item, decrypt(value))"
          >
            {{ value ? decrypt(value) : '-' }}
          </span>
        </template>
      </Table>
    </Card>    

    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-3 space-y-3 gap-y-3"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>
        <Breadcrumb
          v-if="selectedOrderSummaryData"
          class="pb-1"
          :pages="[
            {
              name: decrypt(selectedOrderSummaryData.ORD_SUM_BRAND_SNAME) ?? '',
            },
            {
              name: decrypt(selectedOrderSummaryData.ORD_SUM_CHANNEL_SNAME) ?? '',
            },
            {
              name: fltStatus.map((status) => {
                return commonData.getOrderStatusList.find((item) => item.value === status)?.name ?? status
              }).join(', '),
            }
          ]"
        />

        <div class="grid grid-cols-4 gap-x-6 items-center">
          <FormGroup
            :label="getComponentData('EU030100_LBL01003', 'caption')"
            horizontal
            label-id="EU030100_LBL01003"
          >
            <FormSelect
              id="EU030100_CMB01002"
              v-model="viewType"
              :options="commonData.getOrderViewOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('EU030100_LBL01004', 'caption')"
            horizontal
            label-id="EU030100_LBL01003"
          >
            <FormSelect
              id="EU030100_CMB01004"
              v-model="orderType"
              :options="commonData.getOrderSplitOptions"
            />
          </FormGroup>

          <div>
            <Button
              id="EU030100_BTN01001"
              variant="gray"
              rounded
              size="sm"
              class="w-36"
              :disabled="loading"
              :loading="loading"
              @click="onClickOrderDetailRefresh"
            >
              {{ getComponentData ('EU030100_BTN01001', 'caption') }}
            </Button>
          </div>
        </div>
      </template>
      <Table
        v-if="tableId === 'EU030100_GRD01002'"
        id="EU030100_GRD01002"
        clickable
        checkable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="orderDetailTableColumnsByOrderID"
        :items="paginatedData"
        @on-row-double-click="onClickOrderDetailRow"
      >       
        <template
          v-if="paginatedData.length"
          #header(CHECKBOX)
        >
          <FormCheckbox
            v-model="selectAll"
            :value="true"
          />
        </template>
        <template
          v-if="paginatedData.length"
          #cell(CHECKBOX)="{ item }"
        >
          <FormCheckbox
            v-model="selectedList"
            :value="{
              ORD_SID: item.ORD_SID,
              BRAND_CODE: item.ORD_BRAND_CODE,
              CHANNEL_CODE: item.ORD_CHANNEL_CODE,
            }"
          />
        </template>
      </Table>

      <Table
        v-if="tableId === 'EU030100_GRD01003'"
        id="EU030100_GRD01003"
        clickable
        checkable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="orderDetailTableColumnsByProducts"
        :items="paginatedData"
        @on-row-double-click="onClickOrderDetailRow"
      >       
        <template
          v-if="paginatedData.length"
          #header(CHECKBOX)
        >
          <FormCheckbox
            v-model="selectAll2"
            :value="true"
          />
        </template>
        <template
          v-if="paginatedData.length"
          #cell(CHECKBOX)="{ item }"
        >
          <FormCheckbox
            v-model="selectedList"
            :value="{
              ORD_SID: item.ORD_SID,
              BRAND_CODE: item.ORD_BRAND_CODE,
              CHANNEL_CODE: item.ORD_CHANNEL_CODE,
            }"
          />
        </template>
      </Table>

      <!-- Pagination -->
      <div
        v-if="orderDetailList?.length && selectedOrderSummaryData"
        class="flex justify-between items-center"
      >
        <p class="text-sm text-gray-700">
          Showing
          <span class="mx-1">
            {{ (currentPage - 1) * perPage + 1 }}
          </span>
          to
          <span class="mx-1">
            {{ isLastPage ? orderDetailList?.length : currentPage * perPage }}
          </span>
          of
          <span class="mx-1">
            {{ orderDetailList?.length }}
          </span>
          results
        </p>

        <Pagination
          :total-items="orderDetailList?.length"
          :items-per-page="perPage"
          :current-page="currentPage"
          rounded
          active-variant="gray"
          @page-changed="currentPage = $event"
        />
      </div>
    </Card> 
    <div
      v-if="orderDetailList?.length && selectedOrderSummaryData"
      class="flex space-x-3 justify-end p-2"
    >
      <Button
        id="EU030100_BTN01001"
        class="w-52"
        rounded
        variant="gray"
        :disabled="loading || selectedList?.length == 0"
        :loading="loading"
        @click="onClickPrintButton('WAYBILL')"
      >
        {{ getComponentData('EU030100_BTN01002', 'caption','Waybill Printing') }}
      </Button>

      <Button
        id="EU030100_BTN01002"
        class="w-52"
        rounded
        variant="gray"
        :disabled="loading || selectedList?.length == 0"
        :loading="loading"
        @click="onClickPrintButton('INVOICE')"
      >
        {{ getComponentData('EU030100_BTN01003', 'caption','Invoice Printing') }}
      </Button>

      <Button
        id="EU030100_BTN01003"
        class="w-52"
        rounded
        variant="gray"
        :disabled="loading || SelectStatus != '30' || selectedList?.length == 0"
        :loading="loading"
        @click="updateOrderStatus('32')"
      >
        {{ getComponentData('EU030100_BTN01004', 'caption','Preparing') }}
      </Button>

      <Button
        id="EU030100_BTN01004"
        class="w-52"
        rounded
        variant="gray"
        :disabled="loading || SelectStatus != '50' || selectedList?.length == 0"
        :loading="loading"
        @click="updateOrderStatus('60')"
      >
        {{ getComponentData('EU030100_BTN01005', 'caption','Shipping') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
