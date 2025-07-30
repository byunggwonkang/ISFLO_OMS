<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import VueFeather from "vue-feather";
import {PlusIcon} from "@heroicons/vue/24/solid";

const emits = defineEmits(['stockSaved'])
const pageLoader = usePageLoaderStore()
const commonData = useCommonDataStore()
const StockAdjust = useStockAdjustment()

const { currentTab } = storeToRefs(useTabsStore())
const { AdjustmentDetail, WHList, PopVendorList,PopStoreList } = storeToRefs(StockAdjust)

const { getComponentData } = usePageLoaderComponent(['POP00370'])
const { getGridData } = usePageLoaderGrid(['POP00370'])
const { loading, toggleLoading } = useLoading()

const props = defineProps({
  create: {
    type: Boolean,
    default: false,
  },
  adjustsid: {
    type: String,
    default: '',
  },
  adjustwh: {
    type: String,
    default: '',
  },
  adjustcode: {
    type: String,
    default: '',
  },
})


const InputData =[]
const AdjustDtlItems = ref([])
const AdjustHistory = ref([])
const whData = ref({})
const brand = ref({})
const TransactionType = ref({})

const AdjustInc = ref({})
const AdjustEec = ref({})
const FromWhData = ref({})
const ToWhData = ref({})
const FromStoreData = ref({})
const FromVendorData = ref({})
const ToVendorData = ref({})

const openItemModal = ref(false)

/* Dialog Modal */
const openDialogModal = ref(false)

const DIALOG_TYPE = ref("")
const DIALOG_TITLE = ref("")
const DIALOG_TEXT = ref("")

////////////////////////////////

const getTransactionType = ref([
{
  name: 'Adjustment Increase',
  value: '10',
},
{
  name: 'Adjustment Decrease',
  value: '20',
},
{
  name: 'WH Transfer-in',
  value: '30',
},
{
  name: 'WH Transfer-out',
  value: '40',
},
{
  name: 'Return from store',
  value: '50',
},
{
  name: 'Return from vendor',
  value: '60',
},
{
  name: 'Return to vendor',
  value: '70',
}])

const HistoryTableFields = computed(() => {
  return pageLoader.getTableData('POP00370' , 'POP00370_GRD00002')
})

const formData = ref({
  FLT_STOCK_ADJUST_SID: '',  
  FLT_STOCK_ADJUST_WORKING_SYS_CODE: '0050',  
  FLT_STOCK_ADJUST_WH_CODE: '',
  FLT_STOCK_ADJUST_BRAND_CODE: '',
  FLT_STOCK_ADJUST_BRAND_FNAME: '',
  FLT_STOCK_ADJUST_BATCH_NO: '',
  FLT_STOCK_ADJUST_ETC_DATA_01: '',
  FLT_STOCK_ADJUST_ETC_DATA_02: '',
  FLT_STOCK_ADJUST_REQ_DATE: '',
  FLT_STOCK_ADJUST_STATUS_CODE: '',
  FLT_STOCK_ADJUST_STATUS_FNAME: '',
  FLT_STOCK_ADJUST_REMARK: '',
  FLT_STOCK_ADJUST_TRANS_CODE: '',
  FLT_STOCK_ADJUST_TRANS_DATA_01: '',
  FLT_STOCK_ADJUST_TRANS_DATA_02: '',
  FLT_STOCK_ADJUST_TRANS_DATA_03: '',
  ITEMS: []
})

const formEvnetData = ref({
  FLT_STOCK_ADJUST_WH_CODE: '',  
  FLT_STOCK_ADJUST_TRANS_CODE: '',
  FLT_STOCK_ADJUST_SID: '',
})

const RemoteItems = async (index) => {
  AdjustDtlItems.value.splice(index,1)
  //InputData = InputData.filter((option) => option !== InputData[index])  
  InputData.splice(index,1)
  for (let i = 0; i < AdjustDtlItems.value.length; i++) 
  {
    AdjustDtlItems.value[i].ITEM_SEQ = encrypt((i + 1).toString())
  }

};

