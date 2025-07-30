<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import VueFeather from "vue-feather";
import {PlusIcon} from "@heroicons/vue/24/solid";

const pageLoader = usePageLoaderStore()
const StockOutbound = useStockOutbound()
const InputData =[]
const OutboundDtlItems = ref([])
const OutboundHistory = ref([])
const whData = ref({})
const StoreData = ref({})
const VendorData = ref({})
const brand = ref({})

const openItemModal = ref(false)

const isRadio = ref('STORE')

const emits = defineEmits(['stockSaved'])

const { currentTab } = storeToRefs(useTabsStore())
const { WHList, VendorList, StoreList , OutboundDetail } = storeToRefs(StockOutbound)

const { getComponentData } = usePageLoaderComponent(['POP00330'])
const { getGridData } = usePageLoaderGrid(['POP00330'])
const { loading, toggleLoading } = useLoading()

const props = defineProps({
  create: {
    type: Boolean,
    default: false,
  },
  outboundsid: {
    type: String,
    default: '',
  },
})

/* Dialog Modal */
const openDialogModal = ref(false)

const DIALOG_TYPE = ref("")
const DIALOG_TITLE = ref("")
const DIALOG_TEXT = ref("")

////////////////////////////////

const HistoryTableFields = computed(() => {
  return pageLoader.getTableData('POP00330' , 'POP00330_GRD00002')
})

const formData = ref({
  FLT_OUTBOUND_SID: '',  
  FLT_OUTBOUND_WAVE_ID: '',
  FLT_OUTBOUND_WORKING_SYS_CODE: '0050',  
  FLT_OUTBOUND_SHIPPING_NO: '',
  FLT_OUTBOUND_BATCH_NO: '',
  FLT_OUTBOUND_REQ_DATE: '',
  FLT_OUTBOUND_STORE_SID: '',
  FLT_OUTBOUND_VENDOR_SID: '',
  FLT_OUTBOUND_STATUS_CODE: '',
  FLT_OUTBOUND_STATUS_FNAME: '',
  FLT_OUTBOUND_BRAND_CODE: '',
  FTL_OUTBOUND_BRAND_FNAME: '',
  FLT_OUTBOUND_WH_CODE: '',
  FLT_OUTBOUND_ETC_DATA_01: '',
  FLT_OUTBOUND_ETC_DATA_02: '',
  FLT_OUTBOUND_REMARK: '',
  ITEMS: []
})

const RemoteItems = async (index) => {
  //OutboundDtlItems.value = OutboundDtlItems.value.filter((option) => option !== OutboundDtlItems.value[index])  
  OutboundDtlItems.value.splice(index,1)
  //InputData = InputData.filter((option) => option !== InputData[index])  
  InputData.splice(index,1)
  for (let i = 0; i < OutboundDtlItems.value.length; i++) 
  {
    OutboundDtlItems.value[i].OUTBOUND_ITEM_NO = decrypt((i + 1).toString())
  }

};

watch(() => whData, (value) => {
  if (value) {
    const selectedChannel = WHList.value.find((channel) => decrypt(channel.WH_CODE) === value?.value.value)
    formData.value.FLT_OUTBOUND_BRAND_CODE = selectedChannel?.WH_BRAND_CODE ? decrypt(selectedChannel?.WH_BRAND_CODE) : ''
    formData.value.FTL_OUTBOUND_BRAND_FNAME = selectedChannel?.WH_BRAND_FNAME ? decrypt(selectedChannel?.WH_BRAND_FNAME) : ''
    StockOutbound.fetchStoreList(selectedChannel?.WH_BRAND_CODE)
  }
  else
  {
    formData.value.FLT_OUTBOUND_BRAND_CODE = ''
    formData.value.FTL_OUTBOUND_BRAND_FNAME = ''
    StockOutbound.clearStoreList()
  }
}, { deep: true })


