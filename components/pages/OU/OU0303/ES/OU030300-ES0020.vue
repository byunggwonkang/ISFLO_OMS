<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import moment from "moment";

const pageLoader = usePageLoaderStore()
const exchangeStatus = useExchangeStatusStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { filters20, userGroupChannelList } = storeToRefs(useExchangeStatusStore())
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);
// const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const exchangeDetailList = ref([])
const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(exchangeDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

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

const exchangeStatusData = ref([])
const exchangeReasonData = ref([])
const channelList = ref([])
const fromDate = ref('')
const toDate = ref('')

onBeforeMount(() => {
  fromDate.value = moment().format('YYYY-MM-DD')
  toDate.value = moment().format('YYYY-MM-DD')
})

onMounted(async () => {
  isloading.isLoading = true
  const { success } = await exchangeStatus.fetchUserGroupChannelList()

  if (success) {
    channelList.value = userGroupChannelList.value.map((channel) => {
      return {
        name: decrypt(channel.USER_CHANNEL_DESCR),
        value: decrypt(channel.USER_CHANNEL_CODE),
      }
    })
    exchangeStatusData.value = commonData.getExchangeStatusOptions.filter((status) => {
      return ["70", "71", "72", "73", "74", "75", "76", "77", "78", "79"].includes(status.value)
    })
    filters20.value.FLT_DATE_FROM = moment().format('YYYY-MM-DD')
    filters20.value.FLT_DATE_TO = moment().format('YYYY-MM-DD')
    filters20.value.FLT_STATUS = exchangeStatusData?.value.map((status) => status.value) ?? []
    filters20.value.FLT_EXCHANGE_TYPES = ["E"];
    filters20.value.FLT_CHANNELS = userGroupChannelList.value.map((channel) => decrypt(channel.USER_CHANNEL_CODE))

    const { data } = await exchangeStatus.fetchExchangeDetailList20()
    exchangeDetailList.value = data
  }
  isloading.isLoading = false
})

const onClickExchangeDetailRefresh = async () => {
  filters20.value.FLT_STATUS = exchangeStatusData?.value.length ? exchangeStatusData?.value.map((status) => status.value) : commonData.getExchangeStatusOptions.filter((status) => {
    return ["70", "71", "72", "73", "74", "75", "76", "77", "78", "79"].includes(status.value)
  }).map((status) => status.value)
  filters20.value.FLT_EXCHANGE_TYPES = ["E"];
  filters20.value.FLT_CHANNELS = channelList?.value.map((channel) => channel.value) ?? [];
  filters20.value.FLT_DATE_FROM = moment(fromDate.value).format('YYYY-MM-DD')
  filters20.value.FLT_DATE_TO = moment(toDate.value).format('YYYY-MM-DD')
  filters20.value.FLT_REASON = exchangeReasonData?.value.map((reason) => reason.value) ?? []

  toggleLoading()
  isloading.isLoading = true
  const { data } = await exchangeStatus.fetchExchangeDetailList20()
  exchangeDetailList.value = data
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const exchangeDetailTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '', 'OU030300_GRD02004')
})
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-4 gap-3 items-center pl-3 pb-3 border-b">
      <FormGroup
        :label="getComponentData('OU030300_LBL02001', 'caption', 'Select Channel')"
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
        :label="getComponentData('OU030300_LBL02002', 'caption', 'Select Status')"
        horizontal
      >
        <FormSelect
          v-model="exchangeStatusData"
          multiple
          :options="commonData.getExchangeStatusOptions.filter((status) => status.value > 69 && status.value < 80)"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('OU030300_LBL02003', 'caption', 'Select Reason')"
        horizontal
      >
        <FormSelect
          v-model="exchangeReasonData"
          multiple
          :options="commonData.getExchangeReasonOptions"
        />
      </FormGroup>

      <div class="text-right">
        <Button
          variant="gray"
          rounded
          size="sm"
          class="w-36"
          :disabled="loading"
          :loading="loading"
          @click="onClickExchangeDetailRefresh"
        >
          {{ getComponentData('OU030300_BTN02001', 'caption', 'Search') }}
        </Button>
      </div>
    </div>

    <div class="pl-3 space-y-2">
      <span>
        {{ getComponentData('OU030300_LBL02007', 'caption', 'Exchange Holding List') }}
      </span>

      <Table
        id="OU030300_GRD02005"
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
