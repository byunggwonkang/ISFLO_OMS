<script setup>
const pageLoader = usePageLoaderStore()
const { currentTab } = storeToRefs(useTabsStore())
const { pageLoading, togglePageLoading } = usePageLoading();

const stockOfProducts = useStockOfProductsStore();
const { userGroupBrandList, filters, productStockList } = storeToRefs(stockOfProducts);

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(productStockList, perPage.value);
const { loading, toggleLoading } = useLoading()

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? ''])

const brand = ref({});

const productStockTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component, 'OU020300_GRD00001');
});

const search = async () => {
  filters.value.FLT_BRAND_CODE = brand.value.value;

  toggleLoading();
  await stockOfProducts.fetchProductStockList();
  toggleLoading();
  resetPage()
};

onBeforeUnmount(() => {
  stockOfProducts.clearProductStockList();
});

onMounted(async () => {
  togglePageLoading();
  await stockOfProducts.fetchUserGroupBrandList();
  brand.value = {
    name: userGroupBrandList.value[0].USER_BRAND_FNAME,
    value: parseInt(userGroupBrandList.value[0].USER_BRAND_CODE).toString(),
  };
  filters.value.FLT_BRAND_CODE = brand.value.value;
  togglePageLoading();
});
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-x-12">
        <FormGroup
          :label="getComponentData('OU020300_LBL00001', 'caption')"
          label-id="OU020300_LBL00001"
          label-for="OU020300_CMB00001"
          horizontal
        >
          <FormCombobox
            id="OU020300_CMB00001"
            v-model="brand"
            :options="userGroupBrandList.map((brand) => ({
              name: brand.USER_BRAND_FNAME,
              value: parseInt(brand.USER_BRAND_CODE).toString(),
            }))"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU020300_LBL00002', 'caption')"
          label-id="OU020300_LBL00002"
          label-for="OU020300_TXT00001"
          horizontal
        >
          <FormTextInput
            id="OU020300_TXT00001"
            v-model="filters.FLT_STOCK_FROM"
            type="number"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU020300_LBL00003', 'caption')"
          label-id="OU020300_LBL00003"
          label-for="OU020300_TXT00002"
          horizontal
        >
          <FormTextInput
            id="OU020300_TXT00002"
            v-model="filters.FLT_STOCK_TO"
            type="number"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU020300_LBL00004', 'caption')"
          label-id="OU020300_LBL00004"
          label-for="OU020300_TXT00003"
          horizontal
        >
          <FormTextInput
            id="OU020300_TXT00003"
            v-model="filters.FLT_KEY_WORD"
          />
        </FormGroup>

        <div>
          <Button
            id="OU020300_BTN00001"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="search"
          >
            {{ getComponentData('OU020300_BTN00001', 'caption') }}
          </Button>
        </div>
      </div>
    </template>

    <Table
      id="OU020300_GRD00001"
      class="overflow-x-auto"
      header-variant="secondary"
      :columns="productStockTableFields"
      :items="paginatedData"
    />

    <!-- Pagination -->
    <div
      v-if="productStockList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? productStockList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ productStockList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="productStockList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>
  </AppContent>
</template>

<style scoped>

</style>
