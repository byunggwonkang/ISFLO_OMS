<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

import VueFeather from 'vue-feather';
import {PlusIcon,ArrowPathIcon} from "@heroicons/vue/24/solid";
import {notify} from "notiwind";


const { pageLoading, togglePageLoading } = usePageLoading();
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()
const ReturnInspection = useReturnInspectionStore()
const { currentTab } = storeToRefs(useTabsStore())
const { getMaskedValue } = useMasked();

const { loading, toggleLoading } = useLoading()

const { StationList,WorkStaffList, returnInspectionStatusList,returnInspectionOperationNote,filters,ReturnInspectionItemList } = storeToRefs(ReturnInspection)

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const Station = ref({})
const STATION_WH_FNAME = ref("")
const STATION_WH_CODE = ref("")
const WorkStaff = ref({})
const returnInspectionList = ref([])
const ReturnData = ref({})
const Barcode = ref("")
const SKU_DATA = ref("")
const PICKUP_TRACKING_NO = ref("")
const REQ_CONFIRM = ref(false)

const RETURN_LIST_CNT = ref(encrypt("0"))
const RETURN_REQ_CANCEL_CNT = ref(encrypt("0"))
const RETURN_HOLD_BY_ESM_CNT = ref(encrypt("0"))
const EXCHANGE_LIST_CNT = ref(encrypt("0"))
const EXCHANGE_REQ_CANCEL_CNT = ref(encrypt("0"))
const EXCHANGE_HOLD_BY_ESM_CNT = ref(encrypt("0"))

const RETURN_WATINGINBOUND_CNT = ref(encrypt("0"))
const RETURN_INBOUNDINSPECTION_CNT = ref(encrypt("0"))
const RETURN_INBOUND_CNT = ref(encrypt("0"))

const EXCHANGE_WATINGINBOUND_CNT = ref(encrypt("0"))
const EXCHANGE_INBOUNDINSPECTION_CNT = ref(encrypt("0"))
const EXCHANGE_INBOUND_CNT = ref(encrypt("0"))

const Inspection_QTY = ref("0")

const Return_QTY = ref("0")

const SelectReturnData = ref({
  RET_SID : '',
  RET_BRAND_CODE : '',
  RET_BRAND_FNAME : '',
  RET_CHANNEL_CODE : '',
  RET_CHANNEL_FNAME : '',
  RET_ID : '',
  RET_STATUS_CODE : '',
  RET_STATUS_FNAME : '',
  RET_SUBSTATUS_CODE : '',
  RET_SUBSTATUS_FNAME : '',
  RET_DATETIME : '',
  RET_TYPE_CODE : '',
  RET_TYPE_FNAME : '',
  RET_REASON_CODE : '',
  RET_REASON_FNAME : '',
  RET_SEND_NAME_M : '',
  RET_SEND_TEL_M : '',
  RET_SEND_MOBILE_M : '',
  RET_SEND_ADDR_1 : '',
  RETX_PICKUP_REQ_DATE : '',
  RETX_PICKUP_REQ_TIME : '',
  RET_PICKUP_CURRIOR_CODE : '',
  RET_PICKUP_CURRIOR_FNAME : '',
  RET_PICKUP_TRACK_NO : '',
  RETX_PICKEDUP_DATE : '',
  RETX_PICKEDUP_TIME : '',  
  RET_ORD_ID : '',
  ORD_TYPE_CODE : '',
  ORD_TYPE_FNAME : '',
  ORD_DATETIME : '',
  ORD_STATUS_CODE : '',
  ORD_STATUS_FNAME : '',
  ORD_DELIVERY_SDATE : '',
  ORD_DELIVERY_CURRIOR_CODE : '',
  ORD_DELIVERY_CURRIOR_FNAME : '',
  ORD_DELIVERY_TRACK_NO : '',
  ORD_DELIVERY_EDATE : '',
})

const ReturnRequestData = ref({
  FLT_RET_SID : '',
  FLT_RETURN_TYPE : '',
  FLT_RET_WH_CODE : '',
  FLT_RET_WH_NAME : '',
  FLT_RET_STAFF_SID : '',
  FLT_RET_STAFF_NAME : '',
})

/* Dialog Modal */
const openDialogModal = ref(false)
const openReturnModal = ref(false)
const openRequestReturnModal = ref(false)
const openUnverifiedReturnModal = ref(false)

const DIALOG_TYPE = ref("")
const DIALOG_TITLE = ref("")
const DIALOG_TEXT = ref("")

////////////////////////////////

watch(() => Station, async (value) => {
  if (value) {

    const selectedChannel = StationList.value.find((Stations) => decrypt(Stations.USER_SID) === value?.value.value)

    STATION_WH_FNAME.value = decrypt(selectedChannel.STATION_WH_FNAME)
    STATION_WH_CODE.value = decrypt(selectedChannel.STATION_WH_CODE)
  }
}, { deep: true })

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  
  await pageLoader.fetchPageLoadData(currentTab.value?.component)
  await ReturnInspection.fetchStationList()
  await ReturnInspection.fetchWorkStaffList()
  await fetchInspectionStatusReload()

  Station.value = {
    name: decrypt(StationList.value[0].STATION_ID) || '',
    value: decrypt(StationList.value[0].USER_SID) || '',
  };

  WorkStaff.value = {
    name: WorkStaffList.value[0] ? decrypt(WorkStaffList.value[0].STAFF_NAME) : '',
    value: WorkStaffList.value[0] ? decrypt(WorkStaffList.value[0].STAFF_SID) : '',
  }; 

  ReturnData.value = {
    name: '',
    value: '',
    type: '',
  }

  isloading.isLoading = false
  togglePageLoading()
})

const fetchInspectionStatusReload = async () => {
  toggleLoading()
  isloading.isLoading = true
  await ReturnInspection.fetchReturnInspectionStatusList()

  RETURN_LIST_CNT.value = returnInspectionStatusList.value.find(item => item.RET_INSP_STATUS_NO === encrypt('R_1'))?.RET_INSP_STATUS_VALUE || encrypt(0);
  RETURN_REQ_CANCEL_CNT.value = returnInspectionStatusList.value.find(item => item.RET_INSP_STATUS_NO === encrypt('R_2'))?.RET_INSP_STATUS_VALUE || encrypt(0);
  RETURN_HOLD_BY_ESM_CNT.value = returnInspectionStatusList.value.find(item => item.RET_INSP_STATUS_NO === encrypt('R_3'))?.RET_INSP_STATUS_VALUE || encrypt(0);
  RETURN_WATINGINBOUND_CNT.value = returnInspectionStatusList.value.find(item => item.RET_INSP_STATUS_NO === encrypt('R_4'))?.RET_INSP_STATUS_VALUE || encrypt(0);
  RETURN_INBOUNDINSPECTION_CNT.value = returnInspectionStatusList.value.find(item => item.RET_INSP_STATUS_NO === encrypt('R_5'))?.RET_INSP_STATUS_VALUE || encrypt(0);
  RETURN_INBOUND_CNT.value = returnInspectionStatusList.value.find(item => item.RET_INSP_STATUS_NO === encrypt('R_6'))?.RET_INSP_STATUS_VALUE || encrypt(0);
  
  EXCHANGE_LIST_CNT.value = returnInspectionStatusList.value.find(item => item.RET_INSP_STATUS_NO === encrypt('E_1'))?.RET_INSP_STATUS_VALUE || encrypt(0);
  EXCHANGE_REQ_CANCEL_CNT.value = returnInspectionStatusList.value.find(item => item.RET_INSP_STATUS_NO === encrypt('E_2'))?.RET_INSP_STATUS_VALUE || encrypt(0);
  EXCHANGE_HOLD_BY_ESM_CNT.value = returnInspectionStatusList.value.find(item => item.RET_INSP_STATUS_NO === encrypt('E_3'))?.RET_INSP_STATUS_VALUE || encrypt(0);
  EXCHANGE_WATINGINBOUND_CNT.value = returnInspectionStatusList.value.find(item => item.RET_INSP_STATUS_NO === encrypt('E_4'))?.RET_INSP_STATUS_VALUE || encrypt(0);
  EXCHANGE_INBOUNDINSPECTION_CNT.value = returnInspectionStatusList.value.find(item => item.RET_INSP_STATUS_NO === encrypt('E_5'))?.RET_INSP_STATUS_VALUE || encrypt(0);
  EXCHANGE_INBOUND_CNT.value = returnInspectionStatusList.value.find(item => item.RET_INSP_STATUS_NO === encrypt('E_6'))?.RET_INSP_STATUS_VALUE || encrypt(0);

  const { success,data } = await ReturnInspection.fetchReturnInspectionList({
    FLT_RETURN_SID : '',
    FLT_RETURN_TYPE : '',
    FLT_KEY_WORD : '',
  })
  
  if (success)
  {
    returnInspectionList.value = data
  }

  isloading.isLoading = false
  toggleLoading()
}

