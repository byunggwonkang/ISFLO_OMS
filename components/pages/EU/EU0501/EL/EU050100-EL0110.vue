<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const exchangeList = useExchangeListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { exchangeSummaryList, filters10 } = storeToRefs(exchangeList)
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const exchangeDetailList = ref([])

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(exchangeDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const selectedexchangeSummaryData = ref(null)
const viewType = ref(null)
const channels = ref([])
const fltStatus = ref([])

const emits = defineEmits(['onClickExchangeDetail'])

onMounted(async () => {
  isloading.isLoading = true
  await exchangeList.fetchExchangeSummaryList()
  viewType.value = commonData.getExchangeViewOptions[0] ?? {};
  isloading.isLoading = false
})

const onClickRetSumCount = async (item, status) => {
  selectedexchangeSummaryData.value = item

  filters10.value.FLT_STATUS = [status];
  filters10.value.FLT_CHANNELS = [item.EXC_SUM_CHANNEL_CODE];
  channels.value = [item.EXC_SUM_CHANNEL_CODE];

  fltStatus.value = [status];
  filters10.value.FLT_EXCHANGE_TYPES = ["R"];
  filters10.value.FLT_VIEW_OPT = viewType?.value.value ?? '';

  await fetchData();
}

const fetchData = async () => {
  toggleLoading()
  isloading.isLoading = true

  filters10.value.FLT_STATUS = fltStatus.value
  filters10.value.FLT_CHANNELS = channels.value
  filters10.value.FLT_INCLUDE_REQSUB = "0";
  filters10.value.FLT_EXCHANGE_TYPES = ["E"];
  filters10.value.FLT_VIEW_OPT = viewType?.value.value ?? '';

  const { data } = await exchangeList.fetchExchangeDetailList10()
  exchangeDetailList.value = data
  isloading.isLoading = false
  toggleLoading()
  resetPage()
}

const exchangeSummaryTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU050100_GRD01001')
})

const exchangeDetailTableColumnsByOrderID = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU050100_GRD01002')
})

const exchangeDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU050100_GRD01003')
})

const tableId = computed(() => {
  return filters10.value.FLT_VIEW_OPT === '0010' ? 'EU050100_GRD01002' : 'EU050100_GRD01003'
})

const onClickexchangeDetailRow = (item) => {
  const RowData = {}
  
  Object.entries(item).forEach(([key, value]) => {
    if (value != null)
    RowData[key] = decrypt(value)
    else
    RowData[key] = value
  })

  emits('onClickExchangeDetail', RowData)
}

const onClickexchangeDetailRefresh = async () => {
  filters10.value.FLT_VIEW_OPT = viewType?.value.value ?? '';

  await fetchData();
}
</script>

<template>
  <div class="space-y-3 pl-3">
    <span class="font-black text-md">
      {{ getGridData('EU050100_GRD01001', 'caption', 'Exchange Summary') }}
    </span>

    <Table
      id="EU050100_GRD01001"
      condensed
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="exchangeSummaryTableColumns"
      :items="exchangeSummaryList"
    >
      <template #cell(EXC_SUM_COUNT_00)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, decrypt(value))"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>

      <template #cell(EXC_SUM_COUNT_01)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, '10')"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>

      <template #cell(EXC_SUM_COUNT_02)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, '20')"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>

      <template #cell(EXC_SUM_COUNT_03)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, '30')"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>

      <template #cell(EXC_SUM_COUNT_04)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, '40')"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>

      <template #cell(EXC_SUM_COUNT_05)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, '50')"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>

      <template #cell(EXC_SUM_COUNT_06)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, '50')"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>
    </Table>

    <Card
      v-if="selectedexchangeSummaryData"
      shadow-size="none"
      card-body-class="space-y-3 mt-4"
    >
      <Breadcrumb
        class="pb-1"
        :pages="[
          {
            name: decrypt(selectedexchangeSummaryData.EXC_SUM_BRAND_SNAME),
          },
          {
            name: decrypt(selectedexchangeSummaryData.EXC_SUM_CHANNEL_SNAME),
          },
          {
            name: fltStatus.map((status) => {
              return commonData.getExchangeStatusList.find((item) => item.value === status)?.name ?? status
            }).join(', '),
          }
        ]"
      />

      <div class="grid grid-cols-4 gap-x-6 items-center">
        <FormGroup
          :label="getComponentData('EU050100_LBL01002', 'caption','View Type')"
          horizontal
          label-id="EU050100_LBL01002"
        >
          <FormSelect
            id="EU050100_CMB01001"
            v-model="viewType"
            :options="commonData.getExchangeViewOptions"
          />
        </FormGroup>

        <div>
          <Button
            id="EU050100_BTN01001"
            variant="gray"
            rounded
            size="sm"
            class="w-36"
            :disabled="loading"
            :loading="loading"
            @click="onClickexchangeDetailRefresh"
          >
            {{ getComponentData ('EU050100_BTN01001', 'caption','Refresh') }}
          </Button>
        </div>
      </div>
    </Card>

    <Table
      v-if="selectedexchangeSummaryData && tableId === 'EU050100_GRD01002'"
      id="EU050100_GRD01002"
      clickable
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="exchangeDetailTableColumnsByOrderID"
      :items="paginatedData"
      @on-row-click="onClickexchangeDetailRow"
    />

    <Table
      v-if="selectedexchangeSummaryData && tableId === 'EU050100_GRD01003'"
      id="EU050100_GRD01003"
      clickable
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="exchangeDetailTableColumnsByProducts"
      :items="paginatedData"
      @on-row-click="onClickexchangeDetailRow"
    />

    <!-- Pagination -->
    <div
      v-if="exchangeDetailList?.length && selectedexchangeSummaryData"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? exchangeDetailList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ exchangeDetailList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="exchangeDetailList?.length"
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
