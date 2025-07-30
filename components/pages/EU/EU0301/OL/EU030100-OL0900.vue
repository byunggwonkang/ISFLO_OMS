<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import moment from "moment/moment";
const pageLoader = usePageLoaderStore()
const orderStatus = useOrderListStore()
const commonData = useCommonDataStore()
const { user } = storeToRefs(useAuthStore());
const { orderStatusList } = storeToRefs(useCommonDataStore())
const { currentTab } = storeToRefs(useTabsStore())
const { userGroupChannelList, filters } = storeToRefs(useOrderListStore())
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const orderDetailList = ref([])
const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(orderDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const viewType = ref({})
const orderType = ref({})
const dateType = ref({})
const channelList = ref([])
const statusList = ref([])

onMounted(async () => {
  isloading.isLoading = true
  viewType.value = commonData.getOrderViewOptions[0] ?? {};
  orderType.value = commonData.getOrderSplitOptions[0] ?? {};
  dateType.value = commonData.getOrderDateOptions[0] ?? {};

  const { success } = await orderStatus.fetchUserGroupChannelList()

  if (success) {
    filters.value.FLT_CHANNELS = userGroupChannelList.value.map((channel) => decrypt(channel.USER_CHANNEL_CODE))
    filters.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
    filters.value.FLT_SPLIT_OPT = orderType?.value.value ?? '';
    filters.value.FLT_INCLUDE_REQSUB = "1";
    filters.value.FLT_ORDER_TYPES = ["O", "S"];
    filters.value.FLT_DATE_FROM = moment().format('YYYY-MM-DD'),
    filters.value.FLT_DATE_TO = moment().format('YYYY-MM-DD'),

    channelList.value = userGroupChannelList.value.map((channel) => {
      return {
        name: decrypt(channel.USER_CHANNEL_DESCR),
        value: decrypt(channel.USER_CHANNEL_CODE),
      }
    })

    // const { data } = await orderStatus.fetchOrderDetailList()
    // orderDetailList.value = data
  }
  isloading.isLoading = false
})

const onClickOrderDetailRefresh = async () => {
  filters.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters.value.FLT_SPLIT_OPT = orderType?.value.value ?? '';
  filters.value.FLT_CHANNELS = channelList?.value.map((channel) => channel.value) ?? [];
  filters.value.FLT_STATUS = statusList?.value.map((status) => status.value) ?? [];
  filters.value.FLT_INCLUDE_REQSUB = "1";
  filters.value.FLT_DATE_TYPE = dateType?.value.value ?? '';
  filters.value.FLT_ORDER_TYPES = ["O", "S"];

  toggleLoading()
  isloading.isLoading = true
  const { data } = await orderStatus.fetchOrderDetailList()
  orderDetailList.value = data
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const orderDetailTableColumnsByOrderID = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU030100_GRD09001')
})

const orderDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU030100_GRD09002')
})

const tableId = computed(() => {
  return filters.value.FLT_VIEW_OPT === '0010' ? 'EU030100_GRD09001' : 'EU030100_GRD09002'
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
      <template #header>
        <div class="grid grid-cols-4 gap-y-4 gap-x-12 items-center pl-3 pb-3 border-b">
          <FormGroup
            :label="getComponentData('EU030100_LBL09001', 'caption','Select Channel')"
            horizontal
            label-id="EU030100_LBL09001"
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormSelect
              id="EU030100_CMB09001"
              v-model="channelList"
              multiple
              :options="userGroupChannelList.map((channel) => ({
                name: decrypt(channel.USER_CHANNEL_DESCR),
                value: decrypt(channel.USER_CHANNEL_CODE),
              }))"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('EU030100_LBL09002', 'caption','Order Status')"
            horizontal
            label-id="EU030100_LBL09002"
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormSelect
              id="EU030100_CMB09002"
              v-model="statusList"
              multiple
              :options="orderStatusList?.filter((data) => data.COMM_SNAME !== '')?.map((status) => ({
                name: status.COMM_SNAME,
                value: status.COMM_CODE,
              }))"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('EU030100_LBL09003', 'caption', 'Date Type')"
            horizontal
            label-id="EU030100_LBL09003"
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormSelect
              id="EU030100_CMB09003"
              v-model="dateType"
              :options="commonData.getOrderDateOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('EU030100_LBL09004', 'caption', 'Date')"
            horizontal
            label-id="EU030100_LBL09004"
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <div class="inline-flex items-center space-x-2">
              <FormDatePicker
                id="EU030100_DAT09001"
                v-model.string="filters.FLT_DATE_FROM"
                :placeholder="getComponentData('EU030100_DAT09001', 'placeholder')"
                mode="date"
              />

              <FormDatePicker
                id="EU030100_DAT09002"
                v-model.string="filters.FLT_DATE_TO"
                :placeholder="getComponentData('OU030100_DAT09002', 'placeholder')"
                mode="date"
              />
            </div>
          </FormGroup>

          <FormGroup
            :label="getComponentData('EU030100_LBL09005', 'caption','View Type')"
            horizontal
            label-id="EU030100_LBL09005"
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormSelect
              id="EU030100_CMB09004"
              v-model="viewType"
              :options="commonData.getOrderViewOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('EU030100_LBL09006', 'caption','Split Order')"
            horizontal
            label-id="EU030100_LBL09006"
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormSelect
              id="EU030100_CMB09005"
              v-model="orderType"
              :options="commonData.getOrderSplitOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('EU030100_LBL09007', 'caption','Key Word')"
            horizontal
            label-id="EU030100_LBL09007"
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormTextInput
              id="EU030100_TXT09001"
              v-model="filters.FLT_KEY_WORD"
              size="md"
              :placeholder="getComponentData('EU030100_TXT09001', 'placeholder')"
            />
          </FormGroup>

          <div class="flex">
            <Button
              id="EU030100_BTN09001"
              variant="gray"
              rounded
              size="sm"
              :disabled="loading"
              :loading="loading"
              @click="onClickOrderDetailRefresh"
            >
              {{ getComponentData ('EU030100_BTN09001', 'caption','Search') }}
            </Button>
          </div>
        </div>
      </template>
      <div class="pl-3 space-y-2">
        <span v-if="getGridData('EU030100_GRD09001', 'display') === 'Y'">
          {{ getGridData('EU030100_GRD09002', 'caption') }}
        </span>

        <Table
          v-if="tableId === 'EU030100_GRD09001'"
          id="EU030100_GRD09001"
          clickable
          header-variant="secondary"
          class="overflow-x-auto border-b"
          :columns="orderDetailTableColumnsByOrderID"
          :items="paginatedData"
          @on-row-click="onClickOrderDetailRow"
        />

        <Table
          v-if="tableId === 'EU030100_GRD09002'"
          id="EU030100_GRD09002"
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
            {{ isLastPage ? usersList?.length : currentPage * perPage }}
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
