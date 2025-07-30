<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
const { getComponentData } = usePageLoaderComponent('POP00300')
const { getGridData } = usePageLoaderGrid('POP00300')
const { getMaskedValue } = useMasked();

const exchangeStatus = useExchangeStatusStore()
const pageLoader = usePageLoaderStore()

const { exchangeDetailInfo } = storeToRefs(useExchangeStatusStore())

const props = defineProps({
  exchangeDetailData: {
    type: Object,
    required: true,
    default: () => ({}),
  }
})

const exchangeDetailInfoCSNote = ref([])
const exchangeDetailInfoOperationNote = ref([])

onBeforeUnmount(() => {
  exchangeDetailInfo.value = {}
  exchangeDetailInfoCSNote.value = []
  exchangeDetailInfoOperationNote.value = []

  formData.value = {
    FLT_EXCHANGE_SID: '',
    FLT_EXC_PICKUP_NAME: '',
    FLT_EXC_PICKUP_TEL: '',
    FLT_EXC_PICKUP_MOBILE: '',
    FLT_EXC_PICKUP_ADDR_POST: '',
    FLT_EXC_PICKUP_ADDR_STATE: '',
    FLT_EXC_PICKUP_ADDR_CITY: '',
    FLT_EXC_PICKUP_ADDR_1: '',
    FLT_EXC_PICKUP_ADDR_2: '',
    FLT_EXC_REMARK: ''
  }

  exchangeStatus.resetExchangeDetailInfo()
  exchangeStatus.resetExchangeDetailInfoOperationNote()
  exchangeStatus.resetExchangeDetailInfoCSNote()
})

onBeforeMount(async () => {
  formData.value = {
    FLT_EXCHANGE_SID: '',
    FLT_EXC_PICKUP_NAME: '',
    FLT_EXC_PICKUP_TEL: '',
    FLT_EXC_PICKUP_MOBILE: '',
    FLT_EXC_PICKUP_ADDR_POST: '',
    FLT_EXC_PICKUP_ADDR_STATE: '',
    FLT_EXC_PICKUP_ADDR_CITY: '',
    FLT_EXC_PICKUP_ADDR_1: '',
    FLT_EXC_PICKUP_ADDR_2: '',
    FLT_EXC_REMARK: ''
  }

  exchangeDetailInfo.value.PRODUCTS = [];
  exchangeDetailInfo.value.PAYMENTS = [];
});

const formData = ref({
  FLT_EXCHANGE_SID: '',
  FLT_EXC_PICKUP_NAME: '',
  FLT_EXC_PICKUP_TEL: '',
  FLT_EXC_PICKUP_MOBILE: '',
  FLT_EXC_PICKUP_ADDR_POST: '',
  FLT_EXC_PICKUP_ADDR_STATE: '',
  FLT_EXC_PICKUP_ADDR_CITY: '',
  FLT_EXC_PICKUP_ADDR_1: '',
  FLT_EXC_PICKUP_ADDR_2: '',
  FLT_EXC_REMARK: ''
})

const { toggleLoading } = useLoading()

const fetchExchangeDetailInfo = async () => {
  await exchangeStatus.fetchExchangeDetailInfo(props.exchangeDetailData?.EXC_SID);
  formData.value = {
    FLT_EXCHANGE_SID: props.exchangeDetailData?.EXC_SID,
    FLT_EXC_PICKUP_NAME: props.exchangeDetailData?.EXC_SEND_NAME || '',
    FLT_EXC_PICKUP_TEL: props.exchangeDetailData?.EXC_SEND_TEL || '',
    FLT_EXC_PICKUP_MOBILE: props.exchangeDetailData?.EXC_SEND_MOBILE || '',
    FLT_EXC_PICKUP_ADDR_POST: props.exchangeDetailData?.EXC_SEND_ADDR_POST || '',
    FLT_EXC_PICKUP_ADDR_STATE: props.exchangeDetailData?.EXC_SEND_ADDR_STATE || '',
    FLT_EXC_PICKUP_ADDR_CITY: props.exchangeDetailData?.EXC_SEND_ADDR_CITY || '',
    FLT_EXC_PICKUP_ADDR_1: props.exchangeDetailData?.EXC_SEND_ADDR_1 || '',
    FLT_EXC_PICKUP_ADDR_2: props.exchangeDetailData?.EXC_SEND_ADDR_2 || '',
    FLT_EXC_REMARK: props.exchangeDetailData?.EXC_REMARK || ''
  }
}

