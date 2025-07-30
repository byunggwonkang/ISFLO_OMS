<script setup>
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const exchangeList = useExchangeListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { userGroupChannelList, filters } = storeToRefs(exchangeList)
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);

const emits = defineEmits(['onClickExchangeDetail'])

const exchangeDetailList = ref([])
const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(exchangeDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const viewType = ref({})
const dateType = ref({})
const channelList = ref([])
const exchangeStatusData = ref([])
const exchangeReasonData = ref([])
const exchangeInboundTypeData = ref([])
const ExchangeStatusList = ref([])

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
  exchangeInboundTypeData.value = {
    name: 'All',
    value: '',
  };

  ExchangeStatusList.value = commonData.getExchangeStatusList.filter(
    item => !['10', '11', '12', '20'].includes(item.value)
  )
  await exchangeList.fetchUserGroupBrandList()
  const { success } = await exchangeList.fetchUserGroupChannelList()

  if (success) {
    channelList.value = userGroupChannelList.value.map((channel) => {
      return {
        name: decrypt(channel.USER_CHANNEL_DESCR),
        value: decrypt(channel.USER_CHANNEL_CODE),
      }
    })

    filters.value.FLT_DATE_FROM = moment().format('YYYY-MM-DD')
    filters.value.FLT_DATE_TO = moment().format('YYYY-MM-DD')
    filters.value.FLT_STATUS = [ "50", "51", "52", "53", "54", "55", "56", "57", "58", "59" ];
    filters.value.FLT_CHANNELS = userGroupChannelList.value.map((channel) => decrypt(channel.USER_CHANNEL_CODE))
    filters.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
    filters.value.FLT_EXCHANGE_TYPES = ["E"];
  }
  isloading.isLoading = false
})

const onClickExchangeDetailRefresh = async () => {
  filters.value.FLT_STATUS = exchangeStatusData?.value.map((status) => status.value) ?? []
  filters.value.FLT_EXCHANGE_TYPES = ["E"];
  filters.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters.value.FLT_CHANNELS = channelList?.value.map((channel) => channel.value) ?? [];
  filters.value.FLT_DATE_TYPE = dateType?.value.value ?? '';
  filters.value.FLT_REASON = exchangeReasonData?.value.map((reason) => reason.value) ?? []
  filters.value.FLT_DATE_FROM = moment(fromDate.value).format('YYYY-MM-DD')
  filters.value.FLT_DATE_TO = moment(toDate.value).format('YYYY-MM-DD')
  filters.value.FLT_INBOUND_TYPE = exchangeInboundTypeData?.value.value ?? '';

  toggleLoading()
  isloading.isLoading = true
  const { data } = await exchangeList.fetchExchangeDetailList()
  exchangeDetailList.value = data
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const exchangeDetailTableColumnsByExchangeId = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU050100_GRD09001')
})

const exchangeDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU050100_GRD09002')
})

const tableId = computed(() => {
  return filters.value.FLT_VIEW_OPT === '0010' ? 'EU050100_GRD09001' : 'EU050100_GRD09002'
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
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-4 gap-3 items-center pl-3 pb-3 border-b">
      <FormGroup
        :label="getComponentData('EU050100_LBL09001', 'caption','Brand Channel')"
        horizontal
        label-id="EU050100_LBL09001"
      >
        <FormSelect
          id="EU050100_CMB09001"
          v-model="channelList"
          multiple
          :options="userGroupChannelList.map((channel) => ({
            name: decrypt(channel.USER_CHANNEL_DESCR),
            value: decrypt(channel.USER_CHANNEL_CODE),
          }))"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU050100_LBL09002', 'caption','Inbound Type')"
        horizontal
        label-id="EU050100_LBL09002"
      >
        <FormSelect
          id="EU050100_CMB09002"
          v-model="exchangeInboundTypeData"
          :options="[
            {
              name: 'All',
              value: '',
            },
            ...commonData.getExchangeInboundType
          ]"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU050100_LBL09003', 'caption','Exchange Reason')"
        horizontal
        label-id="EU050100_LBL09003"
      >
        <FormSelect
          id="EU050100_CMB09003"
          v-model="exchangeReasonData"
          multiple
          :options="commonData.getExchangeReasonOptions"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU050100_LBL09004', 'caption','Exchange Status')"
        horizontal
        label-id="EU050100_LBL09004"
      >
        <FormSelect
          id="EU050100_CMB09004"
          v-model="exchangeStatusData"
          multiple
          :options="ExchangeStatusList"
        />
      </FormGroup>

      <FormGroup
        horizontal
        :label="getComponentData('EU050100_LBL09005', 'caption','Date Type')"
        label-id="EU050100_LBL09005"
      >
        <FormSelect
          id="EU050100_CMB09005"
          v-model="dateType"
          :options="commonData.getExchangeDateOptions"
        />
      </FormGroup>

      <FormGroup
        horizontal
        :label="getComponentData('EU050100_LBL09006', 'caption','Date')"
        label-id="EU050100_LBL09006"
      >
        <div class="grid grid-cols-2 gap-x-2">
          <FormDatePicker
            id="EU050100_DAT09001"
            v-model="fromDate"
          />
          <FormDatePicker
            id="EU050100_DAT09002"
            v-model="toDate"
          />
        </div>
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU050100_LBL09007', 'caption','View Type')"
        horizontal
        label-id="EU050100_LBL09007"
      >
        <FormSelect
          id="EU050100_CMB09006"
          v-model="viewType"
          :options="commonData.getExchangeViewOptions"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU050100_LBL09008', 'caption','Key Word')"
        horizontal
        label-id="EU050100_LBL09008"
      >
        <FormTextInput
          id="EU040200_TXT09001"
          v-model="filters.FLT_KEY_WORD"
        />
      </FormGroup>
      <div class="col-span-4 text-right">
        <Button
          id="EU050100_BTN09001"
          variant="gray"
          rounded
          size="sm"
          class="w-36"
          :disabled="loading"
          :loading="loading"
          @click="onClickExchangeDetailRefresh"
        >
          {{ getComponentData ('EU050100_BTN09001', 'caption','SEARCH') }}
        </Button>
      </div>      
    </div>

    <div class="pl-3 space-y-2">
      <span>
        {{ getGridData('EU050100_GRD09001', 'caption','Exchange History list') }}
      </span>

      <Table
        v-if="tableId === 'EU050100_GRD09001'"
        id="EU050100_GRD09001"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="exchangeDetailTableColumnsByExchangeId"
        :items="paginatedData"
        @on-row-click="onClickExchangeDetailRow"
      />

      <Table
        v-if="tableId === 'EU050100_GRD09002'"
        id="EU050100_GRD09002"
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
