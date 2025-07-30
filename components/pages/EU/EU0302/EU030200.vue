<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

import VueFeather from 'vue-feather';
import {notify} from "notiwind";


const { pageLoading, togglePageLoading } = usePageLoading();
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()
const shipmentInspection = useShipmentInspectionStore()
const { currentTab } = storeToRefs(useTabsStore())
const { getMaskedValue } = useMasked();

const { StationList, WorkStaffList, orderSummaryList, STATION_USER_SID, orderStatusList,orderListFilters,orderList,orderDetailInfo, orderDetailInfoOperationNote,orderPackingItemList } = storeToRefs(shipmentInspection)

const { loading, toggleLoading } = useLoading()

const Station = ref({})
const WorkStaff = ref({})
const channel = ref({})

const orderData = ref({
  ORD_STATUS_CODE : '',
  ORD_STATUS_FNAME : '',
  ORD_SUBSTATUS_CODE : '',
  ORD_SUBSTATUS_FNAME : '',
  ORD_ID : '',
  ORD_SID : '',
  ORD_SEQ : '',
  ORD_BRAND_CODE : '',
  ORD_BRAND_FNAME : '',
  ORD_CHANNEL_CODE : '',
  ORD_CHANNEL_DESCR : '',
  ORD_TYPE_FNAME : '',
  ORD_RECVR_NAME_M : '',
  ORD_RECVR_MOBILE_M : '',
  ORD_RECVR_ADDR_1 : '',
})


/* Dialog Modal */
const openPrintModal = ref(false)

const DIALOG_TYPE = ref("")
const DIALOG_TITLE = ref("")
const DIALOG_TEXT = ref("")

////////////////////////////////

const WAYBILL_NO = ref("")
const SKU_DATA = ref("")

const REQUESTED_CNT = ref("")
const PREPARING_CNT = ref("")
const PACKING_CNT = ref("")
const PACKED_CNT = ref("")

const ORDER_LIST_CNT = ref("")
const REQUEST_CANCEL_CNT = ref("")
const CHANGE_INFO_CNT = ref("")
const HOLD_BY_ESM_CNT = ref("")

const ADD_WAYBIL_CNT = ref("0")

const SELECT_WAYBILL_COURIER_SID = ref("")
const SELECT_WAYBILL_NO = ref("")

const openDialogModal = ref(false)
const openOrderModal = ref(false)


const PrintTypeData = ref("WAYBILL")
const PrintOrderData = ref([])
const OrgWayBill = ref("")
const StationSID = ref("")
const CourierSID = ref("")


const SKURef = ref(null);

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);


watch(() => Station, async (value) => {
  if (value) {
    STATION_USER_SID.value = value?.value.value
    await shipmentInspection.fetchOrderSummaryList()   
    channel.value = {
      name: decrypt(orderSummaryList.value[0].ORD_SUM_CHANNEL_DESCR) || '',
      value: decrypt(orderSummaryList.value[0].ORD_SUM_CHANNEL_CODE) || '',
    };
  }
}, { deep: true })

watch(() => channel, async (value) => {
  if (value) {
    const selectedChannel = orderSummaryList.value.find((channel) => decrypt(channel.ORD_SUM_CHANNEL_CODE) === value?.value.value)
    REQUESTED_CNT.value = selectedChannel?.ORD_SUM_COUNT_00
    PREPARING_CNT.value = selectedChannel?.ORD_SUM_COUNT_01
    PACKING_CNT.value = selectedChannel?.ORD_SUM_COUNT_02
    PACKED_CNT.value = selectedChannel?.ORD_SUM_COUNT_03
  }
}, { deep: true })

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  
  await pageLoader.fetchPageLoadData(currentTab.value?.component)
  await shipmentInspection.fetchStationList()
  await shipmentInspection.fetchWorkStaffList()
  await shipmentInspection.fetchOrderStatusList()

  Station.value = {
    name: decrypt(StationList.value[0].STATION_ID) || '',
    value: decrypt(StationList.value[0].USER_SID) || '',
  };
  WorkStaff.value = {
    name: WorkStaffList.value[0] ? decrypt(WorkStaffList.value[0].STAFF_NAME) : '',
    value: WorkStaffList.value[0] ? decrypt(WorkStaffList.value[0].STAFF_SID) : '',
  };
  
  const ORDER_LIST = orderStatusList.value.find((channel) => decrypt(channel.ORD_STATUS_CODE) === '0010')
  ORDER_LIST_CNT.value = ORDER_LIST?.ORD_STATUS_VALUE
  const REQUEST_CANCEL = orderStatusList.value.find((channel) => decrypt(channel.ORD_STATUS_CODE) === '0030')
  REQUEST_CANCEL_CNT.value = REQUEST_CANCEL?.ORD_STATUS_VALUE
  const CHANGE_INFO = orderStatusList.value.find((channel) => decrypt(channel.ORD_STATUS_CODE) === '0040')
  CHANGE_INFO_CNT.value = CHANGE_INFO?.ORD_STATUS_VALUE
  const HOLD_BY_ESM = orderStatusList.value.find((channel) => decrypt(channel.ORD_STATUS_CODE) === '0050')
  HOLD_BY_ESM_CNT.value = HOLD_BY_ESM?.ORD_STATUS_VALUE

  isloading.isLoading = false
  togglePageLoading()
})