watch(() => whData, async (value) => {
  if (value) {
    const selectedChannel = WHList.value.find((channel) => decrypt(channel.WH_CODE) === value?.value.value)
    formData.value.FLT_STOCK_ADJUST_BRAND_CODE = selectedChannel?.WH_BRAND_CODE ? decrypt(selectedChannel?.WH_BRAND_CODE) : ''
    formData.value.FLT_STOCK_ADJUST_BRAND_FNAME = selectedChannel?.WH_BRAND_FNAME ? decrypt(selectedChannel?.WH_BRAND_FNAME) : ''
    await StockAdjust.fetchPopStoreList(selectedChannel?.WH_BRAND_CODE)

    if(PopStoreList.value.length > 0)
    {
      FromStoreData.value = {
        name: PopStoreList.value[0].STORE_FNAME ? decrypt(PopStoreList.value[0].STORE_FNAME) : '',
        value: PopStoreList.value[0].STORE_SID ? decrypt(PopStoreList.value[0].STORE_SID) : '',
      };
    }
    else
    {
      FromStoreData.value = {
        name: '',
        value: '',
      };
    }

    
  }
  else
  {
    formData.value.FLT_STOCK_ADJUST_BRAND_CODE = ''
    formData.value.FLT_STOCK_ADJUST_BRAND_FNAME = ''
    StockAdjust.clearPopStoreList()

    FromStoreData.value = {
      name: '',
      value: '',
    };
  }
}, { deep: true })


onMounted(async () => {
  isloading.isLoading = true
  await commonData.fetchPOP00370CommonData();
  //await pageLoader.fetchPageLoadData('POP00370')
  await StockAdjust.fetchWHList()
  await StockAdjust.fetchPopVendorList()
  await StockAdjust.fetchPopStoreList()

  whData.value = {
    name: decrypt(WHList.value[0].WH_FNAME),
    value: decrypt(WHList.value[0].WH_CODE),
  };

  brand.value = {
    name: '',
    value: '',
  }
  TransactionType.value = getTransactionType.value[0]

  AdjustInc.value = commonData.getAdjustIncReason[0]
  AdjustEec.value = commonData.getAdjustDecReason[0]

  FromWhData.value = {
    name: decrypt(WHList.value[0].WH_FNAME),
    value: decrypt(WHList.value[0].WH_CODE),
  };
  ToWhData.value = {
    name: decrypt(WHList.value[0].WH_FNAME),
    value: decrypt(WHList.value[0].WH_CODE),
  };
  FromStoreData.value = {
    name: decrypt(PopStoreList.value[0].STORE_FNAME),
    value: decrypt(PopStoreList.value[0].STORE_SID),
  };
  FromVendorData.value = {
    name: decrypt(PopVendorList.value[0].VENDER_FNAME),
    value: decrypt(PopVendorList.value[0].VENDOR_SID),
  };  
  ToVendorData.value = {
    name: decrypt(PopVendorList.value[0].VENDER_FNAME),
    value: decrypt(PopVendorList.value[0].VENDOR_SID),
  };



  if (!props.create){ 
    fetchAdjustLoad()
  }
  isloading.isLoading = false

})

