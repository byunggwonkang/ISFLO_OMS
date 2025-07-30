<script setup>
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const exchangeList = useExchangeListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { userGroupChannelList, filters30 } = storeToRefs(exchangeList)
// const { getGridData } = usePageLoaderGrid(currentTab.value?.component);
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
  
  viewType.value = commonData.getExchangeViewOptions[0] ?? {};
  await exchangeList.fetchUserGroupBrandList()
  const { success } = await exchangeList.fetchUserGroupChannelList()

  if (success) {
    channelList.value = userGroupChannelList.value.map((channel) => {
      return {
        name: decrypt(channel.USER_CHANNEL_DESCR),
        value: decrypt(channel.USER_CHANNEL_CODE),
      }
    })

    filters30.value.FLT_DATE_TYPE = dateType?.value.value ?? '';
    filters30.value.FLT_CHANNELS = userGroupChannelList.value.map((channel) => decrypt(channel.USER_CHANNEL_CODE))
    filters30.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
    filters30.value.FLT_EXCHANGE_TYPES = ["C"];

    const { data } = await exchangeList.fetchExchangeDetailList30()
    exchangeDetailList.value = data
  }
  isloading.isLoading = false
})

const onClickExchangeDetailRefresh = async () => {
  filters30.value.FLT_STATUS = exchangeStatusData?.value.map((status) => status.value) ?? []
  filters30.value.FLT_EXCHANGE_TYPES = ["C"];
  filters30.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters30.value.FLT_CHANNELS = channelList?.value.map((channel) => channel.value) ?? [];
  filters30.value.FLT_DATE_TYPE = dateType?.value.value ?? '';
  filters30.value.FLT_REASON = exchangeReasonData?.value.map((reason) => reason.value) ?? []
  filters30.value.FLT_INBOUND_TYPE = exchangeInboundTypeData?.value.value ?? '';

  toggleLoading()
  isloading.isLoading = true
  const { data } = await exchangeList.fetchExchangeDetailList30()
  exchangeDetailList.value = data
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const exchangeDetailTableColumnsByExchangeId = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU050100_GRD03001')
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
    <div class="grid grid-cols-5 gap-3 items-center pl-3 pb-3 border-b">
      <FormGroup
        :label="getComponentData('EU050100_LBL03001', 'caption', 'Brand Channel')"
        horizontal
      >
        <FormSelect
          id="EU050100_CMB03001"
          v-model="channelList"
          multiple
          :options="userGroupChannelList.map((channel) => ({
            name: decrypt(channel.USER_CHANNEL_DESCR),
            value: decrypt(channel.USER_CHANNEL_CODE),
          }))"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU050100_LBL03002', 'caption', 'Inbound Type')"
        horizontal
      >
        <FormSelect
          id="EU050100_CMB03002"
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
        :label="getComponentData('EU050100_LBL03003', 'caption','Exchange Reason')"
        horizontal
      >
        <FormSelect
          id="EU050100_CMB03003"
          v-model="exchangeReasonData"
          multiple
          :options="commonData.getExchangeReasonOptions"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU050100_LBL03004', 'caption','Key Word')"
        horizontal
        label-id="EU050100_LBL03004"
        label-width="w-1/3"
      >
        <FormTextInput
          id="EU050100_TXT03001"
          v-model="filters30.FLT_KEY_WORD"
        />
      </FormGroup>

      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-36"
        :disabled="loading"
        :loading="loading"
        @click="onClickExchangeDetailRefresh"
      >
        {{ getComponentData ('EU050100_BTN03001', 'caption','SEARCH') }}
      </Button>
    </div>

    <div class="pl-3 space-y-2">
      <span>
        {{ getComponentData('EU050100_GRD03001', 'caption','Exchange Request Cancel list') }}
      </span>

      <Table
        id="EU050100_GRD03001"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="exchangeDetailTableColumnsByExchangeId"
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