const fetchExchangeDetailInfoOperationNote = async () => {
  const { data } = await exchangeStatus.fetchExchangeDetailInfoOperationNote(props.exchangeDetailData?.EXC_SID)
  exchangeDetailInfoOperationNote.value = data
}

const fetchExchangeDetailInfoCSNote = async () => {
  const { data } = await exchangeStatus.fetchExchangeDetailInfoCSNote(props.exchangeDetailData?.EXC_SID)
  exchangeDetailInfoCSNote.value = data
}

const addExchangeOperationNote = async (data) => {
  await exchangeStatus.addExchangeOperationNote({
    FLT_EXCHANGE_SID: props.exchangeDetailData.EXC_SID,
    FLT_NOTE: data
  })
  await fetchExchangeDetailInfoOperationNote()
}

const addExchangeCSNote = async (data) => {
  await exchangeStatus.addExchangeCSNote({
    FLT_EXCHANGE_SID: props.exchangeDetailData.EXC_SID,
    FLT_NOTE: data
  })
  await fetchExchangeDetailInfoCSNote()
}

onMounted(async () => {
  toggleLoading()
  await fetchExchangeDetailInfo();
  await fetchExchangeDetailInfoOperationNote();
  await fetchExchangeDetailInfoCSNote();
  toggleLoading()
})

const paymentTableColumns = computed(() => {
  return pageLoader.getTableData('POP00300', 'POP00300_GRD01001')
})

const productTableColumns = computed(() => {
  return pageLoader.getTableData('POP00300', 'POP00300_GRD01002')
})


const productItemTableColumns = computed(() => {
  return pageLoader.getTableData('POP00300', 'POP00300_GRD01003')
})

const checkButtonCanShow = (buttonId) => {
  return exchangeDetailInfo.value?.VISIBLE_BUTTONS?.includes(encrypt(buttonId))
}

const isUpdating = ref(false)
const isStatusChanging = ref({
  changing: false,
  status: '',
})

const updateExchangeStatus = async (status) => {
  isStatusChanging.value.changing = true
  isStatusChanging.value.status = status

  await exchangeStatus.updateExchangeStatus({
    FLT_EXCHANGE_SID: props.exchangeDetailData.EXC_SID,
    FLT_TO_STATUS: status
  })

  await fetchExchangeDetailInfo()

  isStatusChanging.value.changing = false
  isStatusChanging.value.status = ''
}

const updateExchangeInfo = async () => {
  isUpdating.value = true
  await exchangeStatus.updateExchangeInfo(formData)
  isUpdating.value = false
  await fetchExchangeDetailInfo()
}
</script>