const fetchAdjustLoad = async () => {

  const DTLformData = ref({
    FLT_ADJUST_TRANS_SID: props.adjustsid,  
    FLT_ADJUST_WH_CODE: props.adjustwh,  
    FLT_ADJUST_TRANS_CODE: props.adjustcode,
  })


  await StockAdjust.fetchAdjustmentDetail(DTLformData.value) 
  
    formData.value.FLT_STOCK_ADJUST_SID = decrypt(AdjustmentDetail.value.ADJUST_SID)
    formData.value.FLT_STOCK_ADJUST_WH_CODE = decrypt(AdjustmentDetail.value.ADJUST_WH_CODE)
    formData.value.FLT_STOCK_ADJUST_BRAND_CODE = decrypt(AdjustmentDetail.value.ADJUST_BRAND_CODE)
    formData.value.FLT_STOCK_ADJUST_BRAND_FNAME = decrypt(AdjustmentDetail.value.ADJUST_BRAND_FNAME)
    formData.value.FLT_STOCK_ADJUST_BATCH_NO = decrypt(AdjustmentDetail.value.ADJUST_BATCH_NO)
    formData.value.FLT_STOCK_ADJUST_ETC_DATA_01 = decrypt(AdjustmentDetail.value.ADJUST_ETC1_DATA)
    formData.value.FLT_STOCK_ADJUST_ETC_DATA_02 = decrypt(AdjustmentDetail.value.ADJUST_ETC2_DATA)
    formData.value.FLT_STOCK_ADJUST_REQ_DATE = decrypt(AdjustmentDetail.value.ADJUST_REQUEST_DATE)
    formData.value.FLT_STOCK_ADJUST_STATUS_CODE = decrypt(AdjustmentDetail.value.ADJUST_STATUS_CODE)
    formData.value.FLT_STOCK_ADJUST_STATUS_FNAME = decrypt(AdjustmentDetail.value.ADJUST_STATUS_FNAME)
    formData.value.FLT_STOCK_ADJUST_REMARK = decrypt(AdjustmentDetail.value.ADJUST_REMARK)
    formData.value.FLT_STOCK_ADJUST_TRANS_CODE = decrypt(AdjustmentDetail.value.ADJUST_TRANS_CODE)
    formData.value.FLT_STOCK_ADJUST_TRANS_DATA_01 = decrypt(AdjustmentDetail.value.ADJUST_TRANS_CODE)
    formData.value.FLT_STOCK_ADJUST_TRANS_DATA_02 = decrypt(AdjustmentDetail.value.ADJUST_TRANS_CODE)
    formData.value.FLT_STOCK_ADJUST_TRANS_DATA_03 = decrypt(AdjustmentDetail.value.ADJUST_TRANS_CODE)

    whData.value = {
      name: decrypt(AdjustmentDetail.value.ADJUST_WH_FNAME),
      value: decrypt(AdjustmentDetail.value.ADJUST_WH_CODE),
    };

    TransactionType.value = {
      name: decrypt(AdjustmentDetail.value.ADJUST_TRANS_NAME),
      value: decrypt(AdjustmentDetail.value.ADJUST_TRANS_CODE),
    };
    
    AdjustInc.value = {
      name: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_10_REASON_CODE ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_10_REASON_FNAME) : commonData.getAdjustIncReason[0].name,
      value: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_10_REASON_CODE ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_10_REASON_CODE) : commonData.getAdjustIncReason[0].value,
    };

    AdjustEec.value = {
      name: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_20_REASON_CODE ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_20_REASON_FNAME) : commonData.getAdjustDecReason[0].name,
      value: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_20_REASON_CODE ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_20_REASON_CODE) : commonData.getAdjustDecReason[0].value,
    };

    FromWhData.value = {
      name: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_30_FROM_WH_CODE ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_30_FROM_WH_FNAME) : WHList.value[0].WH_FNAME,
      value: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_30_FROM_WH_CODE ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_30_FROM_WH_CODE) : WHList.value[0].WH_CODE,
    };

    ToWhData.value = {
      name: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_40_TO_WH_CODE ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_40_TO_WH_FNAME) : WHList.value[0].WH_FNAME,
      value: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_40_TO_WH_CODE ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_40_TO_WH_CODE) : WHList.value[0].WH_CODE,
    };

    FromStoreData.value = {
      name: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_50_FROM_STORE_SID ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_50_FROM_STORE_FNAME) : PopStoreList.value[0].STORE_FNAME,
      value: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_50_FROM_STORE_SID ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_50_FROM_STORE_SID) : PopStoreList.value[0].STORE_SID,
    };

    FromVendorData.value = {
      name: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_60_FROM_VENDOR_SID ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_60_FROM_VENDOR_FNAME) : PopVendorList.value[0].WH_FNAME,
      value: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_60_FROM_VENDOR_SID ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_60_FROM_VENDOR_SID) : PopVendorList.value[0].WH_CODE,
    };

    ToVendorData.value = {
      name: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_70_TO_VENDOR_SID ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_70_TO_VENDOR_FNAME) : PopVendorList.value[0].WH_FNAME,
      value: AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_70_TO_VENDOR_SID ? decrypt(AdjustmentDetail.value.ADJUST_DETAIL_INFO.TRANS_70_TO_VENDOR_SID) : PopVendorList.value[0].WH_CODE,
    };
    
    InputData.length = 0;
    for (let i = 0; i < AdjustmentDetail.value.ADJUST_ITEMS.length; i++) 
    { 
      //InputData.value.push({
      InputData.push({
        ITEM_CODE : AdjustmentDetail.value.ADJUST_ITEMS[i].ITEM_CODE,
        ITEM_BRAND_CODE : AdjustmentDetail.value.ADJUST_ITEMS[i].ITEM_BRAND_CODE,
        ADJUST_QTY : AdjustmentDetail.value.ADJUST_ITEMS[i].ITEM_INPUT_QTY
      })
    }

    AdjustDtlItems.value = AdjustmentDetail.value.ADJUST_ITEMS
    AdjustHistory.value = AdjustmentDetail.value.ADJUST_HISTORY
};