const ConfirmDialog = async () => {
  
  if(DIALOG_TYPE.value === 'SAVE')
  {
    const INPUT_DATA = ref({
      FLT_STATION_USER_SID: Station.value?.value ?? '',
      FLT_BRAND_CODE: orderData.value.ORD_BRAND_CODE,
      FLT_CHANNEL_CODE: orderData.value.ORD_CHANNEL_CODE,
      FLT_ORDER_SID: orderData.value.ORD_SID,
    })
    toggleLoading()
    isloading.isLoading = true
    const { success } = await shipmentInspection.fetchOrderStatusPackedSet(INPUT_DATA.value)
    if (success) {
      await fetchClearOrderData()
    }
    isloading.isLoading = false
    toggleLoading()
  }
  else if(DIALOG_TYPE.value === 'CANCEL_PACKING')
  {
    const INPUT_DATA = ref({
      FLT_STATION_USER_SID: Station.value?.value ?? '',
      FLT_BRAND_CODE: orderData.value.ORD_BRAND_CODE,
      FLT_CHANNEL_CODE: orderData.value.ORD_CHANNEL_CODE,
      FLT_ORDER_SID: orderData.value.ORD_SID,
    })
    toggleLoading()
    isloading.isLoading = true
    const { success } = await shipmentInspection.fetchOrderItemInputClearSet(INPUT_DATA.value)
    if (success) {

      const STATUS_DATA = ref({
        FLT_TO_STATUS_CODE: encrypt("32"),  
        FLT_ORDERS: [
          {"ORD_SID":encrypt(orderData.value.ORD_SID)}
        ],  
      })
      const { success } = await shipmentInspection.fetchOrderStatusChange(STATUS_DATA.value)
      if (success) await fetchClearOrderData()          
    }
    isloading.isLoading = false

    toggleLoading()
  }
  else if(DIALOG_TYPE.value === 'CLEAR_ITEM')
  {
    const INPUT_DATA = ref({
      FLT_STATION_USER_SID: Station.value?.value ?? '',
      FLT_BRAND_CODE: orderData.value.ORD_BRAND_CODE,
      FLT_CHANNEL_CODE: orderData.value.ORD_CHANNEL_CODE,
      FLT_ORDER_SID: orderData.value.ORD_SID,
    })
    toggleLoading()
    isloading.isLoading = true
    const { success } = await shipmentInspection.fetchOrderItemInputResetSet(INPUT_DATA.value)
    if (success) {
      await shipmentInspection.fetchOrderItemInputGet(INPUT_DATA.value)
    }
    isloading.isLoading = false
    toggleLoading()
  }
  else if(DIALOG_TYPE.value === 'REMOVE_WAYBILL')
  {
    const SEND_DATA = ref({
      FLT_ORDERS: [
        {
          ORDER_SID : encrypt(orderData.value.ORD_SID),
          BRAND_CODE : encrypt(orderData.value.ORD_BRAND_CODE),
          CHANNEL_CODE : encrypt(orderData.value.ORD_CHANNEL_CODE),
          COURIER_SID : encrypt(SELECT_WAYBILL_COURIER_SID.value),
          REQUEST_DATETIME : encrypt(''),
          WAYBILL_NO : encrypt(SELECT_WAYBILL_NO.value),
        }
      ],  
    })
    toggleLoading()
    isloading.isLoading = true
    const { success } = await shipmentInspection.fetchOrderWaybillDeleteSet(SEND_DATA.value)
    if (success) 
    {
      await shipmentInspection.fetchOrderDetailInfo(encrypt(orderData.value.ORD_SID))
    }  
    isloading.isLoading = false
    toggleLoading()
  }
  openDialogModal.value = false
}

const onSave = async () => {
  
  DIALOG_TYPE.value = 'SAVE'
  DIALOG_TITLE.value = 'Shipment Packing Save'
  DIALOG_TEXT.value = 'Would you like to save the packing for this order?'

  openDialogModal.value = true
}

const updateOrderSubStatus = async (item) => {
  const STATUS_DATA = ref({
    FLT_TO_SUBSTATUS_CODE: encrypt(item),  
    FLT_ORDERS: [
      {"ORD_SID":encrypt(orderData.value.ORD_SID)}
    ],
  })
  toggleLoading()
    isloading.isLoading = true
  await shipmentInspection.fetchOrderSubStatusChange(STATUS_DATA.value)
  await OrderReSearch()
    isloading.isLoading = false
  toggleLoading()
}

const removeWaybill = async (item) => {

  DIALOG_TYPE.value = 'REMOVE_WAYBILL'
  DIALOG_TITLE.value = 'Delete Order Waybill'
  DIALOG_TEXT.value = 'Do you want to delete the selected waybill?\n[ waybill : ' + decrypt(item.WAYBILL_NO)+ ' ]'

  SELECT_WAYBILL_COURIER_SID.value = decrypt(item.WAYBILL_COURIER_SID)
  SELECT_WAYBILL_NO.value = decrypt(item.WAYBILL_NO)

  openDialogModal.value = true
}

const changeWaybill = async (item) => {

  PrintOrderData.value.length = 0

  PrintOrderData.value.push({
    ORD_SID: encrypt(orderData.value.ORD_SID),
    BRAND_CODE: encrypt(orderData.value.ORD_BRAND_CODE),
    CHANNEL_CODE: encrypt(orderData.value.ORD_CHANNEL_CODE),
  })
  
  StationSID.value = Station.value?.value ?? ''

  OrgWayBill.value = item.WAYBILL_NO

  const GETCHANNEL = StationList.value?.find((item) => decrypt(item.USER_SID) === Station.value?.value ?? '')
  const GETCOURIER = GETCHANNEL.STATION_CHANNEL_LIST?.find((item) => item.CHANNEL_CODE === encrypt(orderData.value.ORD_CHANNEL_CODE))
  CourierSID.value = GETCOURIER?.CHANNEL_COURIER_SID ?? ''
  openPrintModal.value = true
}

const fetchClearOrderData = async () => {
  toggleLoading()
  isloading.isLoading = true
  orderData.value = {
    ORD_STATUS_CODE : '',
    ORD_STATUS_FNAME : '',
    ORD_SUBSTATUS_CODE : '',
    ORD_SUBSTATUS_FNAME : '',
    ORD_ID : '',
    ORD_SID : '',
    ORD_SEQ : '',
    ORD_BRAND_CODE : '',
    ORD_BRAND_FNAME : '',
    ORD_CHANNEL_CODE : '',
    ORD_CHANNEL_DESCR : '',
    ORD_TYPE_FNAME : '',
    ORD_RECVR_NAME_M : '',
    ORD_RECVR_MOBILE_M : '',
    ORD_RECVR_ADDR_1 : '',
  }

  await shipmentInspection.clearOrderList()
  await shipmentInspection.clearOrderPackingItemList()
  await shipmentInspection.clearOrderDetailInfo()
  await shipmentInspection.clearOrderOperationNote()

  SKU_DATA.value = ''
  WAYBILL_NO.value = ''
  SKU_DATA.value = ''
  orderListFilters.value.FLT_KEY_WORD = ''
  ADD_WAYBIL_CNT.value = '0'
  isloading.isLoading = false
  toggleLoading()
}