<template>
  <div class="divide-y">
    <div class="grid grid-cols-5">
      <div class="col-span-4 space-y-3 divide-y">
        <div class="grid grid-cols-4 gap-3 px-2 pt-2">
          <div class="grid gap-y-3">
            <!-- Exchange Information -->
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="p-2 space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('POP00300_LBL01002', 'caption', 'Exchange Information') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00300_LBL01003', 'caption', 'Status')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01003"
                label-for="POP00300_TXT01001"
              >
                <FormTextInput
                  id="POP00300_TXT01001"
                  :mask="getComponentData('POP00300_TXT01001','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_STATUS_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01004', 'caption', 'Request Status')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01004"
                label-for="POP00300_TXT01002"
              >
                <FormTextInput
                  id="POP00300_TXT01002"
                  :mask="getComponentData('POP00300_TXT01002','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_SUBSTATUS_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01005', 'caption', 'Brand / Channel')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01005"
              >
                <div class="flex gap-x-1">
                  <FormTextInput
                    id="POP00300_TXT01003"
                    :mask="getComponentData('POP00300_TXT01003','editMask')"
                    size="xs"
                    readonly
                    :value="exchangeDetailData.EXC_BRAND_FNAME"
                  />
                  <FormTextInput
                    id="POP00300_TXT01004"
                    :mask="getComponentData('POP00300_TXT01004','editMask')"
                    size="xs"
                    readonly
                    :value="exchangeDetailData.EXC_CHANNEL_FNAME"
                  />
                </div>
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01006', 'caption', 'Exchange SID')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01006"
              >
                <FormTextInput
                  id="POP00300_TXT01005"
                  :mask="getComponentData('POP00300_TXT01005','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_SID"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01007', 'caption', 'Exchange SEQ')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01007"
              >
                <FormTextInput
                  id="POP00300_TXT01006"
                  :mask="getComponentData('POP00300_TXT01006','editMask', 'Exchange ID')"
                  size="xs"
                  :value="exchangeDetailData.EXC_ID"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01008', 'caption', 'Exchange Order ID')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01008"
              >
                <FormTextInput
                  id="POP00300_TXT01007"
                  :mask="getComponentData('POP00300_TXT01007','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_ORD_ID"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01010', 'caption', 'Exchange Reason')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01010"
              >
                <FormTextInput
                  id="POP00300_TXT01009"
                  :mask="getComponentData('POP00300_TXT01009','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_REASON_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01009', 'caption', 'Exchange DateTime')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01009"
              >
                <FormTextInput
                  id="POP00300_TXT01008"
                  :mask="getComponentData('POP00300_TXT01008','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_DATETIME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01011', 'caption', 'Currency')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01011"
              >
                <FormTextInput
                  id="POP00300_TXT01010"
                  :mask="getComponentData('POP00300_TXT01010','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_SALES_CURRENCY"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01012', 'caption', 'Sales Price')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01012"
              >
                <FormNumberInput
                  id="POP00300_TXT01011"
                  v-model="exchangeDetailData.EXC_SALES_PRICE_AMT"
                  :mask="getComponentData('POP00300_TXT01011','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01013', 'caption', 'DC Amount')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01013"
              >
                <FormNumberInput
                  id="POP00300_TXT01012"
                  v-model="exchangeDetailData.EXC_SALES_DC_AMT"
                  :mask="getComponentData('POP00300_TXT01012','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01014', 'caption', 'Gross Amount')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01014"
              >
                <FormNumberInput
                  id="POP00300_TXT01013"
                  v-model="exchangeDetailData.EXC_SALES_GROSS_AMT"
                  :mask="getComponentData('POP00300_TXT01013','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01015', 'caption', 'NET Amount')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01015"
              >
                <FormNumberInput
                  id="POP00300_TXT01014"
                  v-model="exchangeDetailData.EXC_SALES_NET_AMT"
                  :mask="getComponentData('POP00300_TXT01014','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01016', 'caption', 'VAT Amount')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01016"
              >
                <FormNumberInput
                  id="POP00300_TXT01015"
                  v-model="exchangeDetailData.EXC_SALES_VAT_AMT"
                  :mask="getComponentData('POP00300_TXT01015','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01017', 'caption', 'Tax1 Amount')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01017"
              >
                <FormNumberInput
                  id="POP00300_TXT01016"
                  v-model="exchangeDetailData.EXC_SALES_TAX1_AMT"
                  :mask="getComponentData('POP00300_TXT01016','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01018', 'caption', 'Tax2 Amount')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01018"
              >
                <FormNumberInput
                  id="POP00300_TXT01017"
                  v-model="exchangeDetailData.EXC_SALES_TAX2_AMT"
                  :mask="getComponentData('POP00300_TXT01017','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01019', 'caption', 'Delivery Cost')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01019"
              >
                <FormNumberInput
                  id="POP00300_TXT01018"
                  v-model="exchangeDetailData.EXC_SALES_DLVCOST_AMT"
                  :mask="getComponentData('POP00300_TXT01018','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01020', 'caption', 'Remark')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01020"
              >
                <FormTextareaInput
                  id="POP00300_TXT01019"
                  v-model="formData.FLR_ORD_REMARK"
                  :mask="getComponentData('POP00300_TXT01019','editMask')"
                  rows="2"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01021', 'caption', 'Create Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01021"
              >
                <FormTextInput
                  id="POP00300_TXT01020"
                  :mask="getComponentData('POP00300_TXT01020','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_CREATE_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01022', 'caption', 'Update Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01022"
              >
                <FormTextInput
                  id="POP00300_TXT01021"
                  :mask="getComponentData('POP00300_TXT01021','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_UPDATE_DATE"
                  readonly
                />
              </FormGroup>
            </Card>
          </div>

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
                  {{ getComponentData('POP00300_LBL01023', 'caption', 'Order Information') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00300_LBL01024', 'caption', 'Status')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01024"
              >
                <FormTextInput
                  id="POP00300_TXT01022"
                  :mask="getComponentData('POP00300_TXT01022','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORD_STATUS_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01025', 'caption', 'Order Type')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01025"
              >
                <FormTextInput
                  id="POP00300_TXT01023"
                  :mask="getComponentData('POP00300_TXT01023','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORD_TYPE_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01026', 'caption', 'Order DateTime')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01026"
              >
                <FormTextInput
                  id="POP00300_TXT01024"
                  :mask="getComponentData('POP00300_TXT01024','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORD_DATETIME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01027', 'caption', 'Currency')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01027"
              >
                <FormTextInput
                  id="POP00300_TXT01025"
                  :mask="getComponentData('POP00300_TXT01025','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORD_SALES_CURRENCY"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01028', 'caption', 'Sales Price')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01028"
              >
                <FormTextInput
                  id="POP00300_TXT01026"
                  :mask="getComponentData('POP00300_TXT01026','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORD_SALES_PRICE_AMT"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01029', 'caption', 'Delivery Cost')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01029"
              >
                <FormTextInput
                  id="POP00300_TXT01027"
                  :mask="getComponentData('POP00300_TXT01027','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORD_SALES_DLVCOST_AMT"
                  readonly
                />
              </FormGroup>
            </Card>

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
                  {{ getComponentData('POP00300_LBL01030', 'caption', 'Shipping Customer Information') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00300_LBL01031', 'caption', 'Display Name')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_TXT01028"
              >
                <FormTextInput
                  id="POP00300_TXT01028"
                  :mask="getComponentData('POP00300_TXT01028','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORD_RECVR_NAME_M"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01032', 'caption', 'Full Name')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01032"
              >
                <FormTextInput
                  id="POP00300_TXT01029"
                  :value="exchangeDetailData.ORD_RECVR_NAME"
                  :mask="getComponentData('POP00300_TXT01029','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01033', 'caption', 'Tel No.')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01033"
              >
                <FormTextInput
                  id="POP00300_TXT01030"
                  :value="exchangeDetailData.ORD_RECVR_TEL"
                  :mask="getComponentData('POP00300_TXT01030','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01034', 'caption', 'Mobile No.')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01035"
              >
                <FormTextInput
                  id="POP00300_TXT01031"
                  :value="exchangeDetailData.ORD_RECVR_MOBILE"
                  :mask="getComponentData('POP00300_TXT01031','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01035', 'caption', 'Country')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01035"
              >
                <FormTextInput
                  id="'POP00300_TXT01032'"
                  :mask="getComponentData('POP00300_TXT01032','editMask')"
                  size="xs"
                  readonly
                  :value="exchangeDetailData.ORD_RECVR_ADDR_COUNTRY_CODE"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01036', 'caption', 'State')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01036"
              >
                <FormTextInput
                  id="POP00300_TXT01033"
                  :value="exchangeDetailData.ORD_RECVR_ADDR_STATE"
                  :mask="getComponentData('POP00300_TXT01033','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01037', 'caption', 'City')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01037"
              >
                <FormTextInput
                  id="POP00300_TXT01034"
                  :value="exchangeDetailData.ORD_RECVR_ADDR_CITY"
                  :mask="getComponentData('POP00300_TXT01034','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01038', 'caption', 'Postal Code')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01038"
              >
                <FormTextInput
                  id="POP00300_TXT01035"
                  :value="exchangeDetailData.ORD_RECVR_ADDR_POST"
                  :mask="getComponentData('POP00300_TXT01035','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01039', 'caption', 'Address 1')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01039"
              >
                <FormTextInput
                  id="POP00300_TXT01046"
                  :value="exchangeDetailData.ORD_RECVR_ADDR_1"
                  :mask="getComponentData('POP00300_TXT01036','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01040', 'caption', 'Address 2')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01040"
              >
                <FormTextInput
                  id="POP00300_TXT01037"
                  :value="exchangeDetailData.ORD_RECVR_ADDR_2"
                  :mask="getComponentData('POP00300_TXT01037','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>
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
                  {{ getComponentData('POP00300_LBL01041', 'caption', 'Shipping Information') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00300_LBL01042', 'caption', 'Delivery Start Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01045"
              >
                <FormTextInput
                  id="POP00300_TXT01038"
                  :mask="getComponentData('POP00300_TXT01038','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORD_DELIVERY_SDATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01043', 'caption', 'Currior Name')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01046"
              >
                <FormTextInput
                  id="POP00300_TXT01039"
                  :mask="getComponentData('POP00300_TXT01039','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORD_DELIVERY_CURRIOR_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01044', 'caption', 'Tracking No')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01047"
              >
                <FormTextInput
                  id="POP00300_TXT01040"
                  :mask="getComponentData('POP00300_TXT01045','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORD_DELIVERY_TRACK_NO"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01045', 'caption', 'Delivered Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01048"
              >
                <FormTextInput
                  id="POP00300_TXT01041"
                  :mask="getComponentData('POP00300_TXT01041','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORD_DELIVERY_EDATE"
                  readonly
                />
              </FormGroup>
            </Card>
          </div>

          <div class="space-y-3">
            <!-- Pickup Customer Information -->
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="p-2 space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('POP00300_LBL01046', 'caption', 'Pickup Customer Information') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00300_LBL01047', 'caption', 'Display Name')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01047"
              >
                <FormTextInput
                  id="POP00300_TXT01042"
                  :mask="getComponentData('POP00300_TXT01042','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_SEND_NAME_M"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01048', 'caption', 'Full Name')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01048"
              >
                <FormTextInput
                  id="POP00300_TXT01043"
                  v-model="formData.FLT_EXC_PICKUP_NAME"
                  :mask="getComponentData('POP00300_TXT01043','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01049', 'caption', 'Tel No.')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01049"
              >
                <FormTextInput
                  id="POP00300_TXT01044"
                  v-model="formData.FLT_EXC_PICKUP_TEL"
                  :mask="getComponentData('POP00300_TXT01044','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01050', 'caption', 'Mobile No.')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01050"
              >
                <FormTextInput
                  id="POP00300_TXT01045"
                  v-model="formData.FLT_EXC_PICKUP_MOBILE"
                  :mask="getComponentData('POP00300_TXT01045','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01051', 'caption', 'Country')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01051"
              >
                <FormTextInput
                  id="'POP00300_TXT01046'"
                  :mask="getComponentData('POP00300_TXT01046','editMask')"
                  size="xs"
                  readonly
                  :value="exchangeDetailData.EXC_SEND_ADDR_COUNTRY_CODE"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01052', 'caption', 'State')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01052"
              >
                <FormTextInput
                  id="POP00300_TXT01047"
                  v-model="formData.FLT_EXC_PICKUP_ADDR_STATE"
                  :mask="getComponentData('POP00300_TXT01047','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01053', 'caption', 'City')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01053"
              >
                <FormTextInput
                  id="POP00300_TXT01048"
                  v-model="formData.FLT_EXC_PICKUP_ADDR_CITY"
                  :mask="getComponentData('POP00300_TXT01048','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01054', 'caption', 'Postal Code')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01054"
              >
                <FormTextInput
                  id="POP00300_TXT01049"
                  v-model="formData.FLT_EXC_PICKUP_ADDR_POST"
                  :mask="getComponentData('POP00300_TXT01049','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01055', 'caption', 'Address 1')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01055"
              >
                <FormTextInput
                  id="POP00300_TXT01050"
                  v-model="formData.FLT_EXC_PICKUP_ADDR_1"
                  :mask="getComponentData('POP00300_TXT01050','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01056', 'caption', 'Address 2')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01056"
              >
                <FormTextInput
                  id="POP00300_TXT01051"
                  v-model="formData.FLT_EXC_PICKUP_ADDR_2"
                  :mask="getComponentData('POP00300_TXT01051','editMask')"
                  size="xs"
                />
              </FormGroup>
            </Card>

            <!-- Exchange Pickup Information -->
            <Card
              divider
              shadow-size="none"
              card-header-class="p-2 space-y-3"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="p-2 space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('POP00300_LBL01057', 'caption', 'Exchange Pickup Information') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00300_LBL01058', 'caption', 'Req Pickup Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01058"
              >
                <FormTextInput
                  id="POP00300_TXT01052"
                  :mask="getComponentData('POP00300_TXT01052','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_PICKUP_SDATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01059', 'caption', 'Courier')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01059"
              >
                <FormTextInput
                  id="POP00300_TXT01053"
                  :mask="getComponentData('POP00300_TXT01053','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_PICKUP_CURRIOR_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01060', 'caption', 'Tracking No')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01060"
              >
                <FormTextInput
                  id="POP00300_TXT01054"
                  :mask="getComponentData('POP00300_TXT01054','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_PICKUP_TRACK_NO"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01061', 'caption', 'Picked Up Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01061"
              >
                <FormTextInput
                  id="POP00300_TXT01055"
                  :mask="getComponentData('POP00300_TXT01055','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXC_PICKUP_EDATE"
                  readonly
                />
              </FormGroup>
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
                  {{ getGridData('POP00300_LBL01062', 'caption', 'Payments') }}
                </p>
              </template>

              <Table
                id="POP00300_GRD01001"
                condensed
                header-variant="secondary"
                class="overflow-x-auto"
                :columns="paymentTableColumns"
                :items="exchangeDetailInfo?.PAYMENTS || []"
              />
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
                  {{ getComponentData('POP00300_LBL01063', 'caption', 'Order History') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00300_LBL01064', 'caption', 'Receive Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01064"
              >
                <FormTextInput
                  id="POP00300_TXT01056"
                  :mask="getComponentData('POP00300_TXT01056','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORDX_GATHER_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01065', 'caption', 'ERP Deposit Sended')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01065"
              >
                <FormTextInput
                  id="POP00300_TXT01057"
                  :mask="getComponentData('POP00300_TXT01057','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORDX_DEPOSIT_ERP_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01065', 'caption', 'Update ‘Ready’ to Channel')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01065"
              >
                <FormTextInput
                  id="POP00300_TXT01058"
                  :mask="getComponentData('POP00300_TXT01058','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORDX_PICKING_CH_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01067', 'caption', 'Request Ship to WMS')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01067"
              >
                <FormTextInput
                  id="POP00300_TXT01059"
                  :mask="getComponentData('POP00300_TXT01059','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORDX_PICKING_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01068', 'caption', 'Allocation by WMS')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01068"
              >
                <FormTextInput
                  id="POP00300_TXT01060"
                  :mask="getComponentData('POP00300_TXT01060','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORDX_PACKED_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01069', 'caption', 'Packing by WMS')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01069"
              >
                <FormTextInput
                  id="POP00300_TXT01061"
                  :mask="getComponentData('POP00300_TXT01061','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORDX_SHIPPED_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01070', 'caption', 'Shipping by WMS')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01070"
              >
                <FormTextInput
                  id="POP00300_TXT01062"
                  :mask="getComponentData('POP00300_TXT01062','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORDX_OUTBOUND_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01071', 'caption', 'ERP Sales Sended')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01071"
              >
                <FormTextInput
                  id="POP00300_TXT01063"
                  :mask="getComponentData('POP00300_TXT01063','editMask')"
                  size="xs"
                  :value="exchangeDetailData.ORDX_SALES_ERP_DATE"
                  readonly
                />
              </FormGroup>
            </Card>

            <!-- Exchange History -->
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="p-2 space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('POP00300_LBL01072', 'caption', 'Exchange History') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00300_LBL01073', 'caption', 'Exchange Receive Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01073"
              >
                <FormTextInput
                  id="POP00300_TXT01064"
                  :mask="getComponentData('POP00300_TXT01064','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXCX_GATHER_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01074', 'caption', 'Exchange Receipt')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01074"
              >
                <FormTextInput
                  id="POP00300_TXT01065"
                  :mask="getComponentData('POP00300_TXT01065','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXCX_CONFIRM_OMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01075', 'caption', 'Req. Exchange to WMS')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01075"
              >
                <FormTextInput
                  id="POP00300_TXT01066"
                  :mask="getComponentData('POP00300_TXT01066','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXCX_NOTIFY_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01076', 'caption', 'Exchange Inbound')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01076"
              >
                <FormTextInput
                  id="POP00300_TXT01067"
                  :mask="getComponentData('POP00300_TXT01067','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXCX_RECEIVE_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01077', 'caption', 'Approval by OMS')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01077"
              >
                <FormTextInput
                  id="POP00300_TXT01068"
                  :mask="getComponentData('POP00300_TXT01068','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXCX_APPROVE_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01078', 'caption', 'Approval by Channel')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01078"
              >
                <FormTextInput
                  id="POP00300_TXT01069"
                  :mask="getComponentData('POP00300_TXT01069','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXCX_APPROVE_CH_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00300_LBL01079', 'caption', 'Send to ERP')"
                horizontal
                label-width="w-6/12"
                label-id="POP00300_LBL01079"
              >
                <FormTextInput
                  id="POP00300_TXT01070"
                  :mask="getComponentData('POP00300_TXT01070','editMask')"
                  size="xs"
                  :value="exchangeDetailData.EXCX_APPROVE_ERP_DATE"
                  readonly
                />
              </FormGroup>
            </Card>
          </div>
        </div>

        <div class="p-2">
          <Table
            id="POP00300_GRD01002"
            header-variant="light"
            class="overflow-x-auto border-b"
            clickable
            condensed
            :columns="productTableColumns"
            :items="exchangeDetailInfo.PRODUCTS || []"
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
                <TableCell />
                <TableCell
                  :colspan="columns.filter(column => column.display === 'Y').length - 1"
                  class-name="whitespace-nowrap pl-3 text-sm text-gray-500"
                >
                  <Table
                    id="POP00300_GRD01003"
                    condensed
                    header-variant="secondary"
                    :columns="productItemTableColumns"
                    :items="item?.EXC_PRODUCT_ITEMS || []"
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
            id="POP00300_CHA01001"
            :items="exchangeDetailInfoOperationNote"
            :title="getComponentData('POP00300_CHA01001', 'caption', 'Operation Note')"
            :reload="fetchExchangeDetailInfoOperationNote"
            @add="addExchangeOperationNote"
          />

          <ChatBox
            id="POP00300_CHA01002"
            :items="exchangeDetailInfoCSNote"
            :title="getComponentData('POP00300_CHA01002', 'caption', 'CS Note')"
            :reload="fetchExchangeDetailInfoCSNote"
            @add="addExchangeCSNote"
          />
        </div>
      </div>
    </div>

    <div
      v-if="exchangeDetailInfo"
      class="flex space-x-3 justify-end p-2"
    >
      <Button
        v-if="checkButtonCanShow('POP00300_BTN01001')"
        id="POP00300_BTN01001"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'HOLD'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'HOLD'"
        @click="updateExchangeStatus('HOLD')"
      >
        {{ getComponentData('POP00300_BTN01001', 'caption', 'Hold Exchange') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00300_BTN01002')"
        id="POP00300_BTN01002"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'UNHOLD'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'UNHOLD'"
        @click="updateExchangeStatus('UNHOLD')"
      >
        {{ getComponentData('POP00300_BTN01002', 'caption', 'Cancel Exchange') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00300_BTN01003')"
        id="POP00300_BTN01003"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'CANCEL'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'CANCEL'"
        @click="updateExchangeStatus('CANCEL')"
      >
        {{ getComponentData('POP00300_BTN01003', 'caption', 'Exchange Cancel') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00300_BTN01004')"
        id="POP00300_BTN01004"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'APPROVAL'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'APPROVAL'"
        @click="updateExchangeStatus('APPROVAL')"
      >
        {{ getComponentData('POP00300_BTN01004', 'caption', 'Exchange Approval') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00300_BTN01005')"
        id="POP00300_BTN01005"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'REJECT'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'REJECT'"
        @click="updateExchangeStatus('REJECT')"
      >
        {{ getComponentData('POP00300_BTN01005', 'caption', 'Exchange Reject') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00300_BTN01006')"
        id="POP00300_BTN01006"
        class="w-52"
        rounded
        :loading="isUpdating"
        :disabled="isUpdating"
        variant="gray"
        @click="updateExchangeInfo"
      >
        {{ getComponentData('POP00300_BTN01006', 'caption', 'Update Pick-up Info') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
