<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

import VueFeather from 'vue-feather';
import {notify} from "notiwind";


const { pageLoading, togglePageLoading } = usePageLoading();
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()
const ReturnInspection1 = useReturnInspection1Store()
const { currentTab } = storeToRefs(useTabsStore())
const { getMaskedValue } = useMasked();

const { loading, toggleLoading } = useLoading()

const { StationList,WorkStaffList, returnSummaryList, returnStatusList,returnDetailInfoOperationNote,filters,ReturnListData,ReturnInspectionItemList } = storeToRefs(ReturnInspection1)

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const Station = ref({})
const STATION_WH_FNAME = ref("")
const WorkStaff = ref({})
const channelList = ref([])
const channel = ref({})
const ReturnList = ref([])
const ReturnData = ref({})
const Barcode = ref("")
const SKU_DATA = ref("")

const RETURN_LIST_CNT = ref("")
const REQUEST_CANCEL_CNT = ref("")
const HOLD_BY_ESM_CNT = ref("")

const WATINGINBOUND_CNT = ref("")
const INBOUND_CNT = ref("")
const INBOUNDINSPECTION_CNT = ref("")

const Inspection_QTY = ref("0")

const Return_QTY = ref("0")

const SelectReturnData = ref({
  RET_SID : '',
  RET_BRAND_CODE : '',
  RET_BRAND_FNAME : '',
  RET_CHANNEL_CODE : '',
  RET_CHANNEL_DESCR : '',
  RET_ID : '',
  RET_STATUS_CODE : '',
  RET_STATUS_FNAME : '',
  RET_SUBSTATUS_CODE : '',
  RET_SUBSTATUS_FNAME : '',
  RET_DATETIME : '',
  RET_REASON_FNAME : '',
  RET_SEND_NAME_M : '',
  RET_SEND_TEL_M : '',
  RET_SEND_MOBILE_M : '',
  RET_SEND_ADDR_1 : '',
  RET_PICKUP_TRACK_NO : '',
  RET_ORD_ID : '',
  ORD_TYPE_FNAME : '',
  ORD_DATETIME : '',
  ORD_STATUS_FNAME : '',
})

/* Dialog Modal */
const openDialogModal = ref(false)
const openReturnModal = ref(false)

const DIALOG_TYPE = ref("")
const DIALOG_TITLE = ref("")
const DIALOG_TEXT = ref("")

////////////////////////////////

watch(() => Station, async (value) => {
  if (value) {

    const selectedChannel = StationList.value.find((Stations) => decrypt(Stations.USER_SID) === value?.value.value)

    STATION_WH_FNAME.value = decrypt(selectedChannel.STATION_WH_FNAME)
    channelList.value = selectedChannel.STATION_CHANNEL_LIST.map(({ CHANNEL_CODE, CHANNEL_DESCR }) => 
    ({ value: decrypt(CHANNEL_CODE), name: decrypt(CHANNEL_DESCR) }))    

    channel.value = channelList.value[0]
  }
}, { deep: true })

watch(() => channel, async (value) => {
  if (value) {
    await ReturnInspection1.fetchReturnSummaryList()
    const selectedChannel = returnSummaryList.value.find((channel) => decrypt(channel.RET_SUM_CHANNEL_CODE) === value?.value.value)
    WATINGINBOUND_CNT.value = selectedChannel ? selectedChannel?.RET_SUM_COUNT_03 : encrypt('0')
    INBOUNDINSPECTION_CNT.value = selectedChannel ? selectedChannel?.RET_SUM_COUNT_04 : encrypt('0')
    INBOUND_CNT.value = selectedChannel ? selectedChannel?.RET_SUM_COUNT_05 : encrypt('0')

    filters.value.FLT_STATUS = ["30","31"]
    filters.value.FLT_CHANNELS = [value?.value.value]
    filters.value.FLT_INCLUDE_REQSUB = "0";
    filters.value.FLT_RETURN_TYPES = ["R"];
    filters.value.FLT_VIEW_OPT = '0010';

    const { data } = await ReturnInspection1.fetchReturnDetailList()
    
    ReturnList.value = data

    ReturnData.value = {
      name: '',
      value: '',
    };
  }
}, { deep: true })

