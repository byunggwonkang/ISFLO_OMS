<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()
const CSManagement = useCSManagementStore()
const { currentTab } = storeToRefs(useTabsStore())

const { filters,WHList,ChannelList,CSDetailList } = storeToRefs(CSManagement)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(CSDetailList, perPage.value);
const { loading, toggleLoading } = useLoading()

const whData = ref({})
const channel = ref([])
const Status = ref({})

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  
  await commonData.fetchEU060100CommonData()
  await pageLoader.fetchPageLoadData(currentTab.value?.component)
  await CSManagement.fetchWHList()

  whData.value = {
    name: 'All',
    value: '',
  };

  Status.value = {
    name: 'All',
    value: '',
  };
  
  isloading.isLoading = false
  togglePageLoading()
})

watch(() => whData, async (value) => {
  if (value) {
    if(value?.value.value != '')
    {
      isloading.isLoading = true
      await CSManagement.fetchChannelList(value?.value.value)
      isloading.isLoading = false      
    }
    else
    {
      CSManagement.resetChannelList()
    }

    channel.value = {
      name: 'All',
      value: '',
    };
  }
}, { deep: true })

const search = async () => {

}

const CSListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU060100_GRD00001')
})


</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <Card
        divider
        shadow-size="none"
        card-header-class="px-3 py-3 space-y-1"
        class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
        card-body-class="p-3 space-y-3"
      >
        <div class="grid grid-cols-5 gap-y-3 gap-x-12">
          <FormGroup
            :label="getComponentData('EU060100_LBL00001', 'caption', 'WH')"
            label-id="EU060100_LBL00001"
            label-for="EU060100_CMB00001"
            horizontal
          >
            <FormSelect
              id="EU060100_CMB00001"
              v-model="whData"
              :options="[
                {
                  name: 'All',
                  value: '',
                },
                ...WHList.map((item) => ({
                  name: decrypt(item.WH_FNAME),
                  value: decrypt(item.WH_CODE),
                }))
              ]"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('EU060100_LBL00002', 'caption', 'Brand/Channel')"
            label-id="EU060100_LBL00002"
            label-for="EU060100_CMB00002"
            horizontal
          >
            <FormSelect
              id="EU060100_CMB00002"
              v-model="channel"
              :options="[
                {
                  name: 'All',
                  value: '',
                },
                ...ChannelList.map((item) => ({
                  name: decrypt(item.CHANNEL_DESCR),
                  value: decrypt(item.CHANNEL_CODE),
                }))
              ]"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('EU060100_LBL00003', 'caption', 'Status')"
            label-id="EU060100_LBL00003"
            label-for="EU060100_CMB00003"
            horizontal
          >
            <FormSelect
              id="EU060100_CMB00003"
              v-model="Status"
              :options="[
                {
                  name: 'All',
                  value: '',
                },
                ...commonData.getCSStatus
              ]"
            />
          </FormGroup>        
          <FormGroup />
          <FormGroup />
          <FormGroup
            horizontal
            :label="getComponentData('EU060100_LBL00004', 'caption','Date Type')"
            label-id="EU060100_LBL00004"
            label-for="EU060100_CMB00004"
          >
            <FormSelect
              id="EU060100_CMB00004"
            />
          </FormGroup>

          <FormGroup
            horizontal
            :label="getComponentData('EU060100_LBL00005', 'caption','Date')"
            label-id="EU060100_LBL00005"
          >
            <div class="grid grid-cols-2 gap-x-2">
              <FormDatePicker
                id="EU060100_DAT00001"
                v-model="filters.FLT_DATE_FROM"
              />
              <FormDatePicker
                id="EU060100_DAT00002"
                v-model="filters.FLT_DATE_TO"
              />
            </div>
          </FormGroup>
          <FormGroup
            :label="getComponentData('EU060100_LBL00006', 'caption', 'Key Word')"
            label-id="EU060100_LBL00006"
            label-for="EU060100_TXT00001"
            horizontal
          >
            <FormTextInput
              id="EU060100_TXT00001"
              v-model="filters.FLT_KEY_WORD"
            />
          </FormGroup>
          <div class="col-span-1 text-start">
            <Button
              id="EU060100_BTN00001"
              rounded
              variant="gray"
              :loading="loading"
              :disabled="loading"
              @click="search"
            >
              {{ getComponentData('EU060100_BTN00001', 'caption', 'Search') }}
            </Button>
          </div>
        </div>
      </Card>      
    </template>
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-3 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <p>
            {{ getGridData('EU060100_GRD00001', 'caption', 'Search Result') }}
          </p>
        </div>
      </template>

          
      <Table
        id="EU060100_GRD00001"
        header-variant="secondary"
        :columns="CSListTableFields"
        :items="paginatedData"
        clickable
      />
      <!-- Pagination -->
      <div
        class="flex justify-between items-center pl-3"
      >
        <p class="text-sm text-gray-700">
          Showing
          <span class="mx-1">
            {{ (currentPage - 1) * perPage + 1 }}
          </span>
          to
          <span class="mx-1">
            {{ isLastPage ? CSDetailList?.length : currentPage * perPage }}
          </span>
          of
          <span class="mx-1">
            {{ CSDetailList?.length }}
          </span>
          results
        </p>

        <Pagination
          :total-items="CSDetailList?.length"
          :items-per-page="perPage"
          :current-page="currentPage"
          rounded
          active-variant="gray"
          @page-changed="currentPage = $event"
        />
      </div>
    </Card> 
  </AppContent>
</template>

<style scoped>

</style>