const openProductItemModal = () => {

  brand.value = {
      name: formData.value.FLT_STOCK_ADJUST_BRAND_FNAME,
      value: formData.value.FLT_STOCK_ADJUST_BRAND_CODE,
  }

  openItemModal.value = true
}

const onRowDoubleClick = (data) => {

  InputData.push({
    ITEM_CODE : data.data.ITEM_CODE,
    ITEM_BRAND_CODE : data.data.ITEM_BRAND_CODE,
    ADJUST_QTY : encrypt('0')
  })

  AdjustDtlItems.value.push({
    ADJUST_SID : formData.value.FLT_STOCK_ADJUST_SID,
    ITEM_SEQ : encrypt((AdjustDtlItems.value.length + 1).toString()),
    ADJUST_QTY : encrypt('0'),
    ADJUST_INPUT_QTY : encrypt('0'),
    ITEM_CODE : data.data.ITEM_CODE,
    ITEM_BRAND_CODE : data.data.ITEM_BRAND_CODE,
    ITEM_BRAND_SNAME : data.data.ITEM_BRAND_SNAME,
    ITEM_BRAND_FNAME : data.data.ITEM_BRAND_FNAME,
    ITEM_ALU : data.data.ITEM_ALU,
    ITEM_EAN : data.data.ITEM_EAN,
    ITEM_SNAME : data.data.ITEM_SNAME,
    ITEM_FNAME : data.data.ITEM_FNAME,
    ITEM_STATUS_CODE : data.data.ITEM_STATUS_CODE,
    ITEM_STATUS_SNAME : data.data.ITEM_STATUS_SNAME,
    ITEM_STATUS_FNAME : data.data.ITEM_STATUS_FNAME,
    ITEM_CATEGORY_CODE : data.data.ITEM_CATEGORY_CODE,
    ITEM_CATEGORY_SNAME : data.data.ITEM_CATEGORY_SNAME,
    ITEM_CATEGORY_FNAME : data.data.ITEM_CATEGORY_FNAME,
    ITEM_SUB_CATEGORY_CODE : data.data.ITEM_SUB_CATEGORY_CODE,
    ITEM_SUB_CATEGORY_SNAME : data.data.ITEM_SUB_CATEGORY_SNAME,
    ITEM_SUB_CATEGORY_FNAME : data.data.ITEM_SUB_CATEGORY_FNAME,
    ITEM_SUB_SUBCATEGORY_CODE : data.data.ITEM_SUB_SUBCATEGORY_CODE,
    ITEM_SUB_SUBCATEGORY_FNAME : data.data.ITEM_SUB_SUBCATEGORY_FNAME,
    ITEM_SUB_SUBCATEGORY_SNAME : data.data.ITEM_SUB_SUBCATEGORY_SNAME,
    ITEM_PRODUCT_TYPE : data.data.ITEM_PRODUCT_TYPE,
    ITEM_MATERIAL_CODE : data.data.ITEM_MATERIAL_CODE,
    ITEM_GROSS_WEIGHT : data.data.ITEM_GROSS_WEIGHT,
    ITEM_NET_WEIGHT : data.data.ITEM_NET_WEIGHT,
    ITEM_WEIGHT_UNIT : data.data.ITEM_WEIGHT_UNIT,
    ITEM_QTY_IN_PACK : data.data.ITEM_QTY_IN_PACK,
    ITEM_UNIT_NAME : data.data.ITEM_UNIT_NAME,
    ITEM_SIZE_CODE : data.data.ITEM_SIZE_CODE,
    ITEM_COLOR_CODE : data.data.ITEM_COLOR_CODE,
    ITEM_COLOR_NAME : data.data.ITEM_COLOR_NAME,
    ITEM_SIZE_NAME : data.data.ITEM_SIZE_NAME,
    ITEM_SEASON_YEAR : data.data.ITEM_SEASON_YEAR,
    ITEM_SEASON_TYPE : data.data.ITEM_SEASON_TYPE,
    ITEM_SEASON_DATE : data.data.ITEM_SEASON_DATE,
    ITEM_SALES_UNIT : data.data.ITEM_SALES_UNIT,
    ITEM_SALES_CURRENCY_CODE : data.data.ITEM_SALES_CURRENCY_CODE,
    ITEM_SALES_CURRENCY_SNAME : data.data.ITEM_SALES_CURRENCY_SNAME,
    ITEM_SALES_CURRENCY_FNAME : data.data.ITEM_SALES_CURRENCY_FNAME,
    ITEM_SALES_ORG_PRICE : data.data.ITEM_SALES_ORG_PRICE,
    INPUT_LIST : []
  })

  openItemModal.value = false
}