watch(() => ReturnData, async (value) => {
  if (value) {
    const selectedReturn = returnInspectionList.value.find((Return) => decrypt(Return.RET_SID) === value?.value.value && decrypt(Return.RET_TYPE_CODE) === value?.value.type )
    
    if(selectedReturn)
    {
      SelectReturnData.value.RET_SID = selectedReturn ? decrypt(selectedReturn?.RET_SID) : ''
      SelectReturnData.value.RET_BRAND_CODE = selectedReturn ? decrypt(selectedReturn?.RET_BRAND_CODE) : ''
      SelectReturnData.value.RET_BRAND_FNAME = selectedReturn ? decrypt(selectedReturn?.RET_BRAND_FNAME) : ''
      SelectReturnData.value.RET_CHANNEL_CODE = selectedReturn ? decrypt(selectedReturn?.RET_CHANNEL_CODE) : ''
      SelectReturnData.value.RET_CHANNEL_FNAME = selectedReturn ? decrypt(selectedReturn?.RET_CHANNEL_FNAME) : ''
      SelectReturnData.value.RET_ID = selectedReturn ? decrypt(selectedReturn?.RET_ID) : ''
      SelectReturnData.value.RET_STATUS_CODE = selectedReturn ? decrypt(selectedReturn?.RET_STATUS_CODE) : ''
      SelectReturnData.value.RET_STATUS_FNAME = selectedReturn ? decrypt(selectedReturn?.RET_STATUS_FNAME) : ''
      SelectReturnData.value.RET_SUBSTATUS_CODE = selectedReturn ? decrypt(selectedReturn?.RET_SUBSTATUS_CODE) : ''
      SelectReturnData.value.RET_SUBSTATUS_FNAME = selectedReturn ? decrypt(selectedReturn?.RET_SUBSTATUS_FNAME) : ''
      SelectReturnData.value.RET_DATETIME = selectedReturn ? decrypt(selectedReturn?.RET_DATETIME) : ''
      SelectReturnData.value.RET_TYPE_CODE = selectedReturn ? decrypt(selectedReturn?.RET_TYPE_CODE) : ''
      SelectReturnData.value.RET_TYPE_FNAME = selectedReturn ? decrypt(selectedReturn?.RET_TYPE_FNAME) : ''
      SelectReturnData.value.RET_REASON_CODE = selectedReturn ? decrypt(selectedReturn?.RET_REASON_CODE) : ''      
      SelectReturnData.value.RET_REASON_FNAME = selectedReturn ? decrypt(selectedReturn?.RET_REASON_FNAME) : ''
      SelectReturnData.value.RET_SEND_NAME_M = selectedReturn ? decrypt(selectedReturn?.RET_SEND_NAME_M) : ''
      SelectReturnData.value.RET_SEND_TEL_M = selectedReturn ? decrypt(selectedReturn?.RET_SEND_TEL_M) : ''
      SelectReturnData.value.RET_SEND_MOBILE_M = selectedReturn ? decrypt(selectedReturn?.RET_SEND_MOBILE_M) : ''
      SelectReturnData.value.RET_SEND_ADDR_1 = selectedReturn ? decrypt(selectedReturn?.RET_SEND_ADDR_1) : ''

      SelectReturnData.value.RETX_PICKUP_REQ_DATE = selectedReturn ? decrypt(selectedReturn?.RETX_PICKUP_REQ_DATE) : ''    
      SelectReturnData.value.RET_PICKUP_CURRIOR_FNAME = selectedReturn ? decrypt(selectedReturn?.RET_PICKUP_CURRIOR_FNAME) : ''     
      SelectReturnData.value.RET_PICKUP_TRACK_NO = selectedReturn ? decrypt(selectedReturn?.RET_PICKUP_TRACK_NO) : '' 
      PICKUP_TRACKING_NO.value = SelectReturnData.value.RET_PICKUP_TRACK_NO
      SelectReturnData.value.RETX_PICKEDUP_DATE = selectedReturn ? decrypt(selectedReturn?.RETX_PICKEDUP_DATE) : ''    

      SelectReturnData.value.RET_ORD_ID = selectedReturn ? decrypt(selectedReturn?.RET_ORD_ID) : ''
      SelectReturnData.value.ORD_TYPE_FNAME = selectedReturn ? decrypt(selectedReturn?.ORD_TYPE_FNAME) : ''
      SelectReturnData.value.ORD_DATETIME = selectedReturn ? decrypt(selectedReturn?.ORD_DATETIME) : ''
      SelectReturnData.value.ORD_STATUS_FNAME = selectedReturn ? decrypt(selectedReturn?.ORD_STATUS_FNAME) : ''
      
      SelectReturnData.value.ORD_DELIVERY_SDATE = selectedReturn ? decrypt(selectedReturn?.ORD_DELIVERY_SDATE) : ''
      SelectReturnData.value.ORD_DELIVERY_CURRIOR_FNAME = selectedReturn ? decrypt(selectedReturn?.ORD_DELIVERY_CURRIOR_FNAME) : ''
      SelectReturnData.value.ORD_DELIVERY_TRACK_NO  = selectedReturn ? decrypt(selectedReturn?.ORD_DELIVERY_TRACK_NO ) : ''
      SelectReturnData.value.ORD_DELIVERY_EDATE = selectedReturn ? decrypt(selectedReturn?.ORD_DELIVERY_EDATE) : ''

      await ReturnInspection.fetchReturnInspectionItemInputGet({
        FLT_RETURN_SID : SelectReturnData.value.RET_SID,
        FLT_RETURN_TYPE : SelectReturnData.value.RET_TYPE_CODE
      })
      fetchReturnInspectionOperationNote()
      

    }    
  }
}, { deep: true })

watch(() => ReturnInspectionItemList, async (value) => {
  if (value) {
    let InspectionQTY = 0
    let ReturnQTY = 0
    for (let i = 0; i < value.value.length; i++) 
    {
      ReturnQTY = ReturnQTY + Number(decrypt(value.value[i].RETURN_INSPECTION_ITEM_QTY))
      InspectionQTY = InspectionQTY + Number(decrypt(value.value[i].RETURN_INPUT_QTY))
    }
    Inspection_QTY.value = InspectionQTY.toString()
    Return_QTY.value = ReturnQTY.toString()
    
    REQ_CONFIRM.value = value.value.some(item => decrypt(item.RETURN_INPUT_QTY) === '0' || decrypt(item.RETURN_INSPECTION_ITEM_QTY) !== decrypt(item.RETURN_INPUT_QTY))
  }
}, { deep: true })

const onBarcodeEnter = async () => {
  
  if(Barcode.value != '')
  {    
    toggleLoading()
    isloading.isLoading = true
    const { success,data } = await ReturnInspection.fetchReturnInspectionList({
      FLT_RETURN_SID : '',
      FLT_RETURN_TYPE : '',
      FLT_KEY_WORD : Barcode.value,
    })

    if (success)
    {
      if (data.length == 1)
      {
        SelectReturnData.value.RET_SID = data[0].RET_SID ? decrypt(data[0]?.RET_SID) : ''
        SelectReturnData.value.RET_BRAND_CODE = data[0].RET_BRAND_CODE ? decrypt(data[0]?.RET_BRAND_CODE) : ''
        SelectReturnData.value.RET_BRAND_FNAME = data[0].RET_BRAND_FNAME ? decrypt(data[0]?.RET_BRAND_FNAME) : ''
        SelectReturnData.value.RET_CHANNEL_CODE = data[0].RET_CHANNEL_CODE ? decrypt(data[0]?.RET_CHANNEL_CODE) : ''
        SelectReturnData.value.RET_CHANNEL_FNAME = data[0].RET_CHANNEL_FNAME ? decrypt(data[0]?.RET_CHANNEL_FNAME) : ''
        SelectReturnData.value.RET_ID = data[0].RET_ID ? decrypt(data[0]?.RET_ID) : ''
        SelectReturnData.value.RET_STATUS_CODE = data[0].RET_STATUS_CODE ? decrypt(data[0]?.RET_STATUS_CODE) : ''
        SelectReturnData.value.RET_STATUS_FNAME = data[0].RET_STATUS_FNAME ? decrypt(data[0]?.RET_STATUS_FNAME) : ''
        SelectReturnData.value.RET_SUBSTATUS_CODE = data[0].RET_SUBSTATUS_CODE ? decrypt(data[0]?.RET_SUBSTATUS_CODE) : ''
        SelectReturnData.value.RET_SUBSTATUS_FNAME = data[0].RET_SUBSTATUS_FNAME ? decrypt(data[0]?.RET_SUBSTATUS_FNAME) : ''
        SelectReturnData.value.RET_DATETIME = data[0].RET_DATETIME ? decrypt(data[0]?.RET_DATETIME) : ''
        SelectReturnData.value.RET_TYPE_CODE = data[0].RET_TYPE_CODE ? decrypt(data[0]?.RET_TYPE_CODE) : ''
        SelectReturnData.value.RET_TYPE_FNAME = data[0].RET_TYPE_FNAME ? decrypt(data[0]?.RET_TYPE_FNAME) : ''
        SelectReturnData.value.RET_REASON_CODE = data[0].RET_REASON_CODE ? decrypt(data[0]?.RET_REASON_CODE) : ''      
        SelectReturnData.value.RET_REASON_FNAME = data[0].RET_REASON_FNAME ? decrypt(data[0]?.RET_REASON_FNAME) : ''
        SelectReturnData.value.RET_SEND_NAME_M = data[0].RET_SEND_NAME_M ? decrypt(data[0]?.RET_SEND_NAME_M) : ''
        SelectReturnData.value.RET_SEND_TEL_M = data[0].RET_SEND_TEL_M ? decrypt(data[0]?.RET_SEND_TEL_M) : ''
        SelectReturnData.value.RET_SEND_MOBILE_M = data[0].RET_SEND_MOBILE_M ? decrypt(data[0]?.RET_SEND_MOBILE_M) : ''
        SelectReturnData.value.RET_SEND_ADDR_1 = data[0].RET_SEND_ADDR_1 ? decrypt(data[0]?.RET_SEND_ADDR_1) : ''

        SelectReturnData.value.RETX_PICKUP_REQ_DATE = data[0].RETX_PICKUP_REQ_DATE ? decrypt(data[0]?.RETX_PICKUP_REQ_DATE) : ''    
        SelectReturnData.value.RET_PICKUP_CURRIOR_FNAME = data[0].RET_PICKUP_CURRIOR_FNAME ? decrypt(data[0]?.RET_PICKUP_CURRIOR_FNAME) : ''     
        SelectReturnData.value.RET_PICKUP_TRACK_NO = data[0].RET_PICKUP_TRACK_NO ? decrypt(data[0]?.RET_PICKUP_TRACK_NO) : ''
        PICKUP_TRACKING_NO.value = SelectReturnData.value.RET_PICKUP_TRACK_NO   
        SelectReturnData.value.RETX_PICKEDUP_DATE = data[0].RETX_PICKEDUP_DATE ? decrypt(data[0]?.RETX_PICKEDUP_DATE) : ''    

        SelectReturnData.value.RET_ORD_ID = data[0].RET_ORD_ID ? decrypt(data[0]?.RET_ORD_ID) : ''
        SelectReturnData.value.ORD_TYPE_FNAME = data[0].ORD_TYPE_FNAME ? decrypt(data[0]?.ORD_TYPE_FNAME) : ''
        SelectReturnData.value.ORD_DATETIME = data[0].ORD_DATETIME ? decrypt(data[0]?.ORD_DATETIME) : ''
        SelectReturnData.value.ORD_STATUS_FNAME = data[0].ORD_STATUS_FNAME ? decrypt(data[0]?.ORD_STATUS_FNAME) : ''
        
        SelectReturnData.value.ORD_DELIVERY_SDATE = data[0].ORD_DELIVERY_SDATE ? decrypt(data[0]?.ORD_DELIVERY_SDATE) : ''
        SelectReturnData.value.ORD_DELIVERY_CURRIOR_FNAME = data[0].ORD_DELIVERY_CURRIOR_FNAME ? decrypt(data[0]?.ORD_DELIVERY_CURRIOR_FNAME) : ''
        SelectReturnData.value.ORD_DELIVERY_TRACK_NO  = data[0].ORD_DELIVERY_TRACK_NO ? decrypt(data[0]?.ORD_DELIVERY_TRACK_NO ) : ''
        SelectReturnData.value.ORD_DELIVERY_EDATE = data[0].ORD_DELIVERY_EDATE ? decrypt(data[0]?.ORD_DELIVERY_EDATE) : ''

        await ReturnInspection.fetchReturnInspectionItemInputGet({
          FLT_RETURN_SID : SelectReturnData.value.RET_SID,
          FLT_RETURN_TYPE : SelectReturnData.value.RET_TYPE_CODE
        })
        fetchReturnInspectionOperationNote()

      }
      else if (data.length > 1)
      {          
        ReturnInspection.SetReturnListData(data)
        openReturnModal.value = true
      }
      
    }    

    isloading.isLoading = false
    toggleLoading()
  }
}