const onSKUEnter = async (showLoading = true) => {
  
  const INPUT_DATA = ref({
    FLT_STATION_USER_SID: Station.value?.value ?? '',
    FLT_BRAND_CODE: orderData.value.ORD_BRAND_CODE,
    FLT_CHANNEL_CODE: orderData.value.ORD_CHANNEL_CODE,
    FLT_ORDER_SID: orderData.value.ORD_SID,
    FLT_ITEM_CODE: SKU_DATA.value,
    FLT_WAYBILL_NO: WAYBILL_NO.value,
    FLT_INPUT_TYPE_CODE: '0020',
    FLT_STAFF_SID: WorkStaff.value?.value ?? '',
    FLT_QAVIEW_ID: '0',
  })
  if (showLoading) toggleLoading()
  isloading.isLoading = true
  await shipmentInspection.fetchOrderItemInputADDSet(INPUT_DATA.value)
  isloading.isLoading = false
  if (showLoading) toggleLoading()

  SKU_DATA.value = ''
}

const onCancelPacking = async (showLoading = true) => {
  
  DIALOG_TYPE.value = 'CANCEL_PACKING'
  DIALOG_TITLE.value = 'Shipment Packing Cancel'
  DIALOG_TEXT.value = 'Do you want to cancel the ongoing packing?'

  openDialogModal.value = true
  
}

const onClearItem = async (showLoading = true) => {
  
  DIALOG_TYPE.value = 'CLEAR_ITEM'
  DIALOG_TITLE.value = 'Shipment Packing Clear Item'
  DIALOG_TEXT.value = 'Do you want to reset the items in the ongoing packing?'

  openDialogModal.value = true

}

const onWaybillEnter = async (showLoading = true) => {
  
  const newElement = orderDetailInfo.value?.WAYBILLS?.find((item) => item.WAYBILL_NO === encrypt(WAYBILL_NO.value))

  if (newElement != undefined)
  {
    if(orderData.value.ORD_STATUS_CODE != '40')
    {
        const STATUS_DATA = ref({
        FLT_TO_STATUS_CODE: encrypt("40"),  
        FLT_ORDERS: [
          {"ORD_SID":encrypt(orderData.value.ORD_SID)}
        ],  
      })

      if (showLoading) toggleLoading()
      isloading.isLoading = true
      const { success } = await shipmentInspection.fetchOrderStatusChange(STATUS_DATA.value)
      if (success) {
        const INPUT_DATA = ref({
          FLT_STATION_USER_SID: Station.value?.value ?? '',
          FLT_BRAND_CODE: orderData.value.ORD_BRAND_CODE,
          FLT_CHANNEL_CODE: orderData.value.ORD_CHANNEL_CODE,
          FLT_ORDER_SID: orderData.value.ORD_SID,
        })

        if (showLoading) toggleLoading()
        await shipmentInspection.fetchOrderItemInputSet(INPUT_DATA.value)
        await OrderReSearch()
        if (showLoading) toggleLoading()
      }
      isloading.isLoading = false
      if (showLoading) toggleLoading()
    }

    SKURef.value?.focus();
    
  }
  else
  {
    WAYBILL_NO.value = '';
    notify({
      group: 'error',
      title: 'Error',
      text: 'This waybill number is not included in the order.',
    }, 4000)

  }
}

const onAddWaybill = async () => {
  
  PrintOrderData.value.length = 0

  for (let i = 0; i < ADD_WAYBIL_CNT.value; i++) 
  {
    PrintOrderData.value.push({
      ORD_SID: encrypt(orderData.value.ORD_SID),
      BRAND_CODE: encrypt(orderData.value.ORD_BRAND_CODE),
      CHANNEL_CODE: encrypt(orderData.value.ORD_CHANNEL_CODE),
    })
  }
  
  StationSID.value = Station.value?.value ?? ''

  OrgWayBill.value = ''

  const GETCHANNEL = StationList.value?.find((item) => decrypt(item.USER_SID) === Station.value?.value ?? '')
  const GETCOURIER = GETCHANNEL.STATION_CHANNEL_LIST?.find((item) => item.CHANNEL_CODE === encrypt(orderData.value.ORD_CHANNEL_CODE))
  CourierSID.value = GETCOURIER?.CHANNEL_COURIER_SID ?? ''
  openPrintModal.value = true
  
}

const onAddWaybillEnd = async () => {
  
  await shipmentInspection.fetchOrderDetailInfo(orderList.value[0].ORD_SID)
  openPrintModal.value = false
  
}

const ordersearch = async (showLoading = true) => {
  
  orderListFilters.value.FLT_STATION_USER_SID = Station.value?.value ?? ''
  orderListFilters.value.FLT_CHANNEL_CODE = channel.value?.value ?? ''
  orderListFilters.value.FLT_ORDER_SID = ''

  if (showLoading) toggleLoading()
  isloading.isLoading = true
  const { success } = await shipmentInspection.fetchOrderList(orderListFilters.value)
  if (success) {
    if (orderList.value.length == 1)
    {
      orderData.value.ORD_STATUS_CODE = decrypt(orderList.value[0].ORD_STATUS_CODE)
      orderData.value.ORD_STATUS_FNAME = decrypt(orderList.value[0].ORD_STATUS_FNAME)
      orderData.value.ORD_SUBSTATUS_CODE = decrypt(orderList.value[0].ORD_SUBSTATUS_CODE)
      orderData.value.ORD_SUBSTATUS_FNAME = decrypt(orderList.value[0].ORD_SUBSTATUS_FNAME)
      orderData.value.ORD_ID = decrypt(orderList.value[0].ORD_ID)
      orderData.value.ORD_SID = decrypt(orderList.value[0].ORD_SID)
      orderData.value.ORD_SEQ = decrypt(orderList.value[0].ORD_SEQ)
      orderData.value.ORD_BRAND_CODE = decrypt(orderList.value[0].ORD_BRAND_CODE)
      orderData.value.ORD_BRAND_FNAME = decrypt(orderList.value[0].ORD_BRAND_FNAME)
      orderData.value.ORD_CHANNEL_CODE = decrypt(orderList.value[0].ORD_CHANNEL_CODE)
      orderData.value.ORD_CHANNEL_DESCR = decrypt(orderList.value[0].ORD_CHANNEL_DESCR)
      orderData.value.ORD_TYPE_FNAME = decrypt(orderList.value[0].ORD_TYPE_FNAME)
      orderData.value.ORD_RECVR_NAME_M = decrypt(orderList.value[0].ORD_RECVR_NAME_M)
      orderData.value.ORD_RECVR_MOBILE_M = decrypt(orderList.value[0].ORD_RECVR_MOBILE_M)
      orderData.value.ORD_RECVR_ADDR_1 = decrypt(orderList.value[0].ORD_RECVR_ADDR_1)

      await shipmentInspection.fetchOrderDetailInfo(orderList.value[0].ORD_SID)
      await fetchOrderDetailInfoOperationNote()

      const INPUT_DATA = ref({
        FLT_STATION_USER_SID: Station.value?.value ?? '',
        FLT_BRAND_CODE: decrypt(orderList.value[0].ORD_BRAND_CODE),
        FLT_CHANNEL_CODE: decrypt(orderList.value[0].ORD_CHANNEL_CODE),
        FLT_ORDER_SID: decrypt(orderList.value[0].ORD_SID),
      })
      if (decrypt(orderList.value[0].ORD_STATUS_CODE) === '40'){ await shipmentInspection.fetchOrderItemInputGet(INPUT_DATA.value) }
      
    }
    else if (orderList.value.length > 1)
    {
      openOrderModal.value = true
    }
  }
  isloading.isLoading = false
  if (showLoading) toggleLoading()
  
}

