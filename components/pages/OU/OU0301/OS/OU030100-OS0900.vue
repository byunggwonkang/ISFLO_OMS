<script setup>
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const orderStatus = useOrderStatusStore()
const commonData = useCommonDataStore()

const { orderStatusList } = storeToRefs(useCommonDataStore())
const { currentTab } = storeToRefs(useTabsStore())
const { userGroupChannelList, filters } = storeToRefs(useOrderStatusStore())
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

const onClickExportExcel = async () => {

  if (filters.value.FLT_VIEW_OPT === '0010')
  {
    const table = document.getElementById('OU030100_GRD09005')
    const wb = XLSX.utils.table_to_book(table, { sheet: 'Sheet1' })
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'table.xlsx')
  }
  else
  {
    const table = document.getElementById('OU030100_GRD09006')
    const wb = XLSX.utils.table_to_book(table, { sheet: 'Sheet1' })
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'table.xlsx')
  }

  
}

const orderDetailTableColumnsByOrderID = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030100_GRD09003')
})

const orderDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030100_GRD09004')
})

const tableId = computed(() => {
  return filters.value.FLT_VIEW_OPT === '0010' ? 'OU030100_GRD09003' : 'OU030100_GRD09004'
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
    <div class="grid grid-cols-4 gap-y-4 gap-x-12 items-center pl-3 pb-3 border-b">
      <FormGroup
        :label="getGridData('OU030100_GRD09001', 'caption')"
        horizontal
        label-width="w-1/3"
        input-width="w-2/3"
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
        :label="getGridData('OU030100_GRD09002', 'caption')"
        horizontal
        label-width="w-1/3"
        input-width="w-2/3"
      >
        <FormSelect
          v-model="statusList"
          multiple
          :options="orderStatusList?.filter((data) => data.COMM_SNAME !== '')?.map((status) => ({
            name: decrypt(status.COMM_SNAME),
            value: decrypt(status.COMM_CODE),
          }))"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('OU030100_CMB09001', 'caption', 'Date Type')"
        horizontal
        label-id="OU030100_CMB09001"
        label-width="w-1/3"
        input-width="w-2/3"
      >
        <FormSelect
          id="OU030100_CMB09001"
          v-model="dateType"
          :options="commonData.getOrderDateOptions"
        />
      </FormGroup>

      <FormGroup
        label="Date"
        horizontal
      >
        <div class="inline-flex items-center space-x-2">
          <FormDatePicker
            id="OU030100_DAT09001"
            v-model.string="filters.FLT_DATE_FROM"
            :placeholder="getComponentData('OU030100_DAT09001', 'placeholder')"
            mode="date"
            label-width="w-1/3"
            input-width="w-2/3"
          />

          <FormDatePicker
            id="OU030100_DAT09002"
            v-model.string="filters.FLT_DATE_TO"
            :placeholder="getComponentData('OU030100_DAT09002', 'placeholder')"
            mode="date"
          />
        </div>
      </FormGroup>

      <FormGroup
        :label="getComponentData('OU030100_LBL09002', 'caption')"
        horizontal
        label-id="OU030100_LBL09002"
        label-width="w-1/3"
        input-width="w-2/3"
      >
        <FormSelect
          id="OU030100_CMB09002"
          v-model="viewType"
          :options="commonData.getOrderViewOptions"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('OU030100_LBL09003', 'caption')"
        horizontal
        label-id="OU030100_LBL09003"
        label-width="w-1/3"
        input-width="w-2/3"
      >
        <FormSelect
          id="OU030100_CMB03003"
          v-model="orderType"
          :options="commonData.getOrderSplitOptions"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('OU030100_LBL09001', 'caption')"
        horizontal
        label-id="OU030100_LBL09001"
        label-width="w-1/3"
        input-width="w-2/3"
      >
        <FormTextInput
          id="OU030100_TXT09001"
          v-model="filters.FLT_KEY_WORD"
          size="md"
          :placeholder="getComponentData('OU030100_TXT09001', 'placeholder')"
        />
      </FormGroup>
      <div class="grid grid-cols-2">
        <div class="text-start">
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
        <div class="text-end">
          <Button
            id="OU030100_BTN03002"
            variant="gray"
            rounded
            size="sm"
            :disabled="loading || !orderDetailList?.length"
            :loading="loading"
            @click="onClickExportExcel"
          > 
            {{ getComponentData ('OU030100_BTN09003', 'caption','EXCEL Export') }}
          </Button>
        </div>
      </div>  
    </div>

    <div class="pl-3 space-y-2">
      <span v-if="getGridData('OU030100_GRD09003', 'display') === 'Y'">
        {{ getGridData('OU030100_GRD09003', 'caption') }}
      </span>

      <Table
        v-if="tableId === 'OU030100_GRD09003'"
        id="OU030100_GRD09003"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="orderDetailTableColumnsByOrderID"
        :items="paginatedData"
        @on-row-click="onClickOrderDetailRow"
      />
      <Table
        v-if="tableId === 'OU030100_GRD09003'"
        v-show="false"
        id="OU030100_GRD09005"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="orderDetailTableColumnsByOrderID"
        :items="orderDetailList"
      />

      <Table
        v-if="tableId === 'OU030100_GRD09004'"
        id="OU030100_GRD09004"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="orderDetailTableColumnsByProducts"
        :items="paginatedData"
        @on-row-click="onClickOrderDetailRow"
      />

      <Table
        v-if="tableId === 'OU030100_GRD09004'"
        v-show="false"
        id="OU030100_GRD09006"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="orderDetailTableColumnsByProducts"
        :items="orderDetailList"
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
  </div>
</template>

<style scoped>

</style>
