<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
const pageLoader = usePageLoaderStore()
const orderStatus = useOrderListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { StationList, filters0020 } = storeToRefs(useOrderListStore())
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

  //const { success } = await orderStatus.fetchUserGroupChannelList(StationList.value[0].USER_SID)
  

  filters0020.value.FLT_STATUS = [ "70", "71", "72", "73", "74", "75", "76", "77", "78", "79" ];
  filters0020.value.FLT_CHANNELS = StationList.value[0].STATION_CHANNEL_LIST.map((channel) => decrypt(channel.CHANNEL_CODE))
  filters0020.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters0020.value.FLT_SPLIT_OPT = orderType?.value.value ?? '';
  filters0020.value.FLT_INCLUDE_REQSUB = "0";
  filters0020.value.USER_SID = Station.value?.value
  filters0020.value.FLT_DATE_FROM = ''
  filters0020.value.FLT_DATE_TO = ''

  /*channelList.value = StationList.value[0].STATION_CHANNEL_LIST.value.map((channel) => {
    return {
      name: channel.CHANNEL_DESCR,
      value: channel.CHANNEL_CODE,
    }
  })*/

  const { data } = await orderStatus.fetchOrderDetailList0020()
  orderDetailList.value = data
  isloading.isLoading = false
})

const onClickOrderDetailRefresh = async () => {
  filters0020.value.FLT_STATUS = [ "70", "71", "72", "73", "74", "75", "76", "77", "78", "79" ];
  filters0020.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters0020.value.FLT_SPLIT_OPT = orderType?.value.value ?? '';
  filters0020.value.FLT_CHANNELS = channelList?.value.map((channel) => channel.value) ?? [];
  filters0020.value.FLT_INCLUDE_REQSUB = "0";
  filters0020.value.USER_SID = Station.value?.value
  filters0020.value.FLT_DATE_FROM = ''
  filters0020.value.FLT_DATE_TO = ''

  toggleLoading()
  isloading.isLoading = true
  const { data } = await orderStatus.fetchOrderDetailList0020()
  orderDetailList.value = data
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const orderDetailTableColumnsByOrderID = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU030100_GRD02001')
})

const orderDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU030100_GRD02002')
})

const tableId = computed(() => {
  return filters0020.value.FLT_VIEW_OPT === '0010' ? 'EU030100_GRD02001' : 'EU030100_GRD02002'
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
          :label="getComponentData('EU030100_LBL02001', 'caption', 'Station ID')"
          label-id="EU030100_LBL02001"
          label-for="EU030100_CMB02001"
          horizontal
          label-width="w-1/3"
        >
          <FormSelect
            id="EU030100_CMB02001"
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
            :label="getComponentData('EU030100_LBL02002', 'caption','Select Channel')"
            horizontal
            label-id="EU030100_LBL02002"
            label-width="w-1/3"
          >
            <FormSelect
              id="EU030100_CMB02002"
              v-model="channelList"
              multiple
              :options="userChannelList.map((channel) => ({
                name: decrypt(channel.CHANNEL_DESCR),
                value: decrypt(channel.CHANNEL_CODE),
              }))"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('EU030100_LBL02003', 'caption','View Type')"
            horizontal
            label-id="OU030100_LBL02003"
            label-width="w-1/3"
          >
            <FormSelect
              id="EU030100_CMB02003"
              v-model="viewType"
              :options="commonData.getOrderViewOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('EU030100_LBL02004', 'caption','Split Order')"
            horizontal
            label-id="EU030100_LBL02004"
          >
            <FormSelect
              id="EU030100_CMB02004"
              v-model="orderType"
              :options="commonData.getOrderSplitOptions"
            />
          </FormGroup>

          <div class="flex">
            <Button
              id="EU030100_BTN02001"
              variant="gray"
              rounded
              size="sm"
              :disabled="loading"
              :loading="loading"
              @click="onClickOrderDetailRefresh"
            >
              {{ getComponentData ('EU030100_BTN02001', 'caption','Search') }}
            </Button>
          </div>
        </div>
      </template>
      <div class="pl-3 space-y-2">
        <span v-if="getGridData('EU030100_GRD02001', 'display') === 'N'">
          {{ getGridData('EU030100_GRD02002', 'caption') }}
        </span>

        <Table
          v-if="tableId === 'EU030100_GRD02001'"
          id="EU030100_GRD02001"
          clickable
          header-variant="secondary"
          class="overflow-x-auto border-b"
          :columns="orderDetailTableColumnsByOrderID"
          :items="paginatedData"
          @on-row-click="onClickOrderDetailRow"
        />

        <Table
          v-if="tableId === 'EU030100_GRD02002'"
          id="EU030100_GRD02002"
          clickable
          header-variant="secondary"
          class="overflow-x-auto border-b"
          :columns="orderDetailTableColumnsByProducts"
          :items="paginatedData"
          @on-row-click="onClickOrderDetailRow"
        />
      </div>

      <!-- Pagination -->
      <div
        v-if="orderDetailList?.length"
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
  </div>
</template>

<style scoped>

</style>
