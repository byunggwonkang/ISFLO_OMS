<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
const props = defineProps({
  promotionItemData: {
    type: Object,
    default: () => ({}),
  },
})

const pageLoader = usePageLoaderStore()
const { getGridData } = usePageLoaderGrid('POP00200');
const { getComponentData } = usePageLoaderComponent(['POP00200'])
const commonData = useCommonDataStore()
const promotionManagement = usePromotionManagementStore()
const { orderList, orderListFilters } = storeToRefs(promotionManagement)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(orderList, perPage.value);
const { loading, toggleLoading } = useLoading()

const orderStatus = ref([])
const viewType = ref({})
const orderType = ref({})

onMounted(async () => {
  isloading.isLoading = true
  await commonData.fetchPOP00200CommonData();

  viewType.value = commonData.getOrderViewOptions[0] ?? {};
  orderType.value = commonData.getOrderSplitOptions[0] ?? {};
  orderListFilters.value.FLT_PROM_SID = decrypt(props.promotionItemData.PROM_SID)
  orderListFilters.value.FLT_CHANNELS = props.promotionItemData.PRODUCT_CHANNEL.map((c) => decrypt(c.PROM_CHANNEL_CODE))
  isloading.isLoading = false
})

const search = async () => {
  toggleLoading()
  isloading.isLoading = true
  orderListFilters.value.FLT_ORDER_STATUS = orderStatus.value.map((s) => s.value)
  orderListFilters.value.FLT_VIEW_OPT = viewType.value.value ?? ''
  orderListFilters.value.FLT_SPLIT_OPT = orderType.value.value ?? ''
  await promotionManagement.fetchOrderList()
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const orderTableColumns = computed(() => {
  return pageLoader.getTableData('POP00200' , 'POP00200_GRD02003')
})

const openOrderDetailModal = ref(false)
const orderDetailData = ref({})

const onClickOrderDetailRow = (row) => {
  openOrderDetailModal.value = true
  orderDetailData.value = row
}
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-4 gap-3 items-start">
      <FormGroup
        :label="getGridData('POP00200_GRD02001', 'caption') "
        label-width="w-1/3"
        input-width="w-2/3"
      >
        <div class="flex items-center gap-1 flex-wrap">
          <Button
            v-for="(c, cIndex) in promotionItemData.PRODUCT_CHANNEL"
            :key="cIndex"
            size="xs"
            rounded
            variant="white"
            border
          >
            {{ decrypt(c.PROM_CHANNEL_NAME) }}
          </Button>
        </div>
      </FormGroup>

      <div>
        <FormGroup
          :label="getGridData('POP00200_GRD02002', 'caption') "
          horizontal
          label-width="w-2/4"
        >
          <FormSelect
            v-model="orderStatus"
            :options="commonData.getOrderStatusList"
            :max-items="2"
            multiple
          />
        </FormGroup>
      </div>

      <div>
        <FormGroup
          :label="getComponentData('POP00200_LBL02001', 'caption', 'Apply Datw')"
          label-id="POP00190_LBL01005"
          horizontal
        >
          <div class="flex items-center sm:flex-col lg:flex-row sm:space-y-3 sm:space-x-0 lg:space-x-3 lg:space-y-0 w-full">
            <FormDatePicker
              v-model="orderListFilters.FLT_DATE_FROM"
              placeholder="Select a date"
              mode="date"
            />

            <FormDatePicker
              v-model="orderListFilters.FLT_DATE_TO"
              placeholder="Select a date"
              mode="date"
            />
          </div>
        </FormGroup>
      </div>

      <div />

      <FormGroup
        :label="getComponentData('POP00200_LBL02002', 'caption')"
        horizontal
        label-id="POP00200_LBL02002"
        label-width="w-1/3"
      >
        <FormSelect
          v-model="viewType"
          :options="commonData.getOrderViewOptions"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00200_LBL02003', 'caption')"
        horizontal
        label-id="POP00200_LBL02003"
      >
        <FormSelect
          v-model="orderType"
          :options="commonData.getOrderSplitOptions"
        />
      </FormGroup>

      <div>
        <Button
          variant="gray"
          rounded
          size="sm"
          :disabled="loading"
          :loading="loading"
          @click="search"
        >
          {{ getComponentData('POP00200_BTN02001', 'caption') }}
        </Button>
      </div>
    </div>

    <div class="space-y-3">
      <span v-if="getGridData('POP00200_GRD02003', 'display') === 'Y'">
        {{ getGridData('POP00200_GRD02003', 'caption') }}
      </span>

      <Table
        id="POP00200_GRD02003"
        clickable
        header-variant="secondary"
        class="overflow-x-auto border-b"
        :columns="orderTableColumns"
        :items="paginatedData"
        @on-row-click="onClickOrderDetailRow"
      />

      <!-- Pagination -->
      <div
        v-if="orderList?.length"
        class="flex justify-between items-center pl-3"
      >
        <p class="text-sm text-gray-700">
          Showing
          <span class="mx-1">
            {{ (currentPage - 1) * perPage + 1 }}
          </span>
          to
          <span class="mx-1">
            {{ isLastPage ? orderList?.length : currentPage * perPage }}
          </span>
          of
          <span class="mx-1">
            {{ orderList?.length }}
          </span>
          results
        </p>

        <Pagination
          :total-items="orderList?.length"
          :items-per-page="perPage"
          :current-page="currentPage"
          rounded
          @page-changed="currentPage = $event"
        />
      </div>
    </div>

    <Modal
      :show="openOrderDetailModal"
      size="11xl"
      divider
      body-class="p-0"
      @close="() => {
        openOrderDetailModal = false;
        orderDetailData = {};
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00020_LBL01001', 'caption') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00020`"
          :order-detail-data="orderDetailData"
        />
      </template>
    </Modal>
  </div>
</template>

<style scoped>

</style>
