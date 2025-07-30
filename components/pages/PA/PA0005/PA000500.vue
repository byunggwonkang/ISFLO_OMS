<script setup>
import {PlusIcon} from "@heroicons/vue/24/solid";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const channelSettings = useChannelSettingsStore()
const { currentTab } = storeToRefs(useTabsStore())

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])
const { loading, toggleLoading } = useLoading()

const { channelList, brandList, filters } = storeToRefs(channelSettings);

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00140')

  await channelSettings.fetchBrandList()
  await channelSettings.fetchSAChannelList()

  brand.value = {
    name: decrypt(brandList.value[0]?.BRAND_FNAME ?? ''),
    value: decrypt(brandList.value[0]?.BRAND_CODE ?? ''),
  }

  filters.value.FLT_BRAND_CODE = brand.value.value

  inactivate.value = false
  
  isloading.isLoading = false
  togglePageLoading()
})

onBeforeUnmount(() => {
  channelSettings.clearChannelList()
})

const brand = ref({})
const inactivate = ref(false)

const channelListTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component, 'PA000500_GRD00001')
})

const fetchChannelList = async () => {
  await channelSettings.fetchChannelList()
}

const onClickSearch = async () => {
  if (typeof brand.value?.value === 'NaN' || brand.value?.value === 'NaN') {
    filters.value.FLT_BRAND_CODE = parseInt(brand.value?.value)
  } else {
    filters.value.FLT_BRAND_CODE = brand.value?.value ?? ''
  }

  filters.value.FLT_INCLUDE_INACTIVE = inactivate.value ? '1' : '0'

  toggleLoading()
  isloading.isLoading = true
  await fetchChannelList()
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const openChannelDetailsModal = ref(false)
const channelFormData = ref({})

const onClickAddNew = () => {
  channelFormData.value = {}
  openChannelDetailsModal.value = true
}

const onClickChannelListRow = (item) => {
  channelFormData.value = item
  openChannelDetailsModal.value = true
}
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-x-12 items-center">
        <FormGroup
          :label="getComponentData('PA000500_LBL00001', 'caption')"
          label-id="PA000500_LBL00001"
          label-for="PA000500_CMB00001"
          horizontal
        >
          <FormCombobox
            id="PA000500_CMB00001"
            v-model="brand"
            :options="brandList.map((brand) => ({
              name: decrypt(brand.BRAND_FNAME),
              value: parseInt(decrypt(brand.BRAND_CODE)).toString(),
            }))"
          />
        </FormGroup>

        <div class="flex items-center gap-x-6">
          <FormCheckbox
            v-model="inactivate"
            :label="getComponentData('PA000500_LBL00002', 'caption')"
          />

          <Button
            id="PA000500_BTN00001"
            rounded
            class="w-30"
            size="sm"
            :disabled="loading"
            :loading="loading"
            @click="onClickSearch"
          >
            {{ getComponentData('PA000500_BTN00001', 'caption') }}
          </Button>
        </div>
      </div>
    </template>

    <div class="flex justify-between items-center mt-3">
      <p>
        {{ getGridData('PA000500_GRD00001', 'caption', 'Search Results') }}
      </p>

      <Button
        v-tooltip="{
          content: 'Add New',
          placement: 'left',
          trigger: 'hover',
          distance: 10,
          delay: 100,
          popperClass: 'bg-black text-white rounded-md'
        }"
        rounded
        variant="white"
        border
        size="xs"
        @click="onClickAddNew"
      >
        <PlusIcon class="w-5 h-5" />
      </Button>
    </div>

    <Table
      id="PA000500_GRD00001"
      header-variant="secondary"
      clickable
      :columns="channelListTableColumns"
      :items="channelList"
      @on-row-click="onClickChannelListRow"
    >
      <template #cell(CHANNEL_ACTIVE_YN)="{ value }">
        <div>
          <StatusDot :active="decrypt(value) === 'True' || decrypt(value) === '1' || decrypt(value) === true || decrypt(value) === 1" />
        </div>
      </template>
      <template #cell(CHANNEL_WMS_LINK_YN)="{ value }">
        <div>
          <StatusDot :active="decrypt(value) === 'True' || decrypt(value) === '1' || decrypt(value) === true || decrypt(value) === 1" />
        </div>
      </template>
      <template #cell(CHANNEL_ERP_LINK_YN)="{ value }">
        <div>
          <StatusDot :active="decrypt(value) === 'True' || decrypt(value) === '1' || decrypt(value) === true || decrypt(value) === 1" />
        </div>
      </template>
    </Table>

    <Modal
      :show="openChannelDetailsModal"
      divider
      size="4xl"
      @close="openChannelDetailsModal = false"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ channelFormData?.BRAND_CODE ? getComponentData('POP00140_LBL00001', 'caption', 'Channel Details') : 'Add New Channel' }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00140`"
          :channel-data="channelFormData"
          @channel-saved="() => {
            fetchChannelList()
            openChannelDetailsModal = false
          }"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
