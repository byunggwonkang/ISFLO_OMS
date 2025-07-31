<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
const { getComponentData } = usePageLoaderComponent('POP00020')
const { getGridData } = usePageLoaderGrid('POP00020')
const { getMaskedValue } = useMasked();

const orderStatus = useOrderStatusStore()
const pageLoader = usePageLoaderStore()

const { orderDetailInfo, orderDetailInfoCSNote, orderDetailInfoOperationNote } = storeToRefs(useOrderStatusStore())

const props = defineProps({
  orderDetailData: {
    type: Object,
    required: true,
    default: () => ({}),
  }
})

onBeforeUnmount(() => {
  orderDetailInfoOperationNote.value = []
  orderDetailInfoCSNote.value = []
  orderDetailInfo.value = {};

  formData.value = {
    FLT_ORDER_SID: '',
    FLT_ORD_RECVR_NAME: '',
    FLT_ORD_RECVR_TEL: '',
    FLT_ORD_RECVR_MOBILE: '',
    FLT_ORD_RECVR_EMAIL: '',
    FLT_ORD_RECVR_ADDR_POST: '',
    FLT_ORD_RECVR_ADDR_STATE: '',
    FLT_ORD_RECVR_ADDR_CITY: '',
    FLT_ORD_RECVR_ADDR_1: '',
    FLT_ORD_RECVR_ADDR_2: '',
    FLR_ORD_REMARK: '',
  };

  orderStatus.resetOrderDetailInfo()
  orderStatus.resetOrderDetailInfoOperationNote()
  orderStatus.resetOrderDetailInfoCSNote()

  orderDetailInfo.value.PRODUCTS = [];
  orderDetailInfo.value.PAYMENTS = [];
})

const formData = ref({
  FLT_ORDER_SID: '',
  FLT_ORD_RECVR_NAME: '',
  FLT_ORD_RECVR_TEL: '',
  FLT_ORD_RECVR_MOBILE: '',
  FLT_ORD_RECVR_EMAIL: '',
  FLT_ORD_RECVR_ADDR_POST: '',
  FLT_ORD_RECVR_ADDR_STATE: '',
  FLT_ORD_RECVR_ADDR_CITY: '',
  FLT_ORD_RECVR_ADDR_1: '',
  FLT_ORD_RECVR_ADDR_2: '',
  FLR_ORD_REMARK: '',
})

const paymentTableColumns = computed(() => {
  return pageLoader.getTableData('POP00020', 'POP00020_GRD01001')
})

const productTableColumns = computed(() => {
  return pageLoader.getTableData('POP00020', 'POP00020_GRD01002')
})

const productItemTableColumns = computed(() => {
  return pageLoader.getTableData('POP00020', 'POP00020_GRD01003')
})

const checkButtonCanShow = (buttonId) => {
  //return orderDetailInfo.value?.VISIBLE_BUTTONS?.includes(encrypt(buttonId))
  return false
}

const updateOrderStatus = async (status) => {
  isStatusChanging.value.changing = true
  isStatusChanging.value.status = status

  await orderStatus.updateOrderStatus({
    FLT_ORDER_SID: props.orderDetailData.ORD_SID,
    FLT_TO_STATUS: status,
  })

  await fetchOrderDetailInfo()

  isStatusChanging.value.changing = false
  isStatusChanging.value.status = ''
}

const isUpdating = ref(false)
const isStatusChanging = ref({
  changing: false,
  status: '',
})

const updateOrderInfo = async () => {
  isUpdating.value = true
  await orderStatus.updateOrderInfo(formData)
  isUpdating.value = false
  await fetchOrderDetailInfo()
}

const fetchOrderDetailInfoOperationNote = async () => {
  await orderStatus.fetchOrderDetailInfoOperationNote(props.orderDetailData.ORD_SID)
}

const fetchOrderDetailInfoCSNote = async () => {
  await orderStatus.fetchOrderDetailInfoCSNote(props.orderDetailData.ORD_SID)
}

