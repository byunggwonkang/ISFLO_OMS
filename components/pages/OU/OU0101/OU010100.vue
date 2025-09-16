<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
const pageLoader = usePageLoaderStore()
const originalItems = useOriginalItemsStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const { currentTab } = storeToRefs(useTabsStore())
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);

const { filters, userGroupBrandList, itemList } = storeToRefs(originalItems)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(itemList, perPage.value);
const { loading, toggleLoading } = useLoading()

const brand = ref({})

const fetchItemList = async () => {
  filters.value.FLT_BRAND_CODE = brand.value?.value ?? ''
  await originalItems.fetchItemList()
}

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00080')
  await originalItems.fetchUserGroupBrandList()

  brand.value = {
    name: decrypt(userGroupBrandList.value[0]?.BRAND_FNAME_ENG) ?? '',
    value: parseInt(decrypt(userGroupBrandList.value[0]?.BRAND_CODE)).toString() ?? '',
  }
  isloading.isLoading = false
  togglePageLoading()
})

onBeforeUnmount(() => {
  originalItems.clearItemList()
})

const onClickSearch = async () => {
  toggleLoading()
  isloading.isLoading = true
  await fetchItemList()
  isloading.isLoading = false
  toggleLoading()
  resetPage()
}

const openItemDetailsModal = ref(false)
const itemDetailData = ref({})

const onClickItemDetailRow = (item) => {
  Object.entries(item).forEach(([key, value]) => {
    if (value != null)
    itemDetailData.value[`${key}`] = decrypt(value)
  })
  openItemDetailsModal.value = true
}

const itemsListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU010100_GRD00001')
})
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-6">
        <FormGroup
          :label="getComponentData('OU010100_LBL00001', 'caption')"
          label-id="OU010300_LBL00001"
          label-for="OU010300_CMB00001"
          horizontal
        >
          <FormSelect
            id="OU010100_CMB00001"
            v-model="brand"
            :options="userGroupBrandList.map((brand) => ({
              name: decrypt(brand.BRAND_FNAME_ENG),
              value: parseInt(decrypt(brand.BRAND_CODE)).toString(),
            }))"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU010100_LBL00002', 'caption')"
          label-id="OU010100_LBL00002"
          label-for="OU010300_TXT00001"
          horizontal
        >
          <FormTextInput
            id="OU010300_TXT00001"
            v-model="filters.FLT_KEY_WORD"
            :placeholder="getComponentData('OU010300_TXT00001', 'placeholder')"
          />
        </FormGroup>

        <div>
          <Button
            id="OU010100_BTN00001"
            variant="gray"
            rounded
            size="sm"
            :disabled="loading"
            :loading="loading"
            @click="onClickSearch"
          >
            {{ getComponentData ('OU010100_BTN00001', 'caption', 'Search') }}
          </Button>
        </div>        
      </div>
    </template>

    <Table
      id="OU010100_GRD00001"
      class="overflow-x-auto mt-3"
      header-variant="secondary"
      clickable
      :columns="itemsListTableFields"
      :items="paginatedData"
      @on-row-click="onClickItemDetailRow"
    />

    <!-- Pagination -->
    <div
      v-if="itemList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? itemList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ itemList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="itemList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>

    <!-- Item Details Modal -->
    <Modal
      :show="openItemDetailsModal"
      size="4xl"
      divider
      @close="() => {
        openItemDetailsModal = false;
        itemDetailData = {};
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00090_LBL01001', 'caption', 'Item Details') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00080`"
          :item-detail-data="itemDetailData"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
