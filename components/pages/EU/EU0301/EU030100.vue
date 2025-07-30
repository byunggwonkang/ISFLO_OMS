<!-- eslint-disable vue/attribute-hyphenation -->
<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import { ArrowPathIcon } from "@heroicons/vue/24/solid";

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const orderStatus = useOrderListStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { orderStatusList, currentOrderStatus } = storeToRefs(useOrderListStore())

const { loading, toggleLoading } = useLoading()
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? '', 'POP00020'])

watch(currentOrderStatus, () => {
  orderStatus.resetOrderDetailList()
  // orderStatus.resetFilters()
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await commonData.fetchOU030100CommonData()
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00020')
  await orderStatus.fetchOrderStatusList()
  isloading.isLoading = false
  togglePageLoading()
})

const onClickRefresh = async () => {
  toggleLoading()
  isloading.isLoading = true
  await Promise.all([
    orderStatus.fetchOrderStatusList(),
    orderStatus.fetchOrderSummaryList(),
  ])
  isloading.isLoading = false
  toggleLoading()
}

const tabContentComponentName = computed(() => {
  return `${currentTab.value?.component}OL${decrypt(currentOrderStatus.value?.ORD_STATUS_CODE)}`
})

const openOrderDetailModal = ref(false)
const openPrintModal = ref(false)
const orderDetailData = ref({})
const PrintTypeData = ref("")
const PrintOrderData = ref([])
const OrgWayBill = ref("")
const StationSID = ref("")
const CourierSID = ref("")


</script>

<template>
  <AppContent :loading="pageLoading">    
    <div class="flex justify-items-stretch -mt-3">
      <div class="w-44 flex-none space-y-3 border-r border-gray-200 pt-3 pr-3">
        <div class="flex justify-between items-center">
          <span class="font-black text-md">
            {{ getComponentData('EU030100_BTN00001', 'caption', 'Refresh') }}
          </span>

          <Button
            id="EU030100_BTN00001"
            rounded
            :disabled="loading"
            variant="white"
            border
            size="xs"
            @click="onClickRefresh"
          >
            <ArrowPathIcon
              class="w-4 h-5 font-bold"
              :class="{
                'animate-spin': loading
              }"
            />
          </Button>
        </div>

        <div
          class="flex flex-1 flex-col space-y-3"
          aria-label="Sidebar"
        >
          <ul
            v-if="orderStatusList.length === 0"
            role="list"
            class="space-y-3"
          >
            <li
              v-for="(i) in [0, 1, 2, 3, 4, 5]"
              :key="i"
              class="h-20"
            >
              <SkeletonLoader class="w-full h-full rounded" />
            </li>
          </ul>

          <div
            v-for="list in orderStatusList"
            :key="list.ORD_STATUS_CODE"
            class="cursor-pointer"
            @click="orderStatus.setCurrentOrderStatus(list)"
          >
            <div
              class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-20 border hover:border-gray-500"
              :class="{
                'isac-bg-gray' : currentOrderStatus?.ORD_STATUS_CODE === list.ORD_STATUS_CODE,
                'bg-gray-100' : currentOrderStatus?.ORD_STATUS_CODE !== list.ORD_STATUS_CODE,
              }"
            >
              <span
                class="text-xs font-medium"
                :class="{
                  'text-white' : currentOrderStatus?.ORD_STATUS_CODE === list.ORD_STATUS_CODE,
                  'text-gray-700' : currentOrderStatus?.ORD_STATUS_CODE !== list.ORD_STATUS_CODE,
                }"
              >
                {{ decrypt(list.ORD_STATUS_FNAME) }}
              </span>
              <span
                class="text-2xl font-black"
                :class="{
                  'text-white' : currentOrderStatus?.ORD_STATUS_CODE === list.ORD_STATUS_CODE,
                  'text-gray-700' : currentOrderStatus?.ORD_STATUS_CODE !== list.ORD_STATUS_CODE,
                }"
              >
                {{ decrypt(list.ORD_STATUS_VALUE) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="orderStatusList.length"
        class="w-5/6 flex-auto pt-3"
      >
        <keep-alive>
          <component
            :is="tabContentComponentName"
            @on-click-order-detail="(item) => {
              openOrderDetailModal = true;
              orderDetailData = item;
            }"
            @on-click-print="(item,orderData,OrgWayBillData,StationSIDData,CourierSIDData) => {              
              PrintTypeData = item;
              PrintOrderData = orderData;
              OrgWayBill = OrgWayBillData;
              StationSID = StationSIDData;
              CourierSID =CourierSIDData;
              openPrintModal = true;
            }"
          />
        </keep-alive>

        <!-- Edit User Modal -->
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
              {{ getComponentData('POP00020_LBL00001', 'caption', 'Order Details') }}
            </h3>
          </template>

          <template #body>
            <component
              :is="`POP00020`"
              :order-detail-data="orderDetailData"
            />
          </template>
        </Modal>
        <Modal
          :show="openPrintModal"
          body-class="px-3 py-1"
          @close="openPrintModal = false"
        >
          <template #header>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ getComponentData('POP00390_LBL00001', 'caption', 'PRINT') }}
            </h3>
          </template>

          <template #body>
            <component
              :is="`POP00390`"
              :printtype="PrintTypeData"
              :OrderData="PrintOrderData"
              :OrgWayBill="OrgWayBill"
              :StationSID="StationSID"
              :CourierSID="CourierSID"  
            />
          </template>
        </Modal>
      </div>
      <div
        v-else
        class="w-5/6 flex-auto space-y-1 pt-3 pl-3"
      >
        <SkeletonLoader class="w-full h-28 rounded" />
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
