<script setup>
import moment from "moment";

const { getMaskedValue } = useMasked();
const { currentTab } = storeToRefs(useTabsStore())
const pageLoader = usePageLoaderStore()
const claimManagement = useClaimManagementStore()
const { csList, commentListFilters, filters, summaryList } = storeToRefs(useClaimManagementStore())
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? '', 'POP00240', 'POP00230', 'POP00020'])

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(csList, perPage.value);

const csTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '', 'OU040100_GRD01002')
})

const { loading, toggleLoading } = useLoading()

onMounted(async () => {
  claimManagement.resetFilters()
})

onBeforeUnmount(() => {
  resetPage()
})

// const emits = defineEmits(['onRowClick'])

const search = async () => {
  filters.value.FLT_CS_STATUS_CODE = ['0090'];
  filters.value.FLT_RECEIPT_FROM_DATE = receiptFromDate.value ? moment(receiptFromDate.value).format('YYYY-MM-DD') : '';
  filters.value.FLT_RECEIPT_TO_DATE = receiptToDate.value ? moment(receiptToDate.value).format('YYYY-MM-DD') : '';

  toggleLoading()
  resetPage()
  await claimManagement.fetchCsList()
  toggleLoading()
}

const onClickItemRow = async (item) => {
  commentListFilters.value.FLT_CS_SID = item.CS_SID
  claimManagement.clearCommentList()
  await claimManagement.fetchCommentList()

  csData.value = item
  informationForm.value = {
    FLT_CS_SID: item.CS_SID,
    FLT_CS_TYPE_CODE: item.CS_TYPE_CODE,
    FLT_CS_USER_SID: item.CS_USER_SID,
    FLT_CS_BRAND_CODE: item.CS_BRAND_CODE,
    FLT_CS_CHANNEL_CODE: item.CS_CHANNEL_CODE,
    FLT_CS_CUST_REGIST_YN: item.CS_CUST_REGIST_YN,
    FLT_CS_CUST_SID: item.CS_CUST_SID,
    FLT_CS_CUST_FNAME: item.CS_CUST_FNAME,
    FLT_CS_CUST_MOBILE_NO: item.CS_CUST_MOBILE_NO,
    FLT_CS_TRANSACTION_SID: item.CS_TRANSACTION_SID,
    FLT_CS_TRANSACTION_TYPE_CODE: item.CS_TRANSACTION_TYPE_CODE,
    FLT_CS_CATEGORY_CODE: item.CS_CATEGORY_CODE,
    FLT_CS_REGIST_DATE: item.CS_REGIST_DATE,
    FLT_CS_REGIST_TIME: item.CS_REGIST_TIME,
    FLT_CS_STATUS_CODE: item.CS_STATUS_CODE,
    FLT_CS_STATUS_FNAME: item.CS_STATUS_FNAME,
    FLT_CS_REPAIR_COST: item.CS_REPAIR_COST,
    FLT_CS_REPAIR_COST_CHARGE_YN: item.CS_REPAIR_COST_CHARGE_YN,
    FLT_CS_RETURN_ORDER_SID: item.CS_RETURN_ORDER_SID
  }

  date.value = item.CS_REGIST_DATE;
  userRegistered.value = item.CS_CUST_REGIST_YN === '1'
  chargeCustomer.value = item.CS_REPAIR_COST_CHARGE_YN === '1'
}

const csData = ref({})
// const channel = ref({})
// const category = ref({})
const date = ref('')
const userRegistered = ref(false)
// const transactionType = ref({})
const chargeCustomer = ref(false)

const receiptFromDate = ref(moment().format('YYYY-MM-DD'));
const receiptToDate = ref(moment().format('YYYY-MM-DD'));
const dataRange = ref({});
const csType = ref([]);

watch(() => csType.value, (value) => {
  filters.value.FLT_CS_TYPE_CODE = value.map((item) => item.value);
})
watch(() => receiptFromDate, (value) => {
  filters.value.FLT_RECEIPT_FROM_DATE = moment(value).format('YYYY-MM-DD');
})
watch(() => receiptToDate, (value) => {
  filters.value.FLT_RECEIPT_TO_DATE = moment(value).format('YYYY-MM-DD');
})
watch(() => dataRange.value, (value) => {
  const date = moment().format('YYYY-MM-DD');
  switch (value.value) {
    case 'WEEK':
      receiptFromDate.value = moment(date).subtract(7, 'days').format('YYYY-MM-DD');
      break;
    case '1M':
      receiptFromDate.value = moment(date).subtract(1, 'months').format('YYYY-MM-DD');
      break;
    case '3M':
      receiptFromDate.value = moment(date).subtract(3, 'months').format('YYYY-MM-DD');
      break;
    case '6M':
      receiptFromDate.value = moment(date).subtract(6, 'months').format('YYYY-MM-DD');
      break;
  }
  receiptToDate.value = date;
})