const fetchOrderDetailInfo = async () => {
  await orderStatus.fetchOrderDetailInfo(props.orderDetailData.ORD_SID)
  formData.value = {
    FLT_ORDER_SID: props.orderDetailData?.ORD_SID,
    FLT_ORD_RECVR_NAME: props.orderDetailData?.ORD_RECVR_NAME,
    FLT_ORD_RECVR_TEL: props.orderDetailData?.ORD_RECVR_TEL,
    FLT_ORD_RECVR_MOBILE: props.orderDetailData?.ORD_RECVR_MOBILE,
    FLT_ORD_RECVR_EMAIL: props.orderDetailData?.ORD_RECVR_EMAIL,
    FLT_ORD_RECVR_ADDR_POST: props.orderDetailData?.ORD_RECVR_ADDR_POST,
    FLT_ORD_RECVR_ADDR_STATE: props.orderDetailData?.ORD_RECVR_ADDR_STATE,
    FLT_ORD_RECVR_ADDR_CITY: props.orderDetailData?.ORD_RECVR_ADDR_CITY,
    FLT_ORD_RECVR_ADDR_1: props.orderDetailData?.ORD_RECVR_ADDR_1,
    FLT_ORD_RECVR_ADDR_2: props.orderDetailData?.ORD_RECVR_ADDR_2,
    FLR_ORD_REMARK: props.orderDetailData?.ORD_REMARK,
  }
}

const addOrderOperationNote = async (note) => {
  await orderStatus.addOrderOperationNote({
    FLT_ORDER_SID: props.orderDetailData.ORD_SID,
    FLT_NOTE: note,
  })
  await fetchOrderDetailInfoOperationNote()
}

const addOrderCSNote = async (note) => {
  await orderStatus.addOrderCSNote({
    FLT_ORDER_SID: props.orderDetailData.ORD_SID,
    FLT_NOTE: note,
  })
  await fetchOrderDetailInfoCSNote()
}

onMounted(async () => {
  await fetchOrderDetailInfo()
  await fetchOrderDetailInfoOperationNote()
  await fetchOrderDetailInfoCSNote()
})
</script>

