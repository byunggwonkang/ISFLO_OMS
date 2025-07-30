<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
const { getComponentData } = usePageLoaderComponent('POP00290')
const { getGridData } = usePageLoaderGrid('POP00290')
const { getMaskedValue } = useMasked();

const returnStatus = useReturnStatusStore()
const pageLoader = usePageLoaderStore()

const { returnDetailInfo } = storeToRefs(useReturnStatusStore())

const props = defineProps({
  returnDetailData: {
    type: Object,
    required: true,
    default: () => ({}),
  }
})

const returnDetailInfoCSNote = ref([])
const returnDetailInfoOperationNote = ref([])

onBeforeUnmount(() => {
  returnDetailInfo.value = {}
  returnDetailInfoCSNote.value = []
  returnDetailInfoOperationNote.value = []

  formData.value = {
    FLT_RETURN_SID: '',
    FLT_RET_PICKUP_NAME: '',
    FLT_RET_PICKUP_TEL: '',
    FLT_RET_PICKUP_MOBILE: '',
    FLT_RET_PICKUP_ADDR_POST: '',
    FLT_RET_PICKUP_ADDR_STATE: '',
    FLT_RET_PICKUP_ADDR_CITY: '',
    FLT_RET_PICKUP_ADDR_1: '',
    FLT_RET_PICKUP_ADDR_2: '',
    FLT_RET_REMARK: ''
  }

  returnStatus.resetReturnDetailInfo()
  returnStatus.resetReturnDetailInfoOperationNote()
  returnStatus.resetReturnDetailInfoCSNote()
})

onBeforeMount(async () => {
  formData.value = {
    FLT_RETURN_SID: '',
    FLT_RET_PICKUP_NAME: '',
    FLT_RET_PICKUP_TEL: '',
    FLT_RET_PICKUP_MOBILE: '',
    FLT_RET_PICKUP_ADDR_POST: '',
    FLT_RET_PICKUP_ADDR_STATE: '',
    FLT_RET_PICKUP_ADDR_CITY: '',
    FLT_RET_PICKUP_ADDR_1: '',
    FLT_RET_PICKUP_ADDR_2: '',
    FLT_RET_REMARK: ''
  }

  returnDetailInfo.value.PRODUCTS = [];
  returnDetailInfo.value.PAYMENTS = [];
})

const formData = ref({
  FLT_RETURN_SID: '',
  FLT_RET_PICKUP_NAME: '',
  FLT_RET_PICKUP_TEL: '',
  FLT_RET_PICKUP_MOBILE: '',
  FLT_RET_PICKUP_ADDR_POST: '',
  FLT_RET_PICKUP_ADDR_STATE: '',
  FLT_RET_PICKUP_ADDR_CITY: '',
  FLT_RET_PICKUP_ADDR_1: '',
  FLT_RET_PICKUP_ADDR_2: '',
  FLT_RET_REMARK: ''
})

const { toggleLoading } = useLoading()

const fetchReturnDetailInfo = async () => {
  await returnStatus.fetchReturnDetailInfo(props.returnDetailData?.RET_SID)
  formData.value = {
    FLT_RETURN_SID: props.returnDetailData?.RET_SID,
    FLT_RET_PICKUP_NAME: props.returnDetailData?.RET_SEND_NAME,
    FLT_RET_PICKUP_TEL: props.returnDetailData?.RET_SEND_TEL,
    FLT_RET_PICKUP_MOBILE: props.returnDetailData?.RET_SEND_MOBILE,
    FLT_RET_PICKUP_ADDR_POST: props.returnDetailData?.RET_SEND_ADDR_POST,
    FLT_RET_PICKUP_ADDR_STATE: props.returnDetailData?.RET_SEND_ADDR_STATE,
    FLT_RET_PICKUP_ADDR_CITY: props.returnDetailData?.RET_SEND_ADDR_CITY,
    FLT_RET_PICKUP_ADDR_1: props.returnDetailData?.RET_SEND_ADDR_1,
    FLT_RET_PICKUP_ADDR_2: props.returnDetailData?.RET_SEND_ADDR_2,
    FLT_RET_REMARK: props.returnDetailData?.RET_REMARK
  }
}

const fetchReturnDetailInfoOperationNote = async () => {
  const { data } = await returnStatus.fetchReturnDetailInfoOperationNote(props.returnDetailData?.RET_SID)
  returnDetailInfoOperationNote.value = data
}