const defaultFormData = {
  FLT_CS_SID: '',
  FLT_CS_TYPE_CODE: '',
  FLT_CS_USER_SID: '',
  FLT_CS_BRAND_CODE: '',
  FLT_CS_CHANNEL_CODE: '',
  FLT_CS_CUST_REGIST_YN: '',
  FLT_CS_CUST_SID: '',
  FLT_CS_CUST_FNAME: '',
  FLT_CS_CUST_MOBILE_NO: '',
  FLT_CS_TRANSACTION_SID: '',
  FLT_CS_TRANSACTION_TYPE_CODE: '',
  FLT_CS_CATEGORY_CODE: '',
  FLT_CS_REGIST_DATE: '',
  FLT_CS_REGIST_TIME: '',
  FLT_CS_STATUS_CODE: '',
  FLT_CS_STATUS_FNAME: '',
  FLT_CS_REPAIR_COST: '',
  FLT_CS_REPAIR_COST_CHARGE_YN: '',
  FLT_CS_RETURN_ORDER_SID: ''
}

const informationForm = ref(defaultFormData);
</script>

<template>
  <div>
    <Card
      shadow-size="none"
      card-header-class="p-3 space-y-3"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg"
    >
      <div class="mb-3">
        <div class="grid grid-cols-5 gap-x-3">
          <FormGroup
            horizontal
            :label="getComponentData('OU040100_LBL09001', 'caption')"
            label-id="OU040100_LBL09001"
            label-for="OU040100_TXT09001"
          >
            <FormTextInput
              id="OU040100_TXT09001"
              v-model="filters.FLT_KEY_WORD"
            />
          </FormGroup>

          <FormGroup
            horizontal
            :label="getComponentData('OU040100_LBL09002', 'caption')"
            label-id="OU040100_LBL09002"
            class="col-span-2"
          >
            <div class="flex items-center gap-x-3">
              <FormDatePicker
                v-model="receiptFromDate"
                mode="date"
              />
              <FormDatePicker
                v-model="receiptToDate"
                mode="date"
              />

              <FormSelect
                v-model="dataRange"
                :options="[
                  {
                    name: getComponentData('OU040100_BTN09001', 'caption'),
                    value: 'WEEK'
                  },
                  {
                    name: getComponentData('OU040100_BTN09002', 'caption'),
                    value: '1M'
                  },
                  {
                    name: getComponentData('OU040100_BTN09003', 'caption'),
                    value: '3M'
                  },
                  {
                    name: getComponentData('OU040100_BTN09004', 'caption'),
                    value: '6M'
                  }
                ]"
              />
            </div>
          </FormGroup>

          <FormGroup
            horizontal
            :label="getComponentData('OU040100_LBL09003', 'caption')"
            label-id="OU040100_LBL09003"
          >
            <FormSelect
              v-model="csType"
              :options="summaryList.filter(item => item.CS_TYPE_CODE !== '0900').map((item) => ({
                name: item.CS_TYPE_FNAME,
                value: item.CS_TYPE_CODE
              }))"
              multiple
              max-items="3"
            />
          </FormGroup>

          <div class="text-end">
            <Button
              variant="gray"
              rounded
              size="sm"
              :loading="loading"
              :disabled="loading"
              @click="search"
            >
              {{ getComponentData('OU040100_BTN09005', 'caption') }}
            </Button>
          </div>
        </div>
      </div>

      <Table
        id="OU040100_GRD01002"
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="csTableColumns"
        :items="paginatedData"
        clickable
        @on-row-click="onClickItemRow"
      >
        <template #row="{ item, columns }">
          <TableRow
            @click="() => {
              onClickItemRow(item)
              paginatedData.map((data) => {
                data.showSubTable = false
              })
              item.showSubTable = !item.showSubTable
            }"
          >
            <TableCell
              v-for="(column, columnIndex) in columns"
              v-show="column.display === 'Y'"
              :key="columnIndex"
              class-name="whitespace-nowrap px-3 py-3 text-sm text-gray-500"
            >
              <slot
                :name="`cell(${column?.dataFieldName ?? ''})`"
                :value="item[column.dataFieldName]"
                :item="item"
              >
                <span v-if="column.editMask">
                  {{ getMaskedValue(item[column.dataFieldName], column.editMask) ?? '-' }}
                </span>
                <span v-else>
                  {{ item[column.dataFieldName] ?? '-' }}
                </span>
              </slot>
            </TableCell>
          </TableRow>
          <TableRow
            v-if="item.showSubTable"
            disable-clickable
          >
            <TableCell
              :colspan="columns.filter(column => column.display === 'Y').length - 5"
              class-name="whitespace-nowrap p-3 text-sm text-gray-500"
            >
              <Card
                shadow-size="none"
                card-header-class="p-3"
                class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg space-y-3"
              >
                <div class="grid grid-cols-5 mb-3">
                  <p class="font-normal text-gray-700 text-sm uppercase">
                    {{ getComponentData('OU040100_LBL09009', 'caption') }}
                  </p>
                </div>

                <div>
                  <div class="grid grid-cols-4 space-x-6 mb-3">
                    <FormGroup
                      :label="getComponentData('OU040100_LBL09010', 'caption')"
                      label-id="OU040100_LBL09010"
                      horizontal
                    >
                      <FormTextInput
                        v-model="csData.CS_STATUS_FNAME"
                        disabled
                      />
                    </FormGroup>

                    <FormGroup
                      label-id="OU040100_LBL02002"
                      :label="getComponentData('OU040100_LBL02002', 'caption')"
                      label-for="OU040100_TXT02001"
                      horizontal
                    >
                      <FormTextInput
                        v-model="csData.CS_SID"
                        disabled
                      />
                    </FormGroup>

                    <FormGroup
                      :label="getComponentData('OU040100_LBL09011', 'caption')"
                      horizontal
                    >
                      <FormDatePicker
                        disabled
                        mode="date"
                      />
                    </FormGroup>

                    <FormGroup
                      :label="getComponentData('OU040100_LBL09012', 'caption')"
                      label-id="OU040100_LBL09012"
                      horizontal
                    >
                      <FormTextInput
                        v-model="csData.CS_CATEGORY_FNAME"
                        disabled
                      />
                    </FormGroup>
                  </div>

                  <div class="grid grid-cols-4 space-x-6 mb-3">
                    <FormGroup
                      :label="getComponentData('OU040100_LBL09013', 'caption')"
                      label-id="OU040100_LBL09013"
                      horizontal
                    >
                      <FormTextInput
                        v-model="informationForm.FLT_CS_CUST_SID"
                        disabled
                      />
                    </FormGroup>
                    <FormCheckbox
                      id="OU040100_LBL09014"
                      v-model="userRegistered"
                      disabled
                      :label="getComponentData('OU040100_LBL09014', 'caption')"
                    />
                    <FormGroup
                      :label="getComponentData('OU040100_LBL02009', 'caption')"
                      label-id="OU040100_LBL02009"
                      label-for="OU040100_TXT02005"
                      horizontal
                    >
                      <FormTextInput
                        id="OU040100_TXT02004"
                        v-model="informationForm.FLT_CS_CUST_FNAME"
                        disabled
                      />
                    </FormGroup>
                    <FormGroup
                      :label="getComponentData('OU040100_LBL02010', 'caption')"
                      label-id="OU040100_LBL02010"
                      label-for="OU040100_TXT02006"
                      horizontal
                    >
                      <FormTextInput
                        id="OU040100_TXT02006"
                        v-model="informationForm.FLT_CS_CUST_MOBILE_NO"
                        disabled
                      />
                    </FormGroup>
                  </div>

                  <div class="grid grid-cols-4 space-x-6 mb-3">
                    <FormGroup
                      :label="getComponentData('OU040100_LBL09019', 'caption')"
                      label-id="OU040100_LBL09019"
                      horizontal
                    >
                      <FormTextInput
                        v-model="informationForm.FLT_CS_REPAIR_COST"
                        disabled
                      />
                    </FormGroup>

                    <FormCheckbox
                      id="OU040100_LBL09020"
                      v-model="chargeCustomer"
                      disabled
                      :label="getComponentData('OU040100_LBL09020', 'caption')"
                    />
                  </div>
                </div>

                <component
                  :is="`OU040100CSCOMMENTTABLE`"
                />
              </Card>
            </TableCell>
          </TableRow>
        </template>
      </Table>

      <!-- Pagination -->
      <div
        v-if="csList?.length"
        class="flex justify-between items-center mt-3"
      >
        <p class="text-sm text-gray-700">
          Showing
          <span class="mx-1">
            {{ (currentPage - 1) * perPage + 1 }}
          </span>
          to
          <span class="mx-1">
            {{ isLastPage ? csList?.length : currentPage * perPage }}
          </span>
          of
          <span class="mx-1">
            {{ csList?.length }}
          </span>
          results
        </p>

        <Pagination
          :total-items="csList?.length"
          :items-per-page="perPage"
          :current-page="currentPage"
          rounded
          active-variant="gray"
          @page-changed="currentPage = $event"
        />
      </div>
    </Card>
  </div>
</template>

<style scoped>

</style>