const onRowDoubleClick = async (data) => {

  SelectReturnData.value.RET_SID = data.RET_SID ? decrypt(data?.RET_SID) : ''
  SelectReturnData.value.RET_BRAND_CODE = data.RET_BRAND_CODE ? decrypt(data?.RET_BRAND_CODE) : ''
  SelectReturnData.value.RET_BRAND_FNAME = data.RET_BRAND_FNAME ? decrypt(data?.RET_BRAND_FNAME) : ''
  SelectReturnData.value.RET_CHANNEL_CODE = data.RET_CHANNEL_CODE ? decrypt(data?.RET_CHANNEL_CODE) : ''
  SelectReturnData.value.RET_CHANNEL_FNAME = data.RET_CHANNEL_FNAME ? decrypt(data?.RET_CHANNEL_FNAME) : ''
  SelectReturnData.value.RET_ID = data.RET_ID ? decrypt(data?.RET_ID) : ''
  SelectReturnData.value.RET_STATUS_CODE = data.RET_STATUS_CODE ? decrypt(data?.RET_STATUS_CODE) : ''
  SelectReturnData.value.RET_STATUS_FNAME = data.RET_STATUS_FNAME ? decrypt(data?.RET_STATUS_FNAME) : ''
  SelectReturnData.value.RET_SUBSTATUS_CODE = data.RET_SUBSTATUS_CODE ? decrypt(data?.RET_SUBSTATUS_CODE) : ''
  SelectReturnData.value.RET_SUBSTATUS_FNAME = data.RET_SUBSTATUS_FNAME ? decrypt(data?.RET_SUBSTATUS_FNAME) : ''
  SelectReturnData.value.RET_DATETIME = data.RET_DATETIME ? decrypt(data?.RET_DATETIME) : ''
  SelectReturnData.value.RET_TYPE_CODE = data.RET_TYPE_CODE ? decrypt(data?.RET_TYPE_CODE) : ''
  SelectReturnData.value.RET_TYPE_FNAME = data.RET_TYPE_FNAME ? decrypt(data?.RET_TYPE_FNAME) : ''
  SelectReturnData.value.RET_REASON_CODE = data.RET_REASON_CODE ? decrypt(data?.RET_REASON_CODE) : ''      
  SelectReturnData.value.RET_REASON_FNAME = data.RET_REASON_FNAME ? decrypt(data?.RET_REASON_FNAME) : ''
  SelectReturnData.value.RET_SEND_NAME_M = data.RET_SEND_NAME_M ? decrypt(data?.RET_SEND_NAME_M) : ''
  SelectReturnData.value.RET_SEND_TEL_M = data.RET_SEND_TEL_M ? decrypt(data?.RET_SEND_TEL_M) : ''
  SelectReturnData.value.RET_SEND_MOBILE_M = data.RET_SEND_MOBILE_M ? decrypt(data?.RET_SEND_MOBILE_M) : ''
  SelectReturnData.value.RET_SEND_ADDR_1 = data.RET_SEND_ADDR_1 ? decrypt(data?.RET_SEND_ADDR_1) : ''

  SelectReturnData.value.RETX_PICKUP_REQ_DATE = data.RETX_PICKUP_REQ_DATE ? decrypt(data?.RETX_PICKUP_REQ_DATE) : ''    
  SelectReturnData.value.RET_PICKUP_CURRIOR_FNAME = data.RET_PICKUP_CURRIOR_FNAME ? decrypt(data?.RET_PICKUP_CURRIOR_FNAME) : ''     
  SelectReturnData.value.RET_PICKUP_TRACK_NO = data.RET_PICKUP_TRACK_NO ? decrypt(data?.RET_PICKUP_TRACK_NO) : '' 
  PICKUP_TRACKING_NO.value = SelectReturnData.value.RET_PICKUP_TRACK_NO  
  SelectReturnData.value.RETX_PICKEDUP_DATE = data.RETX_PICKEDUP_DATE ? decrypt(data?.RETX_PICKEDUP_DATE) : ''    

  SelectReturnData.value.RET_ORD_ID = data.RET_ORD_ID ? decrypt(data?.RET_ORD_ID) : ''
  SelectReturnData.value.ORD_TYPE_FNAME = data.ORD_TYPE_FNAME ? decrypt(data?.ORD_TYPE_FNAME) : ''
  SelectReturnData.value.ORD_DATETIME = data.ORD_DATETIME ? decrypt(data?.ORD_DATETIME) : ''
  SelectReturnData.value.ORD_STATUS_FNAME = data.ORD_STATUS_FNAME ? decrypt(data?.ORD_STATUS_FNAME) : ''
        
  SelectReturnData.value.ORD_DELIVERY_SDATE = data.ORD_DELIVERY_SDATE ? decrypt(data?.ORD_DELIVERY_SDATE) : ''
  SelectReturnData.value.ORD_DELIVERY_CURRIOR_FNAME = data.ORD_DELIVERY_CURRIOR_FNAME ? decrypt(data?.ORD_DELIVERY_CURRIOR_FNAME) : ''
  SelectReturnData.value.ORD_DELIVERY_TRACK_NO  = data.ORD_DELIVERY_TRACK_NO ? decrypt(data?.ORD_DELIVERY_TRACK_NO ) : ''
  SelectReturnData.value.ORD_DELIVERY_EDATE = data.ORD_DELIVERY_EDATE ? decrypt(data?.ORD_DELIVERY_EDATE) : ''
  
  await ReturnInspection.fetchReturnInspectionItemInputGet({
    FLT_RETURN_SID : SelectReturnData.value.RET_SID,
    FLT_RETURN_TYPE : SelectReturnData.value.RET_TYPE_CODE
  })
  fetchReturnInspectionOperationNote()

  openReturnModal.value = false
}

