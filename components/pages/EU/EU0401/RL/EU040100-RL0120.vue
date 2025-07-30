<script setup>
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const returnList = useReturnListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { filters20, userGroupChannelList } = storeToRefs(returnList)
// const { getGridData } = usePageLoaderGrid(currentTab.value?.component);
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);

const emits = defineEmits(['onClickReturnDetail'])

const returnDetailList = ref([])
const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(returnDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const returnStatusData = ref([])
const returnReasonData = ref([])
const ReturnInboundTypeData = ref([])
const channelList = ref([])
const fromDate = ref('')
const toDate = ref('')

onBeforeMount(() => {
  fromDate.value = moment().format('YYYY-MM-DD')
  toDate.value = moment().format('YYYY-MM-DD')
})

onMounted(async () => {
  isloading.isLoading = true

  ReturnInboundTypeData.value = {
    name: 'All',
    value: '',
  };
  const { success } = await returnList.fetchUserGroupChannelList()

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
    filters20.value.FLT_RETURN_TYPES = ["R"];
    filters20.value.FLT_STATUS = returnStatusData?.value.map((status) => status.value) ?? []
    filters20.value.FLT_CHANNELS = userGroupChannelList.value.map((channel) => decrypt(channel.USER_CHANNEL_CODE))
    filters20.value.FLT_VIEW_OPT = '0010'

    const { data } = await returnList.fetchReturnDetailList20()
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
  filters20.value.FLT_REASON = returnReasonData?.value.map((reason) => reason.value) ?? []
  filters20.value.FLT_INBOUND_TYPE = ReturnInboundTypeData?.value.value ?? '';

  toggleLoading()
  isloading.isLoading = true
  const { data } = await returnList.fetchReturnDetailList20()
  returnDetailList.value = data
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const returnDetailTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU040100_GRD02001')
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
        :label="getComponentData('EU040100_LBL02001', 'caption','Brand Channel')"
        horizontal
      >
        <FormSelect
          id="EU040100_CMB02001"
          v-model="channelList"
          multiple
          :options="userGroupChannelList.map((channel) => ({
            name: decrypt(channel.USER_CHANNEL_DESCR),
            value: decrypt(channel.USER_CHANNEL_CODE),
          }))"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU040100_LBL02002', 'caption','Tracking No')"
        horizontal
      >
        <FormTextInput
          id="EU040100_TXT02001"
          v-model="filters20.FLT_TRACKING_NO"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU040100_LBL02003', 'caption','Inbound Type')"
        horizontal
      >
        <FormSelect
          id="EU040100_CMB02002"
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
        horizontal
        :label="getComponentData('EU040100_LBL02004', 'caption','Logistics')"
      >
        <FormTextInput
          id="EU040100_TXT02002"
          v-model="filters20.FLT_LOGISTICS"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('EU040100_LBL02005', 'caption','Return Reason')"
        horizontal
      >
        <FormSelect
          id="EU040100_CMB02003"
          v-model="returnReasonData"
          multiple
          :options="commonData.getReturnReasonOptions"
        />
      </FormGroup>

      <FormGroup
        horizontal
        :label="getComponentData('EU040100_LBL02006', 'caption','Address')"
      >
        <FormTextInput
          id="EU040100_TXT02003"
          v-model="filters20.FLT_ADDRESS"
        />
      </FormGroup>
      <FormGroup
        horizontal
        :label="getComponentData('EU040100_LBL02007', 'caption','Tel No')"
      >
        <FormTextInput
          id="EU040100_TXT02004"
          v-model="filters20.FLT_TEL_NO"
        />
      </FormGroup>
      <FormGroup
        horizontal
        :label="getComponentData('EU040100_LBL02008', 'caption','Key Word')"
      >
        <FormTextInput
          id="EU040100_TXT02005"
          v-model="filters20.FLT_KEY_WORD"
        />
      </FormGroup>      
      <div class="col-span-4 text-right">
        <Button
          id="EU040100_BTN02001"
          variant="gray"
          rounded
          size="sm"
          class="w-36"
          :disabled="loading"
          :loading="loading"
          @click="onClickReturnDetailRefresh"
        >
          {{ getComponentData ('EU040100_BTN02001', 'caption','SEARCH') }}
        </Button>
      </div>
    </div>

    <div class="pl-3 space-y-2">
      <span>
        {{ getComponentData('EU040100_GRD02001', 'caption','Return Request Check List') }}
      </span>

      <Table
        id="EU040100_GRD02001"
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