onMounted(async () => {
  isloading.isLoading = true
  //await pageLoader.fetchPageLoadData('POP00330')
  await StockOutbound.fetchWHList()
  await StockOutbound.fetchVendorList()
  

  whData.value = {
    name: '',
    value: '',
  };
  StoreData.value = {
    name: '',
    value: '',
  };
  VendorData.value = {
    name: '',
    value: '',
  };

  brand.value = {
    name: '',
    value: '',
  }

  if (!props.create){ 
    fetchOutboundLoad()
  }
  isloading.isLoading = false
})

const fetchOutboundLoad = async () => {
  await StockOutbound.fetchOutboundDetail(props.outboundsid) 
  
    formData.value.FLT_OUTBOUND_SID = decrypt(OutboundDetail.value.OUTBOUND_SID)
    formData.value.FLT_OUTBOUND_WAVE_ID = decrypt(OutboundDetail.value.OUTBOUND_WAVE_ID)
    formData.value.FLT_OUTBOUND_SHIPPING_NO = decrypt(OutboundDetail.value.OUTBOUND_SHIPPING_NO)
    formData.value.FLT_OUTBOUND_BATCH_NO = decrypt(OutboundDetail.value.OUTBOUND_BATCH_NO)
    formData.value.FLT_OUTBOUND_REQ_DATE = decrypt(OutboundDetail.value.OUTBOUND_REQ_DATE)
    formData.value.FLT_OUTBOUND_STORE_SID = decrypt(OutboundDetail.value.OUTBOUND_STORE_SID)
    formData.value.FLT_OUTBOUND_VENDOR_SID = decrypt(OutboundDetail.value.OUTBOUND_VENDOR_SID)
    formData.value.FLT_OUTBOUND_STATUS_CODE = decrypt(OutboundDetail.value.OUTBOUND_STATUS_CODE)
    formData.value.FLT_OUTBOUND_STATUS_FNAME = decrypt(OutboundDetail.value.OUTBOUND_STATUS_FNAME)
    formData.value.FLT_OUTBOUND_BRAND_CODE = decrypt(OutboundDetail.value.OUTBOUND_BRAND_CODE)
    formData.value.FTL_OUTBOUND_BRAND_FNAME = decrypt(OutboundDetail.value.OUTBOUND_BRAND_FNAME)
    formData.value.FLT_OUTBOUND_WH_CODE = decrypt(OutboundDetail.value.OUTBOUND_WH_CODE)
    formData.value.FLT_OUTBOUND_ETC_DATA_01 = decrypt(OutboundDetail.value.OUTBOUND_ETC_DATA_01)
    formData.value.FLT_OUTBOUND_ETC_DATA_02 = decrypt(OutboundDetail.value.OUTBOUND_ETC_DATA_02)
    formData.value.FLT_OUTBOUND_REMARK = decrypt(OutboundDetail.value.OUTBOUND_REMARK)

    if (decrypt(OutboundDetail.value.OUTBOUND_VENDOR_SID) !== '' && decrypt(OutboundDetail.value.OUTBOUND_VENDOR_SID) !== '0')
    {
      isRadio.value = 'VENDOR'
    }
    else
    {
      isRadio.value = 'STORE'
    }

    whData.value = {
      name: decrypt(OutboundDetail.value.OUTBOUND_WH_FNAME),
      value: decrypt(OutboundDetail.value.OUTBOUND_WH_CODE),
    };
    StoreData.value = {
      name: decrypt(OutboundDetail.value.OUTBOUND_STORE_FNAME),
      value: decrypt(OutboundDetail.value.OUTBOUND_STORE_SID),
    };
    VendorData.value = {
      name: decrypt(OutboundDetail.value.OUTBOUND_VENDOR_FNAME),
      value: decrypt(OutboundDetail.value.OUTBOUND_VENDOR_SID),
    };

    
    InputData.length = 0;
    for (let i = 0; i < OutboundDetail.value.ITEMS.length; i++) 
    { 
      //InputData.value.push({
      InputData.push({
        ITEM_CODE : OutboundDetail.value.ITEMS[i].ITEM_CODE,
        ITEM_BRAND_CODE : OutboundDetail.value.ITEMS[i].ITEM_BRAND_CODE,
        OUTBOUND_QTY : OutboundDetail.value.ITEMS[i].OUTBOUND_INPUT_QTY
      })
    }

    OutboundDtlItems.value = OutboundDetail.value.ITEMS
    OutboundHistory.value = OutboundDetail.value.HISTORY
};

