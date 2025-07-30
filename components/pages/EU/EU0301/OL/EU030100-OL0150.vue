<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
const pageLoader = usePageLoaderStore()
const orderStatus = useOrderListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { StationList, filters0050 } = storeToRefs(useOrderListStore())
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);

const orderDetailList = ref([])
const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(orderDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const viewType = ref({})
const orderType = ref({})
const channelList = ref([])
const Station = ref({})
const userChannelList = ref([])

const selectedList = ref([]);
const selectAll = ref(false);
watch(selectAll, (value) => {
  // Updating selected summary based on the selectAll checkbox
  selectedList.value = value
    ? orderDetailList.value.map((item) => ({
      FLT_ORD_SID: item.ORD_SID,
      FLT_ORD_BRAND_CODE: item.ORD_BRAND_CODE,
      FLT_ORD_CHANNEL_CODE: item.ORD_CHANNEL_CODE,
    }))
    : [];
});

const selectAll2 = ref(false);
watch(selectAll2, (value) => {
  // Updating selected summary based on the selectAll checkbox
  selectedList.value = value
    ? orderDetailList.value.map((item) => ({
      FLT_ORD_SID: item.ORD_SID,
      FLT_ORD_BRAND_CODE: item.ORD_BRAND_CODE,
      FLT_ORD_CHANNEL_CODE: item.ORD_CHANNEL_CODE,
    }))
    : [];
});

watch(() => Station, async (value) => {
  if (value) {

    const selectedWHGroup = StationList.value.find((country) => decrypt(country.USER_SID) === value?.value.value)

    userChannelList.value = selectedWHGroup.STATION_CHANNEL_LIST

    channelList.value = selectedWHGroup.STATION_CHANNEL_LIST.map((channel) => {
      return {
        name: decrypt(channel.CHANNEL_DESCR),
        value: decrypt(channel.CHANNEL_CODE),
      }
    })
    //await orderStatus.fetchUserGroupChannelList(value?.value.value) 
  }
}, { deep: true })

onMounted(async () => {
  isloading.isLoading = true
  viewType.value = commonData.getOrderViewOptions[0] ?? {};
  orderType.value = commonData.getOrderSplitOptions[0] ?? {};
  await orderStatus.fetchStationList()  
  Station.value = {
    name: decrypt(StationList.value[0].STATION_ID),
    value: decrypt(StationList.value[0].USER_SID),
  };


  filters0050.value.FLT_ORDER_TYPES = [ "C" ];
  filters0050.value.FLT_CHANNELS = StationList.value[0].STATION_CHANNEL_LIST.map((channel) => decrypt(channel.CHANNEL_CODE))
  filters0050.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters0050.value.FLT_SPLIT_OPT = orderType?.value.value ?? '';
  filters0050.value.FLT_INCLUDE_REQSUB = "1";
  filters0050.value.USER_SID = Station.value?.value
  filters0050.value.FLT_DATE_FROM = ''
  filters0050.value.FLT_DATE_TO = ''

   /* channelList.value = userGroupChannelList.value.map((channel) => {
      return {
        name: channel.USER_CHANNEL_DESCR,
        value: channel.USER_CHANNEL_CODE,
      }
    })*/

    const { data } = await orderStatus.fetchOrderDetailList0050();
    orderDetailList.value = data
 /* if (success) {
    filters0050.value.FLT_ORDER_TYPES = [ "C" ];
    filters0050.value.FLT_CHANNELS = userGroupChannelList.value.map((channel) => channel.USER_CHANNEL_CODE)
    filters0050.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
    filters0050.value.FLT_SPLIT_OPT = orderType?.value.value ?? '';
    filters0050.value.FLT_INCLUDE_REQSUB = "1";

    channelList.value = userGroupChannelList.value.map((channel) => {
      return {
        name: channel.USER_CHANNEL_DESCR,
        value: channel.USER_CHANNEL_CODE,
      }
    })

    const { data } = await orderStatus.fetchOrderDetailList();
    orderDetailList.value = data
  }*/
  isloading.isLoading = false
})

const updateOrderSubStatus = async (item) => {
  const STATUS_DATA = ref({
    FLT_TO_SUBSTATUS_CODE: item,  
    FLT_ORDERS: selectedList.value ,  
  })
  toggleLoading()
  isloading.isLoading = true
  const { success } = await orderStatus.fetchOrderSubStatusChange(STATUS_DATA.value)
  if (success) 
  {
    await onClickOrderDetailRefresh() 
    selectAll.value = false
    selectAll2.value = false
  }  
  isloading.isLoading = false
  toggleLoading()
}

const onClickOrderDetailRefresh = async () => {
  filters0050.value.FLT_ORDER_TYPES = [ "C" ];
  filters0050.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters0050.value.FLT_SPLIT_OPT = orderType?.value.value ?? '';
  filters0050.value.FLT_CHANNELS = channelList?.value.map((channel) => channel.value) ?? [];
  filters0050.value.FLT_INCLUDE_REQSUB = "1";
  filters0050.value.USER_SID = Station.value?.value
  filters0050.value.FLT_DATE_FROM = ''
  filters0050.value.FLT_DATE_TO = ''

  toggleLoading()
  isloading.isLoading = true
  const { data } = await orderStatus.fetchOrderDetailList0050();
  orderDetailList.value = data
  isloading.isLoading = false
  toggleLoading()
  selectAll.value = false
  selectAll2.value = false
  resetPage()
}

const orderDetailTableColumnsByOrderID = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU030100_GRD05001')
})

const orderDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU030100_GRD05002')
})

const tableId = computed(() => {
  return filters0050.value.FLT_VIEW_OPT === '0010' ? 'EU030100_GRD05001' : 'EU030100_GRD05002'
})

const emits = defineEmits(['onClickOrderDetail'])
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
      <div class="grid grid-cols-5 gap-y-3 gap-x-12">       
        <FormGroup
          :label="getComponentData('EU030100_LBL05001', 'caption', 'Station ID')"
          label-id="EU030100_LBL05001"
          label-for="EU030100_CMB05001"
          horizontal
          label-width="w-1/3"
          input-width="w-2/3"
        >
          <FormSelect
            id="EU030100_CMB05001"
            v-model="Station"
            :options="StationList.map((item) => ({
              name: decrypt(item.STATION_ID),
              value: decrypt(item.USER_SID),
            }))"
          />
        </FormGroup>
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
        <div class="grid grid-cols-5 gap-y-3 gap-x-12"> 
          <FormGroup
            :label="getComponentData('EU030100_LBL05002', 'caption','Select Channel')"
            horizontal
            label-id="EU030100_LBL05002"
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormSelect
              id="EU030100_CMB05002"
              v-model="channelList"
              multiple
              :options="userChannelList.map((channel) => ({
                name: decrypt(channel.CHANNEL_DESCR),
                value: decrypt(channel.CHANNEL_CODE),
              }))"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('EU030100_LBL05003', 'caption','View Type')"
            horizontal
            label-id="OU030100_LBL05003"
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormSelect
              id="EU030100_CMB05003"
              v-model="viewType"
              :options="commonData.getOrderViewOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('EU030100_LBL05004', 'caption','Split Order')"
            horizontal
            label-id="EU030100_LBL05004"
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormSelect
              id="EU030100_CMB05004"
              v-model="orderType"
              :options="commonData.getOrderSplitOptions"
            />
          </FormGroup>

          <div class="flex">
            <Button
              id="EU030100_BTN05001"
              variant="gray"
              rounded
              size="sm"
              :disabled="loading"
              :loading="loading"
              @click="onClickOrderDetailRefresh"
            >
              {{ getComponentData ('EU030100_BTN05001', 'caption','Search') }}
            </Button>
          </div>
        </div>
      </template>
      <div class="pl-3 space-y-2">
        <span v-if="getGridData('EU030100_GRD05001', 'display') === 'N'">
          {{ getGridData('EU030100_GRD05002', 'caption') }}
        </span>

        <Table
          v-if="tableId === 'EU030100_GRD05001'"
          id="EU030100_GRD05001"
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
                FLT_ORD_SID: item.ORD_SID,
                FLT_ORD_BRAND_CODE: item.ORD_BRAND_CODE,
                FLT_ORD_CHANNEL_CODE: item.ORD_CHANNEL_CODE,
              }"
            />
          </template>
        </Table>

        <Table
          v-if="tableId === 'EU030100_GRD05002'"
          id="EU030100_GRD05002"
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
                FLT_ORD_SID: item.ORD_SID,
                FLT_ORD_BRAND_CODE: item.ORD_BRAND_CODE,
                FLT_ORD_CHANNEL_CODE: item.ORD_CHANNEL_CODE,
              }"
            />
          </template>
        </Table>
      </div>

      <!-- Pagination -->
      <div
        class="flex justify-between items-center pl-3"
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
          @page-changed="currentPage = $event"
        />
      </div>
    </Card> 
    <div
      class="flex space-x-3 justify-end p-2"
    >
      <Button
        id="EU030100_BTN05002"
        class="w-52"
        rounded
        variant="gray"
        :disabled="loading || orderDetailList?.length == 0"
        :loading="loading"
        @click="updateOrderSubStatus('0274')"
      >
        {{ getComponentData('EU030100_BTN03002', 'caption','UnHold') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
