<script setup>
// Importing ArrowLeftIcon from Heroicons library
import { ArrowLeftIcon } from "@heroicons/vue/24/solid";

// Constants for page identifiers
const PAGE_LISTING = 'OU020100SCRPRODLISTING';
const PAGE_INFO = 'OU020100SCRPRODINFO';
// const PAGE_CHANNEL = 'OU020100SCRPRODCHANNEL';

// Accessing necessary store and creating reactive variables
const pageLoader = usePageLoaderStore();
const { currentTab } = storeToRefs(useTabsStore());
const page = ref(PAGE_LISTING);
const productData = ref({});
const channelTabs = ref([]);
const currentChannelTab = ref(null);

// Computed property to determine if the current operation is a creation
const isCreate = computed(() => productData.value?.PRODUCT_SID === undefined);

// Handler for page changes
const onPageChanged = (data) => {
  page.value = data.page;
  // Reset data if the operation involves creation
  if (data.create) {
    resetData();
  }
};

// Function to reset data variables
const resetData = () => {
  productData.value = {};
  channelTabs.value = [];
  currentChannelTab.value = null;
};

// Handler for adding or editing product data
const onAddEditProductData = (data) => {
  productData.value = data;
  // Change page to product information
  page.value = PAGE_INFO;
};

// Function to add a new channel tab if not already present
const addNewTab = (data) => {
  const index = channelTabs.value.findIndex((item) => item.PRODUCT_CHANNEL_CODE === data.PRODUCT_CHANNEL_CODE);
  if (index === -1) {
    channelTabs.value.push(data);
  }
};

// Handler for clicking on a channel row
const onClickChannelRow = (data) => {
  // Set the current channel tab
  currentChannelTab.value = data;
  // Add a new tab for the channel if not already present
  addNewTab(data);
  // Change page to product channel
  page.value = data.PRODUCT_CHANNEL_CODE;
};

// Fetch page load data on component mount
onMounted(async () => {
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '');
  await pageLoader.fetchPageLoadData('POP00030');
  await pageLoader.fetchPageLoadData('POP00040');
  await pageLoader.fetchPageLoadData('POP00050');
  await pageLoader.fetchPageLoadData('POP00060');
  await pageLoader.fetchPageLoadData('POP00070');
});
</script>

<template>
  <div class="relative">
    <div
      v-if="page !== PAGE_LISTING"
      class="border-b border-gray-200 pb-5 sm:pb-0 m-3 sticky top-0 "
    >
      <div class="flex space-x-3 pb-3">
        <ArrowLeftIcon
          class="h-5 w-5 cursor-pointer"
          @click="onPageChanged({
            page: PAGE_LISTING,
            create: true
          })"
        />
        <h3 class="text-base font-semibold leading-6 text-gray-900">
          Back to Product List
        </h3>
      </div>
    </div>

    <OU020100SCRPRODLISTING
      v-if="page === PAGE_LISTING"
      @page-changed="onPageChanged"
      @on-add-edit-product-data="onAddEditProductData"
    />

    <OU020100SCRPRODINFO
      v-if="page === PAGE_INFO"
      :product-data="productData"
      :create="isCreate"
      @page-changed="onPageChanged"
      @product-created="onAddEditProductData"
      @on-click-channel-row="onClickChannelRow"
    />
  </div>
</template>

<style scoped>

</style>
