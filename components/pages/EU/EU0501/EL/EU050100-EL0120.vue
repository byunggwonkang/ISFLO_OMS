<script setup>
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const exchangeList = useExchangeListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { filters20, userGroupChannelList } = storeToRefs(exchangeList)
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);

const emits = defineEmits(['onClickExchangeDetail'])

const exchangeDetailList = ref([])
const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(exchangeDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const exchangeStatusData = ref([])
const exchangeReasonData = ref([])
const exchangeInboundTypeData = ref([])
const channelList = ref([])
const fromDate = ref('')
const toDate = ref('')

onBeforeMount(() => {
  fromDate.value = moment().format('YYYY-MM-DD')
  toDate.value = moment().format('YYYY-MM-DD')
})

onMounted(async () => {
  isloading.isLoading = true

  exchangeInboundTypeData.value = {
    name: 'All',
    value: '',
  };
  const { success } = await exchangeList.fetchUserGroupChannelList()

  if (success) {
    channelList.value = userGroupChannelList.value.map((channel) => {
      return {
        name: decrypt(channel.USER_CHANNEL_DESCR),
        value: decrypt(channel.USER_CHANNEL_CODE),
      }
    })


    exchangeStatusData.value = commonData.getExchangeStatusList.filter((status) => {
      return ["50", "51", "52", "53", "54", "55", "56", "57", "58", "59"].includes(status.value)
    })
    filters20.value.FLT_EXCHANGE_TYPES = ["E"];
    filters20.value.FLT_STATUS = exchangeStatusData?.value.map((status) => status.value) ?? []
    filters20.value.FLT_CHANNELS = userGroupChannelList.value.map((channel) => decrypt(channel.USER_CHANNEL_CODE))
    filters20.value.FLT_VIEW_OPT = '0010'

    const { data } = await exchangeList.fetchExchangeDetailList20()
    exchangeDetailList.value = data
  }
  isloading.isLoading = false
})

const onClickExchangeDetailRefresh = async () => {
  filters20.value.FLT_STATUS = exchangeStatusData?.value.length ? exchangeStatusData?.value.map((status) => status.value) : commonData.getexchangeStatusList.filter((status) => {
    exchange ["50", "51", "52", "53", "54", "55", "56", "57", "58", "59"].includes(status.value)
  }).map((status) => status.value)
  filters20.value.FLT_EXCHANGE_TYPES = ["E"];
  filters20.value.FLT_CHANNELS = channelList?.value.map((channel) => channel.value) ?? [];
  filters20.value.FLT_VIEW_OPT = '0010'
  filters20.value.FLT_REASON = exchangeReasonData?.value.map((reason) => reason.value) ?? []
  filters20.value.FLT_INBOUND_TYPE = exchangeInboundTypeData?.value.value ?? '';

  toggleLoading()
  isloading.isLoading = true
  const { data } = await exchangeList.fetchExchangeDetailList20()
  exchangeDetailList.value = data
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const exchangeDetailTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU050100_GRD02001')
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
        :label="getComponentData('EU050100_LBL02001', 'caption','Brand Channel')"
        horizontal
      >
        <FormSelect
          id="EU050100_CMB02001"
          v-model="channelList"
          multiple
          :options="userGroupChannelList.map((channel) => ({
            name: decrypt(channel.USER_CHANNEL_DESCR),
            value: decrypt(channel.USER_CHANNEL_CODE),
          }))"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU050100_LBL02002', 'caption','Tracking No')"
        horizontal
      >
        <FormTextInput
          id="EU050100_TXT02001"
          v-model="filters20.FLT_TRACKING_NO"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU050100_LBL02003', 'caption','Inbound Type')"
        horizontal
      >
        <FormSelect
          id="EU050100_CMB02002"
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
        horizontal
        :label="getComponentData('EU050100_LBL02004', 'caption','Logistics')"
      >
        <FormTextInput
          id="EU050100_TXT02002"
          v-model="filters20.FLT_LOGISTICS"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU050100_LBL02005', 'caption','exchange Reason')"
        horizontal
      >
        <FormSelect
          id="EU050100_CMB02003"
          v-model="exchangeReasonData"
          multiple
          :options="commonData.getExchangeReasonOptions"
        />
      </FormGroup>

      <FormGroup
        horizontal
        :label="getComponentData('EU050100_LBL02006', 'caption','Address')"
      >
        <FormTextInput
          id="EU050100_TXT02003"
          v-model="filters20.FLT_ADDRESS"
        />
      </FormGroup>
      <FormGroup
        horizontal
        :label="getComponentData('EU050100_LBL02007', 'caption','Tel No')"
      >
        <FormTextInput
          id="EU050100_TXT02004"
          v-model="filters20.FLT_TEL_NO"
        />
      </FormGroup>
      <FormGroup
        horizontal
        :label="getComponentData('EU050100_LBL02008', 'caption','Key Word')"
      >
        <FormTextInput
          id="EU050100_TXT02005"
          v-model="filters20.FLT_KEY_WORD"
        />
      </FormGroup>      
      <div class="col-span-4 text-right">
        <Button
          id="EU050100_BTN02001"
          variant="gray"
          rounded
          size="sm"
          class="w-36"
          :disabled="loading"
          :loading="loading"
          @click="onClickExchangeDetailRefresh"
        >
          {{ getComponentData ('EU050100_BTN02001', 'caption','SEARCH') }}
        </Button>
      </div>
    </div>

    <div class="pl-3 space-y-2">
      <span>
        {{ getGridData('EU050100_GRD02001', 'caption','Exchange Request Check List') }}
      </span>

      <Table
        id="EU050100_GRD02001"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="exchangeDetailTableColumns"
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
