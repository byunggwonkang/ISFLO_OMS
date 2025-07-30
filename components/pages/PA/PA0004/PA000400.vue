<script setup>
import {PlusIcon} from "@heroicons/vue/24/solid";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import moment from "moment";

const { pageLoading, togglePageLoading } = usePageLoading();
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()
const storeSettings = useStoreSettingsStore()
const { currentTab } = storeToRefs(useTabsStore())

const { storeList, userGroupBrandList , filters } = storeToRefs(storeSettings)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(storeList, perPage.value);
const { loading, toggleLoading } = useLoading()

const brand = ref({})

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const fetchStoreSettingList = async () => {
  await storeSettings.fetchStoreList()
}

onBeforeUnmount(() => {
  storeSettings.clearStoreList()
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component)
  await storeSettings.fetchUserGroupBrandList()
  await pageLoader.fetchPageLoadData('POP00120')

  brand.value = {
    name: 'All',
    value: '',
  }
  //await commonData.fetchAllCommonData();
  isloading.isLoading = false
  togglePageLoading()
})

const checkActive = ref(false)

const onClickSearch = async () => {
  filters.value.FLT_BRAND_CODE = brand.value?.value ?? ''
  filters.value.FLT_OPEN_FROM_DATE = moment(filters.value.FLT_OPEN_FROM_DATE).format('YYYY-MM-DD')
  filters.value.FLT_OPEN_TO_DATE = moment(filters.value.FLT_OPEN_TO_DATE).format('YYYY-MM-DD')
  filters.value.FLT_INCLUDE_INACTIVE = checkActive.value ? '1' : '0'

  toggleLoading()
  isloading.isLoading = true
  await storeSettings.fetchStoreList()
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const storeListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'PA000400_GRD00001')
})

const openStoreDetailsModal = ref(false)

const storeFormData = ref({
  STORE_SID: '',
})

const onClickStoreListRow = (item) => {
  storeFormData.value = item
  openStoreDetailsModal.value = true
}
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-x-12">
        <FormGroup
          :label="getComponentData('PA000400_LBL00001', 'caption')"
          label-id="PA000400_LBL00001"
          label-for="PA000400_CMB00001"
          horizontal
        >
          <FormSelect
            id="PA000400_CMB00001"
            v-model="brand"
            :options="[
              {
                name: 'All',
                value: '',
              },
              ...userGroupBrandList.map((brand) => ({
                name: decrypt(brand.USER_BRAND_FNAME),
                value: parseInt(decrypt(brand.USER_BRAND_CODE)).toString(),
              }))
            ]"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('PA000400_LBL00002', 'caption')"
          label-id="PA000400_LBL00002"
          label-for="PA000400_TXT00001"
          horizontal
        >
          <FormTextInput
            id="PA000400_TXT00001"
            v-model="filters.FLT_STORE_SNAME"
            :placeholder="getComponentData('PA000400_TXT00001', 'placeholder')"
          />
        </FormGroup>

        <FormGroup
          horizontal
          :label="getComponentData('PA000400_LBL00004', 'caption')"
          label-id="PA000400_LBL00004"
        >            
          <div class="flex items-center sm:flex-col lg:flex-row sm:space-y-3 sm:space-x-0 lg:space-x-3 lg:space-y-0 w-full ml-3">
            <FormCheckbox
              v-model="filters.FLT_DATE_CHECK"
            />
            <FormDatePicker
              id="PA000400_DAT00001"
              v-model="filters.FLT_OPEN_FROM_DATE"
              :placeholder="getComponentData('PA000400_DAT00001', 'placeholder')"
              :disabled="!filters.FLT_DATE_CHECK"
            />
            <FormDatePicker
              id="PA000400_DAT00002"
              v-model="filters.FLT_OPEN_TO_DATE"
              :placeholder="getComponentData('PA000400_DAT00002', 'placeholder')"
              :disabled="!filters.FLT_DATE_CHECK"
            />
          </div>
        </FormGroup>

        <div class="flex space-x-6 items-center">
          <FormCheckbox
            id="PA000400_CHK00001"
            v-model="checkActive"
            :label="getComponentData('PA000400_LBL00003', 'caption', 'Inactive')"
          />

          <Button
            id="PA000400_BTN00002"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="onClickSearch"
          >
            {{ getComponentData('PA000400_BTN00002', 'caption') }}
          </Button>
        </div>
      </div>
    </template>

    <div class="flex justify-between items-center mt-2">
      <p>
        {{ getGridData('PA000400_GRD00001', 'caption', 'Search Result') }}
      </p>

      <Button
        v-tooltip="{
          content: getComponentData('PA000400_BTN00001', 'caption'),
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
        @click="openStoreDetailsModal = true"
      >
        <PlusIcon class="w-5 h-5" />
      </Button>
    </div>

    <Table
      id="PA000400_GRD00001"
      class="overflow-x-auto mt-3"
      header-variant="secondary"
      clickable
      :columns="storeListTableFields"
      :items="paginatedData"
      @on-row-click="onClickStoreListRow"
    >
      <template #cell(STORE_ONLINE_YN)="{ value }">
        <div>
          <StatusDot :active="decrypt(value) === 'True' || decrypt(value) === '1' || decrypt(value) === true || decrypt(value) === 1" />
        </div>
      </template>

      <template #cell(STORE_ACTIVE_YN)="{ value }">
        <div>
          <StatusDot :active="decrypt(value) === 'True' || decrypt(value) === '1' || decrypt(value) === true || decrypt(value) === 1" />
        </div>
      </template>
    </Table>

    <!-- Pagination -->
    <div
      v-if="storeList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? storeList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ storeList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="storeList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>

    <Modal
      :show="openStoreDetailsModal"
      divider
      size="3xl"
      @close="() => {
        storeFormData = {
          STORE_SID: '',
        }
        openStoreDetailsModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00120_LBL00001', 'caption', 'Store Details') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00120`"
          :store-data="storeFormData"
          @store-saved="() => {
            fetchStoreSettingList()
            openStoreDetailsModal = false
          }"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
