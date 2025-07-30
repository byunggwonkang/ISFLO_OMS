<script setup>
// Importing necessary functions and hooks from Vue and external stores
const pageLoader = usePageLoaderStore();
const { currentTab } = storeToRefs(useTabsStore());
const productSettingByChannel = useProductSettingByChannelStore();
const { pageLoading, togglePageLoading } = usePageLoading();

// Fetching component and grid data based on the current tab
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? '']);
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? '']);

// Destructuring reactive properties from the product setting store
const { productSummaryList, filters, summaryFilters } = storeToRefs(productSettingByChannel);

// Initializing reactive variables
const visibleButtons = ref([]);
const productSummaryDetailList = ref([]);
const prodStatusCode = ref(null);

// Pagination setup
const perPage = ref(15);
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(productSummaryDetailList, perPage.value);
const { loading, toggleLoading } = useLoading();

// Computed property for channel sales status table columns
const channelSalesStatusTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '', 'OU020200_GRD00001');
});

// Function to fetch the product summary list
const fetchProductSummaryList = async () => {
  await productSettingByChannel.fetchProductSummaryList();
}

// Lifecycle hook: Fetch initial data when the component is mounted
onMounted(async () => {
  togglePageLoading();
  productSettingByChannel.resetFilters();
  await fetchProductSummaryList();
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '');
  togglePageLoading();
});

// Function to perform a search operation
const search = async () => {
  toggleLoading();
  selectedProductSummaryData.value = null;
  await fetchProductSummaryList();
  toggleLoading();
}

// Initializing selected product summary data
const selectedProductSummaryData = ref(null);

// Function to handle the click event on product summary count
const onClickProdSumCount = async (item, status) => {
  selectSaleStatusColumn.value = `PRODUCT_SUM_STATUS_${status}`;
  selectedProductSummaryData.value = item;

  // Updating summary filters based on the selected item
  summaryFilters.value.FLT_PROD_STATUS_CODE = '00' + status;
  summaryFilters.value.FLT_PROD_BRAND_CODE = parseInt(item.PRODUCT_SUM_BRAND_CODE).toString();
  summaryFilters.value.FLT_PROD_CHANNEL_CODE = item.PRODUCT_SUM_CHANNEL_CODE;
  summaryFilters.value.FLT_PROD_SNAME = filters.value.FLT_PROD_SNAME;

  // Fetching detailed product summary data
  const { data } = await productSettingByChannel.fetchProductSummaryDetailList();
  visibleButtons.value = data.VISIBLE_BUTTONS;
  productSummaryDetailList.value = data.PRODUCTS;
  prodStatusCode.value = data.PROD_STATUS_CODE;

  resetPage()
}

// Computed property for product summary detail table columns
const productSummaryDetailTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '', 'OU020200_GRD00002');
});

// Initializing variables for handling selection
const selectAll = ref(false);
const selectedSummary = ref([]);
watch(selectAll, (value) => {
  // Updating selected summary based on the selectAll checkbox
  selectedSummary.value = value
    ? productSummaryDetailList.value.map((item) => ({
      FLT_PROD_SID: item.PRODUCT_SID,
      FLT_PROD_BRAND_CODE: item.PRODUCT_BRAND_CODE,
      FLT_PROD_CHANNEL_CODE: item.PRODUCT_CHANNEL_CODE,
    }))
    : [];
});

// Function to determine if a button should be shown
const buttonCanShow = (button) => {
  return visibleButtons.value.includes(button);
}

// Initializing variables for handling product status change
const productStatusButton = ref({
  loading: false,
  status: null,
})

// Function to handle the click event on status change
const onClickStatusChange = async (status) => {
  // Updating product status button state
  productStatusButton.value = {
    loading: true,
    status: status,
  }

  // Performing product status change for selected items
  selectedSummary.value.map(async (item) => {
    await productSettingByChannel.productStatusChange({
      ...item,
      FLT_TO_STATUS: status,
    });
  });

  // Updating product summary count and fetching updated product summary list
  await onClickProdSumCount(selectedProductSummaryData.value, prodStatusCode.value);
  await fetchProductSummaryList();

  // Resetting product status button state and selected summary
  productStatusButton.value = {
    loading: false,
    status: null,
  }

  selectedSummary.value = [];
}

const selectSaleStatusColumn = ref(null);

