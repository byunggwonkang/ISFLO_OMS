<script setup>
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const returnStatus = useReturnListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { userGroupChannelList, filters } = storeToRefs(useReturnStatusStore())
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
const ReturnStatusList = ref([])

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

  ReturnStatusList.value = commonData.getReturnStatusList.filter(
    item => !['10', '20', '21', '22', '23'].includes(item.value)
  )
  
  await returnStatus.fetchUserGroupBrandList()
  const { success } = await returnStatus.fetchUserGroupChannelList()

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
    filters.value.FLT_RETURN_TYPES = ["R"];
  }
  isloading.isLoading = false
})

const onClickReturnDetailSearch = async () => {
  filters.value.FLT_STATUS = returnStatusData?.value.map((status) => status.value) ?? []
  filters.value.FLT_RETURN_TYPES = ["R"];
  filters.value.FLT_VIEW_OPT = viewType?.value.value ?? '';
  filters.value.FLT_CHANNELS = channelList?.value.map((channel) => channel.value) ?? [];
  filters.value.FLT_DATE_TYPE = dateType?.value.value ?? '';
  filters.value.FLT_REASON = returnReasonData?.value.map((reason) => reason.value) ?? []
  filters.value.FLT_DATE_FROM = moment(fromDate.value).format('YYYY-MM-DD')
  filters.value.FLT_DATE_TO = moment(toDate.value).format('YYYY-MM-DD')
  filters.value.FLT_INBOUND_TYPE = ReturnInboundTypeData?.value.value ?? '';

  toggleLoading()
  isloading.isLoading = true
  const { data } = await returnStatus.fetchReturnDetailList()
  returnDetailList.value = data
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const returnDetailTableColumnsByReturnId = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU040100_GRD09001')
})

const returnDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU040100_GRD09002')
})

const tableId = computed(() => {
  return filters.value.FLT_VIEW_OPT === '0010' ? 'EU040100_GRD09001' : 'EU040100_GRD09002'
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
        :label="getComponentData('EU040100_LBL09001', 'caption','Brand Channel')"
        horizontal
        label-id="EU040100_LBL09001"
      >
        <FormSelect
          id="EU040100_CMB09001"
          v-model="channelList"
          multiple
          :options="userGroupChannelList.map((channel) => ({
            name: decrypt(channel.USER_CHANNEL_DESCR),
            value: decrypt(channel.USER_CHANNEL_CODE),
          }))"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU040100_LBL09002', 'caption','Inbound Type')"
        horizontal
        label-id="EU040100_LBL09002"
      >
        <FormSelect
          id="EU040100_CMB09002"
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
        :label="getComponentData('EU040100_LBL09003', 'caption','Return Reason')"
        horizontal
        label-id="EU040100_LBL09003"
      >
        <FormSelect
          id="EU040100_CMB09003"
          v-model="returnReasonData"
          multiple
          :options="commonData.getReturnReasonOptions"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU040100_LBL09004', 'caption','Return Status')"
        horizontal
        label-id="EU040100_LBL09004"
      >
        <FormSelect
          id="EU040100_CMB09004"
          v-model="returnStatusData"
          multiple
          :options="ReturnStatusList"
        />
      </FormGroup>

      <FormGroup
        horizontal
        :label="getComponentData('EU040100_LBL09005', 'caption','Date Type')"
        label-id="EU040100_LBL09005"
      >
        <FormSelect
          id="EU040100_CMB09005"
          v-model="dateType"
          :options="commonData.getReturnDateOptions"
        />
      </FormGroup>

      <FormGroup
        horizontal
        :label="getComponentData('EU040100_LBL09006', 'caption','Date')"
        label-id="EU040100_LBL09006"
      >
        <div class="grid grid-cols-2 gap-x-2">
          <FormDatePicker
            id="EU040100_DAT09001"
            v-model="fromDate"
          />
          <FormDatePicker
            id="EU040100_DAT09002"
            v-model="toDate"
          />
        </div>
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU040100_LBL09007', 'caption','View Type')"
        horizontal
        label-id="EU040100_LBL09007"
      >
        <FormSelect
          id="EU040100_CMB09006"
          v-model="viewType"
          :options="commonData.getReturnViewOptions"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU040100_LBL09008', 'caption','Key Word')"
        horizontal
        label-id="EU040100_LBL09008"
      >
        <FormTextInput
          id="EU040200_TXT09001"
          v-model="filters.FLT_KEY_WORD"
        />
      </FormGroup>
      <div class="col-span-4 text-right">
        <Button
          id="EU040100_BTN09001"
          variant="gray"
          rounded
          size="sm"
          class="w-36"
          :disabled="loading"
          :loading="loading"
          @click="onClickReturnDetailSearch"
        >
          {{ getComponentData ('EU040100_BTN09001', 'caption','SEARCH') }}
        </Button>
      </div>      
    </div>

    <div class="pl-3 space-y-2">
      <span>
        {{ getComponentData('EU040100_GRD09001', 'caption','Return History list') }}
      </span>

      <Table
        v-if="tableId === 'EU040100_GRD09001'"
        id="EU040100_GRD09001"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="returnDetailTableColumnsByReturnId"
        :items="paginatedData"
        @on-row-click="onClickReturnDetailRow"
      />

      <Table
        v-if="tableId === 'EU040100_GRD09002'"
        id="EU040100_GRD09002"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="returnDetailTableColumnsByProducts"
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
