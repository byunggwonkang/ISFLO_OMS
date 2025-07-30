<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const returnList = useReturnListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { returnSummaryList, filters10 } = storeToRefs(returnList)
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const returnDetailList = ref([])

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(returnDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const selectedReturnSummaryData = ref(null)
const viewType = ref(null)
const channels = ref([])
const fltStatus = ref([])

const emits = defineEmits(['onClickReturnDetail'])

onMounted(async () => {
  isloading.isLoading = true
  await returnList.fetchReturnSummaryList()
  viewType.value = commonData.getReturnViewOptions[0] ?? {};
  isloading.isLoading = false
})

const onClickRetSumCount = async (item, status) => {
  selectedReturnSummaryData.value = item

  filters10.value.FLT_STATUS = [status];
  filters10.value.FLT_CHANNELS = [item.RET_SUM_CHANNEL_CODE];
  channels.value = [item.RET_SUM_CHANNEL_CODE];

  fltStatus.value = [status];
  filters10.value.FLT_RETURN_TYPES = ["R"];
  filters10.value.FLT_VIEW_OPT = viewType?.value.value ?? '';

  await fetchData();
}

const fetchData = async () => {
  toggleLoading()
  isloading.isLoading = true

  filters10.value.FLT_STATUS = fltStatus.value
  filters10.value.FLT_CHANNELS = channels.value
  filters10.value.FLT_INCLUDE_REQSUB = "0";
  filters10.value.FLT_RETURN_TYPES = ["R"];
  filters10.value.FLT_VIEW_OPT = viewType?.value.value ?? '';

  const { data } = await returnList.fetchReturnDetailList10()
  returnDetailList.value = data
  isloading.isLoading = false
  toggleLoading()
  resetPage()
}

const returnSummaryTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU040100_GRD01001')
})

const returnDetailTableColumnsByOrderID = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU040100_GRD01002')
})

const returnDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU040100_GRD01003')
})

const tableId = computed(() => {
  return filters10.value.FLT_VIEW_OPT === '0010' ? 'EU040100_GRD01002' : 'EU040100_GRD01003'
})

const onClickReturnDetailRow = (item) => {
  const RowData = {}
  
  Object.entries(item).forEach(([key, value]) => {
    if (value != null)
    RowData[key] = decrypt(value)
    else
    RowData[key] = value
  })

  emits('onClickReturnDetail', RowData)
}

const onClickReturnDetailRefresh = async () => {
  filters10.value.FLT_VIEW_OPT = viewType?.value.value ?? '';

  await fetchData();
}
</script>

<template>
  <div class="space-y-3 pl-3">
    <span class="font-black text-md">
      {{ getGridData('EU040100_GRD01001', 'caption', 'Return Summary') }}
    </span>

    <Table
      id="EU040100_GRD01001"
      condensed
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="returnSummaryTableColumns"
      :items="returnSummaryList"
    >
      <template #cell(RET_SUM_COUNT_00)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, decrypt(value))"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>

      <template #cell(RET_SUM_COUNT_01)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, '10')"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>

      <template #cell(RET_SUM_COUNT_02)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, '20')"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>

      <template #cell(RET_SUM_COUNT_03)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, '30')"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>

      <template #cell(RET_SUM_COUNT_04)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, '40')"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>

      <template #cell(RET_SUM_COUNT_05)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, '50')"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>
      <template #cell(RET_SUM_COUNT_06)="{ value, item }">
        <span
          class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
          @click="onClickRetSumCount(item, '50')"
        >
          {{ value ? decrypt(value) : '-' }}
        </span>
      </template>
    </Table>

    <Card
      v-if="selectedReturnSummaryData"
      shadow-size="none"
      card-body-class="space-y-3 mt-4"
    >
      <Breadcrumb
        class="pb-1"
        :pages="[
          {
            name: decrypt(selectedReturnSummaryData.RET_SUM_BRAND_SNAME),
          },
          {
            name: decrypt(selectedReturnSummaryData.RET_SUM_CHANNEL_SNAME),
          },
          {
            name: fltStatus.map((status) => {
              return commonData.getReturnStatusList.find((item) => item.value === status)?.name ?? status
            }).join(', '),
          }
        ]"
      />

      <div class="grid grid-cols-4 gap-x-6 items-center">
        <FormGroup
          :label="getComponentData('EU040100_LBL01002', 'caption','View Type')"
          horizontal
          label-id="EU040100_LBL01002"
        >
          <FormSelect
            id="EU040100_CMB01001"
            v-model="viewType"
            :options="commonData.getReturnViewOptions"
          />
        </FormGroup>

        <div>
          <Button
            id="EU040100_BTN01001"
            variant="gray"
            rounded
            size="sm"
            class="w-36"
            :disabled="loading"
            :loading="loading"
            @click="onClickReturnDetailRefresh"
          >
            {{ getComponentData ('EU040100_BTN01001', 'caption','Refresh') }}
          </Button>
        </div>
      </div>
    </Card>

    <Table
      v-if="selectedReturnSummaryData && tableId === 'EU040100_GRD01002'"
      id="EU040100_GRD01002"
      clickable
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="returnDetailTableColumnsByOrderID"
      :items="paginatedData"
      @on-row-click="onClickReturnDetailRow"
    />

    <Table
      v-if="selectedReturnSummaryData && tableId === 'EU040100_GRD01003'"
      id="EU040100_GRD01003"
      clickable
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="returnDetailTableColumnsByProducts"
      :items="paginatedData"
      @on-row-click="onClickReturnDetailRow"
    />

    <!-- Pagination -->
    <div
      v-if="returnDetailList?.length && selectedReturnSummaryData"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? returnDetailList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ returnDetailList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="returnDetailList?.length"
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
