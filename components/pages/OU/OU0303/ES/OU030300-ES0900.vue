<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

import moment from "moment";

const pageLoader = usePageLoaderStore()
const exchangeStatus = useExchangeStatusStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { filters, userGroupChannelList } = storeToRefs(useExchangeStatusStore())
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);
// const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const emits = defineEmits(['onClickExchangeDetail'])
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

const exchangeDetailList = ref([])
const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(exchangeDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const viewType = ref({})
const dateType = ref({})
const exchangeStatusData = ref([])
const exchangeReasonData = ref([])
const channelList = ref([])

const fromDate = ref('')
const toDate = ref('')

onBeforeMount(() => {
  viewType.value = commonData.getExchangeViewOptions[0] ?? {};
  dateType.value = commonData.getExchangeDateOptions[0] ?? {};
  fromDate.value = moment().format('YYYY-MM-DD')
  toDate.value = moment().format('YYYY-MM-DD')
})

onMounted(async () => {
  isloading.isLoading = true
  await exchangeStatus.fetchUserGroupBrandList()
  const { success } = await exchangeStatus.fetchUserGroupChannelList()

  if (success) {
    channelList.value = userGroupChannelList.value.map((channel) => {
      return {
        name: decrypt(channel.USER_CHANNEL_DESCR),
        value: decrypt(channel.USER_CHANNEL_CODE),
      }
    })

    filters.value.FLT_DATE_TYPE = dateType?.value.value ?? '';
    filters.value.FLT_DATE_FROM = moment().format('YYYY-MM-DD')
    filters.value.FLT_DATE_TO = moment().format('YYYY-MM-DD')
    filters.value.FLT_STATUS = ["70", "71", "72", "73", "74", "75", "76", "77", "78", "79"];
    filters.value.FLT_CHANNELS = userGroupChannelList.value.map((channel) => decrypt(channel.USER_CHANNEL_CODE))
    filters.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
    filters.value.FLT_EXCHANGE_TYPES = ["E"];
  }
  isloading.isLoading = false
})

const onClickExchangeDetailSearch = async () => {
  filters.value.FLT_STATUS = exchangeStatusData?.value.map((status) => status.value) ?? []
  filters.value.FLT_EXCHANGE_TYPES = ["E"];
  filters.value.FLT_CHANNELS = channelList?.value.map((channel) => channel.value) ?? [];
  filters.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters.value.FLT_DATE_TYPE = dateType?.value.value ?? '';
  filters.value.FLT_REASON = exchangeReasonData?.value.map((reason) => reason.value) ?? []
  filters.value.FLT_DATE_FROM = moment(fromDate.value).format('YYYY-MM-DD')
  filters.value.FLT_DATE_TO = moment(toDate.value).format('YYYY-MM-DD')

  toggleLoading()
  isloading.isLoading = true
  const { data } = await exchangeStatus.fetchExchangeDetailList()
  exchangeDetailList.value = data
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const exchangeDetailTableColumnsByReturnId = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030300_GRD09005')
})

const exchangeDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030300_GRD09006')
})

const tableId = computed(() => {
  return filters.value.FLT_VIEW_OPT === '0010' ? 'OU030300_GRD09005' : 'OU030300_GRD09006'
})
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-4 gap-3 items-center pl-3 pb-3 border-b">
      <FormGroup
        :label="getComponentData('OU030300_LBL09002', 'caption')"
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
        :label="getComponentData('OU030300_LBL09003', 'caption')"
        horizontal
      >
        <FormSelect
          v-model="exchangeStatusData"
          multiple
          :options="commonData.getExchangeStatusOptions"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('OU030300_LBL09004', 'caption')"
        horizontal
      >
        <FormSelect
          v-model="exchangeReasonData"
          multiple
          :options="commonData.getExchangeReasonOptions"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('OU030300_LBL09006', 'caption')"
        horizontal
      >
        <FormSelect
          v-model="viewType"
          :options="commonData.getExchangeViewOptions"
        />
      </FormGroup>

      <FormGroup
        horizontal
        :label="'Date Type'"
      >
        <FormSelect
          v-model="dateType"
          :options="commonData.getExchangeDateOptions"
        />
      </FormGroup>

      <FormGroup
        horizontal
        :label="'Request Date'"
      >
        <div class="grid grid-cols-2 gap-x-2">
          <FormDatePicker
            v-model="fromDate"
          />
          <FormDatePicker
            v-model="toDate"
          />
        </div>
      </FormGroup>

      <FormGroup
        :label="getComponentData('OU030300_LBL09005', 'caption')"
        horizontal
      >
        <FormTextInput
          v-model="filters.FLT_KEY_WORD"
        />
      </FormGroup>

      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-36"
        :disabled="loading"
        :loading="loading"
        @click="onClickExchangeDetailSearch"
      >
        {{ getComponentData('OU030300_BTN09001', 'caption') }}
      </Button>
    </div>

    <div class="pl-3 space-y-2">
      <span>
        {{ getComponentData('OU030300_LBL09007', 'caption') }}
      </span>

      <Table
        v-if="tableId === 'OU030300_GRD09005'"
        id="OU030300_GRD09005"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="exchangeDetailTableColumnsByReturnId"
        :items="paginatedData"
        @on-row-click="onClickExchangeDetailRow"
      />

      <Table
        v-if="tableId === 'OU030300_GRD09006'"
        id="OU030300_GRD09006"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="exchangeDetailTableColumnsByProducts"
        :items="paginatedData"
        @on-row-click="onClickExchangeDetailRow"
      />
    </div>

    <!-- Pagination -->
    <div
      v-if="exchangeDetailList?.length"
      class="flex justify-between items-center pl-3"
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
        @page-changed="currentPage = $event"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