const onSKUEnter = async () => {
  
  if(SelectReturnData.value.RET_STATUS_CODE == '30')
  {
    toggleLoading()
    isloading.isLoading = true
    const INPUT_SET_DATA = {
      FLT_RETURN_SID: SelectReturnData.value.RET_SID,  
      FLT_RETURN_TYPE: SelectReturnData.value.RET_TYPE_CODE,   
    }

    const { success } = await ReturnInspection.fetchReturnInspectionItemInputSet(INPUT_SET_DATA)

    if(success)
    {
      const STATUS_DATA = {
        FLT_TO_STATUS_CODE: "31",  
        FLT_RETURN_SID: SelectReturnData.value.RET_SID,  
        FLT_RETURN_TYPE: SelectReturnData.value.RET_TYPE_CODE, 
      }

      const { success } = await ReturnInspection.fetchReturnInspectionStatusChange(STATUS_DATA)

      if(success) ReturnReSearch()
      isloading.isLoading = false
      toggleLoading()
        
    }
    else
    {
      isloading.isLoading = false
      toggleLoading()
      return
    }
      
  }

  toggleLoading()
  isloading.isLoading = true
  const INPUT_ADD_DATA = {
    FLT_RETURN_SID: SelectReturnData.value.RET_SID,
    FLT_RETURN_TYPE: SelectReturnData.value.RET_TYPE_CODE,
    FLT_ITEM_CODE: SKU_DATA.value,
    FLT_INPUT_TYPE_CODE: '0020',
    FLT_STAFF_SID: WorkStaff.value?.value ?? '',
    FLT_QAVIEW_ID: '0',
  }
      
  await ReturnInspection.fetchReturnInspectionItemInputADDSet(INPUT_ADD_DATA)
  isloading.isLoading = false
  toggleLoading()

  SKU_DATA.value = ''
}

const ReturnReSearch = async () => {  
 
    toggleLoading()
    isloading.isLoading = true
    const { success,data } = await ReturnInspection.fetchReturnInspectionList({
      FLT_RETURN_SID : SelectReturnData.value.RET_SID,
      FLT_RETURN_TYPE : SelectReturnData.value.RET_TYPE_CODE,
      FLT_KEY_WORD : '',
    })

    if (success)
    {
      if (data.length == 1)
      {
        SelectReturnData.value.RET_SID = data[0].RET_SID ? decrypt(data[0]?.RET_SID) : ''
        SelectReturnData.value.RET_BRAND_CODE = data[0].RET_BRAND_CODE ? decrypt(data[0]?.RET_BRAND_CODE) : ''
        SelectReturnData.value.RET_BRAND_FNAME = data[0].RET_BRAND_FNAME ? decrypt(data[0]?.RET_BRAND_FNAME) : ''
        SelectReturnData.value.RET_CHANNEL_CODE = data[0].RET_CHANNEL_CODE ? decrypt(data[0]?.RET_CHANNEL_CODE) : ''
        SelectReturnData.value.RET_CHANNEL_FNAME = data[0].RET_CHANNEL_FNAME ? decrypt(data[0]?.RET_CHANNEL_FNAME) : ''
        SelectReturnData.value.RET_ID = data[0].RET_ID ? decrypt(data[0]?.RET_ID) : ''
        SelectReturnData.value.RET_STATUS_CODE = data[0].RET_STATUS_CODE ? decrypt(data[0]?.RET_STATUS_CODE) : ''
        SelectReturnData.value.RET_STATUS_FNAME = data[0].RET_STATUS_FNAME ? decrypt(data[0]?.RET_STATUS_FNAME) : ''
        SelectReturnData.value.RET_SUBSTATUS_CODE = data[0].RET_SUBSTATUS_CODE ? decrypt(data[0]?.RET_SUBSTATUS_CODE) : ''
        SelectReturnData.value.RET_SUBSTATUS_FNAME = data[0].RET_SUBSTATUS_FNAME ? decrypt(data[0]?.RET_SUBSTATUS_FNAME) : ''
        SelectReturnData.value.RET_DATETIME = data[0].RET_DATETIME ? decrypt(data[0]?.RET_DATETIME) : ''
        SelectReturnData.value.RET_TYPE_CODE = data[0].RET_TYPE_CODE ? decrypt(data[0]?.RET_TYPE_CODE) : ''
        SelectReturnData.value.RET_TYPE_FNAME = data[0].RET_TYPE_FNAME ? decrypt(data[0]?.RET_TYPE_FNAME) : ''
        SelectReturnData.value.RET_REASON_CODE = data[0].RET_REASON_CODE ? decrypt(data[0]?.RET_REASON_CODE) : ''      
        SelectReturnData.value.RET_REASON_FNAME = data[0].RET_REASON_FNAME ? decrypt(data[0]?.RET_REASON_FNAME) : ''
        SelectReturnData.value.RET_SEND_NAME_M = data[0].RET_SEND_NAME_M ? decrypt(data[0]?.RET_SEND_NAME_M) : ''
        SelectReturnData.value.RET_SEND_TEL_M = data[0].RET_SEND_TEL_M ? decrypt(data[0]?.RET_SEND_TEL_M) : ''
        SelectReturnData.value.RET_SEND_MOBILE_M = data[0].RET_SEND_MOBILE_M ? decrypt(data[0]?.RET_SEND_MOBILE_M) : ''
        SelectReturnData.value.RET_SEND_ADDR_1 = data[0].RET_SEND_ADDR_1 ? decrypt(data[0]?.RET_SEND_ADDR_1) : ''

        SelectReturnData.value.RETX_PICKUP_REQ_DATE = data[0].RETX_PICKUP_REQ_DATE ? decrypt(data[0]?.RETX_PICKUP_REQ_DATE) : ''    
        SelectReturnData.value.RET_PICKUP_CURRIOR_FNAME = data[0].RET_PICKUP_CURRIOR_FNAME ? decrypt(data[0]?.RET_PICKUP_CURRIOR_FNAME) : ''     
        SelectReturnData.value.RET_PICKUP_TRACK_NO = data[0].RET_PICKUP_TRACK_NO ? decrypt(data[0]?.RET_PICKUP_TRACK_NO) : ''   
        PICKUP_TRACKING_NO.value = SelectReturnData.value.RET_PICKUP_TRACK_NO
        SelectReturnData.value.RETX_PICKEDUP_DATE = data[0].RETX_PICKEDUP_DATE ? decrypt(data[0]?.RETX_PICKEDUP_DATE) : ''    

        SelectReturnData.value.RET_ORD_ID = data[0].RET_ORD_ID ? decrypt(data[0]?.RET_ORD_ID) : ''
        SelectReturnData.value.ORD_TYPE_FNAME = data[0].ORD_TYPE_FNAME ? decrypt(data[0]?.ORD_TYPE_FNAME) : ''
        SelectReturnData.value.ORD_DATETIME = data[0].ORD_DATETIME ? decrypt(data[0]?.ORD_DATETIME) : ''
        SelectReturnData.value.ORD_STATUS_FNAME = data[0].ORD_STATUS_FNAME ? decrypt(data[0]?.ORD_STATUS_FNAME) : ''
        
        SelectReturnData.value.ORD_DELIVERY_SDATE = data[0].ORD_DELIVERY_SDATE ? decrypt(data[0]?.ORD_DELIVERY_SDATE) : ''
        SelectReturnData.value.ORD_DELIVERY_CURRIOR_FNAME = data[0].ORD_DELIVERY_CURRIOR_FNAME ? decrypt(data[0]?.ORD_DELIVERY_CURRIOR_FNAME) : ''
        SelectReturnData.value.ORD_DELIVERY_TRACK_NO  = data[0].ORD_DELIVERY_TRACK_NO ? decrypt(data[0]?.ORD_DELIVERY_TRACK_NO ) : ''
        SelectReturnData.value.ORD_DELIVERY_EDATE = data[0].ORD_DELIVERY_EDATE ? decrypt(data[0]?.ORD_DELIVERY_EDATE) : ''

      }
      
    }    

    isloading.isLoading = false
    toggleLoading()
}

const CancelInspection = async () => {
  
  DIALOG_TYPE.value = 'CANCEL'
  DIALOG_TITLE.value = 'Cancel Inbound Inspection'
  DIALOG_TEXT.value = 'Are you sure you want to cancel the ongoing inbound inspection?'

  openDialogModal.value = true
}

const fetchClearReturnData = async () => {
  toggleLoading()
  isloading.isLoading = true
  SelectReturnData.value = {
    RET_SID : '',
    RET_BRAND_CODE : '',
    RET_BRAND_FNAME : '',
    RET_CHANNEL_CODE : '',
    RET_CHANNEL_FNAME : '',
    RET_ID : '',
    RET_STATUS_CODE : '',
    RET_STATUS_FNAME : '',
    RET_SUBSTATUS_CODE : '',
    RET_SUBSTATUS_FNAME : '',
    RET_DATETIME : '',
    RET_TYPE_CODE : '',
    RET_TYPE_FNAME : '',
    RET_REASON_CODE : '',
    RET_REASON_FNAME : '',
    RET_SEND_NAME_M : '',
    RET_SEND_TEL_M : '',
    RET_SEND_MOBILE_M : '',
    RET_SEND_ADDR_1 : '',
    RETX_PICKUP_REQ_DATE : '',
    RETX_PICKUP_REQ_TIME : '',
    RET_PICKUP_CURRIOR_CODE : '',
    RET_PICKUP_CURRIOR_FNAME : '',
    RET_PICKUP_TRACK_NO : '',
    RETX_PICKEDUP_DATE : '',
    RETX_PICKEDUP_TIME : '',  
    RET_ORD_ID : '',
    ORD_TYPE_CODE : '',
    ORD_TYPE_FNAME : '',
    ORD_DATETIME : '',
    ORD_STATUS_CODE : '',
    ORD_STATUS_FNAME : '',
    ORD_DELIVERY_SDATE : '',
    ORD_DELIVERY_CURRIOR_CODE : '',
    ORD_DELIVERY_CURRIOR_FNAME : '',
    ORD_DELIVERY_TRACK_NO : '',
    ORD_DELIVERY_EDATE : '',
  }

  PICKUP_TRACKING_NO.value = ''
  ReturnInspection.resetReturnItemInputGet()
  ReturnInspection.resetReturnInspectionOperationNote()
  
  ReturnData.value = {
    name: '',
    value: '',
    type: '',
  }

  SKU_DATA.value = ''

  fetchInspectionStatusReload()  
  isloading.isLoading = false
  toggleLoading()
}