<template>
  <div class="divide-y">
    <div class="grid grid-cols-5">
      <div class="col-span-4 space-y-3 divide-y">
        <div class="grid grid-cols-4 gap-3 px-2 pt-2">
          <div class="grid gap-y-3">
            <!-- Order Information -->
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="p-2 space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('POP00020_LBL01002', 'caption') }}
                </p>
              </template>

              <div v-if="getComponentData('POP00020_LBL01003', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01003', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01003"
                  label-for="POP00020_TXT01001"
                >
                  <FormTextInput
                    id="POP00020_TXT01001"
                    :mask="getComponentData('POP00020_TXT01001','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_STATUS_FNAME"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01004', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01004', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01004"
                  label-for="POP00020_TXT01002"
                >
                  <FormTextInput
                    id="POP00020_TXT01002"
                    :mask="getComponentData('POP00020_TXT01002','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_SUBSTATUS_FNAME"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01005', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01005', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01005"
                >
                  <div class="flex gap-x-1">
                    <FormTextInput
                      id="POP00020_TXT01003"
                      :mask="getComponentData('POP00020_TXT01003','editMask')"
                      size="xs"
                      readonly
                      :value="orderDetailData.ORD_BRAND_FNAME"
                    />
                    <FormTextInput
                      id="POP00020_TXT01004"
                      :mask="getComponentData('POP00020_TXT01004','editMask')"
                      size="xs"
                      readonly
                      :value="orderDetailData.ORD_CHANNEL_FNAME"
                    />
                  </div>
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01006', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01006', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01006"
                >
                  <FormTextInput
                    id="POP00020_TXT01005"
                    :mask="getComponentData('POP00020_TXT01005','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_SID"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01007', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01007', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01007"
                >
                  <FormTextInput
                    id="POP00020_TXT01006"
                    :mask="getComponentData('POP00020_TXT01006','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_SEQ"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01008', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01008', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01008"
                >
                  <FormTextInput
                    id="POP00020_TXT01007"
                    :mask="getComponentData('POP00020_TXT01007','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_ID"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01009', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01009', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01009"
                >
                  <FormTextInput
                    id="POP00020_TXT01008"
                    :mask="getComponentData('POP00020_TXT01008','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_TYPE_FNAME"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01010', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01010', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01010"
                >
                  <FormTextInput
                    id="POP00020_TXT01009"
                    :mask="getComponentData('POP00020_TXT01009','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_DATETIME"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01011', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01011', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01011"
                >
                  <FormTextInput
                    id="POP00020_TXT01010"
                    :mask="getComponentData('POP00020_TXT01010','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_SALES_CURRENCY"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01012', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01012', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01012"
                >
                  <FormNumberInput
                    id="POP00020_TXT01011"
                    v-model="orderDetailData.ORD_SALES_PRICE_AMT"
                    :mask="getComponentData('POP00020_TXT01011','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01013', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01013', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01013"
                >
                  <FormNumberInput
                    id="POP00020_TXT01012"
                    v-model="orderDetailData.ORD_SALES_DC_AMT"
                    :mask="getComponentData('POP00020_TXT01012','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01014', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01014', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01014"
                >
                  <FormNumberInput
                    id="POP00020_TXT01013"
                    v-model="orderDetailData.ORD_SALES_GROSS_AMT"
                    :mask="getComponentData('POP00020_TXT01013','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01015', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01015', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01015"
                >
                  <FormNumberInput
                    id="POP00020_TXT01014"
                    v-model="orderDetailData.ORD_SALES_NET_AMT"
                    :mask="getComponentData('POP00020_TXT01014','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01016', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01016', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01016"
                >
                  <FormNumberInput
                    id="POP00020_TXT01015"
                    v-model="orderDetailData.ORD_SALES_VAT_AMT"
                    :mask="getComponentData('POP00020_TXT01015','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01017', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01017', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01017"
                >
                  <FormNumberInput
                    id="POP00020_TXT01016"
                    v-model="orderDetailData.ORD_SALES_TAX1_AMT"
                    :mask="getComponentData('POP00020_TXT01016','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01018', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01018', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01018"
                >
                  <FormNumberInput
                    id="POP00020_TXT01017"
                    v-model="orderDetailData.ORD_SALES_TAX2_AMT"
                    :mask="getComponentData('POP00020_TXT01017','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01019', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01019', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01019"
                >
                  <FormNumberInput
                    id="POP00020_TXT01018"
                    v-model="orderDetailData.ORD_SALES_DLVCOST_AMT"
                    :mask="getComponentData('POP00020_TXT01018','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01020', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01020', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01020"
                >
                  <FormTextareaInput
                    id="POP00020_TXT01019"
                    v-model="formData.FLR_ORD_REMARK"
                    :mask="getComponentData('POP00020_TXT01019','editMask')"
                    rows="2"
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01021', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01021', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01021"
                >
                  <FormTextInput
                    id="POP00020_TXT01020"
                    :mask="getComponentData('POP00020_TXT01020','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_CREATE_DATE"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01022', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01022', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01022"
                >
                  <FormTextInput
                    id="POP00020_TXT01021"
                    :mask="getComponentData('POP00020_TXT01021','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_UPDATE_DATE"
                    readonly
                  />
                </FormGroup>
              </div>
            </Card>
          </div>
          <div class="grid  gap-y-3">
            <!-- Order Customer Information -->
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="p-2 space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('POP00020_LBL01023', 'caption') }}
                </p>
              </template>

              <div v-if="getComponentData('POP00020_LBL01024', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01024', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01024"
                >
                  <FormTextInput
                    id="POP00020_TXT01022"
                    :mask="getComponentData('POP00020_TXT01022','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_CUST_NAME_M"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01025', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01025', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01025"
                >
                  <FormTextInput
                    id="POP00020_TXT01023"
                    :mask="getComponentData('POP00020_TXT01023','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_CUST_NAME"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01026', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01026', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01026"
                >
                  <FormTextInput
                    id="POP00020_TXT01024"
                    :mask="getComponentData('POP00020_TXT01024','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_CUST_EMAIL"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01027', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01027', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01027"
                >
                  <FormTextInput
                    id="POP00020_TXT01025"
                    :mask="getComponentData('POP00020_TXT01025','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_CUST_TEL"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01028', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01028', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01028"
                >
                  <FormTextInput
                    id="POP00020_TXT01026"
                    :mask="getComponentData('POP00020_TXT01026','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_CUST_MOBILE"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01029', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01029', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01029"
                >
                  <FormTextInput
                    id="POP00020_TXT01027"
                    :mask="getComponentData('POP00020_TXT01027','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_CUST_COUNTRY_FNAME"
                    readonly
                  />
                </FormGroup>
              </div>
            </Card>

            <!-- Extended Information -->
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="p-2 space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('POP00020_LBL01030', 'caption') }}
                </p>
              </template>

              <div v-if="getComponentData('POP00020_LBL01031', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01031', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01031"
                >
                  <FormTextInput
                    id="POP00020_TXT01028"
                    :mask="getComponentData('POP00020_TXT01028','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_EXT_FIELD_01"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01032', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01032', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01032"
                >
                  <FormTextInput
                    id="POP00020_TXT01029"
                    :mask="getComponentData('POP00020_TXT01029','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_EXT_FIELD_02"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01033', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01033', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01033"
                >
                  <FormTextInput
                    id="POP00020_TXT01030"
                    :mask="getComponentData('POP00020_TXT01030','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_EXT_FIELD_03"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01034', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01034', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01034"
                >
                  <FormTextInput
                    id="POP00020_TXT01031"
                    :mask="getComponentData('POP00020_TXT01031','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_EXT_FIELD_04"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01035', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01035', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01035"
                >
                  <FormTextInput
                    id="POP00020_TXT01032"
                    :mask="getComponentData('POP00020_TXT01032','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_EXT_FIELD_05"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01036', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01036', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01036"
                >
                  <FormTextInput
                    id="POP00020_TXT01033"
                    :mask="getComponentData('POP00020_TXT01033','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_EXT_FIELD_06"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01037', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01037', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01037"
                >
                  <FormTextInput
                    id="POP00020_TXT01034"
                    :mask="getComponentData('POP00020_TXT01034','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_EXT_FIELD_07"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01038', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01038', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01038"
                >
                  <FormTextInput
                    id="POP00020_TXT01035"
                    :mask="getComponentData('POP00020_TXT01035','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_EXT_FIELD_08"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01039', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01039', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01039"
                >
                  <FormTextInput
                    id="POP00020_TXT01036"
                    :mask="getComponentData('POP00020_TXT01036','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_EXT_FIELD_09"
                    readonly
                  />
                </FormGroup>
              </div>
            </Card>
          </div>

          <div class="space-y-3">
            <!-- Shipping Customer Information -->
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="p-2 space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('POP00020_LBL01040', 'caption') }}
                </p>
              </template>

              <div v-if="getComponentData('POP00020_LBL01041', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01041', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01041"
                >
                  <FormTextInput
                    id="POP00020_TXT01037"
                    :mask="getComponentData('POP00020_TXT01037','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_RECVR_NAME_M"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01042', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01042', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01042"
                >
                  <FormTextInput
                    id="POP00020_TXT01038"
                    v-model="formData.FLT_ORD_RECVR_NAME"
                    :mask="getComponentData('POP00020_TXT01038','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01043', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01043', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01043"
                >
                  <FormTextInput
                    id="POP00020_TXT01039"
                    v-model="formData.FLT_ORD_RECVR_EMAIL"
                    :mask="getComponentData('POP00020_TXT01039','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01044', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01044', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01044"
                >
                  <FormTextInput
                    id="POP00020_TXT01040"
                    v-model="formData.FLT_ORD_RECVR_TEL"
                    :mask="getComponentData('POP00020_TXT01040','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01045', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01045', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01045"
                >
                  <FormTextInput
                    id="POP00020_TXT01041"
                    v-model="formData.FLT_ORD_RECVR_MOBILE"
                    :mask="getComponentData('POP00020_TXT01041','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01046', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01046', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01046"
                >
                  <FormTextInput
                    id="POP00020_TXT01042"
                    :mask="getComponentData('POP00020_TXT01042','editMask')"
                    size="xs"
                    readonly
                    :value="orderDetailData.ORD_RECVR_ADDR_COUNTRY_FNAME"
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01047', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01047', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01047"
                >
                  <FormTextInput
                    id="POP00020_TXT01043"
                    v-model="formData.FLT_ORD_RECVR_ADDR_STATE"
                    :mask="getComponentData('POP00020_TXT01043','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01048', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01048', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01048"
                >
                  <FormTextInput
                    id="POP00020_TXT01044"
                    v-model="formData.FLT_ORD_RECVR_ADDR_CITY"
                    :mask="getComponentData('POP00020_TXT01044','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01049', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01049', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01049"
                >
                  <FormTextInput
                    id="POP00020_TXT01045"
                    v-model="formData.FLT_ORD_RECVR_ADDR_POST"
                    :mask="getComponentData('POP00020_TXT01045','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01050', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01050', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01050"
                >
                  <FormTextInput
                    id="POP00020_TXT01046"
                    v-model="formData.FLT_ORD_RECVR_ADDR_1"
                    :mask="getComponentData('POP00020_TXT01046','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01051', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01051', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01051"
                >
                  <FormTextInput
                    id="POP00020_TXT01047"
                    v-model="formData.FLT_ORD_RECVR_ADDR_2"
                    :mask="getComponentData('POP00020_TXT01047','editMask')"
                    size="xs"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01052', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01052', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01052"
                >
                  <FormTextareaInput
                    id="POP00020_TXT01048"
                    :mask="getComponentData('POP00020_TXT01048','editMask')"
                    rows="2"
                    readonly
                    :value="orderDetailData.ORD_DELIVERY_MSG_1"
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01053', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01053', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01053"
                >
                  <FormTextareaInput
                    id="POP00020_TXT01049"
                    :mask="getComponentData('POP00020_TXT01049','editMask')"
                    rows="2"
                    readonly
                    :value="orderDetailData.ORD_DELIVERY_MSG_2"
                  />
                </FormGroup>
              </div>
            </Card>

            <!-- Shipping Information -->
            <Card
              divider
              shadow-size="none"
              card-header-class="p-2 space-y-3"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="p-2 space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('POP00020_LBL01054', 'caption') }}
                </p>
              </template>

              <div v-if="getComponentData('POP00020_LBL01055', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01055', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01055"
                >
                  <FormTextInput
                    id="POP00020_TXT01050"
                    :mask="getComponentData('POP00020_TXT01050','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_DELIVERY_SDATE"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01056', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01056', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01056"
                >
                  <FormTextInput
                    id="POP00020_TXT01051"
                    :mask="getComponentData('POP00020_TXT01051','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_DELIVERY_CURRIOR_FNAME"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01057', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01057', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01057"
                >
                  <FormTextInput
                    id="POP00020_TXT01052"
                    :mask="getComponentData('POP00020_TXT01052','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_DELIVERY_TRACK_NO"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01058', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01058', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01058"
                >
                  <FormTextInput
                    id="POP00020_TXT01053"
                    :mask="getComponentData('POP00020_TXT01053','editMask')"
                    size="xs"
                    :value="orderDetailData.ORD_DELIVERY_EDATE"
                    readonly
                  />
                </FormGroup>
              </div>
            </Card>
          </div>

          <div class="space-y-3">
            <!-- Order History -->
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="p-2 space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('POP00020_LBL01059', 'caption') }}
                </p>
              </template>

              <div v-if="getComponentData('POP00020_LBL01060', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01060', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01060"
                >
                  <FormTextInput
                    id="POP00020_TXT01054"
                    :mask="getComponentData('POP00020_TXT01054','editMask')"
                    size="xs"
                    :value="orderDetailData.ORDX_GATHER_DATE"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01061', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01061', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01061"
                >
                  <FormTextInput
                    id="POP00020_TXT01055"
                    :mask="getComponentData('POP00020_TXT01055','editMask')"
                    size="xs"
                    :value="orderDetailData.ORDX_DEPOSIT_ERP_DATE"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01062', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01062', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01062"
                >
                  <FormTextInput
                    id="POP00020_TXT01056"
                    :mask="getComponentData('POP00020_TXT01056','editMask')"
                    size="xs"
                    :value="orderDetailData.ORDX_PICKING_CH_DATE"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01063', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01063', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01063"
                >
                  <FormTextInput
                    id="POP00020_TXT01057"
                    :mask="getComponentData('POP00020_TXT01057','editMask')"
                    size="xs"
                    :value="orderDetailData.ORDX_PICKING_WMS_DATE"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01064', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01064', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01064"
                >
                  <FormTextInput
                    id="POP00020_TXT01058"
                    :mask="getComponentData('POP00020_TXT01058','editMask')"
                    size="xs"
                    :value="orderDetailData.ORDX_PICKED_WMS_DATE"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01065', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01065', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01065"
                >
                  <FormTextInput
                    id="POP00020_TXT01059"
                    :mask="getComponentData('POP00020_TXT01059','editMask')"
                    size="xs"
                    :value="orderDetailData.ORDX_SHIPPED_WMS_DATE"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01066', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01066', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01066"
                >
                  <FormTextInput
                    id="POP00020_TXT01060"
                    :mask="getComponentData('POP00020_TXT01060','editMask')"
                    size="xs"
                    :value="orderDetailData.ORDX_OUTBOUND_WMS_DATE"
                    readonly
                  />
                </FormGroup>
              </div>

              <div v-if="getComponentData('POP00020_LBL01067', 'display') === 'Y'">
                <FormGroup
                  :label="getComponentData('POP00020_LBL01067', 'caption')"
                  horizontal
                  label-id="POP00020_LBL01067"
                >
                  <FormTextInput
                    id="POP00020_TXT01061"
                    :mask="getComponentData('POP00020_TXT01061','editMask')"
                    size="xs"
                    :value="orderDetailData.ORDX_SALES_ERP_DATE"
                    readonly
                  />
                </FormGroup>
              </div>
            </Card>

            <!-- Payments -->
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-3"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getGridData('POP00020_GRD01001', 'caption') }}
                </p>
              </template>

              <Table
                id="POP00020_GRID01001"
                condensed
                header-variant="secondary"
                class="overflow-x-auto"
                :columns="paymentTableColumns"
                :items="orderDetailInfo?.PAYMENTS || []"
              />
            </Card>
          </div>
        </div>

        <!-- Order Details Info -->
        <div class="p-2">
          <Table
            id="POP00020_GRD01002"
            :columns="productTableColumns"
            header-variant="light"
            class="overflow-x-auto border-b"
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
                      {{ getMaskedValue(decrypt(item[column.dataFieldName]), column.editMask) ?? '-' }}
                    </span>
                    <span v-else>
                      {{ decrypt(item[column.dataFieldName]) ?? '-' }}
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
                    id="POP00020_GRD01003"
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
      </div>

      <div class="border-l col-1 p-2">
        <div class="grid grid-rows-2 grid-flow-col h-full gap-y-3">
          <ChatBox
            id="POP00020_CHA01001"
            :items="orderDetailInfoOperationNote"
            :title="getComponentData('POP00020_CHT01001', 'caption')"
            :reload="fetchOrderDetailInfoOperationNote"
            @add="addOrderOperationNote"
          />

          <ChatBox
            id="POP00020_CHA01002"
            :items="orderDetailInfoCSNote"
            :title="getComponentData('POP00020_CHT01002', 'caption')"
            :reload="fetchOrderDetailInfoCSNote"
            @add="addOrderCSNote"
          />
        </div>
      </div>
    </div>
    <div
      v-if="orderDetailInfo"
      class="flex space-x-3 justify-end p-2"
    >
      <Button
        v-if="checkButtonCanShow('POP00020_BTN01001')"
        id="POP00020_BTN01001"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'CONFIRM'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'CONFIRM'"
        @click="updateOrderStatus('CONFIRM')"
      >
        {{ getComponentData('POP00020_BTN01001', 'caption') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00020_BTN01002')"
        id="POP00020_BTN01002"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'HOLD'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'HOLD'"
        @click="updateOrderStatus('HOLD')"
      >
        {{ getComponentData('POP00020_BTN01002', 'caption') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00020_BTN01003')"
        id="POP00020_BTN01003"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'UNHOLD'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'UNHOLD'"
        @click="updateOrderStatus('UNHOLD')"
      >
        {{ getComponentData('POP00020_BTN01003', 'caption') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00020_BTN01004')"
        id="POP00020_BTN01004"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'CANCEL'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'CANCEL'"
        @click="updateOrderStatus('CANCEL')"
      >
        {{ getComponentData('POP00020_BTN01004', 'caption') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00020_BTN01005')"
        id="POP00020_BTN01005"
        class="w-52"
        rounded
        variant="gray"
      >
        {{ getComponentData('POP00020_BTN01005', 'caption') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00020_BTN01006')"
        id="POP00020_BTN01006"
        class="w-52"
        rounded
        :loading="isUpdating"
        :disabled="isUpdating"
        variant="gray"
        @click="updateOrderInfo"
      >
        {{ getComponentData('POP00020_BTN01006', 'caption') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