const fetchAdjustmentDelete = async () => {

  DIALOG_TYPE.value = 'DELETE'
  DIALOG_TITLE.value = 'Delete Stock Adjustment'
  DIALOG_TEXT.value = 'Do you want to delete the stock adjustment details?'

  openDialogModal.value = true
  
};

const fetchAdjustmentConfirm = async () => {

  DIALOG_TYPE.value = 'CONFIRM'
  DIALOG_TITLE.value = 'Confirm Stock Adjustment'
  DIALOG_TEXT.value = 'Do you want to confirm the stock adjustment details?'

  openDialogModal.value = true
  
};

const fetchAdjustmentSave = async () => {

  DIALOG_TYPE.value = 'SAVE'
  DIALOG_TITLE.value = 'Save Stock Adjustment'
  DIALOG_TEXT.value = 'Do you want to save the stock adjustment details?'

  openDialogModal.value = true
   
};

const ConfirmDialog = async () => {
  
  if(DIALOG_TYPE.value === 'SAVE')
  {
    formData.value.FLT_STOCK_ADJUST_WH_CODE = whData.value?.value
    formData.value.FLT_STOCK_ADJUST_TRANS_CODE = TransactionType.value?.value

    if(TransactionType.value?.value === '10'){ formData.value.FLT_STOCK_ADJUST_TRANS_DATA_01 = AdjustInc.value?.value }
    else if(TransactionType.value?.value === '20'){ formData.value.FLT_STOCK_ADJUST_TRANS_DATA_01 = AdjustEec.value?.value }
    else if(TransactionType.value?.value === '30'){ formData.value.FLT_STOCK_ADJUST_TRANS_DATA_01 = FromWhData.value?.value }
    else if(TransactionType.value?.value === '40'){ formData.value.FLT_STOCK_ADJUST_TRANS_DATA_01 = ToWhData.value?.value }
    else if(TransactionType.value?.value === '50'){ formData.value.FLT_STOCK_ADJUST_TRANS_DATA_01 = FromStoreData.value?.value }
    else if(TransactionType.value?.value === '60'){ formData.value.FLT_STOCK_ADJUST_TRANS_DATA_01 = FromVendorData.value?.value }
    else if(TransactionType.value?.value === '70'){ formData.value.FLT_STOCK_ADJUST_TRANS_DATA_01 = ToVendorData.value?.value }
    
    formData.value.ITEMS = InputData
    
    toggleLoading()
    isloading.isLoading = true
    const { success } = await StockAdjust.fetchAdjustmentSave(formData.value)
    if (success) {

      if (!props.create){await fetchAdjustLoad() }
      else (emits('stockSaved') )

    }
    toggleLoading()
    isloading.isLoading = false
  }
  else if(DIALOG_TYPE.value === 'DELETE')
  {
    toggleLoading()
    isloading.isLoading = true

    formEvnetData.value.FLT_STOCK_ADJUST_WH_CODE = props.adjustwh
    formEvnetData.value.FLT_STOCK_ADJUST_TRANS_CODE = props.adjustcode
    formEvnetData.value.FLT_STOCK_ADJUST_SID = props.adjustsid


    const { success } = await StockAdjust.fetchAdjustmentDelete(formEvnetData.value) 
    if (success) {
      emits('stockSaved')
    }
    toggleLoading()
    isloading.isLoading = false
  }
  else if(DIALOG_TYPE.value === 'CONFIRM')
  {
    formEvnetData.value.FLT_STOCK_ADJUST_WH_CODE = props.adjustwh
    formEvnetData.value.FLT_STOCK_ADJUST_TRANS_CODE = props.adjustcode
    formEvnetData.value.FLT_STOCK_ADJUST_SID = props.adjustsid
    
    toggleLoading()
    isloading.isLoading = true
    const { success } = await StockAdjust.fetchAdjustmentConfirm(formEvnetData.value) 
    if (success) {
      emits('stockSaved')   
    }
    toggleLoading()
    isloading.isLoading = false
  }
  openDialogModal.value = false
}

