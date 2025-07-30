<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const orderStatus = useOrderStatusStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { userGroupChannelList, filters30 } = storeToRefs(useOrderStatusStore())
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const orderDetailList = ref([])
const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(orderDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const viewType = ref({})
const orderType = ref({})
const channelList = ref([])

onMounted(async () => {
  isloading.isLoading = true
  viewType.value = commonData.getOrderViewOptions[0] ?? {};
  orderType.value = commonData.getOrderSplitOptions[0] ?? {};

  const { success } = await orderStatus.fetchUserGroupChannelList()

  if (success) {
    filters30.value.FLT_STATUS = [ "90", "91", "92", "93", "94", "95", "96", "97", "98" ];
    filters30.value.FLT_CHANNELS = userGroupChannelList.value.map((channel) => decrypt(channel.USER_CHANNEL_CODE))
    filters30.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
    filters30.value.FLT_SPLIT_OPT = orderType?.value.value ?? '';
    filters30.value.FLT_INCLUDE_REQSUB = "1";
    channelList.value = userGroupChannelList.value.map((channel) => {
      return {
        name: decrypt(channel.USER_CHANNEL_DESCR),
        value: decrypt(channel.USER_CHANNEL_CODE),
      }
    })

    const { data } = await orderStatus.fetchOrderDetailList30();
    orderDetailList.value = data
  }
  isloading.isLoading = false
})

const onClickOrderDetailRefresh = async () => {
  filters30.value.FLT_STATUS = [ "90", "91", "92", "93", "94", "95", "96", "97", "98" ];
  filters30.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters30.value.FLT_SPLIT_OPT = orderType?.value.value ?? '';
  filters30.value.FLT_CHANNELS = channelList?.value.map((channel) => channel.value) ?? [];
  filters30.value.FLT_INCLUDE_REQSUB = "1";

  toggleLoading()
  isloading.isLoading = true
  const { data } = await orderStatus.fetchOrderDetailList30();
  orderDetailList.value = data
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const orderDetailTableColumnsByOrderID = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030100_GRD03002')
})

const orderDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030100_GRD03003')
})

const tableId = computed(() => {
  return filters30.value.FLT_VIEW_OPT === '0010' ? 'OU030100_GRD03002' : 'OU030100_GRD03003'
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
  <div class="space-y-3">
    <div class="flex space-x-12 items-center pl-3 pb-3 border-b">
      <FormGroup
        :label="getGridData('OU030100_GRD03001', 'caption')"
        horizontal
      >
        <FormSelect
          v-model="channelList"
          multiple
          :options="userGroupChannelList.map((channel) => ({
            name: decrypt(channel.USER_CHANNEL_DESCR),
            value: decrypt(channel.USER_CHANNEL_CODE),
          }))"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('OU030100_LBL03001', 'caption')"
        horizontal
        label-width="w-1/3"
        label-id="OU030100_LBL03001"
      >
        <FormSelect
          id="OU030100_CMB03001"
          v-model="viewType"
          :options="commonData.getOrderViewOptions"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('OU030100_LBL03002', 'caption')"
        horizontal
        label-id="OU030100_LBL03002"
      >
        <FormSelect
          id="OU030100_CMB03002"
          v-model="orderType"
          :options="commonData.getOrderSplitOptions"
        />
      </FormGroup>

      <div class="flex">
        <Button
          id="OU030100_BTN03001"
          variant="gray"
          rounded
          size="sm"
          :disabled="loading"
          :loading="loading"
          @click="onClickOrderDetailRefresh"
        >
          {{ getComponentData ('OU030100_BTN03001', 'caption') }}
        </Button>
      </div>
    </div>

    <div class="pl-3 space-y-2">
      <span v-if="getGridData('OU030100_GRD03002', 'display') === 'Y'">
        {{ getGridData('OU030100_GRD03002', 'caption') }}
      </span>

      <Table
        v-if="tableId === 'OU030100_GRD03002'"
        id="OU030100_GRD03002"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="orderDetailTableColumnsByOrderID"
        :items="paginatedData"
        @on-row-click="onClickOrderDetailRow"
      />

      <Table
        v-if="tableId === 'OU030100_GRD03003'"
        id="OU030100_GRD03003"
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
  </div>
</template>

<style scoped>

</style>
