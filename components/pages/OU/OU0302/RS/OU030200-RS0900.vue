<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

import moment from "moment";

const pageLoader = usePageLoaderStore()
const returnStatus = useReturnStatusStore()
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

  toggleLoading()
  isloading.isLoading = true
  const { data } = await returnStatus.fetchReturnDetailList()
  returnDetailList.value = data
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const returnDetailTableColumnsByReturnId = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030200_GRD09004')
})

const returnDetailTableColumnsByProducts = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU030200_GRD09005')
})

const tableId = computed(() => {
  return filters.value.FLT_VIEW_OPT === '0010' ? 'OU030200_GRD09004' : 'OU030200_GRD09005'
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
        :label="getComponentData('OU030200_LBL03002', 'caption')"
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
        :label="getComponentData('OU030200_LBL03003', 'caption')"
        horizontal
      >
        <FormSelect
          id="OU030200_CMB03001"
          v-model="returnStatusData"
          multiple
          :options="commonData.getReturnStatusList"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('OU030200_LBL03004', 'caption')"
        horizontal
      >
        <FormSelect
          id="OU030200_CMB03001"
          v-model="returnReasonData"
          multiple
          :options="commonData.getReturnReasonOptions"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('OU030200_LBL03006', 'caption')"
        horizontal
        label-id="OU030100_LBL02001"
        label-width="w-1/3"
      >
        <FormSelect
          id="OU030100_LBL02001"
          v-model="viewType"
          :options="commonData.getReturnViewOptions"
        />
      </FormGroup>

      <FormGroup
        horizontal
        :label="'Date Type'"
      >
        <FormSelect
          v-model="dateType"
          :options="commonData.getReturnDateOptions"
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
        @click="onClickReturnDetailSearch"
      >
        {{ getComponentData ('OU030200_BTN09001', 'caption') }}
      </Button>
    </div>

    <div class="pl-3 space-y-2">
      <span>
        {{ getComponentData('OU030200_LBL09007', 'caption') }}
      </span>

      <Table
        v-if="tableId === 'OU030200_GRD09004'"
        id="OU030200_GRD09004"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="returnDetailTableColumnsByReturnId"
        :items="paginatedData"
        @on-row-click="onClickReturnDetailRow"
      />

      <Table
        v-if="tableId === 'OU030200_GRD09005'"
        id="OU030200_GRD09005"
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
