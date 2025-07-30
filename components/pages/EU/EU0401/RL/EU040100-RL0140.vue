<script setup>
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const returnList = useReturnListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { userGroupChannelList, filters40 } = storeToRefs(returnList)
// const { getGridData } = usePageLoaderGrid(currentTab.value?.component);
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);

const emits = defineEmits(['onClickReturnDetail'])

const returnDetailList = ref([])
const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(returnDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const viewType = ref({})
const dateType = ref({})
const channelList = ref([])
const returnStatusData = ref([])
const returnReasonData = ref([])
const ReturnInboundTypeData = ref([])

const fromDate = ref('')
const toDate = ref('')

onBeforeMount(() => {
  viewType.value = commonData.getReturnViewOptions[0] ?? {};
  dateType.value = commonData.getReturnDateOptions[0] ?? {};
  fromDate.value = moment().format('YYYY-MM-DD')
  toDate.value = moment().format('YYYY-MM-DD')
})

onMounted(async () => {
  isloading.isLoading = true
  
  ReturnInboundTypeData.value = {
    name: 'All',
    value: '',
  };

  viewType.value = commonData.getReturnViewOptions[0] ?? {};
  await returnList.fetchUserGroupBrandList()
  const { success } = await returnList.fetchUserGroupChannelList()

  if (success) {
    channelList.value = userGroupChannelList.value.map((channel) => {
      return {
        name: decrypt(channel.USER_CHANNEL_DESCR),
        value: decrypt(channel.USER_CHANNEL_CODE),
      }
    })

    filters40.value.FLT_DATE_TYPE = dateType?.value.value ?? '';
    filters40.value.FLT_CHANNELS = userGroupChannelList.value.map((channel) => decrypt(channel.USER_CHANNEL_CODE))
    filters40.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
    filters40.value.FLT_RETURN_TYPES = ["C"];

    const { data } = await returnList.fetchReturnDetailList40()
    returnDetailList.value = data
  }
  isloading.isLoading = false
})

const onClickReturnDetailRefresh = async () => {
  filters40.value.FLT_STATUS = returnStatusData?.value.map((status) => status.value) ?? []
  filters40.value.FLT_RETURN_TYPES = ["C"];
  filters40.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters40.value.FLT_CHANNELS = channelList?.value.map((channel) => channel.value) ?? [];
  filters40.value.FLT_DATE_TYPE = dateType?.value.value ?? '';
  filters40.value.FLT_REASON = returnReasonData?.value.map((reason) => reason.value) ?? []
  filters40.value.FLT_INBOUND_TYPE = ReturnInboundTypeData?.value.value ?? '';

  toggleLoading()
  isloading.isLoading = true
  const { data } = await returnList.fetchReturnDetailList40()
  returnDetailList.value = data
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const returnDetailTableColumnsByReturnId = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU040100_GRD04001')
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
    <div class="grid grid-cols-5 gap-3 items-center pl-3 pb-3 border-b">
      <FormGroup
        :label="getComponentData('EU040100_LBL04001', 'caption', 'Brand Channel')"
        horizontal
      >
        <FormSelect
          id="EU040100_CMB04001"
          v-model="channelList"
          multiple
          :options="userGroupChannelList.map((channel) => ({
            name: decrypt(channel.USER_CHANNEL_DESCR),
            value: decrypt(channel.USER_CHANNEL_CODE),
          }))"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU040100_LBL04002', 'caption', 'Inbound Type')"
        horizontal
      >
        <FormSelect
          id="EU040100_CMB04002"
          v-model="ReturnInboundTypeData"
          :options="[
            {
              name: 'All',
              value: '',
            },
            ...commonData.getReturnInboundType
          ]"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU040100_LBL04003', 'caption','Return Reason')"
        horizontal
      >
        <FormSelect
          id="EU040100_CMB04003"
          v-model="returnReasonData"
          multiple
          :options="commonData.getReturnReasonOptions"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU040100_LBL04004', 'caption','Key Word')"
        horizontal
        label-id="OU030100_LBL02001"
        label-width="w-1/3"
      >
        <FormTextInput
          id="EU040200_TXT04001"
          v-model="filters40.FLT_KEY_WORD"
        />
      </FormGroup>

      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-36"
        :disabled="loading"
        :loading="loading"
        @click="onClickReturnDetailRefresh"
      >
        {{ getComponentData ('EU040100_BTN04001', 'caption','SEARCH') }}
      </Button>
    </div>

    <div class="pl-3 space-y-2">
      <span>
        {{ getComponentData('EU040100_GRD04001', 'caption','Return Request Reject list') }}
      </span>

      <Table
        id="EU040100_GRD04001"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="returnDetailTableColumnsByReturnId"
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
