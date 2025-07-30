<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const exchangeStatus = useExchangeStatusStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { exchangeSummaryList, filters10 } = storeToRefs(useExchangeStatusStore())
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const exchangeDetailList = ref([])

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(exchangeDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const selectedExchangeSummaryData = ref(null)
const viewType = ref(null)
const channels = ref([])
const fltStatus = ref([])

const emits = defineEmits(['onClickExchangeDetail'])

onMounted(async () => {
  isloading.isLoading = true
  await exchangeStatus.fetchExchangeSummaryList()
  viewType.value = commonData.getExchangeViewOptions[0] ?? {};
  isloading.isLoading = false
})

const onClickExcSumCount = async (item, status) => {
  selectedExchangeSummaryData.value = item

  filters10.value.FLT_STATUS = [status];
  filters10.value.FLT_CHANNELS = [item.EXC_SUM_CHANNEL_CODE];
  channels.value = [item.EXC_SUM_CHANNEL_CODE];

  fltStatus.value = [status];
  filters10.value.FLT_EXCHANGE_TYPES = ["E"];
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

  const { data } = await exchangeStatus.fetchExchangeDetailList10()
  exchangeDetailList.value = data
  isloading.isLoading = false
  toggleLoading()
  resetPage()
}

const exchangeSummaryTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030300_GRD01001')
})

const exchangeDetailTableColumnsByExchangeID = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030300_GRD01002')
})

const exchangeDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030300_GRD01003')
})

const tableId = computed(() => {
  return filters10.value.FLT_VIEW_OPT === '0010' ? 'OU030300_GRD01002' : 'OU030300_GRD01003'
})

const onClickExchangeDetailRow = (item) => {
  const RowData = {}
  
  Object.entries(item).forEach(([key, value]) => {
    if (value != null)
    RowData[key] = decrypt(value)
    else
    RowData[key] = value
  })

  emits('onClickExchangeDetail', RowData)
}

const onClickExchangeDetailRefresh = async () => {
  await fetchData();
  filters10.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
}
</script>

<template>
  <div class="space-y-3 pl-3">
    <span class="font-black text-md">
      {{ getGridData('OU030300_GRD01001', 'caption', 'Exchange Summary') }}
    </span>

    <Table
      id="OU030300_GRD01001"
      condensed
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="exchangeSummaryTableColumns"
      :items="exchangeSummaryList"
    >
      <template #cell(EXC_SUM_COUNT_00)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickExcSumCount(item, decrypt(value))"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(EXC_SUM_COUNT_01)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickExcSumCount(item, '10')"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(EXC_SUM_COUNT_02)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickExcSumCount(item, '20')"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(EXC_SUM_COUNT_03)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickExcSumCount(item, '30')"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(EXC_SUM_COUNT_04)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickExcSumCount(item, '40')"
        >
          {{ decrypt(value) }}
        </span>
      </template>

      <template #cell(EXC_SUM_COUNT_05)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickExcSumCount(item, '50')"
        >
          {{ decrypt(value) }}
        </span>
      </template>
    </Table>

    <Card
      v-if="selectedExchangeSummaryData"
      shadow-size="none"
      card-body-class="space-y-3 mt-4"
    >
      <Breadcrumb
        class="pb-1"
        :pages="[
          {
            name: decrypt(selectedExchangeSummaryData.EXC_SUM_BRAND_SNAME),
          },
          {
            name: decrypt(selectedExchangeSummaryData.EXC_SUM_CHANNEL_FNAME),
          },
          {
            name: fltStatus.map((status) => {
              return commonData.getExchangeStatusOptions.find((option) => option.value === status)?.name
            }).join(', '),
          },
        ]"
      />

      <div class="grid grid-cols-4 gap-x-6 items-center">
        <FormGroup
          :label="getComponentData('OU030300_LBL01003', 'caption')"
          horizontal
          label-id="OU030300_LBL01003"
        >
          <FormSelect
            id="OU030300_CMB01001"
            v-model="viewType"
            :options="commonData.getExchangeViewOptions"
          />
        </FormGroup>

        <div>
          <Button
            id="OU030300_BTN01001"
            variant="gray"
            rounded
            size="sm"
            class="w-36"
            :disabled="loading"
            :loading="loading"
            @click="onClickExchangeDetailRefresh"
          >
            {{ getComponentData ('OU030300_BTN01002', 'caption') }}
          </Button>
        </div>
      </div>
    </Card>

    <Table
      v-if="selectedExchangeSummaryData && tableId === 'OU030300_GRD01002'"
      id="OU030300_GRD01002"
      clickable
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="exchangeDetailTableColumnsByExchangeID"
      :items="paginatedData"
      @on-row-click="onClickExchangeDetailRow"
    />

    <Table
      v-if="selectedExchangeSummaryData && tableId === 'OU030300_GRD01003'"
      id="OU030300_GRD01003"
      clickable
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="exchangeDetailTableColumnsByProducts"
      :items="paginatedData"
      @on-row-click="onClickExchangeDetailRow"
    />

    <!-- Pagination -->
    <div
      v-if="exchangeDetailList?.length && selectedExchangeSummaryData"
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
