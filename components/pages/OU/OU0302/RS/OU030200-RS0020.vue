<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import moment from "moment";

const pageLoader = usePageLoaderStore()
const returnStatus = useReturnStatusStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { filters20, userGroupChannelList } = storeToRefs(useReturnStatusStore())
// const { getGridData } = usePageLoaderGrid(currentTab.value?.component);
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);

const emits = defineEmits(['onClickReturnDetail'])

const returnDetailList = ref([])
const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(returnDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const returnStatusData = ref([])
const returnReasonData = ref([])
const channelList = ref([])
const fromDate = ref('')
const toDate = ref('')

onBeforeMount(() => {
  fromDate.value = moment().format('YYYY-MM-DD')
  toDate.value = moment().format('YYYY-MM-DD')
})

onMounted(async () => {
  isloading.isLoading = true
  const { success } = await returnStatus.fetchUserGroupChannelList()

  if (success) {
    channelList.value = userGroupChannelList.value.map((channel) => {
      return {
        name: decrypt(channel.USER_CHANNEL_DESCR),
        value: decrypt(channel.USER_CHANNEL_CODE),
      }
    })


    returnStatusData.value = commonData.getReturnStatusList.filter((status) => {
      return ["50", "51", "52", "53", "54", "55", "56", "57", "58", "59"].includes(status.value)
    })
    filters20.value.FLT_DATE_FROM = moment().format('YYYY-MM-DD')
    filters20.value.FLT_DATE_TO = moment().format('YYYY-MM-DD')
    filters20.value.FLT_RETURN_TYPES = ["R"];
    filters20.value.FLT_STATUS = returnStatusData?.value.map((status) => status.value) ?? []
    filters20.value.FLT_CHANNELS = userGroupChannelList.value.map((channel) => decrypt(channel.USER_CHANNEL_CODE))
    filters20.value.FLT_VIEW_OPT = '0010'

    const { data } = await returnStatus.fetchReturnDetailList20()
    returnDetailList.value = data
  }
  isloading.isLoading = false
})

const onClickReturnDetailRefresh = async () => {
  filters20.value.FLT_STATUS = returnStatusData?.value.length ? returnStatusData?.value.map((status) => status.value) : commonData.getReturnStatusList.filter((status) => {
    return ["50", "51", "52", "53", "54", "55", "56", "57", "58", "59"].includes(status.value)
  }).map((status) => status.value)
  filters20.value.FLT_RETURN_TYPES = ["R"];
  filters20.value.FLT_CHANNELS = channelList?.value.map((channel) => channel.value) ?? [];
  filters20.value.FLT_VIEW_OPT = '0010'
  filters20.value.FLT_DATE_FROM = moment(fromDate.value).format('YYYY-MM-DD')
  filters20.value.FLT_DATE_TO = moment(toDate.value).format('YYYY-MM-DD')
  filters20.value.FLT_REASON = returnReasonData?.value.map((reason) => reason.value) ?? []

  toggleLoading()
  isloading.isLoading = true
  const { data } = await returnStatus.fetchReturnDetailList20()
  returnDetailList.value = data
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const returnDetailTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030200_GRD02004')
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
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-4 gap-3 items-center pl-3 pb-3 border-b">
      <FormGroup
        :label="getComponentData('OU030200_LBL02001', 'caption')"
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
        :label="getComponentData('OU030200_LBL02002', 'caption')"
        horizontal
      >
        <FormSelect
          v-model="returnStatusData"
          multiple
          :options="commonData.getReturnStatusList.filter((status) => status.value > 49 && status.value < 60)"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('OU030200_LBL02003', 'caption')"
        horizontal
      >
        <FormSelect
          v-model="returnReasonData"
          multiple
          :options="commonData.getReturnReasonOptions"
        />
      </FormGroup>

      <FormGroup
        horizontal
        :label="getComponentData('OU030200_LBL02004', 'caption')"
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
        :label="getComponentData('OU030200_LBL02005', 'caption')"
        horizontal
      >
        <FormTextInput
          v-model="filters20.FLT_KEY_WORD"
        />
      </FormGroup>

      <div class="col-span-3 text-right">
        <Button
          id="OU030200_BTN02001"
          variant="gray"
          rounded
          size="sm"
          class="w-36"
          :disabled="loading"
          :loading="loading"
          @click="onClickReturnDetailRefresh"
        >
          {{ getComponentData ('OU030200_BTN02001', 'caption') }}
        </Button>
      </div>
    </div>

    <div class="pl-3 space-y-2">
      <span>
        {{ getComponentData('OU030200_LBL02006', 'caption') }}
      </span>

      <Table
        id="OU030200_GRD02004"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="returnDetailTableColumns"
        :items="paginatedData"
        @on-row-click="onClickReturnDetailRow"
      />
    </div>

    <!-- Pagination -->
    <div
      v-if="returnDetailList?.length"
      class="flex justify-between items-center pl-3"
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
        @page-changed="currentPage = $event"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