const openProductItemModal = () => {

  brand.value = {
      name: formData.value.FTL_OUTBOUND_BRAND_FNAME,
      value: formData.value.FLT_OUTBOUND_BRAND_CODE,
  }

  openItemModal.value = true
}

const onRowDoubleClick = (data) => {

  InputData.push({
    ITEM_CODE : data.data.ITEM_CODE,
    ITEM_BRAND_CODE : data.data.ITEM_BRAND_CODE,
    OUTBOUND_QTY : encrypt('0')
  })

  OutboundDtlItems.value.push({
    OUTBOUND_SID : formData.value.FLT_OUTBOUND_SID,
    OUTBOUND_ITEM_NO : encrypt((OutboundDtlItems.value.length + 1).toString()),
    OUTBOUND_QTY : encrypt('0'),
    OUTBOUND_INPUT_QTY : encrypt('0'),
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
/*  if (selectFixedType.value.value === 'PRODUCTS') {
    formData.value.FLT_PROM_CONDITION_PROD_LIST.push({
      PROM_CONDITION_PROD_SID: data.PRODUCT_SID,
      PROM_CONDITION_PROD_NAME_LOC: data.PRODUCT_NAME_LOC,
      PROM_CONDITION_PROD_NAME_ENG: data.PRODUCT_NAME_ENG,
      PROM_CONDITION_PROD_MIN_QTY: "1"
    })
  }

  if (selectFixedType.value.value === 'ITEMS') {
    formData.value.FLT_PROM_CONDITION_ITEM_LIST.push({
      PROM_CONDITION_ITEM_CODE: data.data.ITEM_CODE,
      PROM_CONDITION_ITEM_BRAND_CODE: data.data.ITEM_BRAND_CODE,
      PROM_CONDITION_ITEM_MIN_QTY: "1"
    })
  }
*/
  openItemModal.value = false
}

const fetchOutboundDelete = async () => {

  DIALOG_TYPE.value = 'DELETE'
  DIALOG_TITLE.value = 'Delete Item Outbound'
  DIALOG_TEXT.value = 'Do you want to delete the item outbound details?'

  openDialogModal.value = true
  
};

const fetchOutboundConfirm = async () => {

  DIALOG_TYPE.value = 'CONFIRM'
  DIALOG_TITLE.value = 'Confirm Item Outbound'
  DIALOG_TEXT.value = 'Do you want to confirm the item outbound details?'

  openDialogModal.value = true
  
};

const fetchOutboundSave = async () => {

  DIALOG_TYPE.value = 'SAVE'
  DIALOG_TITLE.value = 'Save Item Outbound'
  DIALOG_TEXT.value = 'Do you want to save the item outbound details?'

  openDialogModal.value = true

};

const ConfirmDialog = async () => {
  
  if(DIALOG_TYPE.value === 'SAVE')
  {
    formData.value.FLT_OUTBOUND_WH_CODE = whData.value?.value
    formData.value.FLT_OUTBOUND_VENDOR_SID = VendorData.value?.value
    formData.value.FLT_OUTBOUND_STORE_SID = StoreData.value?.value

    if (isRadio.value == 'VENDOR')
    {
      formData.value.FLT_OUTBOUND_VENDOR_SID = VendorData.value?.value
      formData.value.FLT_OUTBOUND_STORE_SID = ''
    }
    else
    {
      formData.value.FLT_OUTBOUND_VENDOR_SID = ''
      formData.value.FLT_OUTBOUND_STORE_SID = StoreData.value?.value
    }

    const uniqueArr = new Set(InputData)
    formData.value.ITEMS = InputData

    toggleLoading()
    isloading.isLoading = true
    const { success } = await StockOutbound.fetchOutboundSave(formData.value)
    if (success) {

      if (!props.create){await fetchOutboundLoad() }
      else (emits('stockSaved') )

    }
    isloading.isLoading = false
    toggleLoading()
  }
  else if(DIALOG_TYPE.value === 'DELETE')
  {
    toggleLoading()
    isloading.isLoading = true
    const { success } = await StockOutbound.fetchOutboundDelete(props.outboundsid) 
    if (success) {
      emits('stockSaved')
    }
    isloading.isLoading = false
    toggleLoading()
  }
  else if(DIALOG_TYPE.value === 'CONFIRM')
  {
    toggleLoading()
    isloading.isLoading = true
    const { success } = await StockOutbound.fetchOutboundConfirm(props.outboundsid) 
    if (success) {
      emits('stockSaved')   
    }
    isloading.isLoading = false
    toggleLoading()
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
                  :label="getComponentData('POP00330_LBL00002', 'caption', 'SID')"
                  label-id="POP00330_LBL00002"
                  label-for="POP00330_TXT00001"
                  horizontal
                  label-width="w-1/3"
                >
                  <FormTextInput
                    id="POP00330_TXT00001"
                    v-model="formData.FLT_OUTBOUND_SID"
                    disabled
                  />
                </FormGroup>
              </div>
              <div class="col-span-2">
                <FormGroup
                  :label="getComponentData('POP00330_LBL00003', 'caption', 'Status')"
                  label-id="POP00330_LBL00003"
                  label-for="POP00330_TXT00002"
                  horizontal
                >
                  <FormTextInput
                    id="POP00330_TXT00002"
                    v-model="formData.FLT_OUTBOUND_STATUS_FNAME"
                    disabled
                  />
                </FormGroup>
              </div>
            </div>
          </div>
          <FormGroup
            :label="getComponentData('POP00330_LBL00004', 'caption', 'Wave ID')"
            label-id="POP00330_LBL00004"            
            label-for="POP00330_TXT00003"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextInput              
              id="POP00330_TXT00003"
              v-model="formData.FLT_OUTBOUND_WAVE_ID"
              :disabled="!props.create"           
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00330_LBL00005', 'caption', 'Warehouse')"
            label-id="POP00330_LBL00005"
            label-for="POP00330_CMB00001"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormSelect
              id="POP00330_CMB00001"
              v-model="whData"
              :options="WHList.map((item) => ({
                name: decrypt(item.WH_FNAME),
                value: decrypt(item.WH_CODE),
              }))"
              :disabled="formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00330_LBL00006', 'caption', 'Brand')"
            label-id="POP00330_LBL00006"
            label-for="POP00330_TXT00004"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextInput
              id="POP00330_TXT00004"
              v-model="formData.FTL_OUTBOUND_BRAND_FNAME"
              disabled
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00330_LBL00007', 'caption', 'Shipping No')"
            label-id="POP00330_LBL00007"
            label-for="POP00330_TXT00005"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextInput
              id="POP00330_TXT00005"
              v-model="formData.FLT_OUTBOUND_SHIPPING_NO"
              :disabled="formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00330_LBL00008', 'caption', 'Batch No')"
            label-id="POP00330_LBL00008"
            label-for="POP00330_TXT00006"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextInput
              id="POP00330_TXT00006"
              v-model="formData.FLT_OUTBOUND_BATCH_NO"
              :disabled="formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00330_LBL00009', 'caption', 'ETC 1')"
            label-id="POP00330_LBL00009"
            label-for="POP00330_TXT00007"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextInput
              id="POP00330_TXT00007"
              v-model="formData.FLT_OUTBOUND_ETC_DATA_01"
              :disabled="formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00330_LBL00010', 'caption', 'ETC 2')"
            label-id="POP00330_LBL00010"
            label-for="POP00330_TXT00008"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextInput
              id="POP00330_TXT00008"
              v-model="formData.FLT_OUTBOUND_ETC_DATA_02"
              :disabled="formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00330_LBL00011', 'caption', 'Request Date')"
            label-id="POP00330_LBL00011"
            label-for="POP00330_DAT00001"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormDatePicker
              id="POP00330_DAT00001"
              v-model.string="formData.FLT_OUTBOUND_REQ_DATE"
              placeholder="Select a date"
              mode="date"
              :disabled="formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00330_LBL00012', 'caption', 'Store')"
            label-id="POP00330_LBL00012"
            label-for="POP00330_CMB00002"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
            prefix-class="z-10"
          >
            <template #prefix>
              <FormRadio
                v-model="isRadio"
                :value="'STORE'"
                :disabled="formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
              />
            </template>
            <FormCombobox
              id="POP00330_CMB00002"
              v-model="StoreData"
              :options="StoreList.map((item) => ({
                name: decrypt(item.STORE_FNAME),
                value: decrypt(item.STORE_SID),
              }))"
              :disabled="isRadio != 'STORE' || formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
            />
          </FormGroup> 
          <FormGroup
            :label="getComponentData('POP00330_LBL00013', 'caption', 'Vendor')"
            label-id="POP00330_LBL00013"
            label-for="POP00330_CMB00003"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
            prefix-class="z-10"
          >
            <template #prefix>
              <FormRadio
                v-model="isRadio"
                :value="'VENDOR'"
                :disabled ="formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
              />
            </template>
            <FormCombobox
              id="POP00330_CMB00003"
              v-model="VendorData"
              :options="VendorList.map((item) => ({
                name: decrypt(item.VENDER_FNAME),
                value: decrypt(item.VENDOR_SID),
              }))"
              :disabled="isRadio != 'VENDOR' || formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
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
            {{ getGridData('POP00330_GRD00002', 'caption') }}
          </p>
          <Table
            id="POP00330_GRD00002"
            border
            header-variant="secondary"
            class="overflow-y-auto max-h-80 min-h-80 "
            clickable
            :columns="HistoryTableFields"
            :items="OutboundHistory"
          />                    
          <FormGroup
            class="py-2"
            :label="getComponentData('POP00330_LBL00014', 'caption', 'Remark')"
            label-id="POP00330_LBL00014"
            label-for="POP00330_TXT00009"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextareaInput
              id="POP00330_TXT00009"
              v-model="formData.FLT_OUTBOUND_REMARK"
              :disabled ="formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
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
            {{ getGridData('POP00330_GRD00001', 'caption', 'Item List') }}
          </p>
          <Button
            v-if="formData.FLT_OUTBOUND_STATUS_CODE != '0060'"
            id="POP00330_BTN00001"
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
        id="POP00330_GRD00001"
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
            v-for="(option, index) in OutboundDtlItems"
            :key="index"
          >                          
            <TableCell class="text-center ">
              {{ decrypt(option.OUTBOUND_ITEM_NO) }}
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
                :disabled="formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
                type="number"
                :value="decrypt(InputData[index].OUTBOUND_QTY)" 
                @input="e => InputData[index].OUTBOUND_QTY = encrypt(e.target.value)"
              />
            </TableCell> 
            <TableCell class="text-center">
              <span
                v-if="formData.FLT_OUTBOUND_STATUS_CODE != '0060'"
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
        :disabled="create || formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
        @click="fetchOutboundConfirm"
      >
        {{ getComponentData('POP00330_BTN00004', 'caption', 'Confirm') }}
      </Button>
      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-30"
        :disabled="create || formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
        @click="fetchOutboundDelete"
      >
        {{ getComponentData('POP00330_BTN00003', 'caption', 'Delate') }}
      </Button>
      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-30"
        :disabled="formData.FLT_OUTBOUND_STATUS_CODE == '0060'"
        @click="fetchOutboundSave"
      >
        {{ getComponentData('POP00330_BTN00002', 'caption', 'Save') }}
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