</script>

<template>
  <div class="relative space-y-3">
    <div class="grid grid-cols-5 gap-y-3 gap-x-4">
      <div class="col-span-2 space-y-3">
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-2 space-y-1"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-3"
        >   
          <div class="col-span-1">            
            <div class="grid grid-cols-5 gap-x-5">
              <div class="col-span-3">
                <FormGroup                
                  :label="getComponentData('POP00370_LBL00002', 'caption', 'SID')"
                  label-id="POP00370_LBL00002"
                  label-for="POP00370_TXT00001"
                  horizontal
                  label-width="w-1/3"
                >
                  <FormTextInput
                    id="POP00370_TXT00001"
                    v-model="formData.FLT_STOCK_ADJUST_SID"
                    disabled
                  />
                </FormGroup>
              </div>
              <div class="col-span-2">
                <FormGroup
                  :label="getComponentData('POP00370_LBL00003', 'caption', 'Status')"
                  label-id="POP00370_LBL00003"
                  label-for="POP00370_TXT00002"
                  horizontal
                >
                  <FormTextInput
                    id="POP00370_TXT00002"
                    v-model="formData.FLT_STOCK_ADJUST_STATUS_FNAME"
                    disabled
                  />
                </FormGroup>
              </div>
            </div>
          </div>
          <FormGroup
            :label="getComponentData('POP00370_LBL00004', 'caption', 'Warehouse')"
            label-id="POP00370_LBL00004"
            label-for="POP00370_CMB00001"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormSelect
              id="POP00370_CMB00001"
              v-model="whData"
              :options="WHList.map((item) => ({
                name: decrypt(item.WH_FNAME),
                value: decrypt(item.WH_CODE),
              }))"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00370_LBL00005', 'caption', 'Brand')"
            label-id="POP00370_LBL00005"
            label-for="POP00370_TXT00003"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextInput
              id="POP00370_TXT00003"
              v-model="formData.FLT_STOCK_ADJUST_BRAND_FNAME"
              disabled
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00370_LBL00006', 'caption', 'Batch No')"
            label-id="POP00370_LBL00006"
            label-for="POP00370_TXT00004"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextInput
              id="POP00370_TXT00004"
              v-model="formData.FLT_STOCK_ADJUST_BATCH_NO"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00370_LBL00007', 'caption', 'Information #1')"
            label-id="POP00370_LBL00007"
            label-for="POP00370_TXT00005"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextInput
              id="POP00370_TXT00005"
              v-model="formData.FLT_STOCK_ADJUST_ETC_DATA_01"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00370_LBL00008', 'caption', 'Information #2')"
            label-id="POP00370_LBL00008"
            label-for="POP00370_TXT00006"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextInput
              id="POP00370_TXT00006"
              v-model="formData.FLT_STOCK_ADJUST_ETC_DATA_02"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00370_LBL00009', 'caption', 'Request Date')"
            label-id="POP00370_LBL00009"
            label-for="POP00370_DAT00001"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormDatePicker
              id="POP00370_DAT00001"
              v-model.string="formData.FLT_STOCK_ADJUST_REQ_DATE"
              placeholder="Select a date"
              mode="date"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00370_LBL00010', 'caption', 'Transaction Type')"
            label-id="POP00370_LBL00010"
            label-for="POP00370_CMB00001"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormSelect
              id="POP00370_CMB00001"
              v-model="TransactionType"
              :options="getTransactionType"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup>                      
        </Card> 
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-2 space-y-1"
          class="isac-bg-lighter shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-3"
        >  
          <FormGroup
            v-if="TransactionType.value === '10'"
            :label="getComponentData('POP00370_LBL00011', 'caption', 'Reason')"
            label-id="POP00370_LBL00011"
            label-for="POP00370_CMB00003"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormSelect
              id="POP00370_CMB00003"
              v-model="AdjustInc"
              :options="commonData.getAdjustIncReason"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup> 
          <FormGroup
            v-if="TransactionType.value === '20'"
            :label="getComponentData('POP00370_LBL00012', 'caption', 'Reason')"
            label-id="POP00370_LBL00012"
            label-for="POP00370_CMB00004"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormSelect
              id="POP00370_CMB00004"
              v-model="AdjustEec"
              :options="commonData.getAdjustDecReason"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup>   
          <FormGroup
            v-if="TransactionType.value === '30'"
            :label="getComponentData('POP00370_LBL00013', 'caption', 'From WH')"
            label-id="POP00370_LBL00013"
            label-for="POP00370_CMB00005"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormSelect
              id="POP00370_CMB00005"
              v-model="FromWhData"
              :options="WHList.map((item) => ({
                name: decrypt(item.WH_FNAME),
                value: decrypt(item.WH_CODE),
              }))"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup>    
          <FormGroup
            v-if="TransactionType.value === '40'"
            :label="getComponentData('POP00370_LBL00014', 'caption', 'To WH')"
            label-id="POP00370_LBL00014"
            label-for="POP00370_CMB00006"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormSelect
              id="POP00370_CMB00006"
              v-model="ToWhData"
              :options="WHList.map((item) => ({
                name: decrypt(item.WH_FNAME),
                value: decrypt(item.WH_CODE),
              }))"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup> 
          <FormGroup
            v-if="TransactionType.value === '50'"
            :label="getComponentData('POP00370_LBL00015', 'caption', 'From Store')"
            label-id="POP00370_LBL00015"
            label-for="POP00370_CMB00007"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormSelect
              id="POP00370_CMB00007"
              v-model="FromStoreData"
              :options="PopStoreList.map((item) => ({
                name: decrypt(item.STORE_FNAME),
                value: decrypt(item.STORE_SID),
              }))"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup>   
          <FormGroup
            v-if="TransactionType.value === '60'"
            :label="getComponentData('POP00370_LBL00016', 'caption', 'From Vendor')"
            label-id="POP00370_LBL00016"
            label-for="POP00370_CMB00008"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormSelect
              id="POP00370_CMB00008"
              v-model="FromVendorData"
              :options="PopVendorList.map((item) => ({
                name: decrypt(item.VENDER_FNAME),
                value: decrypt(item.VENDOR_SID),
              }))"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup>    
          <FormGroup
            v-if="TransactionType.value === '70'"
            :label="getComponentData('POP00370_LBL00017', 'caption', 'To Vendor')"
            label-id="POP00370_LBL00017"
            label-for="POP00370_CMB00009"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormSelect
              id="POP00370_CMB00009"
              v-model="ToVendorData"
              :options="PopVendorList.map((item) => ({
                name: decrypt(item.VENDER_FNAME),
                value: decrypt(item.VENDOR_SID),
              }))"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup>  
        </Card> 
      </div>
      <div class="col-span-3 space-y-3">
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-2 space-y-1"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-3"
        >          
          <p class="leading-6 font-medium text-gray-900">
            {{ getGridData('POP00370_GRD00002', 'caption') }}
          </p>
          <Table
            id="POP00370_GRD00002"
            border
            header-variant="secondary"
            class="overflow-y-auto max-h-80 min-h-80 "
            clickable
            :columns="HistoryTableFields"
            :items="AdjustHistory"
          />                    
          <FormGroup
            class="py-2"
            :label="getComponentData('POP00370_LBL00018', 'caption', 'Remark')"
            label-id="POP00370_LBL00018"
            label-for="POP00370_TXT00007"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextareaInput
              id="POP00370_TXT00007"
              v-model="formData.FLT_STOCK_ADJUST_REMARK"
              :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
            />
          </FormGroup>    
        </Card>        
      </div>
    </div>
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-2 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    > 
      <template #header>
        <div class="flex justify-between items-center">
          <p>
            {{ getGridData('POP00370_GRD00001', 'caption', 'Item List') }}
          </p>
          <Button
            v-if="formData.FLT_STOCK_ADJUST_STATUS_CODE != '0060'"
            id="POP00370_BTN00001"
            v-tooltip="{
              content: 'Add Item',
              placement: 'left',
              trigger: 'hover',
              distance: 10,
              delay: 100,
              popperClass: 'bg-black text-white rounded-md'
            }"
            rounded
            variant="white"
            border
            size="xs"
            @click="openProductItemModal"
          >
            <PlusIcon class="w-5 h-5" />
          </Button>
        </div>
      </template>
      <Table
        id="POP00370_GRD00001"
        border
        clickable
        header-variant="secondary"  
        class="overflow-y-auto max-h-80 min-h-80 "          
      >
        <TableHead>              
          <TableHeadCell class="text-center">
            No
          </TableHeadCell>
          <TableHeadCell class="text-center">
            SKU
          </TableHeadCell>
          <TableHeadCell class="text-center">
            Barcode
          </TableHeadCell>
          <TableHeadCell class="text-center">
            Short Name
          </TableHeadCell>
          <TableHeadCell class="text-center">
            Full Name
          </TableHeadCell>
          <TableHeadCell class="text-center">
            Color
          </TableHeadCell>
          <TableHeadCell class="text-center">
            Size
          </TableHeadCell>
          <TableHeadCell class="text-center">
            Input Qty
          </TableHeadCell>
          <TableHeadCell class="text-center">
            DEL
          </TableHeadCell>
        </TableHead>
        <TableBody>
          <TableRow
            v-for="(option, index) in AdjustDtlItems"
            :key="index"
          >                          
            <TableCell class="text-center ">
              {{ decrypt(option.ITEM_SEQ) }}
            </TableCell>
            <TableCell class="text-center">
              {{ decrypt(option.ITEM_CODE) }}
            </TableCell> 
            <TableCell class="text-center">
              {{ decrypt(option.ITEM_EAN) }}
            </TableCell>           
            <TableCell class="text-center">
              {{ decrypt(option.ITEM_SNAME) }}
            </TableCell> 
            <TableCell class="text-center">
              {{ decrypt(option.ITEM_FNAME) }}
            </TableCell> 
            <TableCell class="text-center">
              {{ decrypt(option.ITEM_COLOR_NAME) }}
            </TableCell> 
            <TableCell class="text-center">
              {{ decrypt(option.ITEM_SIZE_CODE) }}
            </TableCell> 
            <TableCell class="w-32 text-center">
              <FormTextInput 
                type="number"
                :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
                :value="decrypt(InputData[index].ADJUST_QTY)" 
                @input="e => InputData[index].ADJUST_QTY = encrypt(e.target.value)"
              />
            </TableCell> 
            <TableCell class="text-center">
              <span
                v-if="formData.FLT_STOCK_ADJUST_STATUS_CODE != '0060'"
                class=" cursor-pointer hover:font-bold hover:text-blue-700"
                @click="(e) => {
                  e.stopPropagation();
                  RemoteItems(index)
                }"
              >
                <VueFeather
                  type="minus-circle"
                  class="h-5 w-5"
                />
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>                      
    </Card>    
    <div
      class="flex justify-end pb-1 space-x-2"
    >
      <Button
        variant="gray"
        rounded        
        size="sm"
        class="w-30"
        :disabled="create || formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
        @click="fetchAdjustmentConfirm"
      >
        {{ getComponentData('POP00370_BTN00004', 'caption', 'Confirm') }}
      </Button>
      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-30"
        :disabled="create || formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
        @click="fetchAdjustmentDelete"
      >
        {{ getComponentData('POP00370_BTN00003', 'caption', 'Delate') }}
      </Button>
      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-30"
        :disabled="formData.FLT_STOCK_ADJUST_STATUS_CODE == '0060'"
        @click="fetchAdjustmentSave"
      >
        {{ getComponentData('POP00370_BTN00002', 'caption', 'Save') }}
      </Button>
    </div> 
    <Modal
      :show="openItemModal"
      divider
      size="6xl"
      @close="() => {
        openItemModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00210_LBL01001', 'caption', 'Items') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00210'"
          :brand="brand"
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
  </div>
</template>

<style scoped>

</style>