const fetchResetReturnInputData = async () => {
  toggleLoading()
  isloading.isLoading = true
  const INPUT_DATA = {
    FLT_RETURN_SID: SelectReturnData.value.RET_SID,  
    FLT_RETURN_TYPE: SelectReturnData.value.RET_TYPE_CODE, 
  }

  await ReturnInspection.fetchReturnInspectionItemInputResetSet(INPUT_DATA)
  isloading.isLoading = false
  toggleLoading()
}

const fetchActionReturnInputData = async (data,Action) => {
  toggleLoading()
  isloading.isLoading = true
  const INPUT_DATA = {
    FLT_RETURN_SID: SelectReturnData.value.RET_SID,  
    FLT_RETURN_TYPE: SelectReturnData.value.RET_TYPE_CODE, 
    FLT_RETURN_INPUT_ITEM_SEQ: decrypt(data.RETURN_INSPECTION_ITEM_SEQ),
    FLT_RETURN_INPUT_ITEM_SEQ_LINE: decrypt(data.RETURN_INSPECTION_ITEM_SEQ_LINE),
    FLT_RETURN_INPUT_ITEM_CODE: decrypt(data.RETURN_INSPECTION_ITEM_CODE),
    FLT_ACTION_TYPE: Action,
    FLT_ITEM_CODE: SKU_DATA.value,
    FLT_INPUT_TYPE_CODE: '0020',
    FLT_STAFF_SID: WorkStaff.value?.value ?? '',
    FLT_QAVIEW_ID: '0',
  }

  await ReturnInspection.fetchReturnInspectionItemInputActionSet(INPUT_DATA)
  isloading.isLoading = false
  toggleLoading()
}

const updateReturnSubStatus = async (item) => {

  const INPUT_DATA = {
    FLT_TO_SUBSTATUS_CODE: item, 
    FLT_RETURN_SID: SelectReturnData.value.RET_SID,  
    FLT_RETURN_TYPE: SelectReturnData.value.RET_TYPE_CODE, 
  }
  toggleLoading()
  isloading.isLoading = true
  await ReturnInspection.fetchReturnInspectionSubStatusChange(INPUT_DATA)
  await ReturnReSearch()
  isloading.isLoading = false
  toggleLoading()
}

const ConfirmDialog = async () => {

  if(DIALOG_TYPE.value == 'CANCEL')
  {
    const INPUT_DATA = {
        FLT_RETURN_SID: SelectReturnData.value.RET_SID,  
        FLT_RETURN_TYPE: SelectReturnData.value.RET_TYPE_CODE, 
    }
    toggleLoading()
    isloading.isLoading = true
    const { success } = await ReturnInspection.fetchReturnInspectionItemInputClearSet(INPUT_DATA)
    if (success) {

      if (SelectReturnData.value.RET_TYPE_CODE !== "U")
      {
        const STATUS_DATA = {
          FLT_TO_STATUS_CODE: "30",  
          FLT_RETURN_SID: SelectReturnData.value.RET_SID,  
          FLT_RETURN_TYPE: SelectReturnData.value.RET_TYPE_CODE, 
        }

        const { success } = await ReturnInspection.fetchReturnInspectionStatusChange(STATUS_DATA)
      
        if (success) await fetchClearReturnData()   
      }
      else
      {
        await fetchClearReturnData()   
      }
             
    }
    isloading.isLoading = false

    toggleLoading()
  }
  else if(DIALOG_TYPE.value == 'SAVE')
  {
    const STATUS_DATA = ref({
      FLT_TO_STATUS_CODE: encrypt("40"),  
      FLT_RETURNS: [
        {"RET_SID":encrypt(SelectReturnData.value.RET_SID)}
      ],  
    })
    const { success } = await ReturnInspection.fetchReturnStatusChange(STATUS_DATA.value)
    
    if (success) await fetchClearReturnData()  
  }

  openDialogModal.value = false
}

const fetchReturnInspectionOperationNote = async () => {
  toggleLoading()
  isloading.isLoading = true
  await ReturnInspection.fetchReturnInspectionOperationNote({
    FLT_RETURN_SID : SelectReturnData.value.RET_SID,
    FLT_RETURN_TYPE : SelectReturnData.value.RET_TYPE_CODE
  })
  isloading.isLoading = false
  toggleLoading()
}

const addReturnInspectionOperationNote = async (note) => {
  toggleLoading()
  isloading.isLoading = true
  await ReturnInspection.addReturnInspectionOperationNote({
    FLT_RETURN_SID: SelectReturnData.value.RET_SID,
    FLT_RETURN_TYPE : SelectReturnData.value.RET_TYPE_CODE,
    FLT_NOTE: note,
  })
  await fetchReturnInspectionOperationNote()
  isloading.isLoading = false
  toggleLoading()
}

const ReturnRequest = async () => {  
 
    ReturnRequestData.value.FLT_RET_SID = SelectReturnData.value.RET_SID 
    ReturnRequestData.value.FLT_RETURN_TYPE = SelectReturnData.value.RET_TYPE_CODE
    ReturnRequestData.value.FLT_RET_WH_CODE = STATION_WH_CODE.value
    ReturnRequestData.value.FLT_RET_WH_NAME = STATION_WH_FNAME.value
    ReturnRequestData.value.FLT_RET_STAFF_SID = WorkStaff.value?.value ?? '',
    ReturnRequestData.value.FLT_RET_STAFF_NAME = WorkStaff.value?.name ?? '',

    openRequestReturnModal.value = true
}












const TrackingNoChange = async () => {
  
  const TRACKING_DATA = ref({
    FLT_TO_TRACKING_NO: SelectReturnData.value.RET_PICKUP_TRACK_NO,  
    FLT_RETURN_SID: SelectReturnData.value.RET_SID
  })
  toggleLoading()
  isloading.isLoading = true
  const { success } = await ReturnInspection.fetchReturnTrackingChangeSet(TRACKING_DATA.value)
  if (!success) {
    isloading.isLoading = false
    toggleLoading()
    return
  }
  ReturnReSearch()
  isloading.isLoading = false
  toggleLoading()
}

const onInbound = async () => {
  
  DIALOG_TYPE.value = 'SAVE'
  DIALOG_TITLE.value = 'Inbound Inspection Completed'
  DIALOG_TEXT.value = 'Are you sure you want to complete the ongoing inbound inspection?'

  openDialogModal.value = true
}

const InspectedItemTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU040300_GRD00001')
})