const selectSaleStatusLabel = computed(() => {
  return channelSalesStatusTableColumns.value?.find((column) => column.dataFieldName === selectSaleStatusColumn.value)?.caption ?? '';
});
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-x-12 items-center">
        <FormGroup
          :label="getComponentData('OU020200_LBL00001', 'caption')"
          label-id="OU020200_LBL00001"
          label-for="OU020200_TXT00001"
          horizontal
          class="w-full"
        >
          <FormTextInput
            id="OU020200_TXT00001"
            v-model="filters.FLT_PROD_SNAME"
            type="search"
          />
        </FormGroup>
        <div>
          <Button
            id="OU020200_BTN00001"
            rounded
            size="sm"
            variant="gray"
            :disabled="loading"
            :loading="loading"
            @click="search"
          >
            {{ getComponentData('OU020200_BTN00001', 'caption') }}
          </Button>
        </div>
      </div>
    </template>

    <div class="space-y-3 mt-3 mb-6">
      <span class="font-black text-md">
        {{ getGridData('OU020200_GRD00001', 'caption') }}
      </span>

      <Table
        id="OU020200_GRD00001"
        condensed
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="channelSalesStatusTableColumns"
        :items="productSummaryList"
      >
        <template #cell(PRODUCT_SUM_STATUS_00)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickProdSumCount(item, '00')"
          >
            {{ value }}
          </span>
        </template>

        <template #cell(PRODUCT_SUM_STATUS_11)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickProdSumCount(item, '11')"
          >
            {{ value }}
          </span>
        </template>

        <template #cell(PRODUCT_SUM_STATUS_12)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickProdSumCount(item, '12')"
          >
            {{ value }}
          </span>
        </template>

        <template #cell(PRODUCT_SUM_STATUS_13)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickProdSumCount(item, '13')"
          >
            {{ value }}
          </span>
        </template>

        <template #cell(PRODUCT_SUM_STATUS_14)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickProdSumCount(item, '14')"
          >
            {{ value }}
          </span>
        </template>

        <template #cell(PRODUCT_SUM_STATUS_15)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickProdSumCount(item, '15')"
          >
            {{ value }}
          </span>
        </template>

        <template #cell(PRODUCT_SUM_STATUS_16)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickProdSumCount(item, '16')"
          >
            {{ value }}
          </span>
        </template>

        <template #cell(PRODUCT_SUM_STATUS_20)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickProdSumCount(item, '20')"
          >
            {{ value }}
          </span>
        </template>

        <template #cell(PRODUCT_SUM_STATUS_70)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickProdSumCount(item, '70')"
          >
            {{ value }}
          </span>
        </template>

        <template #cell(PRODUCT_SUM_STATUS_80)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickProdSumCount(item, '80')"
          >
            {{ value }}
          </span>
        </template>

        <template #cell(PRODUCT_SUM_STATUS_90)="{ value, item }">
          <span
            class="underline underline-offset-4 cursor-pointer hover:text-blue-700 hover:font-extrabold"
            @click="onClickProdSumCount(item, '90')"
          >
            {{ value }}
          </span>
        </template>
      </Table>
    </div>

    <div
      v-if="selectedProductSummaryData"
    >
      <Breadcrumb
        class="pb-1"
        :pages="[
          {
            name: selectedProductSummaryData.PRODUCT_SUM_BRAND_SNAME,
          },
          {
            name: selectedProductSummaryData.PRODUCT_SUM_CHANNEL_SNAME,
          },
          {
            name: selectSaleStatusLabel,
          }
        ]"
      />
    </div>

    <div
      v-if="selectedProductSummaryData"
      class="flex justify-between items-center"
    >
      <div class="flex gap-x-6 items-center">
        <FormGroup
          :label="getComponentData('OU020200_LBL00002', 'caption')"
          label-id="OU020200_LBL00002"
          label-for="OU020200_TXT00002"
          horizontal
        >
          <FormTextInput
            id="OU020200_TXT00002"
            :model-value="selectedProductSummaryData?.PRODUCT_SUM_BRAND_FNAME"
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU020200_LBL00003', 'caption')"
          label-id="OU020200_LBL00003"
          label-for="OU020200_TXT00003"
          horizontal
        >
          <FormTextInput
            id="OU020200_TXT00003"
            :model-value="selectedProductSummaryData?.PRODUCT_SUM_CHANNEL_FNAME"
            disabled
          />
        </FormGroup>
      </div>

      <div class="flex items-center space-x-2">
        <Button
          v-if="buttonCanShow('OU020200_BTN00002')"
          id="OU020200_BTN00002"
          variant="gray"
          rounded
          size="sm"
          :loading="productStatusButton.loading && productStatusButton.status === 'DISTRIB_REQ'"
          :disabled="!selectedSummary.length || productStatusButton.loading"
          @click="onClickStatusChange('DISTRIB_REQ')"
        >
          {{ getComponentData('OU020200_BTN00002', 'caption') }}
        </Button>

        <Button
          v-if="buttonCanShow('OU020200_BTN00003')"
          id="OU020200_BTN00003"
          variant="gray"
          rounded
          size="sm"
          :loading="productStatusButton.loading && productStatusButton.status === 'REQ_REVIEW'"
          :disabled="!selectedSummary.length || productStatusButton.loading"
          @click="onClickStatusChange('REQ_REVIEW')"
        >
          {{ getComponentData('OU020200_BTN00003', 'caption') }}
        </Button>

        <Button
          v-if="buttonCanShow('OU020200_BTN00004')"
          id="OU020200_BTN00004"
          variant="gray"
          rounded
          size="sm"
          :disabled="!selectedSummary.length || productStatusButton.loading"
          :loading="productStatusButton.loading && productStatusButton.status === 'TEMP_OUT_STOCK'"
          @click="onClickStatusChange('TEMP_OUT_STOCK')"
        >
          {{ getComponentData('OU020200_BTN00004', 'caption') }}
        </Button>

        <Button
          v-if="buttonCanShow('OU020200_BTN00005')"
          id="OU020200_BTN00005"
          variant="gray"
          rounded
          size="sm"
          :loading="productStatusButton.loading && productStatusButton.status === 'OUT_STOCK'"
          :disabled="!selectedSummary.length || productStatusButton.loading"
          @click="onClickStatusChange('OUT_STOCK')"
        >
          {{ getComponentData('OU020200_BTN00005', 'caption') }}
        </Button>

        <Button
          v-if="buttonCanShow('OU020200_BTN00006')"
          id="OU020200_BTN00006"
          variant="gray"
          rounded
          size="sm"
          :disabled="!selectedSummary.length || productStatusButton.loading"
          :loading="productStatusButton.loading && productStatusButton.status === 'STOP_SELL'"
          @click="onClickStatusChange('STOP_SELL')"
        >
          {{ getComponentData('OU020200_BTN00006', 'caption') }}
        </Button>

        <Button
          v-if="buttonCanShow('OU020200_BTN00007')"
          id="OU020200_BTN00007"
          variant="gray"
          rounded
          size="sm"
          :loading="productStatusButton.loading && productStatusButton.status === 'RESUM_SELL'"
          :disabled="!selectedSummary.length || productStatusButton.loading"
          @click="onClickStatusChange('RESUM_SELL')"
        >
          {{ getComponentData('OU020200_BTN00007', 'caption') }}
        </Button>
      </div>
    </div>

    <div class="flex">
      <Table
        v-if="selectedProductSummaryData"
        id="OU020200_GRD00001"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        checkable
        :columns="productSummaryDetailTableColumns"
        :items="paginatedData"
      >
        <template
          v-if="paginatedData.length"
          #header(CHECKBOX)
        >
          <FormCheckbox
            v-model="selectAll"
            :value="true"
          />
        </template>

        <template
          v-if="paginatedData.length"
          #cell(CHECKBOX)="{ item }"
        >
          <FormCheckbox
            v-model="selectedSummary"
            :value="{
              FLT_PROD_SID: item.PRODUCT_SID,
              FLT_PROD_BRAND_CODE: item.PRODUCT_BRAND_CODE,
              FLT_PROD_CHANNEL_CODE: item.PRODUCT_CHANNEL_CODE,
            }"
          />
        </template>
      </Table>
    </div>

    <!-- Pagination -->
    <div
      v-if="productSummaryDetailList?.length && selectedProductSummaryData !== null"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? productSummaryDetailList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ productSummaryDetailList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="productSummaryDetailList?.length"
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