const fetchReturnDetailInfoCSNote = async () => {
  const { data } = await returnStatus.fetchReturnDetailInfoCSNote(props.returnDetailData?.RET_SID)
  returnDetailInfoCSNote.value = data
}

const addReturnOperationNote = async (data) => {
  await returnStatus.addReturnOperationNote({
    FLT_RETURN_SID: props.returnDetailData.RET_SID,
    FLT_NOTE: data
  })
  await fetchReturnDetailInfoOperationNote()
}

const addReturnCSNote = async (data) => {
  await returnStatus.addReturnCSNote({
    FLT_RETURN_SID: props.returnDetailData.RET_SID,
    FLT_NOTE: data
  })
  await fetchReturnDetailInfoCSNote()
}

onMounted(async () => {
  toggleLoading()
  await fetchReturnDetailInfo();
  await fetchReturnDetailInfoOperationNote();
  await fetchReturnDetailInfoCSNote();
  toggleLoading()
})

const paymentTableColumns = computed(() => {
  return pageLoader.getTableData('POP00290', 'POP00290_GRD01001')
})

const productTableColumns = computed(() => {
  return pageLoader.getTableData('POP00290', 'POP00290_GRD01002')
})

const productItemTableColumns = computed(() => {
  return pageLoader.getTableData('POP00290', 'POP00290_GRD01003')
})

const checkButtonCanShow = (buttonId) => {
  return returnDetailInfo.value?.VISIBLE_BUTTONS?.includes(encrypt(buttonId))
}

const isUpdating = ref(false)
const isStatusChanging = ref({
  changing: false,
  status: '',
})

const updateReturnStatus = async (status) => {
  isStatusChanging.value.changing = true
  isStatusChanging.value.status = status

  await returnStatus.updateReturnStatus({
    FLT_RETURN_SID: props.returnDetailData.RET_SID,
    FLT_TO_STATUS: status
  })

  await fetchReturnDetailInfo()

  isStatusChanging.value.changing = false
  isStatusChanging.value.status = ''
}

const updateReturnInfo = async () => {
  isUpdating.value = true
  await returnStatus.updateReturnInfo(formData)
  isUpdating.value = false
  await fetchReturnDetailInfo()
}
</script>