const OrderReSearch = async () => {
  orderListFilters.value.FLT_STATION_USER_SID = Station.value?.value ?? ''
  orderListFilters.value.FLT_CHANNEL_CODE = channel.value?.value ?? ''
  orderListFilters.value.FLT_ORDER_SID = ''

  const INPUT_DATA = ref({
    FLT_STATION_USER_SID: Station.value?.value ?? '',
    FLT_CHANNEL_CODE: orderData.value.ORD_CHANNEL_CODE,
    FLT_ORDER_SID: orderData.value.ORD_SID,
    FLT_KEY_WORD: '',
  })

  toggleLoading()
  isloading.isLoading = true
  const { success } = await shipmentInspection.fetchOrderList(INPUT_DATA.value)
  if (success) {
    orderData.value.ORD_STATUS_CODE = decrypt(orderList.value[0].ORD_STATUS_CODE)
    orderData.value.ORD_STATUS_FNAME = decrypt(orderList.value[0].ORD_STATUS_FNAME)
    orderData.value.ORD_SUBSTATUS_CODE = decrypt(orderList.value[0].ORD_SUBSTATUS_CODE)
    orderData.value.ORD_SUBSTATUS_FNAME = decrypt(orderList.value[0].ORD_SUBSTATUS_FNAME)
    orderData.value.ORD_ID = decrypt(orderList.value[0].ORD_ID)
    orderData.value.ORD_SID = decrypt(orderList.value[0].ORD_SID)
    orderData.value.ORD_SEQ = decrypt(orderList.value[0].ORD_SEQ)     
    orderData.value.ORD_BRAND_CODE = decrypt(orderList.value[0].ORD_BRAND_CODE)
    orderData.value.ORD_BRAND_FNAME = decrypt(orderList.value[0].ORD_BRAND_FNAME)
    orderData.value.ORD_CHANNEL_CODE = decrypt(orderList.value[0].ORD_CHANNEL_CODE)
    orderData.value.ORD_CHANNEL_DESCR = decrypt(orderList.value[0].ORD_CHANNEL_DESCR)
    orderData.value.ORD_TYPE_FNAME = decrypt(orderList.value[0].ORD_TYPE_FNAME)
    orderData.value.ORD_RECVR_NAME_M = decrypt(orderList.value[0].ORD_RECVR_NAME_M)
    orderData.value.ORD_RECVR_MOBILE_M = decrypt(orderList.value[0].ORD_RECVR_MOBILE_M)
    orderData.value.ORD_RECVR_ADDR_1 = decrypt(orderList.value[0].ORD_RECVR_ADDR_1)
  }
  isloading.isLoading = false
  toggleLoading()
  
}

const fetchOrderDetailInfoOperationNote = async () => {
  toggleLoading()
  isloading.isLoading = true
  await shipmentInspection.fetchOrderDetailInfoOperationNote(orderData.value.ORD_SID)
  isloading.isLoading = false
  toggleLoading()
}

const addOrderOperationNote = async (note) => {
  toggleLoading()
  isloading.isLoading = true
  await shipmentInspection.addOrderOperationNote({
    FLT_ORDER_SID: orderData.value.ORD_SID,
    FLT_NOTE: note,
  })
  await fetchOrderDetailInfoOperationNote()
  isloading.isLoading = false
  toggleLoading()
}

const onRowDoubleClick = async (data) => {

  orderData.value.ORD_STATUS_CODE = decrypt(data.ORD_STATUS_CODE)
  orderData.value.ORD_STATUS_FNAME = decrypt(data.ORD_STATUS_FNAME)
  orderData.value.ORD_SUBSTATUS_CODE = decrypt(data.ORD_SUBSTATUS_CODE)
  orderData.value.ORD_SUBSTATUS_FNAME = decrypt(data.ORD_SUBSTATUS_FNAME)
  orderData.value.ORD_ID = decrypt(data.ORD_ID)
  orderData.value.ORD_SID = decrypt(data.ORD_SID)
  orderData.value.ORD_SEQ = decrypt(data.ORD_SEQ)
  orderData.value.ORD_BRAND_CODE = decrypt(data.ORD_BRAND_CODE)
  orderData.value.ORD_BRAND_FNAME = decrypt(data.ORD_BRAND_FNAME)
  orderData.value.ORD_CHANNEL_CODE = decrypt(data.ORD_CHANNEL_CODE)
  orderData.value.ORD_CHANNEL_DESCR = decrypt(data.ORD_CHANNEL_DESCR)
  orderData.value.ORD_TYPE_FNAME = decrypt(data.ORD_TYPE_FNAME)
  orderData.value.ORD_RECVR_NAME_M = decrypt(data.ORD_RECVR_NAME_M)
  orderData.value.ORD_RECVR_MOBILE_M = decrypt(data.ORD_RECVR_MOBILE_M)
  orderData.value.ORD_RECVR_ADDR_1 = decrypt(data.ORD_RECVR_ADDR_1)

  await shipmentInspection.fetchOrderDetailInfo(data.ORD_SID)
  await fetchOrderDetailInfoOperationNote()

  const INPUT_DATA = ref({
    FLT_STATION_USER_SID: Station.value?.value ?? '',
    FLT_BRAND_CODE: decrypt(data.ORD_BRAND_CODE),
    FLT_CHANNEL_CODE: decrypt(data.ORD_CHANNEL_CODE),
    FLT_ORDER_SID: decrypt(data.ORD_SID),
  })
  await shipmentInspection.fetchOrderItemInputGet(INPUT_DATA.value)
  
  openOrderModal.value = false
}

