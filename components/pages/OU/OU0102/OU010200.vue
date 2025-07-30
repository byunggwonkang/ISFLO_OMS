<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const commonData = useCommonDataStore()
const nonMerchandisingItems = useNonMerchandisingItemsStore();

const { currentTab } = storeToRefs(useTabsStore())

const { filters, nmdItemList, userGroupBrandList } = storeToRefs(nonMerchandisingItems);
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? '']);
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage } = usePagination(nmdItemList, perPage.value);
const { loading, toggleLoading } = useLoading()

const nonMerchandisingItemsTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '', 'OU010200_GRD00001');
});

const brand = ref({});
const prodType = ref({});
const stockType = ref({});

const isCreate = ref(true)

const setDefaultValue = () => {
  brand.value = {
    name: decrypt(userGroupBrandList.value[0].USER_BRAND_FNAME),
    value: parseInt(decrypt(userGroupBrandList.value[0].USER_BRAND_CODE)).toString(),
  };
  prodType.value = {
    name: 'All',
    value: '',
  };

  stockType.value = {
    name: 'All',
    value: '',
  };

  filters.value.FLT_NMD_BRAND_CODE = brand.value.value;
};

onMounted(async () => {
  togglePageLoading();
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00100')
  await pageLoader.fetchPageLoadData('POP00180')
  await pageLoader.fetchPageLoadData('POP00170')

  await commonData.fetchOU010200CommonData();
  await nonMerchandisingItems.fetchUserGroupBrandList();

  setDefaultValue();
  isloading.isLoading = false
  togglePageLoading();
});

onBeforeUnmount(() => {
  nonMerchandisingItems.clearNmdItemList();
});

const search = async () => {
  filters.value.FLT_NMD_BRAND_CODE = brand.value?.value;
  filters.value.FLT_NMD_PRODTYPE_CODE = prodType.value?.value;
  filters.value.FLT_NMD_STOCKTYPE_CODE = stockType.value?.value;

  toggleLoading();
  isloading.isLoading = true
  await nonMerchandisingItems.fetchNonMerchandisingItemList();
  isloading.isLoading = false
  toggleLoading();
};

const stockDisabled = computed(() => {
  if (stockType.value?.value !== '0010') {
    filters.value.FLT_NMD_STOCK_FROM = '';
    filters.value.FLT_NMD_STOCK_TO = '';
  }

  return stockType.value?.value !== '0010';
});

const excelData = computed(() => {
  return nmdItemList.value.map((item) => {
    const obj = {};

    nonMerchandisingItemsTableFields.value.forEach((field) => {
      obj[field.caption] = item[field.dataFieldName];
    });

    return obj;
  });
})

const openFileUploadModal = ref(false)
const openNMDItemDetailModal = ref(false)

const nmdItemDetail = ref({});
const onClickItemRow = (item) => {
  nmdItemDetail.value = item;
  isCreate.value = false
  openNMDItemDetailModal.value = true;
}
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-y-3 gap-x-12">
        <FormGroup
          :label="getComponentData('OU010200_LBL00001', 'caption')"
          label-id="OU010200_LBL00001"
          label-for="OU010200_CMB00001"
          horizontal
        >
          <FormCombobox
            id="OU010200_CMB00001"
            v-model="brand"
            :options="userGroupBrandList.map((brand) => ({
              name: decrypt(brand.USER_BRAND_FNAME),
              value: parseInt(decrypt(brand.USER_BRAND_CODE)).toString(),
            }))"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU010200_LBL00002', 'caption')"
          label-id="OU010200_LBL00002"
          label-for="OU010200_CMB00002"
          horizontal
        >
          <FormCombobox
            id="OU010200_CMB00002"
            v-model="prodType"
            :options="[
              { name: 'All', value: '' },
              ...commonData.getNmdProductTypeOptions
            ]"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU010200_LBL00004', 'caption')"
          label-id="OU010200_LBL00004"
          label-for="OU010200_CMB00003"
          horizontal
        >
          <FormCombobox
            id="OU010200_CMB00003"
            v-model="stockType"
            :options="[
              { name: 'All', value: '' },
              ...commonData.getNmdStockTypeOptions
            ]"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU010200_LBL00005', 'caption')"
          label-id="OU010200_LBL00005"
          horizontal
        >
          <div class="flex items-center space-x-3">
            <FormTextInput
              id="OU010200_TXT00002"
              v-model="filters.FLT_NMD_STOCK_FROM"
              :disabled="stockDisabled"
            />
            <FormTextInput
              id="OU010200_TXT00003"
              v-model="filters.FLT_NMD_STOCK_TO"
              :disabled="stockDisabled"
            />
          </div>
        </FormGroup>
        <FormGroup
          :label="getComponentData('OU010200_LBL00003', 'caption')"
          label-id="OU010200_LBL00003"
          label-for="OU010200_TXT00001"
          horizontal
        >
          <FormTextInput
            id="OU010200_TXT00001"
            v-model="filters.FLT_NMD_KEY_WORD"
          />
        </FormGroup>

        <div class="col-start-5 text-end">
          <Button
            id="OU010200_BTN00001"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="search"
          >
            {{ getComponentData('OU010200_BTN00001', 'caption') }}
          </Button>
        </div>
      </div>
    </template>

    <div class="flex justify-between items-center mt-2">
      <p>
        {{ getGridData('OU010200_GRD00001', 'caption') }}
      </p>

      <div class="flex items-center">
        <DownloadExcel
          id="OU010200_BTN00003"
          class="px-3 w-fit py-2 text-sm leading-4 rounded text-white isac-bg-gray hover:bg-gray-600 focus:ring-gray-400 cursor-pointer disabled:opacity-50"
          :data="excelData"
          :disabled="!nmdItemList?.length"
        >
          {{ getComponentData('OU010200_BTN00003', 'caption') }}
        </DownloadExcel>

        <Button
          id="OU010200_BTN00004"
          rounded
          variant="gray"
          class="ml-2"
          @click="openFileUploadModal = true"
        >
          {{ getComponentData('OU010200_BTN00004', 'caption') }}
        </Button>

        <Button
          id="OU010200_BTN00002"
          rounded
          variant="gray"
          class="ml-2"
          @click="() => {
            isCreate = true
            openNMDItemDetailModal = true
          }"
        >
          {{ getComponentData('OU010200_BTN00002', 'caption') }}
        </Button>
      </div>
    </div>

    <Table
      id="OU010200_GRD00001"
      class="overflow-x-auto"
      header-variant="secondary"
      :columns="nonMerchandisingItemsTableFields"
      :items="paginatedData"
      clickable
      @on-row-click="onClickItemRow"
    />

    <!-- Pagination -->
    <div
      v-if="nmdItemList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? nmdItemList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ nmdItemList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="nmdItemList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>

    <!--File Upload Modal-->
    <Modal
      :show="openFileUploadModal"
      divider
      @close="() => {
        openFileUploadModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00100_LBL01001', 'caption', 'Excel File Upload') }} : WIP
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00100'"
        />
      </template>
    </Modal>

    <!--NMD Item Detail Modal-->
    <Modal
      :show="openNMDItemDetailModal"
      divider
      size="4xl"
      @close="() => {
        nmdItemDetail = {}
        openNMDItemDetailModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00170_LBL01001', 'caption', 'Non-Merchandising Item') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00170'"
          :nmd-detail-data="nmdItemDetail"
          :isCreate="isCreate"
          @nmd-detail-saved="() => {
            openNMDItemDetailModal = false
            nmdItemDetail = {}
            search()
          }"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