watch(() => ReturnData, async (value) => {
  if (value) {
    const selectedReturn = ReturnList.value.find((Return) => decrypt(Return.RET_SID) === value?.value.value)
    
    if(selectedReturn)
    {
      SelectReturnData.value.RET_SID = selectedReturn ? decrypt(selectedReturn?.RET_SID) : ''
      SelectReturnData.value.RET_BRAND_CODE = selectedReturn ? decrypt(selectedReturn?.RET_BRAND_CODE) : ''
      SelectReturnData.value.RET_BRAND_FNAME = selectedReturn ? decrypt(selectedReturn?.RET_BRAND_FNAME) : ''
      SelectReturnData.value.RET_CHANNEL_CODE = selectedReturn ? decrypt(selectedReturn?.RET_CHANNEL_CODE) : ''
      SelectReturnData.value.RET_CHANNEL_DESCR = selectedReturn ? decrypt(selectedReturn?.RET_CHANNEL_DESCR) : ''
      SelectReturnData.value.RET_ID = selectedReturn ? decrypt(selectedReturn?.RET_ID) : ''
      SelectReturnData.value.RET_STATUS_CODE = selectedReturn ? decrypt(selectedReturn?.RET_STATUS_CODE) : ''
      SelectReturnData.value.RET_STATUS_FNAME = selectedReturn ? decrypt(selectedReturn?.RET_STATUS_FNAME) : ''
      SelectReturnData.value.RET_SUBSTATUS_CODE = selectedReturn ? decrypt(selectedReturn?.RET_SUBSTATUS_CODE) : ''
      SelectReturnData.value.RET_SUBSTATUS_FNAME = selectedReturn ? decrypt(selectedReturn?.RET_SUBSTATUS_FNAME) : ''
      SelectReturnData.value.RET_DATETIME = selectedReturn ? decrypt(selectedReturn?.RET_DATETIME) : ''
      SelectReturnData.value.RET_REASON_FNAME = selectedReturn ? decrypt(selectedReturn?.RET_REASON_FNAME) : ''
      SelectReturnData.value.RET_SEND_NAME_M = selectedReturn ? decrypt(selectedReturn?.RET_SEND_NAME_M) : ''
      SelectReturnData.value.RET_SEND_TEL_M = selectedReturn ? decrypt(selectedReturn?.RET_SEND_TEL_M) : ''
      SelectReturnData.value.RET_SEND_MOBILE_M = selectedReturn ? decrypt(selectedReturn?.RET_SEND_MOBILE_M) : ''
      SelectReturnData.value.RET_SEND_ADDR_1 = selectedReturn ? decrypt(selectedReturn?.RET_SEND_ADDR_1) : ''
      SelectReturnData.value.RET_PICKUP_TRACK_NO = selectedReturn ? decrypt(selectedReturn?.RET_PICKUP_TRACK_NO) : ''    
      SelectReturnData.value.RET_ORD_ID = selectedReturn ? decrypt(selectedReturn?.RET_ORD_ID) : ''
      SelectReturnData.value.ORD_TYPE_FNAME = selectedReturn ? decrypt(selectedReturn?.ORD_TYPE_FNAME) : ''
      SelectReturnData.value.ORD_DATETIME = selectedReturn ? decrypt(selectedReturn?.ORD_DATETIME) : ''
      SelectReturnData.value.ORD_STATUS_FNAME = selectedReturn ? decrypt(selectedReturn?.ORD_STATUS_FNAME) : ''


      const INPUT_DATA = ref({
        FLT_STATION_USER_SID: Station.value?.value ?? '',
        FLT_BRAND_CODE: selectedReturn ? decrypt(selectedReturn?.RET_BRAND_CODE) : '',
        FLT_CHANNEL_CODE: selectedReturn ? decrypt(selectedReturn?.RET_CHANNEL_CODE) : '',
        FLT_RETURN_SID: selectedReturn ? decrypt(selectedReturn?.RET_SID) : '',
      })
      await ReturnInspection1.fetchReturnItemInputGet(INPUT_DATA.value)
      await fetchReturnDetailInfoOperationNote()
    }    
  }
}, { deep: true })

watch(() => ReturnInspectionItemList, async (value) => {
  if (value) {
    let InspectionQTY = 0
    let ReturnQTY = 0
    for (let i = 0; i < value.value.length; i++) 
    {
      ReturnQTY = ReturnQTY + Number(decrypt(value.value[i].RETURN_ITEM_QTY))
      InspectionQTY = InspectionQTY + Number(decrypt(value.value[i].RETURN_INPUT_QTY))
    }
    Inspection_QTY.value = InspectionQTY.toString()
    Return_QTY.value = ReturnQTY.toString()
  }
}, { deep: true })

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  
  await pageLoader.fetchPageLoadData(currentTab.value?.component)
  await ReturnInspection1.fetchStationList()
  await ReturnInspection1.fetchWorkStaffList()
  await ReturnInspection1.fetchReturnStatusList()

  Station.value = {
    name: decrypt(StationList.value[0].STATION_ID) || '',
    value: decrypt(StationList.value[0].USER_SID) || '',
  };

  WorkStaff.value = {
    name: WorkStaffList.value[0] ? decrypt(WorkStaffList.value[0].STAFF_NAME) : '',
    value: WorkStaffList.value[0] ? decrypt(WorkStaffList.value[0].STAFF_SID) : '',
  }; 

  const RETURN_LIST = returnStatusList.value.find((channel) => decrypt(channel.RET_STATUS_CODE) === '0110')
  RETURN_LIST_CNT.value = RETURN_LIST?.RET_STATUS_VALUE
  const REQUEST_CANCEL = returnStatusList.value.find((channel) => decrypt(channel.RET_STATUS_CODE) === '0130')
  REQUEST_CANCEL_CNT.value = REQUEST_CANCEL?.RET_STATUS_VALUE
  const HOLD_BY_ESM = returnStatusList.value.find((channel) => decrypt(channel.RET_STATUS_CODE) === '0160')
  HOLD_BY_ESM_CNT.value = HOLD_BY_ESM?.RET_STATUS_VALUE

  isloading.isLoading = false
  togglePageLoading()
})

const fetchClearReturnData = async () => {
  toggleLoading()
  isloading.isLoading = true
  SelectReturnData.value = {
    RET_SID : '',
    RET_BRAND_CODE : '',
    RET_BRAND_FNAME : '',
    RET_CHANNEL_CODE : '',
    RET_CHANNEL_DESCR : '',
    RET_ID : '',
    RET_STATUS_CODE : '',
    RET_STATUS_FNAME : '',
    RET_SUBSTATUS_CODE : '',
    RET_SUBSTATUS_FNAME : '',
    RET_DATETIME : '',
    RET_REASON_FNAME : '',
    RET_SEND_NAME_M : '',
    RET_SEND_TEL_M : '',
    RET_SEND_MOBILE_M : '',
    RET_SEND_ADDR_1 : '',
    RET_PICKUP_TRACK_NO : '',
    RET_ORD_ID : '',
    ORD_TYPE_FNAME : '',
    ORD_DATETIME : '',
    ORD_STATUS_FNAME : '',
  }

  ReturnInspection1.resetReturnItemInputGet()
  ReturnInspection1.resetReturnDetailInfoOperationNote()
  
  await ReturnInspection1.fetchReturnSummaryList()
  const selectedChannel = returnSummaryList.value.find((channels) => decrypt(channels.RET_SUM_CHANNEL_CODE) === channel.value.value)
  WATINGINBOUND_CNT.value = selectedChannel ? selectedChannel?.RET_SUM_COUNT_03 : encrypt('0')
  INBOUNDINSPECTION_CNT.value = selectedChannel ? selectedChannel?.RET_SUM_COUNT_04 : encrypt('0')
  INBOUND_CNT.value = selectedChannel ? selectedChannel?.RET_SUM_COUNT_05 : encrypt('0')
  filters.value.FLT_STATUS = ["30","31"]
  filters.value.FLT_CHANNELS = [channel.value.value]
  filters.value.FLT_INCLUDE_REQSUB = "0";
  filters.value.FLT_RETURN_TYPES = ["R"];
  filters.value.FLT_VIEW_OPT = '0010';
  const { data } = await ReturnInspection1.fetchReturnDetailList()
  
  ReturnList.value = data
  ReturnData.value = {
    name: '',
    value: '',
  };

  SKU_DATA.value = ''
  isloading.isLoading = false
  toggleLoading()
}