const PrintListTableFields = computed(() => {

  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU030200_GRD00001')
})

const productListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU030200_GRD00002')
})

const productItemTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU030200_GRD00003')
})

const PackingListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU030200_GRD00004')
})

</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >    
    <div class="grid grid-cols-5 gap-x-3">
      <div class="col-span-1">
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-3 space-y-3 gap-y-3"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-6"
        >
          <template #header>
            <p>
              {{ getComponentData('EU030200_LBL00001', 'caption', 'Station Information') }}
            </p>
          </template>
          <div class="grid grid-cols-1 gap-x-3 space-y-2">
            <FormGroup
              :label="getComponentData('EU030200_LBL00002', 'caption', 'Station ID')"
              label-id="EU030200_LBL00002"
              label-for="EU030200_CMB00001"
              horizontal
            >
              <FormCombobox
                id="EU030200_CMB00001"
                v-model="Station"
                :options="StationList.map((item) => ({
                  name: decrypt(item.STATION_ID),
                  value: decrypt(item.USER_SID),
                }))"
                :disabled="orderData.ORD_SID != ''"
              />
            </FormGroup>
            <FormGroup
              :label="getComponentData('EU030200_LBL00003', 'caption', 'Inspection Staff')"
              label-id="EU030200_LBL00003"
              label-for="EU030200_CMB00002"
              horizontal
            >
              <FormSelect
                id="EU030200_CMB00002"
                v-model="WorkStaff"
                :options="WorkStaffList.map((item) => ({
                  name: decrypt(item.STAFF_NAME),
                  value: decrypt(item.STAFF_SID),
                }))"
                :disabled="orderData.ORD_SID != ''"
              />
            </FormGroup>
            <FormGroup
              :label="getComponentData('EU030200_LBL00004', 'caption', 'Channel')"
              label-id="EU030200_LBL00004"
              label-for="EU030200_CMB00003"
              horizontal
            >
              <FormSelect
                id="EU030200_CMB00003"
                v-model="channel"
                :options="orderSummaryList.map((item) => ({
                  name: decrypt(item.ORD_SUM_CHANNEL_DESCR),
                  value: decrypt(item.ORD_SUM_CHANNEL_CODE),
                }))"
                :disabled="orderData.ORD_SID != ''"
              />
            </FormGroup>
          </div>          
          <div class="grid grid-cols-2 gap-x-3">
            <div class="col-span-1 space-y-2">
              <div
                class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-15 border hover:border-gray-500 isac-bg-gray"              
              >
                <span
                  class="text-xs font-medium text-white"
                >
                  {{ "ORDER LIST" }}
                </span>
                <span
                  class="text-2xl font-black text-white"
                >
                  {{ decrypt(ORDER_LIST_CNT) }}
                </span>
              </div>
              <div
                class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-15 border hover:border-gray-500 isac-bg-gray"
              >
                <span
                  class="text-xs font-medium text-white"
                > 
                  {{ "REQUEST CANCEL" }}
                </span>
                <span
                  class="text-2xl font-black text-white"
                >
                  {{ decrypt(REQUEST_CANCEL_CNT) }}
                </span>
              </div>
              <div
                class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-15 border hover:border-gray-500 isac-bg-gray"
              >
                <span
                  class="text-xs font-medium text-white"
                >
                  {{ "CHANGE INFO" }}
                </span>
                <span
                  class="text-2xl font-black text-white"
                >
                  {{ decrypt(CHANGE_INFO_CNT) }}
                </span>
              </div>
              <div
                class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-15 border hover:border-gray-500 isac-bg-gray"
              >
                <span
                  class="text-xs font-medium text-white"
                >
                  {{ "HOLD BY ESM" }}
                </span>
                <span
                  class="text-2xl font-black text-white"
                >
                  {{ decrypt(HOLD_BY_ESM_CNT) }}
                </span>
              </div>
            </div>
            <div class="col-span-1 space-y-2">
              <div
                class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-15 border hover:border-gray-500 bg-gray-100"
              >
                <span
                  class="text-xs font-medium text-gray-700"
                >
                  {{ "REQUESTED" }}
                </span>
                <span
                  class="text-2xl font-black text-gray-700"
                >
                  {{ decrypt(REQUESTED_CNT) }}
                </span>
              </div>            
              <div
                class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-15 border hover:border-gray-500 bg-gray-100"
              >
                <span
                  class="text-xs font-medium text-gray-700"
                >
                  {{ "PREPARING" }}
                </span>
                <span
                  class="text-2xl font-black text-gray-700"
                >
                  {{ decrypt(PREPARING_CNT) }}
                </span>
              </div>            
              <div
                class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-15 border hover:border-gray-500 bg-gray-100"
              >
                <span
                  class="text-xs font-medium text-gray-700"
                >
                  {{ "PACKING" }}
                </span>
                <span
                  class="text-2xl font-black text-gray-700"
                >
                  {{ decrypt(PACKING_CNT) }}
                </span>
              </div>            
              <div
                class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-15 border hover:border-gray-500 bg-gray-100"
              >
                <span
                  class="text-xs font-medium text-gray-700"
                >
                  {{ "PACKED" }}
                </span>
                <span
                  class="text-2xl font-black text-gray-700 text-right"
                >
                  {{ decrypt(PACKED_CNT) }}
                </span>
              </div>
            </div>            
          </div>
        </Card>  
      </div>
      <div class="col-span-4">
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-3 space-y-3 text-white bg-black"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-3"
        >
          <template #header>
            <p>
              {{ getComponentData('EU030200_LBL00005', 'caption', 'Order Information') }}
            </p>
          </template>
          <div class="grid grid-cols-5 gap-x-2">
            <div class="col-span-4 space-y-3">    
              <div class="grid grid-cols-7 gap-x-12">
                <div class="col-span-5">
                  <div class="grid grid-cols-3 gap-y-3 gap-x-12">
                    <div class="col-span-2 space-y-3">
                      <Card
                        divider
                        shadow-size="none"
                        card-header-class="px-3 py-3 space-y-3"
                        class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
                        card-body-class="p-2 space-y-3 bg-gray-50"
                      >
                        <FormGroup
                          :label="getComponentData('EU030200_LBL00006', 'caption', 'Search Order')"
                          label-id="EU010200_LBL00004"          
                          horizontal
                          label-width="w-1/6"
                          input-width="w-5/6"
                        >
                          <FormTextInput
                            id="EU030200_TXT00001" 
                            v-model="orderListFilters.FLT_KEY_WORD"  
                            style="font-size: 15px; height: 32px;"   
                            @keyup.enter="ordersearch"
                          />
                        </FormGroup>          
                      </Card> 
                    </div>
                    <FormGroup
                      :label="getComponentData('EU030200_LBL00007', 'caption', 'Status')"
                      label-id="EU010200_LBL00004"
                      class="px-1 py-3"
                      horizontal
                      label-width="w-1/4"
                      input-width="w-3/4"
                    >
                      <div class="inline-flex items-center space-x-2">
                        <FormTextInput
                          id="EU030200_TXT00002"
                          v-model="orderData.ORD_STATUS_FNAME"
                          class="bg-gray-100"
                          readonly
                        />
                        <FormTextInput
                          id="EU030200_TXT00003"
                          v-model="orderData.ORD_SUBSTATUS_FNAME"
                          class="bg-gray-100"
                          readonly
                        />
                      </div>                  
                    </FormGroup>
                  </div>                  
                </div>                
                <div class="col-span-2 space-y-3">
                  <FormGroup
                    class="px-1 py-3"
                    horizontal
                    label-width="w-0/4"
                    input-width="w-4/4"
                  >
                    <div class="inline-flex items-center space-x-2">
                      <FormTextInput
                        id="EU030200_TXT00013"
                        v-model="ADD_WAYBIL_CNT"
                        style="width: 50%;"                        
                        :disabled="orderData.ORD_STATUS_CODE === '' || (orderData.ORD_STATUS_CODE != '32' && orderData.ORD_STATUS_CODE != '40')"
                        type="number"                        
                      /> 
                      <Button
                        id="EU030200_BTN00004"
                        rounded
                        variant="gray"
                        :loading="loading"
                        :disabled="loading || 
                          orderData.ORD_STATUS_CODE === '' || 
                          (orderData.ORD_STATUS_CODE != '32' && orderData.ORD_STATUS_CODE != '40') ||
                          ADD_WAYBIL_CNT === '0'"
                        @click="onAddWaybill"
                      >
                        {{ getComponentData('EU030200_BTN00004', 'caption', '+ Add Waybill') }}
                      </Button> 
                    </div>                                                   
                  </FormGroup>   
                </div>                             
              </div>
              <Card
                divider
                shadow-size="none"
                card-header-class="px-3 py-1 space-y-3"
                card-body-class="p-1 space-y-3"
              >
                <div class="grid grid-cols-7 gap-x-3">
                  <div class="col-span-5">
                    <div class="grid grid-cols-3 gap-y-3 gap-x-12">
                      <FormGroup
                        :label="getComponentData('EU030200_LBL00008', 'caption', 'Order ID')"
                        label-id="EU030200_LBL00008"
                        horizontal
                        label-width="w-1/4"
                        input-width="w-3/4"
                      >
                        <div class="flex items-center gap-x-2">
                          <FormTextInput
                            id="EU030200_TXT00004"
                            v-model="orderData.ORD_ID"
                            class="bg-gray-100"
                            readonly
                          /> 

                          <Button
                            rounded
                            variant="gray"
                            :disabled="orderData.ORD_ID === ''"
                            @click="fetchClearOrderData"
                          >
                            <VueFeather
                              type="delete"
                              class="h-5 w-5"
                            />
                          </Button>
                        </div>                        
                      </FormGroup>
                      <FormGroup
                        :label="getComponentData('EU030200_LBL00009', 'caption', 'Delivery ID')"
                        label-id="EU030200_LBL00009"
                        horizontal
                        label-width="w-1/4"
                        input-width="w-3/4"
                      >
                        <FormTextInput
                          id="EU030200_TXT00005"
                          v-model="orderData.ORD_SID"
                          class="bg-gray-100"
                          readonly
                        />
                      </FormGroup>
                      <FormGroup
                        :label="getComponentData('EU030200_LBL00010', 'caption', 'Split Seq')"
                        label-id="EU030200_LBL00010"
                        horizontal
                        label-width="w-1/4"
                        input-width="w-3/4"
                      >
                        <FormTextInput
                          id="EU030200_TXT00006"
                          v-model="orderData.ORD_SEQ"
                          class="bg-gray-100"
                          readonly
                        />
                      </FormGroup>
                      <FormGroup
                        :label="getComponentData('EU030200_LBL00011', 'caption', 'Brand')"
                        label-id="EU030200_LBL00011"
                        horizontal
                        label-width="w-1/4"
                        input-width="w-3/4"
                      >
                        <FormTextInput
                          id="EU030200_TXT00007"
                          v-model="orderData.ORD_BRAND_FNAME"
                          class="bg-gray-100"
                          readonly
                        />
                      </FormGroup>
                      <FormGroup
                        :label="getComponentData('EU030200_LBL00012', 'caption', 'Channel')"
                        label-id="EU030200_LBL00012"
                        horizontal
                        label-width="w-1/4"
                        input-width="w-3/4"
                      >
                        <FormTextInput
                          id="EU030200_TXT00008"
                          v-model="orderData.ORD_CHANNEL_DESCR"
                          class="bg-gray-100"
                          readonly
                        />
                      </FormGroup>
                      <FormGroup
                        :label="getComponentData('EU030200_LBL00013', 'caption', 'Order Type')"
                        label-id="EU030200_LBL00013"
                        horizontal
                        label-width="w-1/4"
                        input-width="w-3/4"
                      >
                        <FormTextInput
                          id="EU030200_TXT00009"
                          v-model="orderData.ORD_TYPE_FNAME"
                          class="bg-gray-100"
                          readonly
                        />
                      </FormGroup>
                      <FormGroup
                        :label="getComponentData('EU030200_LBL00014', 'caption', 'Recipient Name')"
                        label-id="EU030200_LBL00014"
                        horizontal
                        label-width="w-1/4"
                        input-width="w-3/4"
                      >
                        <FormTextInput
                          id="EU030200_TXT00010"
                          v-model="orderData.ORD_RECVR_NAME_M"
                          class="bg-gray-100"
                          readonly
                        />
                      </FormGroup>
                      <FormGroup
                        :label="getComponentData('EU030200_LBL00015', 'caption', 'Recipient Mobile(Tel)')"
                        label-id="EU030200_LBL00015"
                        horizontal
                        label-width="w-1/4"
                        input-width="w-3/4"
                      >
                        <FormTextInput
                          id="EU030200_TXT00011"
                          v-model="orderData.ORD_RECVR_MOBILE_M"
                          class="bg-gray-100"
                          readonly
                        />
                      </FormGroup>
                      <FormGroup
                        :label="getComponentData('EU030200_LBL00016', 'caption', 'Recipient Address')"
                        label-id="EU030200_LBL00016"
                        horizontal
                        label-width="w-1/4"
                        input-width="w-3/4"
                      >
                        <FormTextInput
                          id="EU030200_TXT00012"
                          v-model="orderData.ORD_RECVR_ADDR_1"
                          class="bg-gray-100"
                          readonly
                        />
                      </FormGroup>
                    </div>
                  </div>
                  <div class="col-span-2">                    
                    <Table
                      id="EU030200_GRD00001"
                      border
                      clickable
                      class="max-h-36 min-h-36 overflow-y-auto text-center"
                      header-variant="secondary"           
                      :columns="[
                        ...PrintListTableFields,
                        {
                          caption: 'Print',
                          dataFieldName: 'PRINT',
                          display: 'Y'
                        },
                        {
                          caption: 'Change',
                          dataFieldName: 'CHANGE',
                          display: 'Y'
                        },
                        {
                          caption: 'Del',
                          dataFieldName: 'DELETE',
                          display: 'Y'
                        }
                      ]" 
                      :items="orderDetailInfo.WAYBILLS"
                      @on-row-click="onClickItemRow"
                    >
                      <template #cell(PRINT)="{ item }">
                        <span
                          v-if="orderData.ORD_STATUS_CODE != '60'&&orderData.ORD_STATUS_CODE != '69'"
                          class=" cursor-pointer hover:font-bold hover:text-blue-700"
                          @click="(e) => {
                            e.stopPropagation();
                            removeWork(item)
                          }"
                        >
                          <VueFeather
                            type="printer"
                            class="h-5 w-5"
                          />
                        </span>
                      </template>
                      <template #cell(CHANGE)="{ item }">
                        <span
                          v-if="orderData.ORD_STATUS_CODE == '32' || orderData.ORD_STATUS_CODE == '40'"
                          class=" cursor-pointer hover:font-bold hover:text-blue-700"
                          @click="(e) => {
                            e.stopPropagation();
                            changeWaybill(item)
                          }"
                        >
                          <VueFeather
                            type="repeat"
                            class="h-5 w-5"
                          />
                        </span>
                      </template>
                      <template #cell(DELETE)="{ item }">
                        <span
                          v-if="(orderData.ORD_STATUS_CODE == '32' || orderData.ORD_STATUS_CODE == '40') && orderDetailInfo.WAYBILLS.length > 1"
                          class=" cursor-pointer hover:font-bold hover:text-blue-700"
                          @click="(e) => {
                            e.stopPropagation();
                            removeWaybill(item)
                          }"
                        >
                          <VueFeather
                            type="x-square"
                            class="h-5 w-5"
                          />
                        </span>
                      </template>
                    </Table>
                  </div>              
                </div>  
                <div class="grid">                  
                  <Table
                    id="EU030200_GRD00002"
                    :columns="productListTableFields"
                    header-variant="light"
                    border
                    class="overflow-x-auto border-b max-h-40 min-h-40 overflow-y-auto"
                    clickable
                    condensed
                    :items="orderDetailInfo?.PRODUCTS || []"
                  >
                    <template #row="{ item, columns }">
                      <TableRow @click="item.showSubTable = !item.showSubTable">
                        <TableCell
                          v-for="(column, columnIndex) in columns"
                          v-show="column.display === 'Y'"
                          :key="columnIndex"
                          class-name="whitespace-nowrap px-3 py-1 text-sm text-gray-500"
                        >
                          <slot
                            :name="`cell(${column?.dataFieldName ?? ''})`"
                            :value="item[column.dataFieldName]"
                            :item="item"
                          >
                            <span v-if="column.editMask">
                              {{ item[column.dataFieldName] ? getMaskedValue(decrypt(item[column.dataFieldName]), column.editMask) : '-' }}
                            </span>
                            <span v-else>
                              {{ item[column.dataFieldName] ? decrypt(item[column.dataFieldName]) : '-' }}
                            </span>
                          </slot>
                        </TableCell>
                      </TableRow>
                      <TableRow
                        v-if="item.showSubTable"
                        disable-clickable
                      >
                        <TableCell/>
                        <TableCell
                          :colspan="columns.filter(column => column.display === 'Y').length - 1"
                          class-name="whitespace-nowrap pl-3 text-sm text-gray-500"
                        >
                          <Table
                            id="EU030200_GRD00003"
                            condensed
                            header-variant="secondary"
                            :columns="productItemTableColumns"
                            :items="item?.ORD_PRODUCT_ITEMS || []"
                          />
                        </TableCell>
                      </TableRow>
                    </template>
                  </Table>
                </div>
                <div class="flex space-x-6 items-center justify-start">
                  <Button
                    id="EU030200_BTN00001"
                    variant="gray"
                    class="w-52"
                    rounded
                    size="sm"
                    :disabled="loading || (orderData.ORD_SUBSTATUS_CODE != '' && orderData.ORD_SUBSTATUS_CODE != '0274' && orderData.ORD_SUBSTATUS_CODE != '0275') || orderData.ORD_STATUS_CODE === ''"
                    :loading="loading"
                    @click="updateOrderSubStatus('0074')"
                  >
                    {{ getComponentData('OU040100_BTN01001', 'caption', 'Hold by Shortage') }}
                  </Button>
                
                  <Button
                    id="EU030200_BTN00002"
                    variant="gray"
                    class="w-52"
                    rounded
                    size="sm"
                    :disabled="loading || (orderData.ORD_SUBSTATUS_CODE != '' && orderData.ORD_SUBSTATUS_CODE != '0274' && orderData.ORD_SUBSTATUS_CODE != '0275') || orderData.ORD_STATUS_CODE === ''"
                    :loading="loading"
                    @click="updateOrderSubStatus('0075')"
                  >
                    {{ getComponentData('OU040100_BTN01001', 'caption', 'Hold by ETC') }}
                  </Button>
                  <Button
                    id="EU030200_BTN00003"
                    variant="gray"
                    class="w-52"
                    rounded
                    size="sm"
                    :disabled="loading || (orderData.ORD_SUBSTATUS_CODE != '0074' && orderData.ORD_SUBSTATUS_CODE != '0075') || orderData.ORD_STATUS_CODE === ''"
                    :loading="loading"
                    @click="updateOrderSubStatus('0274')"
                  >
                    {{ getComponentData('OU040100_BTN01001', 'caption', 'Unhold') }}
                  </Button>
                </div> 
              </Card>   
            </div>
            <div class="col-1">
              <div class="grid grid-rows-1 grid-flow-col h-full">
                <ChatBox
                  v-if="orderData.ORD_STATUS_CODE != ''"
                  id="EU030200_CHA00001"
                  :items="orderDetailInfoOperationNote"
                  :title="getComponentData('EU030200_CHT00001', 'caption', 'Operation Note')"
                  :reload="fetchOrderDetailInfoOperationNote"
                  @add="addOrderOperationNote"
                />
              </div>          
            </div>
          </div>
        </Card> 
      </div>
    </div>
      
    
    <Card
      v-if="orderData.ORD_STATUS_CODE === '32' || orderData.ORD_STATUS_CODE === '40'"
      divider
      shadow-size="none"
      card-header-class="px-3 py-3 space-y-3 text-white bg-black"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <p>
            {{ getGridData('EU030200_LBL00019', 'caption', 'Packing Items') }}
          </p>
          <div class="flex justify-between items-center gap-x-3">
            <FormCheckbox
              id="EU030200_CHK00001"
            />
            <p class="font-medium text-white">
              {{ getComponentData('EU030200_LBL00020', 'caption', 'Image Viewer') }}
            </p>
            <FormCheckbox
              id="EU030200_CHK00002"
            />
            <p class="font-medium text-white">
              {{ getComponentData('EU030200_LBL00021', 'caption', 'QA Viewer') }}
            </p>
          </div>
        </div>
      </template>     
      <div class="grid grid-cols-8 gap-y-1 gap-x-12">
        <div class="col-span-2 space-y-3">
          <Card
            divider
            shadow-size="none"
            card-header-class="px-3 py-3 space-y-3"
            class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
            card-body-class="p-2 space-y-3 bg-gray-50"
          >
            <FormGroup
              :label="getComponentData('EU030200_LBL00022', 'caption', 'Waybill No')"
              label-id="EU030200_LBL00022"
              class="font-medium"
              horizontal
              label-width="w-3/12"
              input-width="w-9/12"
            >
              <FormTextInput
                id="EU030200_TXT00014"
                v-model="WAYBILL_NO"   
                style="font-size: 15px; height: 32px;" 
                @keyup.enter="onWaybillEnter"
              />
            </FormGroup>          
          </Card> 
        </div>
        <div class="col-span-2 space-y-3">
          <Card
            divider
            shadow-size="none"
            card-header-class="px-3 py-3 space-y-3"
            class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
            card-body-class="p-2 space-y-3 bg-gray-50"
          >
            <FormGroup
              :label="getComponentData('EU030200_LBL00023', 'caption', 'SKU')"
              label-id="EU030200_LBL00023"
              style="font-size: 15px;"
              horizontal
              label-width="w-3/12"
              input-width="w-9/12"
            >
              <FormTextInput
                id="EU030200_TXT00015"
                ref="SKURef"   
                v-model="SKU_DATA"   
                style="font-size: 15px; height: 32px;" 
                @keyup.enter="onSKUEnter"          
              />
            </FormGroup>          
          </Card> 
        </div>
        <div class="col-span-2 space-y-3">
          <Card
            divider
            shadow-size="none"
            card-header-class="px-3 py-3 space-y-3"
            class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
            card-body-class="p-2 space-y-3 bg-gray-50"
          >
            <FormGroup
              :label="getComponentData('EU030200_LBL00024', 'caption', 'Serial No')"
              label-id="EU030200_LBL00024"
              style="font-size: 15px;"
              horizontal
              label-width="w-3/12"
              input-width="w-9/12"
            >
              <FormTextInput
                id="EU030200_TXT00016"
                style="font-size: 15px; height: 32px;"
              />
            </FormGroup>          
          </Card> 
        </div>
        <FormGroup />
        <div class="flex justify-between items-center gap-x-3">
          <Button
            id="EU030200_BTN00005"
            class="w-50"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading || orderData.ORD_STATUS_CODE === '' || orderData.ORD_STATUS_CODE != '40'"
            @click="onClearItem"
          >
            {{ getComponentData('EU030200_BTN00005', 'caption', 'Clear Items') }}
          </Button>
          <Button
            id="EU030200_BTN00006"
            class="w-50"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading || orderData.ORD_STATUS_CODE === '' || orderData.ORD_STATUS_CODE != '40'"
            @click="onCancelPacking"
          >
            {{ getComponentData('EU030200_BTN00006', 'caption', 'Cancel Packing') }}
          </Button>
        </div>
      </div>
      <div class="grid">
        <Table
          id="EU030200_GRD00004"
          class="overflow-x-auto border-b max-h-96 h-96 overflow-y-auto"
          border
          header-variant="secondary"
          :columns="PackingListTableFields"
          :items="orderPackingItemList"
        />
      </div>      
    </Card>
    <div class="grid grid-cols-1 gap-x-3">
      <div class="col-span-1 text-end">
        <Button
          id="EU030200_BTN00007"
          rounded
          variant="gray"
          class="w-52"
          :loading="loading"
          :disabled="loading || orderData.ORD_STATUS_CODE != '40'"
          @click="onSave"
        >
          {{ getComponentData('EU030200_BTN00007', 'caption', 'SAVE') }}
        </Button>
      </div>      
    </div>    
    <Modal
      :show="openOrderModal"
      divider
      size="6xl"
      @close="() => {
        openOrderModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00400_LBL01001', 'caption', 'Select Order') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00400'"
          @on-row-double-click="onRowDoubleClick"
        />
      </template>
    </Modal>
    <!-- Dialog Modal -->
    <Modal
      :show="openDialogModal"
      divider
      @close="() => {
        openDialogModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00001_LBL00001', 'caption', 'Information') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00001'"
          :dialog-title="DIALOG_TITLE"
          :dialog-text="DIALOG_TEXT"
          @btn-confirm="ConfirmDialog"
          @btn-cancel="() => {
            openDialogModal = false
          }"
        />
      </template>
    </Modal>
    <Modal
      :show="openPrintModal"
      divider
      @close="() => {
        openPrintModal = false
      }"
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
          @btn-print="onAddWaybillEnd"
          @btn-cancel="() => {
            openPrintModal = false
          }"        
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
