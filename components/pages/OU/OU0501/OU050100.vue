<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import moment from "moment";

const pageLoader = usePageLoaderStore()
const { currentTab, openTabs } = storeToRefs(useTabsStore())
const { pageLoading, togglePageLoading } = usePageLoading();

const commonData = useCommonDataStore()
const customerManagement = useCustomerManagementStore()
const { customerList, filters, userGroupChannelList } = storeToRefs(customerManagement)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage } = usePagination(customerList, perPage.value);
const { loading, toggleLoading } = useLoading()
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? ''])

const channel = ref([]);
const customerStatus = ref({});
const customerClass = ref([]);
const country = ref({});
const gender = ref({});
const enableRegisteredDate = ref(false);
const enableOrderDate = ref(false);

watch(currentTab, async () => {
  const found = openTabs.value.filter((tab) => tab.component === 'OU050100');

  if (found.length === 0) {
    channel.value = [];
    customerManagement.clearCustomerList();
    customerManagement.resetFilters();
  }
});

watch(country, (newValue) => {
  filters.value.FLT_CUST_NATIONAL_CODE = newValue?.value ?? '';
});

watch(enableOrderDate, (newValue) => {
  if (!newValue) {
    filters.value.FLT_CUST_L_ORDER_FROM_DATE = '';
    filters.value.FLT_CUST_L_ORDER_TO_DATE = '';
  }

  if (newValue && filters.value.FLT_CUST_L_ORDER_FROM_DATE === '' && filters.value.FLT_CUST_L_ORDER_TO_DATE === '') {
    filters.value.FLT_CUST_L_ORDER_FROM_DATE = moment().format('YYYY-MM-DD');
    filters.value.FLT_CUST_L_ORDER_TO_DATE = moment().format('YYYY-MM-DD');
  }
});

watch(enableRegisteredDate, (newValue) => {
  if (!newValue) {
    filters.value.FLT_CUST_REGIST_FROM_DATE = '';
    filters.value.FLT_CUST_REGIST_TO_DATE = '';
  }

  if (newValue && filters.value.FLT_CUST_REGIST_FROM_DATE === '' && filters.value.FLT_CUST_REGIST_TO_DATE === '') {
    filters.value.FLT_CUST_REGIST_FROM_DATE = moment().format('YYYY-MM-DD');
    filters.value.FLT_CUST_REGIST_TO_DATE = moment().format('YYYY-MM-DD');
  }
});

const setDefaultValues = () => {
  channel.value = [];
  customerStatus.value = {
    name: 'All',
    value: '',
  };
  country.value = {
    name: 'All',
    value: '',
  };
  gender.value = {
    name: 'All',
    value: '',
  };

  channel.value = userGroupChannelList.value.map((channel) => ({
    name: decrypt(channel.USER_BRAND_FNAME) + ' - ' + decrypt(channel.USER_CHANNEL_FNAME),
    value: decrypt(channel.USER_CHANNEL_CODE),
    brand_code: decrypt(channel.USER_BRAND_CODE),
  }))
}


onMounted(async () => {
  togglePageLoading();
  isloading.isLoading = true
  await commonData.fetchOU050100CommonData();
  await pageLoader.fetchPageLoadData(currentTab.value?.component)
  await customerManagement.fetchUserGroupChannelList();

  setDefaultValues();
  isloading.isLoading = false
  togglePageLoading();
});

const onClickRefresh = async () => {
  toggleLoading();
  isloading.isLoading = true

  filters.value.FLT_REGIST_BRAND_CODE = channel.value.map((item) => item.brand_code) ?? [];
  filters.value.FLT_REGIST_CHANNEL_CODE = channel.value.map((item) => item.value) ?? [];
  filters.value.FLT_CUST_STATUS_CODE = customerStatus.value?.value ?? '';
  filters.value.FLT_CUST_CLASS_CODE = customerClass.value.map((item) => item.value) ?? [];
  filters.value.FLT_CUST_NATIONAL_CODE = country.value?.value ?? '';
  filters.value.FLT_PROFLT_CUST_GENDER_CODE = gender.value?.value ?? '';

  if (!enableRegisteredDate.value) {
    filters.value.FLT_CUST_REGIST_FROM_DATE = '';
    filters.value.FLT_CUST_REGIST_TO_DATE = '';
  } else {
    filters.value.FLT_CUST_REGIST_FROM_DATE = moment(filters.value.FLT_CUST_REGIST_FROM_DATE).format('YYYY-MM-DD');
    filters.value.FLT_CUST_REGIST_TO_DATE = moment(filters.value.FLT_CUST_REGIST_TO_DATE).format('YYYY-MM-DD');
  }

  if (!enableOrderDate.value) {
    filters.value.FLT_CUST_L_ORDER_FROM_DATE = '';
    filters.value.FLT_CUST_L_ORDER_TO_DATE = '';
  } else {
    filters.value.FLT_CUST_L_ORDER_FROM_DATE = moment(filters.value.FLT_CUST_L_ORDER_FROM_DATE).format('YYYY-MM-DD');
    filters.value.FLT_CUST_L_ORDER_TO_DATE = moment(filters.value.FLT_CUST_L_ORDER_TO_DATE).format('YYYY-MM-DD');
  }

  await customerManagement.fetchCustomerList();
  isloading.isLoading = false
  toggleLoading();
}

const customerListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU050100_GRD00001')
})

onBeforeUnmount(() => {
  customerManagement.clearCustomerList();
});
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-4 gap-x-12 gap-y-3">
        <FormGroup
          :label="getComponentData('OU050100_LBL00001', 'caption', 'Brand / Channel')"
          label-id="OU050100_LBL00001"
          label-for="OU050100_CMB00001"
          horizontal
        >
          <FormSelect
            id="OU050100_CMB00001"
            v-model="channel"
            :options="userGroupChannelList.map((channel) => ({
              name: decrypt(channel.USER_BRAND_FNAME) + ' - ' + decrypt(channel.USER_CHANNEL_FNAME),
              value: decrypt(channel.USER_CHANNEL_CODE),
              brand_code: decrypt(channel.USER_BRAND_CODE),
            }))"
            :max-items="4"
            multiple
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU050100_LBL00002', 'caption', 'Customer Status')"
          label-id="OU050100_LBL00002"
          label-for="OU050100_CMB00002"
          horizontal
        >
          <FormCombobox
            id="OU050100_CMB00002"
            v-model="customerStatus"
            :options="[
              {
                name: 'All',
                value: '',
              },
              ...commonData.getCustomerStatusOptions
            ]"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU050100_LBL00003', 'caption', 'Customer Class')"
          label-id="OU050100_LBL00003"
          label-for="OU050100_CMB00003"
          horizontal
        >
          <FormSelect
            id="OU050100_CMB00003"
            v-model="customerClass"
            :options="[
              ...commonData.getCustomerClassOptions
            ]"
            multiple
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU050100_LBL00007', 'caption', 'Country')"
          label-id="OU050100_LBL00007"
          label-for="OU050100_CMB00009"
          horizontal
        >
          <FormCombobox
            id="OU050100_CMB00009"
            v-model="country"
            :options="[
              {
                name: 'All',
                value: '',
              },
              ...commonData.getCountriesList
            ]"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU050100_LBL00004', 'caption', 'Gender')"
          label-id="OU050100_LBL00004"
          label-for="OU050100_CMB00004"
          horizontal
        >
          <FormCombobox
            id="OU050100_CMB00004"
            v-model="gender"
            :options="[
              {
                name: 'All',
                value: '',
              },
              ...commonData.getGenderList
            ]"
          />
        </FormGroup>

        <FormGroup
          horizontal
          label-width="w-1/3"
          :label="getComponentData('OU020100_LBL00005', 'caption', 'Registered Date')"
          label-id="OU020100_LBL00005"
        >
          <div class="flex items-center space-x-3">
            <FormCheckbox
              v-model="enableRegisteredDate"
            />
            <FormDatePicker
              v-model="filters.FLT_CUST_REGIST_FROM_DATE"
              :disabled="!enableRegisteredDate"
              mode="date"
            />
            <FormDatePicker
              v-model="filters.FLT_CUST_REGIST_TO_DATE"
              :disabled="!enableRegisteredDate"
              mode="date"
            />
          </div>
        </FormGroup>

        <FormGroup
          horizontal
          label-width="w-1/3"
          :label="getComponentData('OU020100_LBL00006', 'caption', 'Last Order Date')"
          label-id="OU020100_LBL00006"
        >
          <div class="flex items-center space-x-3">
            <FormCheckbox
              v-model="enableOrderDate"
            />
            <FormDatePicker
              v-model="filters.FLT_CUST_L_ORDER_FROM_DATE"
              :disabled="!enableOrderDate"
              mode="date"
            />
            <FormDatePicker
              v-model="filters.FLT_CUST_L_ORDER_TO_DATE"
              :disabled="!enableOrderDate"
              mode="date"
            />
          </div>
        </FormGroup>

        <FormGroup
          horizontal
          label-id="OU050100_LBL00008"
          :label="getComponentData('OU050100_LBL00008', 'caption', 'Keyword')"
        >
          <FormTextInput
            v-model="filters.FLT_CUST_KEYWORD"
          />
        </FormGroup>

        <div class="col-span-4 text-end mt-2">
          <Button
            id="OU050100_BTN00001"
            variant="gray"
            rounded
            size="sm"
            :disabled="loading"
            :loading="loading"
            @click="onClickRefresh"
          >
            {{ getComponentData('OU050100_BTN00001', 'caption', 'Refresh') }}
          </Button>
        </div>
      </div>
    </template>

    <div class="flex justify-between items-center mt-3">
      <p>
        {{ getGridData('OU050200_GRD00001', 'caption', 'Search Result') }}
      </p>

      <div class="inline-flex gap-x-3">
        <Button
          id="OU050100_BTN00002"
          rounded
          border
          size="xs"
        >
          {{ getComponentData('OU050100_BTN00002', 'caption', 'DM') }}
        </Button>

        <Button
          id="OU050100_BTN00003"
          rounded
          border
          size="xs"
        >
          {{ getComponentData('OU050100_BTN00003', 'caption', 'GIFT') }}
        </Button>
      </div>
    </div>

    <Table
      id="OU050200_GRD00001"
      border
      class="overflow-x-auto"
      header-variant="secondary"
      clickable
      :columns="customerListTableFields"
      :items="paginatedData"
    />

    <!-- Pagination -->
    <div
      v-if="customerList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? customerList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ customerList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="customerList?.length"
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