<template>
  <div class="divide-y">
    <div class="grid grid-cols-5">
      <div class="col-span-4 space-y-3 divide-y">
        <div class="grid grid-cols-4 gap-3 px-2 pt-2">
          <div class="grid gap-y-3">
            <!-- Return Information -->
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="p-2 space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('POP00290_LBL01002', 'caption', 'Return Information') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00290_LBL01003', 'caption', 'Status')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01003"
                label-for="POP00290_TXT01001"
              >
                <FormTextInput
                  id="POP00290_TXT01001"
                  :mask="getComponentData('POP00290_TXT01001','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_STATUS_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01004', 'caption', 'Request Status')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01004"
                label-for="POP00290_TXT01002"
              >
                <FormTextInput
                  id="POP00290_TXT01002"
                  :mask="getComponentData('POP00290_TXT01002','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_SUBSTATUS_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01005', 'caption', 'Brand / Channel')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01005"
              >
                <div class="flex gap-x-1">
                  <FormTextInput
                    id="POP00290_TXT01003"
                    :mask="getComponentData('POP00290_TXT01003','editMask')"
                    size="xs"
                    readonly
                    :value="returnDetailData.RET_BRAND_FNAME"
                  />
                  <FormTextInput
                    id="POP00290_TXT01004"
                    :mask="getComponentData('POP00290_TXT01004','editMask')"
                    size="xs"
                    readonly
                    :value="returnDetailData.RET_CHANNEL_FNAME"
                  />
                </div>
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01006', 'caption', 'Return SID')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01006"
              >
                <FormTextInput
                  id="POP00290_TXT01005"
                  :mask="getComponentData('POP00290_TXT01005','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_SID"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01007', 'caption', 'Return SEQ')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01007"
              >
                <FormTextInput
                  id="POP00290_TXT01006"
                  :mask="getComponentData('POP00290_TXT01006','editMask', 'Return ID')"
                  size="xs"
                  :value="returnDetailData.RET_ID"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01008', 'caption', 'Return Order ID')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01008"
              >
                <FormTextInput
                  id="POP00290_TXT01007"
                  :mask="getComponentData('POP00290_TXT01007','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_ORD_ID"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01010', 'caption', 'Return Reason')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01010"
              >
                <FormTextInput
                  id="POP00290_TXT01009"
                  :mask="getComponentData('POP00290_TXT01009','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_REASON_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01009', 'caption', 'Return DateTime')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01009"
              >
                <FormTextInput
                  id="POP00290_TXT01008"
                  :mask="getComponentData('POP00290_TXT01008','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_DATETIME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01011', 'caption', 'Currency')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01011"
              >
                <FormTextInput
                  id="POP00290_TXT01010"
                  :mask="getComponentData('POP00290_TXT01010','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_SALES_CURRENCY"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01012', 'caption', 'Sales Price')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01012"
              >
                <FormNumberInput
                  id="POP00290_TXT01011"
                  v-model="returnDetailData.RET_SALES_PRICE_AMT"
                  :mask="getComponentData('POP00290_TXT01011','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01013', 'caption', 'DC Amount')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01013"
              >
                <FormNumberInput
                  id="POP00290_TXT01012"
                  v-model="returnDetailData.RET_SALES_DC_AMT"
                  :mask="getComponentData('POP00290_TXT01012','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01014', 'caption', 'Gross Amount')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01014"
              >
                <FormNumberInput
                  id="POP00290_TXT01013"
                  v-model="returnDetailData.RET_SALES_GROSS_AMT"
                  :mask="getComponentData('POP00290_TXT01013','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01015', 'caption', 'NET Amount')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01015"
              >
                <FormNumberInput
                  id="POP00290_TXT01014"
                  v-model="returnDetailData.RET_SALES_NET_AMT"
                  :mask="getComponentData('POP00290_TXT01014','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01016', 'caption', 'VAT Amount')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01016"
              >
                <FormNumberInput
                  id="POP00290_TXT01015"
                  v-model="returnDetailData.RET_SALES_VAT_AMT"
                  :mask="getComponentData('POP00290_TXT01015','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01017', 'caption', 'Tax1 Amount')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01017"
              >
                <FormNumberInput
                  id="POP00290_TXT01016"
                  v-model="returnDetailData.RET_SALES_TAX1_AMT"
                  :mask="getComponentData('POP00290_TXT01016','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01018', 'caption', 'Tax2 Amount')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01018"
              >
                <FormNumberInput
                  id="POP00290_TXT01017"
                  v-model="returnDetailData.RET_SALES_TAX2_AMT"
                  :mask="getComponentData('POP00290_TXT01017','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01019', 'caption', 'Delivery Cost')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01019"
              >
                <FormNumberInput
                  id="POP00290_TXT01018"
                  v-model="returnDetailData.RET_SALES_DLVCOST_AMT"
                  :mask="getComponentData('POP00290_TXT01018','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01020', 'caption', 'Remark')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01020"
              >
                <FormTextareaInput
                  id="POP00290_TXT01019"
                  v-model="formData.FLR_ORD_REMARK"
                  :mask="getComponentData('POP00290_TXT01019','editMask')"
                  rows="2"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01021', 'caption', 'Create Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01021"
              >
                <FormTextInput
                  id="POP00290_TXT01020"
                  :mask="getComponentData('POP00290_TXT01020','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_CREATE_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01022', 'caption', 'Update Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01022"
              >
                <FormTextInput
                  id="POP00290_TXT01021"
                  :mask="getComponentData('POP00290_TXT01021','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_UPDATE_DATE"
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
                  {{ getComponentData('POP00290_LBL01023', 'caption', 'Order Information') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00290_LBL01024', 'caption', 'Status')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01024"
              >
                <FormTextInput
                  id="POP00290_TXT01022"
                  :mask="getComponentData('POP00290_TXT01022','editMask')"
                  size="xs"
                  :value="returnDetailData.ORD_STATUS_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01025', 'caption', 'Order Type')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01025"
              >
                <FormTextInput
                  id="POP00290_TXT01023"
                  :mask="getComponentData('POP00290_TXT01023','editMask')"
                  size="xs"
                  :value="returnDetailData.ORD_TYPE_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01026', 'caption', 'Order DateTime')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01026"
              >
                <FormTextInput
                  id="POP00290_TXT01024"
                  :mask="getComponentData('POP00290_TXT01024','editMask')"
                  size="xs"
                  :value="returnDetailData.ORD_DATETIME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01027', 'caption', 'Currency')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01027"
              >
                <FormTextInput
                  id="POP00290_TXT01025"
                  :mask="getComponentData('POP00290_TXT01025','editMask')"
                  size="xs"
                  :value="returnDetailData.ORD_SALES_CURRENCY"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01028', 'caption', 'Sales Price')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01028"
              >
                <FormTextInput
                  id="POP00290_TXT01026"
                  :mask="getComponentData('POP00290_TXT01026','editMask')"
                  size="xs"
                  :value="returnDetailData.ORD_SALES_PRICE_AMT"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01029', 'caption', 'Delivery Cost')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01029"
              >
                <FormTextInput
                  id="POP00290_TXT01027"
                  :mask="getComponentData('POP00290_TXT01027','editMask')"
                  size="xs"
                  :value="returnDetailData.ORD_SALES_DLVCOST_AMT"
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
                  {{ getComponentData('POP00290_LBL01030', 'caption', 'Shipping Customer Information') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00290_LBL01031', 'caption', 'Display Name')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_TXT01028"
              >
                <FormTextInput
                  id="POP00290_TXT01028"
                  :mask="getComponentData('POP00290_TXT01028','editMask')"
                  size="xs"
                  :value="returnDetailData.ORD_RECVR_NAME_M"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01032', 'caption', 'Full Name')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01032"
              >
                <FormTextInput
                  id="POP00290_TXT01029"
                  :value="returnDetailData.ORD_RECVR_NAME"
                  :mask="getComponentData('POP00290_TXT01029','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01033', 'caption', 'Tel No.')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01033"
              >
                <FormTextInput
                  id="POP00290_TXT01030"
                  :value="returnDetailData.ORD_RECVR_TEL"
                  :mask="getComponentData('POP00290_TXT01030','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01034', 'caption', 'Mobile No.')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01035"
              >
                <FormTextInput
                  id="POP00290_TXT01031"
                  :value="returnDetailData.ORD_RECVR_MOBILE"
                  :mask="getComponentData('POP00290_TXT01031','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01035', 'caption', 'Country')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01035"
              >
                <FormTextInput
                  id="'POP00290_TXT01032'"
                  :mask="getComponentData('POP00290_TXT01032','editMask')"
                  size="xs"
                  readonly
                  :value="returnDetailData.ORD_RECVR_ADDR_COUNTRY_CODE"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01036', 'caption', 'State')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01036"
              >
                <FormTextInput
                  id="POP00290_TXT01033"
                  :value="returnDetailData.ORD_RECVR_ADDR_STATE"
                  :mask="getComponentData('POP00290_TXT01033','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01037', 'caption', 'City')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01037"
              >
                <FormTextInput
                  id="POP00290_TXT01034"
                  :value="returnDetailData.ORD_RECVR_ADDR_CITY"
                  :mask="getComponentData('POP00290_TXT01034','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01038', 'caption', 'Postal Code')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01038"
              >
                <FormTextInput
                  id="POP00290_TXT01035"
                  :value="returnDetailData.ORD_RECVR_ADDR_POST"
                  :mask="getComponentData('POP00290_TXT01035','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01039', 'caption', 'Address 1')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01039"
              >
                <FormTextInput
                  id="POP00290_TXT01046"
                  :value="returnDetailData.ORD_RECVR_ADDR_1"
                  :mask="getComponentData('POP00290_TXT01036','editMask')"
                  size="xs"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01040', 'caption', 'Address 2')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01040"
              >
                <FormTextInput
                  id="POP00290_TXT01037"
                  :value="returnDetailData.ORD_RECVR_ADDR_2"
                  :mask="getComponentData('POP00290_TXT01037','editMask')"
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
                  {{ getComponentData('POP00290_LBL01041', 'caption', 'Shipping Information') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00290_LBL01042', 'caption', 'Delivery Start Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01045"
              >
                <FormTextInput
                  id="POP00290_TXT01038"
                  :mask="getComponentData('POP00290_TXT01038','editMask')"
                  size="xs"
                  :value="returnDetailData.ORD_DELIVERY_SDATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01043', 'caption', 'Currior Name')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01046"
              >
                <FormTextInput
                  id="POP00290_TXT01039"
                  :mask="getComponentData('POP00290_TXT01039','editMask')"
                  size="xs"
                  :value="returnDetailData.ORD_DELIVERY_CURRIOR_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01044', 'caption', 'Tracking No')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01047"
              >
                <FormTextInput
                  id="POP00290_TXT01040"
                  :mask="getComponentData('POP00290_TXT01040','editMask')"
                  size="xs"
                  :value="returnDetailData.ORD_DELIVERY_TRACK_NO"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01045', 'caption', 'Delivered Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01048"
              >
                <FormTextInput
                  id="POP00290_TXT01041"
                  :mask="getComponentData('POP00290_TXT01041','editMask')"
                  size="xs"
                  :value="returnDetailData.ORD_DELIVERY_EDATE"
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
                  {{ getComponentData('POP00290_LBL01046', 'caption', 'Pickup Customer Information') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00290_LBL01047', 'caption', 'Display Name')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01047"
              >
                <FormTextInput
                  id="POP00290_TXT01042"
                  :mask="getComponentData('POP00290_TXT01042','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_SEND_NAME_M"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01048', 'caption', 'Full Name')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01048"
              >
                <FormTextInput
                  id="POP00290_TXT01043"
                  v-model="formData.FLT_RET_PICKUP_NAME"
                  :mask="getComponentData('POP00290_TXT01043','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01049', 'caption', 'Tel No.')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01049"
              >
                <FormTextInput
                  id="POP00290_TXT01044"
                  v-model="formData.FLT_RET_PICKUP_TEL"
                  :mask="getComponentData('POP00290_TXT01044','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01050', 'caption', 'Mobile No.')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01050"
              >
                <FormTextInput
                  id="POP00290_TXT01045"
                  v-model="formData.FLT_RET_PICKUP_MOBILE"
                  :mask="getComponentData('POP00290_TXT01045','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01051', 'caption', 'Country')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01051"
              >
                <FormTextInput
                  id="'POP00290_TXT01046'"
                  :mask="getComponentData('POP00290_TXT01046','editMask')"
                  size="xs"
                  readonly
                  :value="returnDetailData.RET_SEND_ADDR_COUNTRY_CODE"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01052', 'caption', 'State')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01052"
              >
                <FormTextInput
                  id="POP00290_TXT01047"
                  v-model="formData.FLT_RET_PICKUP_ADDR_STATE"
                  :mask="getComponentData('POP00290_TXT01047','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01053', 'caption', 'City')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01053"
              >
                <FormTextInput
                  id="POP00290_TXT01048"
                  v-model="formData.FLT_RET_PICKUP_ADDR_CITY"
                  :mask="getComponentData('POP00290_TXT01048','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01054', 'caption', 'Postal Code')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01054"
              >
                <FormTextInput
                  id="POP00290_TXT01049"
                  v-model="formData.FLT_RET_PICKUP_ADDR_POST"
                  :mask="getComponentData('POP00290_TXT01049','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01055', 'caption', 'Address 1')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01055"
              >
                <FormTextInput
                  id="POP00290_TXT01050"
                  v-model="formData.FLT_RET_PICKUP_ADDR_1"
                  :mask="getComponentData('POP00290_TXT01050','editMask')"
                  size="xs"
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01056', 'caption', 'Address 2')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01056"
              >
                <FormTextInput
                  id="POP00290_TXT01051"
                  v-model="formData.FLT_RET_PICKUP_ADDR_2"
                  :mask="getComponentData('POP00290_TXT01051','editMask')"
                  size="xs"
                />
              </FormGroup>
            </Card>

            <!-- Return Pickup Information -->
            <Card
              divider
              shadow-size="none"
              card-header-class="p-2 space-y-3"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="p-2 space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('POP00290_LBL01057', 'caption', 'Return Pickup Information') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00290_LBL01058', 'caption', 'Req Pickup Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01058"
              >
                <FormTextInput
                  id="POP00290_TXT01052"
                  :mask="getComponentData('POP00290_TXT01052','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_PICKUP_SDATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01059', 'caption', 'Courier')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01059"
              >
                <FormTextInput
                  id="POP00290_TXT01053"
                  :mask="getComponentData('POP00290_TXT01053','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_PICKUP_CURRIOR_FNAME"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01060', 'caption', 'Tracking No')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01060"
              >
                <FormTextInput
                  id="POP00290_TXT01054"
                  :mask="getComponentData('POP00290_TXT01054','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_PICKUP_TRACK_NO"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01061', 'caption', 'Picked Up Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01061"
              >
                <FormTextInput
                  id="POP00290_TXT01055"
                  :mask="getComponentData('POP00290_TXT01055','editMask')"
                  size="xs"
                  :value="returnDetailData.RET_PICKUP_EDATE"
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
                  {{ getGridData('POP00290_LBL01062', 'caption', 'Payments') }}
                </p>
              </template>

              <Table
                id="POP00290_GRD01001"
                condensed
                header-variant="secondary"
                class="overflow-x-auto"
                :columns="paymentTableColumns"
                :items="returnDetailInfo?.PAYMENTS || []"
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
                  {{ getComponentData('POP00290_LBL01063', 'caption', 'Order History') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00290_LBL01064', 'caption', 'Receive Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01064"
              >
                <FormTextInput
                  id="POP00290_TXT01056"
                  :mask="getComponentData('POP00290_TXT01056','editMask')"
                  size="xs"
                  :value="returnDetailData.ORDX_GATHER_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01065', 'caption', 'ERP Deposit Sended')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01065"
              >
                <FormTextInput
                  id="POP00290_TXT01057"
                  :mask="getComponentData('POP00290_TXT01057','editMask')"
                  size="xs"
                  :value="returnDetailData.ORDX_DEPOSIT_ERP_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01065', 'caption', 'Update ‘Ready’ to Channel')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01065"
              >
                <FormTextInput
                  id="POP00290_TXT01058"
                  :mask="getComponentData('POP00290_TXT01058','editMask')"
                  size="xs"
                  :value="returnDetailData.ORDX_PICKING_CH_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01067', 'caption', 'Request Ship to WMS')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01067"
              >
                <FormTextInput
                  id="POP00290_TXT01059"
                  :mask="getComponentData('POP00290_TXT01059','editMask')"
                  size="xs"
                  :value="returnDetailData.ORDX_PICKING_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01068', 'caption', 'Allocation by WMS')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01068"
              >
                <FormTextInput
                  id="POP00290_TXT01060"
                  :mask="getComponentData('POP00290_TXT01060','editMask')"
                  size="xs"
                  :value="returnDetailData.ORDX_PACKED_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01069', 'caption', 'Packing by WMS')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01069"
              >
                <FormTextInput
                  id="POP00290_TXT01061"
                  :mask="getComponentData('POP00290_TXT01061','editMask')"
                  size="xs"
                  :value="returnDetailData.ORDX_SHIPPED_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01070', 'caption', 'Shipping by WMS')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01070"
              >
                <FormTextInput
                  id="POP00290_TXT01062"
                  :mask="getComponentData('POP00290_TXT01062','editMask')"
                  size="xs"
                  :value="returnDetailData.ORDX_OUTBOUND_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01071', 'caption', 'ERP Sales Sended')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01071"
              >
                <FormTextInput
                  id="POP00290_TXT01063"
                  :mask="getComponentData('POP00290_TXT01063','editMask')"
                  size="xs"
                  :value="returnDetailData.ORDX_SALES_ERP_DATE"
                  readonly
                />
              </FormGroup>
            </Card>

            <!-- Return History -->
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="isac-bg-lighter sm:rounded-lg"
              card-body-class="p-2 space-y-1"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('POP00290_LBL01072', 'caption', 'Return History') }}
                </p>
              </template>

              <FormGroup
                :label="getComponentData('POP00290_LBL01073', 'caption', 'Return Receive Date')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01073"
              >
                <FormTextInput
                  id="POP00290_TXT01064"
                  :mask="getComponentData('POP00290_TXT01064','editMask')"
                  size="xs"
                  :value="returnDetailData.RETX_GATHER_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01074', 'caption', 'Return Receipt')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01074"
              >
                <FormTextInput
                  id="POP00290_TXT01065"
                  :mask="getComponentData('POP00290_TXT01065','editMask')"
                  size="xs"
                  :value="returnDetailData.RETX_CONFIRM_OMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01075', 'caption', 'Req. Return to WMS')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01075"
              >
                <FormTextInput
                  id="POP00290_TXT01066"
                  :mask="getComponentData('POP00290_TXT01066','editMask')"
                  size="xs"
                  :value="returnDetailData.RETX_NOTIFY_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01076', 'caption', 'Return Inbound')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01076"
              >
                <FormTextInput
                  id="POP00290_TXT01067"
                  :mask="getComponentData('POP00290_TXT01067','editMask')"
                  size="xs"
                  :value="returnDetailData.RETX_RECEIVE_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01077', 'caption', 'Approval by OMS')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01077"
              >
                <FormTextInput
                  id="POP00290_TXT01068"
                  :mask="getComponentData('POP00290_TXT01068','editMask')"
                  size="xs"
                  :value="returnDetailData.RETX_APPROVE_WMS_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01078', 'caption', 'Approval by Channel')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01078"
              >
                <FormTextInput
                  id="POP00290_TXT01069"
                  :mask="getComponentData('POP00290_TXT01069','editMask')"
                  size="xs"
                  :value="returnDetailData.RETX_APPROVE_CH_DATE"
                  readonly
                />
              </FormGroup>

              <FormGroup
                :label="getComponentData('POP00290_LBL01079', 'caption', 'Send to ERP')"
                horizontal
                label-width="w-6/12"
                label-id="POP00290_LBL01079"
              >
                <FormTextInput
                  id="POP00290_TXT01070"
                  :mask="getComponentData('POP00290_TXT01070','editMask')"
                  size="xs"
                  :value="returnDetailData.RETX_APPROVE_ERP_DATE"
                  readonly
                />
              </FormGroup>
            </Card>
          </div>
        </div>

        <div class="p-2">
          <Table
            id="POP00290_GRD01002"
            header-variant="light"
            class="overflow-x-auto border-b"
            clickable
            condensed
            :columns="productTableColumns"
            :items="returnDetailInfo.PRODUCTS || []"
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
                    id="POP00290_GRD01003"
                    condensed
                    header-variant="secondary"
                    :columns="productItemTableColumns"
                    :items="item?.RET_PRODUCT_ITEMS || []"
                  />
                </TableCell>
              </TableRow>
            </template>
          </Table>
        </div>
      </div>

      <div class="col-1 border-l p-2">
        <div class="grid grid-rows-2 grid-flow-col h-full gap-y-3">
          <ChatBox
            id="POP00290_CHT01001"
            :items="returnDetailInfoOperationNote"
            :title="getComponentData('POP00290_CHT01001', 'caption', 'Operation Note')"
            :reload="fetchReturnDetailInfoOperationNote"
            @add="addReturnOperationNote"
          />

          <ChatBox
            id="POP00290_CHT01002"
            :items="returnDetailInfoCSNote"
            :title="getComponentData('POP00290_CHT01002', 'caption', 'CS Note')"
            :reload="fetchReturnDetailInfoCSNote"
            @add="addReturnCSNote"
          />
        </div>
      </div>
    </div>

    <div
      v-if="returnDetailInfo"
      class="flex space-x-3 justify-end p-2"
    >
      <Button
        v-if="checkButtonCanShow('POP00290_BTN01001')"
        id="POP00290_BTN01001"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'HOLD'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'HOLD'"
        @click="updateReturnStatus('HOLD')"
      >
        {{ getComponentData('POP00290_BTN01001', 'caption', 'Hold Return') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00290_BTN01002')"
        id="POP00290_BTN01002"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'UNHOLD'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'UNHOLD'"
        @click="updateReturnStatus('UNHOLD')"
      >
        {{ getComponentData('POP00290_BTN01002', 'caption', 'Cancel Hold') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00290_BTN01003')"
        id="POP00290_BTN01003"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'CANCEL'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'CANCEL'"
        @click="updateReturnStatus('CANCEL')"
      >
        {{ getComponentData('POP00290_BTN01003', 'caption', 'Return Cancel') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00290_BTN01004')"
        id="POP00290_BTN01004"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'APPROVAL'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'APPROVAL'"
        @click="updateReturnStatus('APPROVAL')"
      >
        {{ getComponentData('POP00290_BTN01004', 'caption', 'Return Approval') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00290_BTN01005')"
        id="POP00290_BTN01005"
        class="w-52"
        rounded
        variant="gray"
        :disabled="isStatusChanging.changing && isStatusChanging.status === 'REJECT'"
        :loading="isStatusChanging.changing && isStatusChanging.status === 'REJECT'"
        @click="updateReturnStatus('REJECT')"
      >
        {{ getComponentData('POP00290_BTN01005', 'caption', 'Return Reject') }}
      </Button>

      <Button
        v-if="checkButtonCanShow('POP00290_BTN01006')"
        id="POP00290_BTN01006"
        class="w-52"
        rounded
        :loading="isUpdating"
        :disabled="isUpdating"
        variant="gray"
        @click="updateReturnInfo"
      >
        {{ getComponentData('POP00290_BTN01006', 'caption', 'Update Pick-up Info') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
