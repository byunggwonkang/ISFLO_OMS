<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const orderStatus = useOrderStatusStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { orderSummaryList, filters10 } = storeToRefs(useOrderStatusStore())
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const orderDetailList = ref([])

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(orderDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const selectedOrderSummaryData = ref(null)
const viewType = ref(null)
const orderType = ref(null)
const channels = ref([])
const fltStatus = ref([])

const emits = defineEmits(['onClickOrderDetail'])

onMounted(async () => {
  isloading.isLoading = true
  await orderStatus.fetchOrderSummaryList()

  viewType.value = commonData.getOrderViewOptions[0] ?? {};
  orderType.value = commonData.getOrderSplitOptions[0] ?? {};
  isloading.isLoading = false
})

const onClickOrdSumCount = async (item, status) => {
  selectedOrderSummaryData.value = item

  filters10.value.FLT_STATUS = [status];
  filters10.value.FLT_CHANNELS = [item.ORD_SUM_CHANNEL_CODE];
  channels.value = [item.ORD_SUM_CHANNEL_CODE];
  fltStatus.value = [status];
  filters10.value.FLT_INCLUDE_REQSUB = "0";
  filters10.value.FLT_ORDER_TYPES = ["O", "S"];
  filters10.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters10.value.FLT_SPLIT_OPT = orderType?.value.value ?? '';
  await fetchData();
}

const onClickOrderDetailRefresh = async () => {
  filters10.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters10.value.FLT_SPLIT_OPT = orderType?.value.value ?? '';

  await fetchData();
}

const fetchData = async () => {
  toggleLoading()
  isloading.isLoading = true

  filters10.value.FLT_STATUS = fltStatus.value
  filters10.value.FLT_CHANNELS = channels.value
  filters10.value.FLT_INCLUDE_REQSUB = "0";
  filters10.value.FLT_ORDER_TYPES = ["O", "S"];

  const { data }  = await orderStatus.fetchOrderDetailList10()
  orderDetailList.value = data
  toggleLoading()
  isloading.isLoading = false
  resetPage()
}

const orderSummaryTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030100_GRD01001')
})

const orderDetailTableColumnsByOrderID = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030100_GRD01002')
})

const orderDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030100_GRD01003')
})

const tableId = computed(() => {
  return filters10.value.FLT_VIEW_OPT === '0010' ? 'OU030100_GRD01002' : 'OU030100_GRD01003'
})

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
    <span class="font-black text-md">
      {{ getGridData('OU030100_GRD01002', 'caption') }}
    </span>

    <Table
      id="OU030100_GRD01001"
      condensed
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="orderSummaryTableColumns"
      :items="orderSummaryList"
    >
      <template #cell(ORD_SUM_COUNT_00)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickOrdSumCount(item, '09')"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(ORD_SUM_COUNT_01)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickOrdSumCount(item, '10')"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(ORD_SUM_COUNT_02)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickOrdSumCount(item, '20')"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(ORD_SUM_COUNT_03)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickOrdSumCount(item, '30')"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(ORD_SUM_COUNT_04)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickOrdSumCount(item, '32')"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(ORD_SUM_COUNT_05)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickOrdSumCount(item, '40')"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(ORD_SUM_COUNT_06)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickOrdSumCount(item, '50')"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(ORD_SUM_COUNT_07)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickOrdSumCount(item, decrypt(value))"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(ORD_SUM_COUNT_08)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickOrdSumCount(item, decrypt(value))"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(ORD_SUM_COUNT_09)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickOrdSumCount(item, decrypt(value))"
        >
          {{ decrypt(value) }}
        </span>
      </template>
    </Table>

    <Card
      v-if="selectedOrderSummaryData"
      shadow-size="none"
      card-body-class="space-y-3 mt-4"
    >
      <Breadcrumb
        class="pb-1"
        :pages="[
          {
            name: decrypt(selectedOrderSummaryData.ORD_SUM_BRAND_SNAME),
          },
          {
            name: decrypt(selectedOrderSummaryData.ORD_SUM_CHANNEL_SNAME),
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
          :label="getComponentData('OU030100_LBL01002', 'caption')"
          horizontal
          label-id="OU030100_LBL01002"
        >
          <FormSelect
            id="OU030100_CMB01001"
            v-model="viewType"
            :options="commonData.getOrderViewOptions"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU030100_LBL01003', 'caption')"
          horizontal
          label-id="OU030100_LBL01003"
        >
          <FormSelect
            id="OU030100_CMB01002"
            v-model="orderType"
            :options="commonData.getOrderSplitOptions"
          />
        </FormGroup>

        <div>
          <Button
            id="OU030100_BTN01001"
            variant="gray"
            rounded
            size="sm"
            class="w-36"
            :disabled="loading"
            :loading="loading"
            @click="onClickOrderDetailRefresh"
          >
            {{ getComponentData ('OU030100_BTN01001', 'caption') }}
          </Button>
        </div>
      </div>
    </Card>

    <Table
      v-if="selectedOrderSummaryData && tableId === 'OU030100_GRD01002'"
      id="OU030100_GRD01002"
      clickable
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="orderDetailTableColumnsByOrderID"
      :items="paginatedData"
      @on-row-click="onClickOrderDetailRow"
    />

    <Table
      v-if="selectedOrderSummaryData && tableId === 'OU030100_GRD01003'"
      id="OU030100_GRD01003"
      clickable
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="orderDetailTableColumnsByProducts"
      :items="paginatedData"
      @on-row-click="onClickOrderDetailRow"
    />

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
  </div>
</template>

<style scoped>

</style>