const fetchReturnDetailInfoOperationNote = async () => {
  toggleLoading()
  isloading.isLoading = true
  await ReturnInspection1.fetchReturnDetailInfoOperationNote(encrypt(SelectReturnData.value.RET_SID))
  isloading.isLoading = false
  toggleLoading()
}

const addReturnOperationNote = async (note) => {
  toggleLoading()
  isloading.isLoading = true
  await ReturnInspection1.addReturnOperationNote({
    FLT_RETURN_SID: SelectReturnData.value.RET_SID,
    FLT_NOTE: note,
  })
  await fetchReturnDetailInfoOperationNote()
  isloading.isLoading = false
  toggleLoading()
}

const updateReturnSubStatus = async (item) => {
  const STATUS_DATA = ref({
    FLT_TO_SUBSTATUS_CODE: encrypt(item),  
    FLT_RETURNS: [
      {"RET_SID":encrypt(SelectReturnData.value.RET_SID)}
    ],
  })
  toggleLoading()
  isloading.isLoading = true
  await ReturnInspection1.fetchReturnSubStatusChange(STATUS_DATA.value)
  await ReturnReSearch()
  isloading.isLoading = false
  toggleLoading()
}

const ConfirmDialog = async () => {

  if(DIALOG_TYPE.value == 'CANCEL')
  {
    const INPUT_DATA = ref({
      FLT_STATION_USER_SID: Station.value?.value ?? '',
      FLT_BRAND_CODE: SelectReturnData.value.RET_BRAND_CODE,
      FLT_CHANNEL_CODE: SelectReturnData.value.RET_CHANNEL_CODE,
      FLT_RETURN_SID: SelectReturnData.value.RET_SID,
    })
    toggleLoading()
    isloading.isLoading = true
    const { success } = await ReturnInspection1.fetchReturnItemInputClearSet(INPUT_DATA.value)
    if (success) {

      const STATUS_DATA = ref({
        FLT_TO_STATUS_CODE: encrypt("30"),  
        FLT_RETURNS: [
          {"RET_SID":encrypt(SelectReturnData.value.RET_SID)}
        ],  
      })

      const { success } = await ReturnInspection1.fetchReturnStatusChange(STATUS_DATA.value)
      
      if (success) await fetchClearReturnData()          
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
    const { success } = await ReturnInspection1.fetchReturnStatusChange(STATUS_DATA.value)
    
    if (success) await fetchClearReturnData()  
  }

  openDialogModal.value = false
}

const onBarcodeEnter = async (showLoading = true) => {
  
  if(Barcode.value != '')
  {
    const INPUT_DATA = ref({
      FLT_STATION_USER_SID: Station.value?.value ?? '',
      FLT_CHANNEL_CODE: channel.value?.value ?? '',
      FLT_RETURN_SID: '',
      FLT_KEY_WORD: Barcode.value,
    })
    if (showLoading) toggleLoading()
    isloading.isLoading = true
    const { success } = await ReturnInspection1.fetchReturnList(INPUT_DATA.value)

    if (success)
    {
      if (ReturnListData.value.length == 1)
      {
        SelectReturnData.value.RET_SID = ReturnListData.value[0].RET_SID ? decrypt(ReturnListData.value[0].RET_SID) : ''
        SelectReturnData.value.RET_BRAND_CODE = ReturnListData.value[0].RET_BRAND_CODE ? decrypt(ReturnListData.value[0].RET_BRAND_CODE) : ''
        SelectReturnData.value.RET_BRAND_FNAME = ReturnListData.value[0].RET_BRAND_FNAME ? decrypt(ReturnListData.value[0].RET_BRAND_FNAME) : ''
        SelectReturnData.value.RET_CHANNEL_CODE = ReturnListData.value[0].RET_CHANNEL_CODE ? decrypt(ReturnListData.value[0].RET_CHANNEL_CODE) : ''
        SelectReturnData.value.RET_CHANNEL_DESCR = ReturnListData.value[0].RET_CHANNEL_DESCR ? decrypt(ReturnListData.value[0].RET_CHANNEL_DESCR) : ''
        SelectReturnData.value.RET_ID = ReturnListData.value[0].RET_ID ? decrypt(ReturnListData.value[0].RET_ID) : ''
        SelectReturnData.value.RET_STATUS_CODE = ReturnListData.value[0].RET_STATUS_CODE ? decrypt(ReturnListData.value[0].RET_STATUS_CODE) : ''
        SelectReturnData.value.RET_STATUS_FNAME = ReturnListData.value[0].RET_STATUS_FNAME ? decrypt(ReturnListData.value[0].RET_STATUS_FNAME) : ''
        SelectReturnData.value.RET_SUBSTATUS_CODE = ReturnListData.value[0].RET_SUBSTATUS_CODE ? decrypt(ReturnListData.value[0].RET_SUBSTATUS_CODE) : ''
        SelectReturnData.value.RET_SUBSTATUS_FNAME = ReturnListData.value[0].RET_SUBSTATUS_FNAME ? decrypt(ReturnListData.value[0].RET_SUBSTATUS_FNAME) : ''
        SelectReturnData.value.RET_DATETIME = ReturnListData.value[0].RET_DATETIME ? decrypt(ReturnListData.value[0].RET_DATETIME) : ''
        SelectReturnData.value.RET_REASON_FNAME = ReturnListData.value[0].RET_REASON_FNAME ? decrypt(ReturnListData.value[0].RET_REASON_FNAME) : ''
        SelectReturnData.value.RET_SEND_NAME_M = ReturnListData.value[0].RET_SEND_NAME_M ? decrypt(ReturnListData.value[0].RET_SEND_NAME_M) : ''
        SelectReturnData.value.RET_SEND_TEL_M = ReturnListData.value[0].RET_SEND_TEL_M ? decrypt(ReturnListData.value[0].RET_SEND_TEL_M) : ''
        SelectReturnData.value.RET_SEND_MOBILE_M = ReturnListData.value[0].RET_SEND_MOBILE_M ? decrypt(ReturnListData.value[0].RET_SEND_MOBILE_M) : ''
        SelectReturnData.value.RET_SEND_ADDR_1 = ReturnListData.value[0].RET_SEND_ADDR_1 ? decrypt(ReturnListData.value[0].RET_SEND_ADDR_1) : ''
        SelectReturnData.value.RET_PICKUP_TRACK_NO = ReturnListData.value[0].RET_PICKUP_TRACK_NO ? decrypt(ReturnListData.value[0].RET_PICKUP_TRACK_NO) : ''    
        SelectReturnData.value.RET_ORD_ID = ReturnListData.value[0].RET_ORD_ID ? decrypt(ReturnListData.value[0].RET_ORD_ID) : ''
        SelectReturnData.value.ORD_TYPE_FNAME = ReturnListData.value[0].ORD_TYPE_FNAME ? decrypt(ReturnListData.value[0].ORD_TYPE_FNAME) : ''
        SelectReturnData.value.ORD_DATETIME = ReturnListData.value[0].ORD_DATETIME ? decrypt(ReturnListData.value[0].ORD_DATETIME) : ''
        SelectReturnData.value.ORD_STATUS_FNAME = ReturnListData.value[0].ORD_STATUS_FNAME ? decrypt(ReturnListData.value[0].ORD_STATUS_FNAME) : ''
        

        const INPUT_DATA = ref({
          FLT_STATION_USER_SID: Station.value?.value ?? '',
          FLT_BRAND_CODE: decrypt(ReturnListData.value[0].RET_BRAND_CODE),
          FLT_CHANNEL_CODE: decrypt(ReturnListData.value[0].RET_CHANNEL_CODE),
          FLT_RETURN_SID: decrypt(ReturnListData.value[0].RET_SID),
        })
        await ReturnInspection1.fetchReturnItemInputGet(INPUT_DATA.value)
        await fetchReturnDetailInfoOperationNote()

      }
      else if (ReturnListData.value.length > 1)
      {          
        openReturnModal.value = true
      }
      
    }    

    isloading.isLoading = false
    if (showLoading) toggleLoading()
  }
}

const onRowDoubleClick = async (data) => {

  SelectReturnData.value.RET_SID = data.RET_SID ? decrypt(data.RET_SID) : ''
  SelectReturnData.value.RET_BRAND_CODE = data.RET_BRAND_CODE ? decrypt(data.RET_BRAND_CODE) : ''
  SelectReturnData.value.RET_BRAND_FNAME = data.RET_BRAND_FNAME ? decrypt(data.RET_BRAND_FNAME) : ''
  SelectReturnData.value.RET_CHANNEL_CODE = data.RET_CHANNEL_CODE ? decrypt(data.RET_CHANNEL_CODE) : ''
  SelectReturnData.value.RET_CHANNEL_DESCR = data.RET_CHANNEL_DESCR ? decrypt(data.RET_CHANNEL_DESCR) : ''
  SelectReturnData.value.RET_ID = data.RET_ID ? decrypt(data.RET_ID) : ''
  SelectReturnData.value.RET_STATUS_CODE = data.RET_STATUS_CODE ? decrypt(data.RET_STATUS_CODE) : ''
  SelectReturnData.value.RET_STATUS_FNAME = data.RET_STATUS_FNAME ? decrypt(data.RET_STATUS_FNAME) : ''
  SelectReturnData.value.RET_SUBSTATUS_CODE = data.RET_SUBSTATUS_CODE ? decrypt(data.RET_SUBSTATUS_CODE) : ''
  SelectReturnData.value.RET_SUBSTATUS_FNAME = data.RET_SUBSTATUS_FNAME ? decrypt(data.RET_SUBSTATUS_FNAME) : ''
  SelectReturnData.value.RET_DATETIME = data.RET_DATETIME ? decrypt(data.RET_DATETIME) : ''
  SelectReturnData.value.RET_REASON_FNAME = data.RET_REASON_FNAME ? decrypt(data.RET_REASON_FNAME) : ''
  SelectReturnData.value.RET_SEND_NAME_M = data.RET_SEND_NAME_M ? decrypt(data.RET_SEND_NAME_M) : ''
  SelectReturnData.value.RET_SEND_TEL_M = data.RET_SEND_TEL_M ? decrypt(data.RET_SEND_TEL_M) : ''
  SelectReturnData.value.RET_SEND_MOBILE_M = data.RET_SEND_MOBILE_M ? decrypt(data.RET_SEND_MOBILE_M) : ''
  SelectReturnData.value.RET_SEND_ADDR_1 = data.RET_SEND_ADDR_1 ? decrypt(data.RET_SEND_ADDR_1) : ''
  SelectReturnData.value.RET_PICKUP_TRACK_NO = data.RET_PICKUP_TRACK_NO ? decrypt(data.RET_PICKUP_TRACK_NO) : ''    
  SelectReturnData.value.RET_ORD_ID = data.RET_ORD_ID ? decrypt(data.RET_ORD_ID) : ''
  SelectReturnData.value.ORD_TYPE_FNAME = data.ORD_TYPE_FNAME ? decrypt(data.ORD_TYPE_FNAME) : ''
  SelectReturnData.value.ORD_DATETIME = data.ORD_DATETIME ? decrypt(data.ORD_DATETIME) : ''
  SelectReturnData.value.ORD_STATUS_FNAME = data.ORD_STATUS_FNAME ? decrypt(data.ORD_STATUS_FNAME) : ''

  const INPUT_DATA = ref({
    FLT_STATION_USER_SID: Station.value?.value ?? '',
    FLT_BRAND_CODE: decrypt(data.RET_BRAND_CODE),
    FLT_CHANNEL_CODE: decrypt(data.RET_CHANNEL_CODE),
    FLT_RETURN_SID: decrypt(data.RET_SID),
  })
  await ReturnInspection1.fetchReturnItemInputGet(INPUT_DATA.value)

  await fetchReturnDetailInfoOperationNote()
  
  openReturnModal.value = false
}

const onSKUEnter = async (showLoading = true) => {
  
  const newElement = ReturnInspectionItemList.value?.find((item) => item.RETURN_ITEM_CODE === encrypt(SKU_DATA.value))
  
  if(newElement)
  {

    if(SelectReturnData.value.RET_STATUS_CODE == '30')
    {
      const STATUS_DATA = ref({
        FLT_TO_STATUS_CODE: encrypt("31"),  
        FLT_RETURNS: [
          {"RET_SID":encrypt(SelectReturnData.value.RET_SID)}
        ],  
      })

      if (showLoading) toggleLoading()
      isloading.isLoading = true
      const { success } = await ReturnInspection1.fetchReturnStatusChange(STATUS_DATA.value)
      if (!success) {
        isloading.isLoading = false
        if (showLoading) toggleLoading()
        return
      }
      ReturnReSearch()
      isloading.isLoading = false
      if (showLoading) toggleLoading()
    }
    else if(SelectReturnData.value.RET_STATUS_CODE != '31')
    {
      return
    }

    const INPUT_DATA = ref({
      FLT_STATION_USER_SID: Station.value?.value ?? '',
      FLT_BRAND_CODE: SelectReturnData.value.RET_BRAND_CODE,
      FLT_CHANNEL_CODE: SelectReturnData.value.RET_CHANNEL_CODE,
      FLT_RETURN_SID: SelectReturnData.value.RET_SID,
      FLT_ITEM_CODE: SKU_DATA.value,
      FLT_INPUT_TYPE_CODE: '0020',
      FLT_STAFF_SID: WorkStaff.value?.value ?? '',
      FLT_QAVIEW_ID: '0',
    })
    if (showLoading) toggleLoading()
    isloading.isLoading = true
    await ReturnInspection1.fetchReturnItemInputADDSet(INPUT_DATA.value)
    isloading.isLoading = false
    if (showLoading) toggleLoading()

  }  

  SKU_DATA.value = ''
}

const ReturnReSearch = async () => {
  
  const INPUT_DATA = ref({
      FLT_STATION_USER_SID: Station.value?.value ?? '',
      FLT_CHANNEL_CODE: channel.value?.value ?? '',
      FLT_RETURN_SID: SelectReturnData.value.RET_SID,
      FLT_KEY_WORD: '',
    })
    toggleLoading()
    isloading.isLoading = true
    const { success } = await ReturnInspection1.fetchReturnList(INPUT_DATA.value)

    if (success)
    {
      if (ReturnListData.value.length == 1)
      {
        SelectReturnData.value.RET_SID = ReturnListData.value[0].RET_SID ? decrypt(ReturnListData.value[0].RET_SID) : ''
        SelectReturnData.value.RET_BRAND_CODE = ReturnListData.value[0].RET_BRAND_CODE ? decrypt(ReturnListData.value[0].RET_BRAND_CODE) : ''
        SelectReturnData.value.RET_BRAND_FNAME = ReturnListData.value[0].RET_BRAND_FNAME ? decrypt(ReturnListData.value[0].RET_BRAND_FNAME) : ''
        SelectReturnData.value.RET_CHANNEL_CODE = ReturnListData.value[0].RET_CHANNEL_CODE ? decrypt(ReturnListData.value[0].RET_CHANNEL_CODE) : ''
        SelectReturnData.value.RET_CHANNEL_DESCR = ReturnListData.value[0].RET_CHANNEL_DESCR ? decrypt(ReturnListData.value[0].RET_CHANNEL_DESCR) : ''
        SelectReturnData.value.RET_ID = ReturnListData.value[0].RET_ID ? decrypt(ReturnListData.value[0].RET_ID) : ''
        SelectReturnData.value.RET_STATUS_CODE = ReturnListData.value[0].RET_STATUS_CODE ? decrypt(ReturnListData.value[0].RET_STATUS_CODE) : ''
        SelectReturnData.value.RET_STATUS_FNAME = ReturnListData.value[0].RET_STATUS_FNAME ? decrypt(ReturnListData.value[0].RET_STATUS_FNAME) : ''
        SelectReturnData.value.RET_SUBSTATUS_CODE = ReturnListData.value[0].RET_SUBSTATUS_CODE ? decrypt(ReturnListData.value[0].RET_SUBSTATUS_CODE) : ''
        SelectReturnData.value.RET_SUBSTATUS_FNAME = ReturnListData.value[0].RET_SUBSTATUS_FNAME ? decrypt(ReturnListData.value[0].RET_SUBSTATUS_FNAME) : ''
        SelectReturnData.value.RET_DATETIME = ReturnListData.value[0].RET_DATETIME ? decrypt(ReturnListData.value[0].RET_DATETIME) : ''
        SelectReturnData.value.RET_REASON_FNAME = ReturnListData.value[0].RET_REASON_FNAME ? decrypt(ReturnListData.value[0].RET_REASON_FNAME) : ''
        SelectReturnData.value.RET_SEND_NAME_M = ReturnListData.value[0].RET_SEND_NAME_M ? decrypt(ReturnListData.value[0].RET_SEND_NAME_M) : ''
        SelectReturnData.value.RET_SEND_TEL_M = ReturnListData.value[0].RET_SEND_TEL_M ? decrypt(ReturnListData.value[0].RET_SEND_TEL_M) : ''
        SelectReturnData.value.RET_SEND_MOBILE_M = ReturnListData.value[0].RET_SEND_MOBILE_M ? decrypt(ReturnListData.value[0].RET_SEND_MOBILE_M) : ''
        SelectReturnData.value.RET_SEND_ADDR_1 = ReturnListData.value[0].RET_SEND_ADDR_1 ? decrypt(ReturnListData.value[0].RET_SEND_ADDR_1) : ''
        SelectReturnData.value.RET_PICKUP_TRACK_NO = ReturnListData.value[0].RET_PICKUP_TRACK_NO ? decrypt(ReturnListData.value[0].RET_PICKUP_TRACK_NO) : ''    
        SelectReturnData.value.RET_ORD_ID = ReturnListData.value[0].RET_ORD_ID ? decrypt(ReturnListData.value[0].RET_ORD_ID) : ''
        SelectReturnData.value.ORD_TYPE_FNAME = ReturnListData.value[0].ORD_TYPE_FNAME ? decrypt(ReturnListData.value[0].ORD_TYPE_FNAME) : ''
        SelectReturnData.value.ORD_DATETIME = ReturnListData.value[0].ORD_DATETIME ? decrypt(ReturnListData.value[0].ORD_DATETIME) : ''
        SelectReturnData.value.ORD_STATUS_FNAME = ReturnListData.value[0].ORD_STATUS_FNAME ? decrypt(ReturnListData.value[0].ORD_STATUS_FNAME) : ''

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

const TrackingNoChange = async () => {
  
  const TRACKING_DATA = ref({
    FLT_TO_TRACKING_NO: SelectReturnData.value.RET_PICKUP_TRACK_NO,  
    FLT_RETURN_SID: SelectReturnData.value.RET_SID
  })
  toggleLoading()
  isloading.isLoading = true
  const { success } = await ReturnInspection1.fetchReturnTrackingChangeSet(TRACKING_DATA.value)
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
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU040200_GRD00001')
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
        <p>
          {{ getComponentData('EU040200_LBL00001', 'caption', 'Station Information') }}
        </p>
      </template>
      <div class="grid grid-cols-4 gap-x-3">
        <FormGroup
          :label="getComponentData('EU040200_LBL00002', 'caption', 'Station ID')"
          label-id="EU040200_LBL00002"
          label-for="EU040200_CMB00001"
          label-width="w-1/4"
          input-width="w-3/4"
          horizontal
        >
          <FormSelect
            id="EU040200_CMB00001"
            v-model="Station"
            :options="StationList.map((item) => ({
              name: decrypt(item.STATION_ID),
              value: decrypt(item.USER_SID),
            }))"
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU040200_LBL00003', 'caption', 'Warehouse')"
          label-id="EU040200_LBL00003"
          label-for="EU040200_TXT00001"
          label-width="w-1/4"
          input-width="w-3/4"
          horizontal
        >
          <FormTextInput
            id="EU040200_TXT00001"
            v-model="STATION_WH_FNAME"
            class="bg-gray-100"
            readonly
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU040200_LBL00004', 'caption', 'Inspection Staff')"
          label-id="EU040200_LBL00004"
          label-for="EU040200_CMB00002"
          label-width="w-1/4"
          input-width="w-3/4"
          horizontal
        >
          <FormSelect
            id="EU040200_CMB00002"
            v-model="WorkStaff"
            :options="WorkStaffList.map((item) => ({
              name: decrypt(item.STAFF_NAME),
              value: decrypt(item.STAFF_SID),
            }))"
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU040200_LBL00005', 'caption', 'Channel')"
          label-id="EU040200_LBL00005"
          label-for="EU040200_CMB00003"
          label-width="w-1/4"
          input-width="w-3/4"
          horizontal
        >
          <FormSelect
            id="EU040200_CMB00003"
            v-model="channel"
            :options="channelList"
          />
        </FormGroup>
      </div>  
      <div class="grid grid-cols-10 gap-x-3">
        <div
          class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-15 border hover:border-gray-500 isac-bg-gray"              
        >
          <span
            class="text-xs font-medium text-white"
          >
            {{ "Return List" }}
          </span>
          <span
            class="text-2xl font-black text-white"
          >
            {{ decrypt(RETURN_LIST_CNT) }}
          </span>
        </div>
        <div
          class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-15 border hover:border-gray-500 isac-bg-gray"
        >
          <span
            class="text-xs font-medium text-white"
          > 
            {{ "Request Cancel" }}
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
            {{ "Hold by ESM" }}
          </span>
          <span
            class="text-2xl font-black text-white"
          >
            {{ decrypt(HOLD_BY_ESM_CNT) }}
          </span>
        </div>
        <div class="col-span-4" />
        <div
          class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-15 border hover:border-gray-500 bg-gray-100"
        >
          <span
            class="text-xs font-medium text-gray-700"
          >
            {{ "WAITING INBOUND" }}
          </span>
          <span
            class="text-2xl font-black text-gray-700"
          >
            {{ decrypt(WATINGINBOUND_CNT) }}
          </span>
        </div>            
        <div
          class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-15 border hover:border-gray-500 bg-gray-100"
        >
          <span
            class="text-xs font-medium text-gray-700"
          >
            {{ "INBOUND INSPECTION" }}
          </span>
          <span
            class="text-2xl font-black text-gray-700"
          >
            {{ decrypt(INBOUNDINSPECTION_CNT) }}
          </span>
        </div>            
        <div
          class="flex flex-col justify-center items-center px-3 py-2 rounded-md h-15 border hover:border-gray-500 bg-gray-100"
        >
          <span
            class="text-xs font-medium text-gray-700"
          >
            {{ "INBOUND" }}
          </span>
          <span
            class="text-2xl font-black text-gray-700"
          >
            {{ decrypt(INBOUND_CNT) }}
          </span>
        </div>          
      </div>
    </Card> 
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-3 space-y-3 text-white bg-black"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>
        <p>
          {{ getComponentData('EU040200_LBL00006', 'caption', 'Inspection Information') }}
        </p>
      </template>
      <div class="grid grid-cols-5 gap-x-2">
        <div class="col-span-4 space-y-3">
          <div class="grid grid-cols-4 gap-x-12">
            <div class="col-span-2 space-y-3">
              <Card
                divider
                shadow-size="none"
                card-header-class="px-3 py-3 space-y-3"
                class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
                card-body-class="p-2 space-y-3 bg-gray-50"
              >
                <FormGroup
                  :label="getComponentData('EU040200_LBL00007', 'caption', 'Barcode')"
                  label-id="EU040200_LBL00007"          
                  horizontal
                  label-width="w-1/6"
                  input-width="w-5/6"
                >
                  <FormTextInput
                    id="EU040200_TXT00002" 
                    v-model="Barcode"
                    style="font-size: 14px; height: 32px;" 
                    placeholder="Invoice No or Tracking No"
                    :disabled="SelectReturnData.RET_STATUS_CODE != '30' && SelectReturnData.RET_STATUS_CODE != ''" 
                    @keyup.enter="onBarcodeEnter"
                  />
                </FormGroup>          
              </Card> 
            </div>
            <div class="col-span-2 space-y-3">
              <Card
                divider
                shadow-size="none"
                card-header-class="px-3 py-3 space-y-3"
                card-body-class="p-2 space-y-3 bg-gray-0"
              >
                <FormGroup
                  :label="getComponentData('EU040200_LBL00008', 'caption', 'Delivery ID')"
                  label-id="EU040200_LBL00008"          
                  horizontal
                  label-width="w-1/6"
                  input-width="w-5/6"
                >
                  <FormSelect
                    id="EU040200_CMB00004"
                    v-model="ReturnData"
                    :options="ReturnList.map((item) => ({ 
                      value: decrypt(item.RET_SID), 
                      name: 'Return ID : ' + decrypt(item.RET_ID) + 
                        '/Order ID : ' + decrypt(item.RET_ORD_ID) + 
                        '/Name : ' + decrypt(item.RET_SEND_NAME_M) + 
                        '/Mobile : ' + decrypt(item.RET_SEND_MOBILE_M) 
                    }))"
                    :disabled="SelectReturnData.RET_STATUS_CODE != '30' && SelectReturnData.RET_STATUS_CODE != ''"
                  />
                </FormGroup>          
              </Card> 
            </div>
          </div>    
          <Card
            divider
            shadow-size="none"
            card-header-class="px-3 py-1 space-y-3"
            card-body-class="p-1 space-y-3"
          >
            <div class="grid grid-cols-4 gap-x-3 gap-y-3">              
              <div class="col-span-2">
                <div class="grid grid-cols-2 gap-x-3 gap-y-3">
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00009', 'caption', 'Brand')"
                    label-id="EU040200_LBL00009"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU040200_TXT00003"
                      v-model="SelectReturnData.RET_BRAND_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00010', 'caption', 'Channel')"
                    label-id="EU040200_LBL00010"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU040200_TXT00004"
                      v-model="SelectReturnData.RET_CHANNEL_DESCR"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>  
                </div>
              </div>
              <div class="col-span-1" />  
              <div class="col-span-4">
                <div class="grid grid-cols-4 gap-x-3 gap-y-3">
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00011', 'caption', 'Return ID')"
                    label-id="EU040200_LBL00011"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU040200_TXT00005"
                      v-model="SelectReturnData.RET_ID"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00012', 'caption', 'Return Reason')"
                    label-id="EU040200_LBL00012"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU040200_TXT00006"
                      v-model="SelectReturnData.RET_REASON_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00013', 'caption', 'Return Req. Date')"
                    label-id="EU040200_LBL00013"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU040200_TXT00007"
                      v-model="SelectReturnData.RET_DATETIME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00014', 'caption', 'Return Status')"
                    label-id="EU040200_LBL00014"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU040200_TXT00008"
                      v-model="SelectReturnData.RET_STATUS_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00015', 'caption', 'Order ID')"
                    label-id="EU040200_LBL00015"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU040200_TXT00009"
                      v-model="SelectReturnData.RET_ORD_ID"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00016', 'caption', 'Order Type')"
                    label-id="EU040200_LBL00016"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU040200_TXT00010"
                      v-model="SelectReturnData.ORD_TYPE_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>   
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00017', 'caption', 'Order Date')"
                    label-id="EU040200_LBL00017"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU040200_TXT00011"
                      v-model="SelectReturnData.ORD_DATETIME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>      
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00018', 'caption', 'Order Status')"
                    label-id="EU040200_LBL00018"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU040200_TXT00012"
                      v-model="SelectReturnData.ORD_STATUS_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>           
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00019', 'caption', 'Sender Name')"
                    label-id="EU040200_LBL00019"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU040200_TXT00013"
                      v-model="SelectReturnData.RET_SEND_NAME_M"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00020', 'caption', 'Sender Mobile(Tel)')"
                    label-id="EU040200_LBL00020"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU040200_TXT00014"
                      v-model="SelectReturnData.RET_SEND_MOBILE_M"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00021', 'caption', 'Sender Address')"
                    label-id="EU040200_LBL00021"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU040200_TXT00015"
                      v-model="SelectReturnData.RET_SEND_ADDR_1"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU040200_LBL00022', 'caption', 'Tracking No.')"
                    label-id="EU040200_LBL00022"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <div class="flex items-center gap-x-2">
                      <FormTextInput
                        id="EU040200_TXT00016"
                        v-model="SelectReturnData.RET_PICKUP_TRACK_NO"    
                        :readonly="SelectReturnData.RET_SID === ''"                     
                      /> 
                      <Button
                        id="EU040200_BTN00001"
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
                </div>
              </div> 
            </div> 
            <div class="flex space-x-6 items-center justify-end">
              <Button
                id="EU040200_BTN00002"
                rounded
                class="w-32"
                variant="gray"
                :loading="loading"
                :disabled="SelectReturnData.RET_SID === '' || SelectReturnData.RET_SUBSTATUS_CODE == '0075'" 
                @click="updateReturnSubStatus('0075')"
              >
                {{ getComponentData('EU040200_BTN00002', 'caption', 'Holding') }}
              </Button>  
              <Button
                id="EU040200_BTN00003"
                rounded
                class="w-32"
                variant="gray"
                :loading="loading"
                :disabled="SelectReturnData.RET_SID === '' || SelectReturnData.RET_SUBSTATUS_CODE != '0075'" 
                @click="updateReturnSubStatus('0274')"
              >
                {{ getComponentData('EU040200_BTN00003', 'caption', 'UnHold') }}
              </Button>  
              <Button
                id="EU040200_BTN00004"
                rounded
                class="w-32"
                variant="gray"
                :loading="loading"
                :disabled="SelectReturnData.RET_SID === '' || SelectReturnData.RET_STATUS_CODE != '30'" 
                @click="fetchClearReturnData"
              >
                {{ getComponentData('EU040200_BTN00004', 'caption', 'Reset') }}
              </Button>
            </div>    
          </Card>          
        </div> 
        <div class="col-1">
          <div class="grid grid-rows-1 grid-flow-col h-full">
            <ChatBox
              v-if="SelectReturnData.RET_SID != ''"
              id="EU030200_CHA00001"
              :items="returnDetailInfoOperationNote"
              :title="getComponentData('EU030200_CHT00001', 'caption', 'Operation Note')"
              :reload="fetchReturnDetailInfoOperationNote"
              @add="addReturnOperationNote"
            />
          </div>          
        </div>           
      </div>
    </Card> 
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-3 space-y-3 text-white bg-black"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <p>
            {{ getComponentData('EU040200_LBL00023', 'caption', 'Inspection Items') }}
          </p>
          <div class="flex justify-between items-center gap-x-3">
            <FormCheckbox
              id="EU030200_CHK00001"
            />
            <p class="font-medium text-white">
              {{ getComponentData('EU040200_LBL00024', 'caption', 'Image Viewer') }}
            </p>
            <FormCheckbox
              id="EU030200_CHK00002"
            />
            <p class="font-medium text-white">
              {{ getComponentData('EU040200_LBL00025', 'caption', 'QA Viewer') }}
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
              :label="getComponentData('EU040200_LBL00026', 'caption', 'SKU')"
              label-id="EU030200_LBL00023"
              style="font-size: 15px;"
              horizontal
              label-width="w-3/12"
              input-width="w-9/12"
            >
              <FormTextInput
                id="EU040200_TXT00017"
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
              :label="getComponentData('EU040200_LBL00027', 'caption', 'Serial No')"
              label-id="EU030200_LBL00024"
              style="font-size: 15px;"
              horizontal
              label-width="w-3/12"
              input-width="w-9/12"
            >
              <FormTextInput
                id="EU040200_TXT00018"
                :disabled="SelectReturnData.RET_SID === '' && SelectReturnData.RET_STATUS_CODE != '30' && SelectReturnData.RET_STATUS_CODE != '31'"
                style="font-size: 15px; height: 32px;"
              />
            </FormGroup>          
          </Card> 
        </div>
        <div class="col-span-3" />        
      </div>
      <div class="grid grid-cols-4 gap-y-3 gap-x-12">
        <div class="col-span-2 pl-3 py-3">
          <p class="text-base font-semibold text-gray-700">
            {{ getComponentData('EU040200_LBL00028', 'caption', 'Inspection QTY / Return QTY : ') }}
            <span class="mx-1">
              {{ Inspection_QTY }}
            </span>
            /
            <span class="mx-1">
              {{ Return_QTY }}
            </span>
          </p>
        </div>
        <div class="col-span-2">
          <div class="flex space-x-6 items-center justify-end py-3">
            <Button
              id="EU040200_BTN00005"
              rounded
              variant="gray"
              :loading="loading"
              :disabled="SelectReturnData.RET_STATUS_CODE != '31'" 
              @click="onInbound"
            >
              {{ getComponentData('EU040200_BTN00005', 'caption', 'Inspection Completed') }}
            </Button>
            <Button
              id="EU040200_BTN00006"
              rounded
              variant="gray"
              :loading="loading"
              :disabled="SelectReturnData.RET_STATUS_CODE != '31'" 
              @click="CancelInspection"
            >
              {{ getComponentData('EU040200_BTN00006', 'caption', 'Cancel Inspection') }}
            </Button>
          </div>
        </div>
      </div>
      <div class="grid">
        <Table
          id="EU040200_GRD00001"
          class="overflow-x-auto border-b max-h-90 h-90 overflow-y-auto"
          border
          header-variant="secondary"
          :items="ReturnInspectionItemList"
          :columns="InspectedItemTableColumns"
        />
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
          :is="'POP00400'"
          @on-row-double-click="onRowDoubleClick"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>
:deep(#EU040200_CMB00004 button) {
  font-size: 12px !important;
  height: 32px !important;
}
</style>