</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >    
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-3 space-y-3 gap-y-3"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-6"
    >    
      <template #header>
        <div class="grid grid-cols-4 gap-x-3">
          <FormGroup
            :label="getComponentData('EU040300_LBL00001', 'caption', 'Station ID')"
            label-id="EU040300_LBL00001"
            label-for="EU040300_CMB00001"
            label-width="w-1/4"
            input-width="w-3/4"
            horizontal
          >
            <FormSelect
              id="EU040300_CMB00001"
              v-model="Station"
              :options="StationList.map((item) => ({
                name: decrypt(item.STATION_ID),
                value: decrypt(item.USER_SID),
              }))"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('EU040300_LBL00002', 'caption', 'Warehouse')"
            label-id="EU040300_LBL00002"
            label-for="EU040300_TXT00001"
            label-width="w-1/4"
            input-width="w-3/4"
            horizontal
          >
            <FormTextInput
              id="EU040300_TXT00001"
              v-model="STATION_WH_FNAME"
              class="bg-gray-100"
              readonly
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('EU040300_LBL00003', 'caption', 'Inspection Staff')"
            label-id="EU040300_LBL00003"
            label-for="EU040300_CMB00002"
            label-width="w-1/4"
            input-width="w-3/4"
            horizontal
          >
            <FormSelect
              id="EU040300_CMB00002"
              v-model="WorkStaff"
              :options="WorkStaffList.map((item) => ({
                name: decrypt(item.STAFF_NAME),
                value: decrypt(item.STAFF_SID),
              }))"
            />
          </FormGroup>
          <div class="text-right">
            <Button
              v-tooltip="{
                content: 'Reload',
                placement: 'left',
                trigger: 'hover',
                distance: 10,
                delay: 100,
                popperClass: 'bg-black text-white rounded-md'
              }"
              class="w-10 py-2"
              rounded
              variant="white"
              border
              size="xs"
              @click="fetchInspectionStatusReload"
            >
              <ArrowPathIcon class="w-5 h-5" />
            </Button>
          </div>          
        </div> 
      </template>
      <div class="grid grid-cols-10 gap-x-2 gap-y-2">
        <button class="flex justify-between items-center isac-bg-gray text-white text-sm px-4 py-2 rounded-lg">
          Return List
          <span
            class="bg-white text-gray-700 rounded-lg px-2 py-0.5 text-sm font-semibold"
          >
            {{ decrypt(RETURN_LIST_CNT) }}
          </span>
        </button>
        <button class="flex justify-between items-center isac-bg-gray text-white text-sm px-4 py-2 rounded-lg">
          Request Cancel
          <span
            class="bg-white text-gray-700 rounded-lg px-2 py-0.5 text-sm font-semibold"
          >
            {{ decrypt(RETURN_REQ_CANCEL_CNT) }}
          </span>
        </button>   
        <button class="flex justify-between items-center isac-bg-gray text-white text-sm px-4 py-2 rounded-lg">
          Hold by ESM
          <span
            class="bg-white text-gray-700 rounded-lg px-2 py-0.5 text-sm font-semibold"
          >
            {{ decrypt(RETURN_HOLD_BY_ESM_CNT) }}
          </span>
        </button>   
        <div class="col-span-4" />
        <button class="flex justify-between items-center bg-gray-500 text-white text-sm px-4 py-2 rounded-lg">
          Exchange List
          <span
            class="bg-white text-gray-700 rounded-lg px-2 py-0.5 text-sm font-semibold"
          >
            {{ decrypt(EXCHANGE_LIST_CNT) }}
          </span>
        </button>
        <button class="flex justify-between items-center bg-gray-500 text-white text-sm px-4 py-2 rounded-lg">
          Request Cancel
          <span
            class="bg-white text-gray-700 rounded-lg px-2 py-0.5 text-sm font-semibold"
          >
            {{ decrypt(EXCHANGE_REQ_CANCEL_CNT) }}
          </span>
        </button>   
        <button class="flex justify-between items-center bg-gray-500 text-white text-sm px-4 py-2 rounded-lg">
          Hold by ESM
          <span
            class="bg-white text-gray-700 rounded-lg px-2 py-0.5 text-sm font-semibold"
          >
            {{ decrypt(EXCHANGE_HOLD_BY_ESM_CNT) }}
          </span>
        </button> 
        <button class="flex justify-between items-center bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg">
          Waiting Inbound
          <span
            class="isac-bg-gray text-white rounded-lg px-2 py-0.5 text-sm font-semibold"
          >
            {{ decrypt(RETURN_WATINGINBOUND_CNT) }}
          </span>
        </button>
        <button class="flex justify-between items-center bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg">
          Inbound Inspection
          <span
            class="isac-bg-gray text-white rounded-lg px-2 py-0.5 text-sm font-semibold"
          >
            {{ decrypt(RETURN_INBOUNDINSPECTION_CNT) }}
          </span>
        </button>
        <button class="flex justify-between items-center bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg">
          Inbound
          <span
            class="isac-bg-gray text-white rounded-lg px-2 py-0.5 text-sm font-semibold"
          >
            {{ decrypt(RETURN_INBOUND_CNT) }}
          </span>
        </button>             
        <div class="col-span-4" />
        <button class="flex justify-between items-center bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg">
          Waiting Inbound
          <span
            class="bg-gray-500 text-white rounded-lg px-2 py-0.5 text-sm font-semibold"
          >
            {{ decrypt(EXCHANGE_WATINGINBOUND_CNT) }}
          </span>
        </button>
        <button class="flex justify-between items-center bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg">
          Inbound Inspection
          <span
            class="bg-gray-500 text-white rounded-lg px-2 py-0.5 text-sm font-semibold"
          >
            {{ decrypt(EXCHANGE_INBOUNDINSPECTION_CNT) }}
          </span>
        </button>
        <button class="flex justify-between items-center bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg">
          Inbound
          <span
            class="bg-gray-500 text-white rounded-lg px-2 py-0.5 text-sm font-semibold"
          >
            {{ decrypt(EXCHANGE_INBOUND_CNT) }}
          </span>
        </button>     
      </div>
    </Card> 
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-1 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <p>
            {{ getComponentData('EU040300_LBL00004', 'caption', 'Inspection Information') }}
          </p>
          <Button
            v-tooltip="{
              content: 'Unverified Return Create',
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
            @click="openUnverifiedReturnModal = true"
          >
            <PlusIcon class="w-5 h-5" />
          </Button>
        </div>        
      </template>
      <div class="grid grid-cols-7 gap-x-2">
        <div class="col-span-6 space-y-3">
          <div class="grid grid-cols-5 gap-x-12">
            <div class="col-span-2 space-y-3">
              <Card
                divider
                shadow-size="none"
                card-header-class="px-3 py-3 space-y-3"
                class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
                card-body-class="p-2 space-y-3 bg-gray-50"
              >
                <FormGroup
                  :label="getComponentData('EU040300_LBL00005', 'caption', 'Barcode')"
                  label-id="EU040300_LBL00005"          
                  horizontal
                  label-width="w-1/6"
                  input-width="w-5/6"
                >
                  <FormTextInput
                    id="EU040300_TXT00002" 
                    v-model="Barcode"
                    style="font-size: 14px; height: 32px;" 
                    placeholder="Invoice No or Tracking No"
                    :disabled="SelectReturnData.RET_STATUS_CODE != '30' && SelectReturnData.RET_STATUS_CODE != ''" 
                    @keyup.enter="onBarcodeEnter"
                  />
                </FormGroup>          
              </Card> 
            </div>
            <div class="col-span-3 space-y-3">
              <Card
                divider
                shadow-size="none"
                card-header-class="px-3 py-3 space-y-3"
                card-body-class="p-2 space-y-3 bg-gray-0"
              >
                <FormGroup
                  :label="getComponentData('EU040300_LBL00006', 'caption', 'Delivery ID')"
                  label-id="EU040300_LBL00006"          
                  horizontal
                  label-width="w-1/12"
                  input-width="w-11/12"
                >
                  <FormSelect
                    id="EU040300_CMB00003"
                    v-model="ReturnData"
                    :options="returnInspectionList.map((item) => ({ 
                      value: decrypt(item.RET_SID), 
                      name: decrypt(item.RET_TYPE_FNAME).toUpperCase() + 
                        ' - ' + decrypt(item.RET_STATUS_FNAME) + 
                        ' / Return ID : ' + decrypt(item.RET_ID) +  
                        ' / Order ID : ' + decrypt(item.RET_ORD_ID) + 
                        ' / Name : ' + decrypt(item.RET_SEND_NAME_M) + 
                        ' / Mobile : ' + decrypt(item.RET_SEND_MOBILE_M),
                      type: decrypt(item.RET_TYPE_CODE), 
                    }))"
                    :disabled="SelectReturnData.RET_STATUS_CODE != '30' && SelectReturnData.RET_STATUS_CODE != ''"
                  />
                </FormGroup>          
              </Card> 
            </div>
          </div>    
          <div class="grid grid-cols-5 gap-x-3 gap-y-3">            
            <div class="col-span-2">
              <Card
                divider
                shadow-size="none"
                card-header-class="px-3 py-2 space-y-1"
                class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
                card-body-class="p-2 space-y-3"
              >
                <template #header>                      
                  <p>
                    {{ getComponentData('EU040300_LBL00007', 'caption', 'Return Information') }}
                  </p>        
                </template>
                <div class="grid grid-cols-2 gap-x-3">
                  <div class="col-span-1 space-y-1">
                    <FormGroup
                      :label="getComponentData('EU040300_LBL00008', 'caption', 'Brand')"
                      label-id="EU040300_LBL00008"
                      horizontal
                      label-width="w-1/4"
                      input-width="w-3/4"
                    >
                      <FormTextInput
                        id="EU040300_TXT00003"
                        v-model="SelectReturnData.RET_BRAND_FNAME"
                        class="bg-gray-100"
                        readonly
                      />
                    </FormGroup>
                    <FormGroup
                      :label="getComponentData('EU040300_LBL00009', 'caption', 'Channel')"
                      label-id="EU040300_LBL00009"
                      horizontal
                      label-width="w-1/4"
                      input-width="w-3/4"
                    >
                      <FormTextInput
                        id="EU040300_TXT00004"
                        v-model="SelectReturnData.RET_CHANNEL_FNAME"
                        class="bg-gray-100"
                        readonly
                      />
                    </FormGroup>  
                      
                    <FormGroup
                      :label="getComponentData('EU040300_LBL00010', 'caption', 'Return ID')"
                      label-id="EU040300_LBL00010"
                      horizontal
                      label-width="w-1/4"
                      input-width="w-3/4"
                    >
                      <FormTextInput
                        id="EU040300_TXT00005"
                        v-model="SelectReturnData.RET_ID"
                        class="bg-gray-100"
                        readonly
                      />
                    </FormGroup>
                    <FormGroup
                      :label="getComponentData('EU040300_LBL00011', 'caption', 'Return Status')"
                      label-id="EU040300_LBL00011"
                      horizontal
                      label-width="w-1/4"
                      input-width="w-3/4"
                    >
                      <div class="flex items-center gap-x-2">
                        <FormTextInput
                          id="EU040300_TXT00006"
                          v-model="SelectReturnData.RET_STATUS_FNAME"
                          class="bg-gray-100"
                          readonly
                        />
                        <FormTextInput
                          id="EU040300_TXT00007"
                          v-model="SelectReturnData.RET_SUBSTATUS_FNAME"
                          class="bg-gray-100"
                          readonly
                        />
                      </div>                      
                    </FormGroup>
                    <FormGroup
                      :label="getComponentData('EU040300_LBL00012', 'caption', 'Return Req. Date')"
                      label-id="EU040300_LBL00012"
                      horizontal
                      label-width="w-1/4"
                      input-width="w-3/4"
                    >
                      <FormTextInput
                        id="EU040300_TXT00008"
                        v-model="SelectReturnData.RET_DATETIME"
                        class="bg-gray-100"
                        readonly
                      />
                    </FormGroup>
                  </div>
                  <div class="col-span-1 space-y-1"> 
                    <FormGroup
                      :label="getComponentData('EU040300_LBL00013', 'caption', 'Return Type')"
                      label-id="EU040300_LBL00013"
                      horizontal
                      label-width="w-1/4"
                      input-width="w-3/4"
                    >
                      <FormTextInput
                        id="EU040300_TXT00009"
                        v-model="SelectReturnData.RET_TYPE_FNAME"
                        class="bg-gray-100"
                        readonly
                      />
                    </FormGroup>
                    <FormGroup
                      :label="getComponentData('EU040300_LBL00014', 'caption', 'Return Reason')"
                      label-id="EU040300_LBL00014"
                      horizontal
                      label-width="w-1/4"
                      input-width="w-3/4"
                    >
                      <FormTextInput
                        id="EU040300_TXT00010"
                        v-model="SelectReturnData.RET_REASON_FNAME"
                        class="bg-gray-100"
                        readonly
                      />
                    </FormGroup>
                    <FormGroup
                      :label="getComponentData('EU040300_LBL00015', 'caption', 'Sender Name')"
                      label-id="EU040300_LBL00015"
                      horizontal
                      label-width="w-1/4"
                      input-width="w-3/4"
                    >
                      <FormTextInput
                        id="EU040300_TXT00011"
                        v-model="SelectReturnData.RET_SEND_NAME_M"
                        class="bg-gray-100"
                        readonly
                      />
                    </FormGroup>
                    <FormGroup
                      :label="getComponentData('EU040300_LBL00016', 'caption', 'Sender Mobile(Tel)')"
                      label-id="EU040300_LBL00016"
                      horizontal
                      label-width="w-1/4"
                      input-width="w-3/4"
                    >
                      <FormTextInput
                        id="EU040300_TXT00012"
                        v-model="SelectReturnData.RET_SEND_MOBILE_M"
                        class="bg-gray-100"
                        readonly
                      />
                    </FormGroup>
                    <FormGroup
                      :label="getComponentData('EU040300_LBL00017', 'caption', 'Sender Address')"
                      label-id="EU040300_LBL00017"
                      horizontal
                      label-width="w-1/4"
                      input-width="w-3/4"
                    >
                      <FormTextInput
                        id="EU040300_TXT00013"
                        v-model="SelectReturnData.RET_SEND_ADDR_1"
                        class="bg-gray-100"
                        readonly
                      />
                    </FormGroup>
                  </div>                      
                </div>
              </Card>
            </div>
            <Card
              divider
              shadow-size="none"
              card-header-class="px-3 py-2 space-y-1"
              class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
              card-body-class="p-2 space-y-1"
            >
              <template #header>                      
                <p>
                  {{ getComponentData('EU040300_LBL00018', 'caption', 'Return Pickup Information') }}
                </p>        
              </template>
              <FormGroup
                :label="getComponentData('EU040300_LBL00019', 'caption', 'Req. Pick-up Date')"
                label-id="EU040300_LBL00019"
                horizontal
                label-width="w-1/4"
                input-width="w-3/4"
              >
                <FormTextInput
                  id="EU040300_TXT00014"
                  v-model="SelectReturnData.RETX_PICKUP_REQ_DATE"
                  class="bg-gray-100"
                  readonly
                />
              </FormGroup>
              <FormGroup
                :label="getComponentData('EU040300_LBL00020', 'caption', 'Courier')"
                label-id="EU040300_LBL00020"
                horizontal                      
                label-width="w-1/4"
                input-width="w-3/4"
              >
                <FormTextInput
                  id="EU040300_TXT00015"
                  v-model="SelectReturnData.RET_PICKUP_CURRIOR_FNAME"
                  class="bg-gray-100"
                  readonly
                />
              </FormGroup>
              <FormGroup
                :label="getComponentData('EU040300_LBL00021', 'caption', 'Tracking No.')"
                label-id="EU040300_LBL00021"
                horizontal
                label-width="w-1/4"
                input-width="w-3/4"
              >
                <div class="flex items-center gap-x-2">
                  <FormTextInput
                    id="EU040300_TXT00016"
                    v-model="PICKUP_TRACKING_NO"    
                    :readonly="SelectReturnData.RET_SID === '' || SelectReturnData.RET_PICKUP_TRACK_NO != '' || SelectReturnData.RET_STATUS_CODE != '31'"                     
                  /> 
                  <Button
                    id="EU040300_BTN00001"
                    rounded
                    variant="gray"
                    :disabled="SelectReturnData.RET_SID === ''" 
                    @click="TrackingNoChange"
                  >
                    <VueFeather
                      type="plus"
                      class="h-5 w-5"
                    />
                  </Button>
                </div>                        
              </FormGroup>
              <FormGroup
                :label="getComponentData('EU040300_LBL00022', 'caption', 'Picked-up Date')"
                label-id="EU040300_LBL00022"
                horizontal
                label-width="w-1/4"
                input-width="w-3/4"
              >
                <FormTextInput
                  id="EU040300_TXT00017"
                  v-model="SelectReturnData.RETX_PICKEDUP_DATE"
                  class="bg-gray-100"
                  readonly
                />
              </FormGroup>            
            </Card>
            <Card
              divider
              shadow-size="none"
              card-header-class="px-3 py-2 space-y-1"
              class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
              card-body-class="p-2 space-y-1"
            >
              <template #header>                      
                <p>
                  {{ getComponentData('EU040300_LBL00023', 'caption', 'Order Information') }}
                </p>        
              </template>
              <FormGroup
                :label="getComponentData('EU040300_LBL00024', 'caption', 'Order ID')"
                label-id="EU040300_LBL00024"
                horizontal
                label-width="w-1/4"
                input-width="w-3/4"
              >
                <FormTextInput
                  id="EU040300_TXT00018"
                  v-model="SelectReturnData.RET_ORD_ID"
                  class="bg-gray-100"
                  readonly
                />
              </FormGroup>
              <FormGroup
                :label="getComponentData('EU040300_LBL00025', 'caption', 'Order Type')"
                label-id="EU040300_LBL00025"
                horizontal                      
                label-width="w-1/4"
                input-width="w-3/4"
              >
                <FormTextInput
                  id="EU040300_TXT00019"
                  v-model="SelectReturnData.ORD_TYPE_FNAME"
                  class="bg-gray-100"
                  readonly
                />
              </FormGroup>
              <FormGroup
                :label="getComponentData('EU040300_LBL00026', 'caption', 'Order Date')"
                label-id="EU040300_LBL00026"
                horizontal
                label-width="w-1/4"
                input-width="w-3/4"
              >
                <FormTextInput
                  id="EU040300_TXT00020"
                  v-model="SelectReturnData.ORD_DATETIME"
                  class="bg-gray-100"
                  readonly
                />
              </FormGroup>
              <FormGroup
                :label="getComponentData('EU040300_LBL00027', 'caption', 'Order Status')"
                label-id="EU040300_LBL00027"
                horizontal
                label-width="w-1/4"
                input-width="w-3/4"
              >
                <FormTextInput
                  id="EU040300_TXT00021"
                  v-model="SelectReturnData.ORD_STATUS_FNAME"
                  class="bg-gray-100"
                  readonly
                />
              </FormGroup>            
            </Card>
            <Card
              divider
              shadow-size="none"
              card-header-class="px-3 py-2 space-y-1"
              class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
              card-body-class="p-2 space-y-1"
            >
              <template #header>                      
                <p>
                  {{ getComponentData('EU040300_LBL00028', 'caption', 'Shipping Information') }}
                </p>        
              </template>
              <FormGroup
                :label="getComponentData('EU040300_LBL00029', 'caption', 'Delivery Date')"
                label-id="EU040300_LBL00029"
                horizontal
                label-width="w-1/4"
                input-width="w-3/4"
              >
                <FormTextInput
                  id="EU040300_TXT00022"
                  v-model="SelectReturnData.ORD_DELIVERY_SDATE"
                  class="bg-gray-100"
                  readonly
                />
              </FormGroup>
              <FormGroup
                :label="getComponentData('EU040300_LBL00030', 'caption', 'Courier')"
                label-id="EU040300_LBL00030"
                horizontal
                label-width="w-1/4"
                input-width="w-3/4"
              >
                <FormTextInput
                  id="EU040300_TXT00023"
                  v-model="SelectReturnData.ORD_DELIVERY_CURRIOR_FNAME"
                  class="bg-gray-100"
                  readonly
                />
              </FormGroup>
              <FormGroup
                :label="getComponentData('EU040300_LBL00031', 'caption', 'Tracking No.')"
                label-id="EU040300_LBL00031"
                horizontal
                label-width="w-1/4"
                input-width="w-3/4"
              >
                <FormTextInput
                  id="EU040300_TXT00024"
                  v-model="SelectReturnData.ORD_DELIVERY_TRACK_NO"
                  class="bg-gray-100"
                  readonly
                />
              </FormGroup>
              <FormGroup
                :label="getComponentData('EU040300_LBL00032', 'caption', 'Delivered Date')"
                label-id="EU040300_LBL00032"
                horizontal
                label-width="w-1/4"
                input-width="w-3/4"
              >
                <FormTextInput
                  id="EU040300_TXT00025"
                  v-model="SelectReturnData.ORD_DELIVERY_EDATE"
                  class="bg-gray-100"
                  readonly
                />
              </FormGroup>             
            </Card>
          </div> 
          <div class="grid grid-cols-2 gap-x-3 gap-y-3">
            <div class="flex space-x-6 items-center justify-start">
              <Button
                id="EU040300_BTN00002"
                rounded
                class="w-32"
                variant="gray"
                :loading="loading"
                :disabled="SelectReturnData.RET_SID === '' || SelectReturnData.RET_SUBSTATUS_CODE == '0075'" 
                @click="updateReturnSubStatus('0075')"
              >
                {{ getComponentData('EU040300_BTN00002', 'caption', 'Holding') }}
              </Button>  
              <Button
                id="EU040300_BTN00003"
                rounded
                class="w-36"
                variant="gray"
                :loading="loading"
                :disabled="SelectReturnData.RET_SID === '' || SelectReturnData.RET_SUBSTATUS_CODE != '0075'" 
                @click="updateReturnSubStatus('0274')"
              >
                {{ getComponentData('EU040300_BTN00003', 'caption', 'UnHold') }}
              </Button>  
            </div>  
            <div class="flex space-x-6 items-center justify-end">
              <Button
                id="EU040300_BTN00005"
                rounded
                variant="gray"
                :loading="loading"
                :disabled="SelectReturnData.RET_STATUS_CODE != '31' || REQ_CONFIRM" 
                @click="onInbound"
              >
                {{ getComponentData('EU040300_BTN00005', 'caption', 'Inspection Completed') }}
              </Button>
              <Button
                id="EU040300_BTN00005"
                rounded
                variant="gray"
                :loading="loading"
                :disabled="SelectReturnData.RET_STATUS_CODE != '31' || !REQ_CONFIRM" 
                @click="ReturnRequest"
              >
                {{ getComponentData('EU040300_BTN00005', 'caption', 'Request Confirmation') }}
              </Button>
              <Button
                id="EU040300_BTN00005"
                rounded
                variant="gray"
                :loading="loading" 
                @click="ReturnRequest"
              >
                {{ getComponentData('EU040300_BTN00005', 'caption', 'Request Confirmation') }}
              </Button>
              <Button
                id="EU040300_BTN00006"
                rounded
                variant="gray"
                :loading="loading"
                :disabled="SelectReturnData.RET_STATUS_CODE != '31'" 
                @click="CancelInspection"
              >
                {{ getComponentData('EU040300_BTN00006', 'caption', 'Cancel Inspection') }}
              </Button>
            </div>  
          </div>                 
        </div> 
        <div class="col-1">
          <div class="grid grid-rows-1 grid-flow-col h-full">
            <ChatBox
              id="EU030200_CHA00001"
              :items="returnInspectionOperationNote"
              :title="getComponentData('EU030200_CHT00001', 'caption', 'Operation Note')"
              :reload="fetchReturnInspectionOperationNote"
              @add="addReturnInspectionOperationNote"
            />
          </div>          
        </div>           
      </div>
    </Card> 
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-3 space-y-3"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <p>
            {{ getComponentData('EU040300_LBL00033', 'caption', 'Inspection Items') }}
          </p>
          <div class="flex justify-between items-center gap-x-3">
            <FormCheckbox
              id="EU030200_CHK00001"
            />
            <p class="font-medium">
              {{ getComponentData('EU040300_LBL00034', 'caption', 'Image Viewer') }}
            </p>
            <FormCheckbox
              id="EU030200_CHK00002"
            />
            <p class="font-medium">
              {{ getComponentData('EU040300_LBL00035', 'caption', 'QA Viewer') }}
            </p>
          </div>
        </div>
      </template>     
      <div class="grid grid-cols-7 gap-y-1 gap-x-12">
        <div class="col-span-2 space-y-3">
          <Card
            divider
            shadow-size="none"
            card-header-class="px-3 py-3 space-y-3"
            class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
            card-body-class="p-2 space-y-3 bg-gray-50"
          >
            <FormGroup
              :label="getComponentData('EU040300_LBL00036', 'caption', 'SKU')"
              label-id="EU040300_LBL00036"
              style="font-size: 15px;"
              horizontal
              label-width="w-3/12"
              input-width="w-9/12"
            >
              <FormTextInput
                id="EU040300_TXT00026"
                ref="SKURef"   
                v-model="SKU_DATA"
                :disabled="SelectReturnData.RET_SID === '' && SelectReturnData.RET_STATUS_CODE != '30' && SelectReturnData.RET_STATUS_CODE != '31'"
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
              :label="getComponentData('EU040300_LBL00037', 'caption', 'Serial No')"
              label-id="EU040300_LBL00037"
              style="font-size: 15px;"
              horizontal
              label-width="w-3/12"
              input-width="w-9/12"
            >
              <FormTextInput
                id="EU040300_TXT00027"
                :disabled="SelectReturnData.RET_SID === '' && SelectReturnData.RET_STATUS_CODE != '30' && SelectReturnData.RET_STATUS_CODE != '31'"
                style="font-size: 15px; height: 32px;"
              />
            </FormGroup>          
          </Card> 
        </div>    
      </div>
      <div class="grid grid-cols-2 gap-y-3 gap-x-12">
        <div class="col-span-1 py-1 ">
          <p class="text-base font-semibold text-gray-700">
            {{ getComponentData('EU040300_LBL00038', 'caption', 'Inspection QTY / Return QTY : ') }}
            <span class="mx-1">
              {{ Inspection_QTY }}
            </span>
            /
            <span class="mx-1">
              {{ Return_QTY }}
            </span>
          </p> 
        </div>
        <div class="col-span-1">
          <div class="flex space-x-6 items-center justify-end">
            <Button
              id="EU040300_BTN00004"
              rounded
              class="w-44"
              variant="gray"
              :loading="loading"
              :disabled="SelectReturnData.RET_SID === '' || SelectReturnData.RET_STATUS_CODE != '31'" 
              @click="fetchResetReturnInputData"
            >
              {{ getComponentData('EU040300_BTN00004', 'caption', 'Reset') }}
            </Button>
          </div>   
        </div>
      </div>     
      <div class="grid">
        <Table
          id="EU040300_GRD00001"
          class="overflow-x-auto border-b max-h-90 h-90 overflow-y-auto"
          border
          header-variant="secondary"
          :items="ReturnInspectionItemList"          
          :columns="[
            ...InspectedItemTableColumns,
            {
              caption: 'Plus',
              dataFieldName: 'PLUS',
              display: 'Y',
            },{
              caption: 'Minus',
              dataFieldName: 'MINUS',
              display: 'Y',
            },
            {
              caption: 'Delete',
              dataFieldName: 'DELETE',
              display: 'Y',
            }
          ]" 
        >
          <template #cell(PLUS)="{ item }">            
            <span
              v-if="decrypt(item.RETURN_INPUT_QTY) == '0' && SelectReturnData.RET_STATUS_CODE == '31'"
              class="cursor-pointer hover:font-bold hover:text-blue-700"
              @click="(e) => {
                e.stopPropagation();
                fetchActionReturnInputData(item,'PLUS')
              }"
            >
              <VueFeather
                type="plus-square"
                class="h-5 w-5"
              />
            </span>
          </template>
          <template #cell(MINUS)="{ item }">            
            <span
              v-if="decrypt(item.RETURN_INPUT_QTY) != '0' && SelectReturnData.RET_STATUS_CODE == '31'"
              class="cursor-pointer hover:font-bold hover:text-blue-700"
              @click="(e) => {
                e.stopPropagation();
                fetchActionReturnInputData(item,'MINUS')
              }"
            >
              <VueFeather
                type="minus-square"
                class="h-5 w-5"
              />
            </span>
          </template>
          <template #cell(DELETE)="{ item }">
            <span
              v-if="decrypt(item.RETURN_INSPECTION_ITEM_QTY) == '0' && SelectReturnData.RET_STATUS_CODE == '31'"
              class=" cursor-pointer hover:font-bold hover:text-blue-700 "
              @click="(e) => {
                e.stopPropagation();
                fetchActionReturnInputData(item,'DELETE')
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
    </Card>
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
      :show="openReturnModal"
      divider
      size="6xl"
      @close="() => {
        openReturnModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00400_LBL01001', 'caption', 'Select Return') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00410'"
          @on-row-double-click="onRowDoubleClick"
        />
      </template>
    </Modal> 
    <Modal
      :show="openRequestReturnModal"
      divider
      size="12xl"
      @close="() => {
        openRequestReturnModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00400_LBL01001', 'caption', 'Request Return Confirmation') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00420'"
          :requestData="ReturnRequestData"
          @btn-save="() => {
            fetchInspectionStatusReload()
            fetchClearReturnData()
            openRequestReturnModal = false

          }"
          @btn-cancel="() => {
            openRequestReturnModal = false
          }"
        />
      </template>
    </Modal>
    <Modal
      :show="openUnverifiedReturnModal"
      divider
      size="5xl"
      @close="() => {
        openUnverifiedReturnModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00400_LBL01001', 'caption', 'Unverified Return Create') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00430'"
          @btn-save="(item) => {
            SelectReturnData.RET_SID = decrypt(item.RET_SID),
            SelectReturnData.RET_TYPE_CODE = decrypt(item.RET_TYPE_CODE),
            ReturnReSearch()
            openUnverifiedReturnModal = false

          }"
          @btn-cancel="() => {
            openUnverifiedReturnModal = false
          }"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>
:deep(#EU040300_CMB00004 button) {
  font-size: 12px !important;
  height: 32px !important;
}
</style>
