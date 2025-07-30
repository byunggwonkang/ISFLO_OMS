<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

import VueFeather from 'vue-feather';
import {notify} from "notiwind";


const { pageLoading, togglePageLoading } = usePageLoading();
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()
const ExchangeInspection = useExchangeInspectionStore()
const { currentTab } = storeToRefs(useTabsStore())
const { getMaskedValue } = useMasked();

const { loading, toggleLoading } = useLoading()

const { StationList,WorkStaffList, ExchangeSummaryList, ExchangeStatusList,ExchangeDetailInfoOperationNote,filters,ExchangeListData,ExchangeInspectionItemList } = storeToRefs(ExchangeInspection)

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const Station = ref({})
const STATION_WH_FNAME = ref("")
const WorkStaff = ref({})
const channelList = ref([])
const channel = ref({})
const ExchangeList = ref([])
const ExchangeData = ref({})
const Barcode = ref("")
const SKU_DATA = ref("")

const EXCHANGE_LIST_CNT = ref("")
const REQUEST_CANCEL_CNT = ref("")
const HOLD_BY_ESM_CNT = ref("")

const WATINGINBOUND_CNT = ref("")
const INBOUND_CNT = ref("")
const INBOUNDINSPECTION_CNT = ref("")

const Inspection_QTY = ref("0")

const EXCHANGE_QTY = ref("0")

const SelectExchangeData = ref({
  EXC_SID : '',
  EXC_BRAND_CODE : '',
  EXC_BRAND_FNAME : '',
  EXC_CHANNEL_CODE : '',
  EXC_CHANNEL_DESCR : '',
  EXC_ID : '',
  EXC_STATUS_CODE : '',
  EXC_STATUS_FNAME : '',
  EXC_SUBSTATUS_CODE : '',
  EXC_SUBSTATUS_FNAME : '',
  EXC_DATETIME : '',
  EXC_REASON_FNAME : '',
  EXC_SEND_NAME_M : '',
  EXC_SEND_TEL_M : '',
  EXC_SEND_MOBILE_M : '',
  EXC_SEND_ADDR_1 : '',
  EXC_PICKUP_TRACK_NO : '',
  EXC_ORD_ID : '',
  ORD_TYPE_FNAME : '',
  ORD_DATETIME : '',
  ORD_STATUS_FNAME : '',
})

/* Dialog Modal */
const openDialogModal = ref(false)
const openExchangeModal = ref(false)

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
    await ExchangeInspection.fetchExchangeSummaryList()
    const selectedChannel = ExchangeSummaryList.value.find((channel) => decrypt(channel.EXC_SUM_CHANNEL_CODE) === value?.value.value)
    WATINGINBOUND_CNT.value = selectedChannel ? selectedChannel?.EXC_SUM_COUNT_03 : encrypt('0')
    INBOUNDINSPECTION_CNT.value = selectedChannel ? selectedChannel?.EXC_SUM_COUNT_04 : encrypt('0')
    INBOUND_CNT.value = selectedChannel ? selectedChannel?.EXC_SUM_COUNT_05 : encrypt('0')

    filters.value.FLT_STATUS = ["30","31"]
    filters.value.FLT_CHANNELS = [value?.value.value]
    filters.value.FLT_INCLUDE_REQSUB = "0";
    filters.value.FLT_EXCHANGE_TYPES = ["R"];
    filters.value.FLT_VIEW_OPT = '0010';

    const { data } = await ExchangeInspection.fetchExchangeDetailList()
    
    ExchangeList.value = data

    ExchangeData.value = {
      name: '',
      value: '',
    };
  }
}, { deep: true })

watch(() => ExchangeData, async (value) => {
  if (value) {
    const selectedExchange = ExchangeList.value.find((Exchange) => decrypt(Exchange.EXC_SID) === value?.value.value)
    
    if(selectedExchange)
    {
      SelectExchangeData.value.EXC_SID = selectedExchange ? decrypt(selectedExchange?.EXC_SID) : ''
      SelectExchangeData.value.EXC_BRAND_CODE = selectedExchange ? decrypt(selectedExchange?.EXC_BRAND_CODE) : ''
      SelectExchangeData.value.EXC_BRAND_FNAME = selectedExchange ? decrypt(selectedExchange?.EXC_BRAND_FNAME) : ''
      SelectExchangeData.value.EXC_CHANNEL_CODE = selectedExchange ? decrypt(selectedExchange?.EXC_CHANNEL_CODE) : ''
      SelectExchangeData.value.EXC_CHANNEL_DESCR = selectedExchange ? decrypt(selectedExchange?.EXC_CHANNEL_DESCR) : ''
      SelectExchangeData.value.EXC_ID = selectedExchange ? decrypt(selectedExchange?.EXC_ID) : ''
      SelectExchangeData.value.EXC_STATUS_CODE = selectedExchange ? decrypt(selectedExchange?.EXC_STATUS_CODE) : ''
      SelectExchangeData.value.EXC_STATUS_FNAME = selectedExchange ? decrypt(selectedExchange?.EXC_STATUS_FNAME) : ''
      SelectExchangeData.value.EXC_SUBSTATUS_CODE = selectedExchange ? decrypt(selectedExchange?.EXC_SUBSTATUS_CODE) : ''
      SelectExchangeData.value.EXC_SUBSTATUS_FNAME = selectedExchange ? decrypt(selectedExchange?.EXC_SUBSTATUS_FNAME) : ''
      SelectExchangeData.value.EXC_DATETIME = selectedExchange ? decrypt(selectedExchange?.EXC_DATETIME) : ''
      SelectExchangeData.value.EXC_REASON_FNAME = selectedExchange ? decrypt(selectedExchange?.EXC_REASON_FNAME) : ''
      SelectExchangeData.value.EXC_SEND_NAME_M = selectedExchange ? decrypt(selectedExchange?.EXC_SEND_NAME_M) : ''
      SelectExchangeData.value.EXC_SEND_TEL_M = selectedExchange ? decrypt(selectedExchange?.EXC_SEND_TEL_M) : ''
      SelectExchangeData.value.EXC_SEND_MOBILE_M = selectedExchange ? decrypt(selectedExchange?.EXC_SEND_MOBILE_M) : ''
      SelectExchangeData.value.EXC_SEND_ADDR_1 = selectedExchange ? decrypt(selectedExchange?.EXC_SEND_ADDR_1) : ''
      SelectExchangeData.value.EXC_PICKUP_TRACK_NO = selectedExchange ? decrypt(selectedExchange?.EXC_PICKUP_TRACK_NO) : ''    
      SelectExchangeData.value.EXC_ORD_ID = selectedExchange ? decrypt(selectedExchange?.EXC_ORD_ID) : ''
      SelectExchangeData.value.ORD_TYPE_FNAME = selectedExchange ? decrypt(selectedExchange?.ORD_TYPE_FNAME) : ''
      SelectExchangeData.value.ORD_DATETIME = selectedExchange ? decrypt(selectedExchange?.ORD_DATETIME) : ''
      SelectExchangeData.value.ORD_STATUS_FNAME = selectedExchange ? decrypt(selectedExchange?.ORD_STATUS_FNAME) : ''


      const INPUT_DATA = ref({
        FLT_STATION_USER_SID: Station.value?.value ?? '',
        FLT_BRAND_CODE: selectedExchange ? decrypt(selectedExchange?.EXC_BRAND_CODE) : '',
        FLT_CHANNEL_CODE: selectedExchange ? decrypt(selectedExchange?.EXC_CHANNEL_CODE) : '',
        FLT_EXCHANGE_SID: selectedExchange ? decrypt(selectedExchange?.EXC_SID) : '',
      })
      await ExchangeInspection.fetchExchangeItemInputGet(INPUT_DATA.value)
      await fetchExchangeDetailInfoOperationNote()
    }    
  }
}, { deep: true })

watch(() => ExchangeInspectionItemList, async (value) => {
  if (value) {
    let InspectionQTY = 0
    let ExchangeQTY = 0
    for (let i = 0; i < value.value.length; i++) 
    {
      ExchangeQTY = ExchangeQTY + Number(decrypt(value.value[i].EXCHANGE_ITEM_QTY))
      InspectionQTY = InspectionQTY + Number(decrypt(value.value[i].EXCHANGE_INPUT_QTY))
    }
    Inspection_QTY.value = InspectionQTY.toString()
    EXCHANGE_QTY.value = ExchangeQTY.toString()
  }
}, { deep: true })

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  
  await pageLoader.fetchPageLoadData(currentTab.value?.component)
  await ExchangeInspection.fetchStationList()
  await ExchangeInspection.fetchWorkStaffList()
  await ExchangeInspection.fetchExchangeStatusList()

  Station.value = {
    name: decrypt(StationList.value[0].STATION_ID) || '',
    value: decrypt(StationList.value[0].USER_SID) || '',
  };

  WorkStaff.value = {
    name: WorkStaffList.value[0] ? decrypt(WorkStaffList.value[0].STAFF_NAME) : '',
    value: WorkStaffList.value[0] ? decrypt(WorkStaffList.value[0].STAFF_SID) : '',
  }; 

  const EXCHANGE_LIST = ExchangeStatusList.value.find((channel) => decrypt(channel.EXC_STATUS_CODE) === '0110')
  EXCHANGE_LIST_CNT.value = EXCHANGE_LIST?.EXC_STATUS_VALUE
  const REQUEST_CANCEL = ExchangeStatusList.value.find((channel) => decrypt(channel.EXC_STATUS_CODE) === '0130')
  REQUEST_CANCEL_CNT.value = REQUEST_CANCEL?.EXC_STATUS_VALUE
  const HOLD_BY_ESM = ExchangeStatusList.value.find((channel) => decrypt(channel.EXC_STATUS_CODE) === '0160')
  HOLD_BY_ESM_CNT.value = HOLD_BY_ESM ? HOLD_BY_ESM?.EXC_STATUS_VALUE : encrypt('0')

  isloading.isLoading = false
  togglePageLoading()
})

const fetchClearExchangeData = async () => {
  toggleLoading()
  isloading.isLoading = true
  SelectExchangeData.value = {
    EXC_SID : '',
    EXC_BRAND_CODE : '',
    EXC_BRAND_FNAME : '',
    EXC_CHANNEL_CODE : '',
    EXC_CHANNEL_DESCR : '',
    EXC_ID : '',
    EXC_STATUS_CODE : '',
    EXC_STATUS_FNAME : '',
    EXC_SUBSTATUS_CODE : '',
    EXC_SUBSTATUS_FNAME : '',
    EXC_DATETIME : '',
    EXC_REASON_FNAME : '',
    EXC_SEND_NAME_M : '',
    EXC_SEND_TEL_M : '',
    EXC_SEND_MOBILE_M : '',
    EXC_SEND_ADDR_1 : '',
    EXC_PICKUP_TRACK_NO : '',
    EXC_ORD_ID : '',
    ORD_TYPE_FNAME : '',
    ORD_DATETIME : '',
    ORD_STATUS_FNAME : '',
  }

  ExchangeInspection.resetExchangeItemInputGet()
  ExchangeInspection.resetExchangeDetailInfoOperationNote()
  
  await ExchangeInspection.fetchExchangeSummaryList()
  const selectedChannel = ExchangeSummaryList.value.find((channels) => decrypt(channels.EXC_SUM_CHANNEL_CODE) === channel.value.value)
  WATINGINBOUND_CNT.value = selectedChannel ? selectedChannel?.EXC_SUM_COUNT_03 : encrypt('0')
  INBOUNDINSPECTION_CNT.value = selectedChannel ? selectedChannel?.EXC_SUM_COUNT_04 : encrypt('0')
  INBOUND_CNT.value = selectedChannel ? selectedChannel?.EXC_SUM_COUNT_05 : encrypt('0')
  filters.value.FLT_STATUS = ["30","31"]
  filters.value.FLT_CHANNELS = [channel.value.value]
  filters.value.FLT_INCLUDE_REQSUB = "0";
  filters.value.FLT_EXCHANGE_TYPES = ["R"];
  filters.value.FLT_VIEW_OPT = '0010';
  const { data } = await ExchangeInspection.fetchExchangeDetailList()
  
  ExchangeList.value = data
  ExchangeData.value = {
    name: '',
    value: '',
  };

  SKU_DATA.value = ''
  isloading.isLoading = false
  toggleLoading()
}

const fetchExchangeDetailInfoOperationNote = async () => {
  toggleLoading()
  isloading.isLoading = true
  await ExchangeInspection.fetchExchangeDetailInfoOperationNote(encrypt(SelectExchangeData.value.EXC_SID))
  isloading.isLoading = false
  toggleLoading()
}

const addExchangeOperationNote = async (note) => {
  toggleLoading()
  isloading.isLoading = true
  await ExchangeInspection.addExchangeOperationNote({
    FLT_EXCHANGE_SID: SelectExchangeData.value.EXC_SID,
    FLT_NOTE: note,
  })
  await fetchExchangeDetailInfoOperationNote()
  isloading.isLoading = false
  toggleLoading()
}

const updateExchangeSubStatus = async (item) => {
  const STATUS_DATA = ref({
    FLT_TO_SUBSTATUS_CODE: encrypt(item),  
    FLT_EXCHANGES: [
      {"EXC_SID":encrypt(SelectExchangeData.value.EXC_SID)}
    ],
  })
  toggleLoading()
  isloading.isLoading = true
  await ExchangeInspection.fetchExchangeSubStatusChange(STATUS_DATA.value)
  await ExchangeReSearch()
  isloading.isLoading = false
  toggleLoading()
}

const ConfirmDialog = async () => {

  if(DIALOG_TYPE.value == 'CANCEL')
  {
    const INPUT_DATA = ref({
      FLT_STATION_USER_SID: Station.value?.value ?? '',
      FLT_BRAND_CODE: SelectExchangeData.value.EXC_BRAND_CODE,
      FLT_CHANNEL_CODE: SelectExchangeData.value.EXC_CHANNEL_CODE,
      FLT_EXCHANGE_SID: SelectExchangeData.value.EXC_SID,
    })
    toggleLoading()
    isloading.isLoading = true
    const { success } = await ExchangeInspection.fetchExchangeItemInputClearSet(INPUT_DATA.value)
    if (success) {

      const STATUS_DATA = ref({
        FLT_TO_STATUS_CODE: encrypt("30"),  
        FLT_EXCHANGES: [
          {"EXC_SID":encrypt(SelectExchangeData.value.EXC_SID)}
        ],  
      })

      const { success } = await ExchangeInspection.fetchExchangeStatusChange(STATUS_DATA.value)
      
      if (success) await fetchClearExchangeData()          
    }
    isloading.isLoading = false

    toggleLoading()
  }
  else if(DIALOG_TYPE.value == 'SAVE')
  {
    const STATUS_DATA = ref({
      FLT_TO_STATUS_CODE: encrypt("40"),  
      FLT_EXCHANGES: [
        {"EXC_SID":encrypt(SelectExchangeData.value.EXC_SID)}
      ],  
    })
    const { success } = await ExchangeInspection.fetchExchangeStatusChange(STATUS_DATA.value)
    
    if (success) await fetchClearExchangeData()  
  }

  openDialogModal.value = false
}

const onBarcodeEnter = async (showLoading = true) => {
  
  if(Barcode.value != '')
  {
    const INPUT_DATA = ref({
      FLT_STATION_USER_SID: Station.value?.value ?? '',
      FLT_CHANNEL_CODE: channel.value?.value ?? '',
      FLT_EXCHANGE_SID: '',
      FLT_KEY_WORD: Barcode.value,
    })
    if (showLoading) toggleLoading()
    isloading.isLoading = true
    const { success } = await ExchangeInspection.fetchExchangeList(INPUT_DATA.value)

    if (success)
    {
      if (ExchangeListData.value.length == 1)
      {
        SelectExchangeData.value.EXC_SID = ExchangeListData.value[0].EXC_SID ? decrypt(ExchangeListData.value[0].EXC_SID) : ''
        SelectExchangeData.value.EXC_BRAND_CODE = ExchangeListData.value[0].EXC_BRAND_CODE ? decrypt(ExchangeListData.value[0].EXC_BRAND_CODE) : ''
        SelectExchangeData.value.EXC_BRAND_FNAME = ExchangeListData.value[0].EXC_BRAND_FNAME ? decrypt(ExchangeListData.value[0].EXC_BRAND_FNAME) : ''
        SelectExchangeData.value.EXC_CHANNEL_CODE = ExchangeListData.value[0].EXC_CHANNEL_CODE ? decrypt(ExchangeListData.value[0].EXC_CHANNEL_CODE) : ''
        SelectExchangeData.value.EXC_CHANNEL_DESCR = ExchangeListData.value[0].EXC_CHANNEL_DESCR ? decrypt(ExchangeListData.value[0].EXC_CHANNEL_DESCR) : ''
        SelectExchangeData.value.EXC_ID = ExchangeListData.value[0].EXC_ID ? decrypt(ExchangeListData.value[0].EXC_ID) : ''
        SelectExchangeData.value.EXC_STATUS_CODE = ExchangeListData.value[0].EXC_STATUS_CODE ? decrypt(ExchangeListData.value[0].EXC_STATUS_CODE) : ''
        SelectExchangeData.value.EXC_STATUS_FNAME = ExchangeListData.value[0].EXC_STATUS_FNAME ? decrypt(ExchangeListData.value[0].EXC_STATUS_FNAME) : ''
        SelectExchangeData.value.EXC_SUBSTATUS_CODE = ExchangeListData.value[0].EXC_SUBSTATUS_CODE ? decrypt(ExchangeListData.value[0].EXC_SUBSTATUS_CODE) : ''
        SelectExchangeData.value.EXC_SUBSTATUS_FNAME = ExchangeListData.value[0].EXC_SUBSTATUS_FNAME ? decrypt(ExchangeListData.value[0].EXC_SUBSTATUS_FNAME) : ''
        SelectExchangeData.value.EXC_DATETIME = ExchangeListData.value[0].EXC_DATETIME ? decrypt(ExchangeListData.value[0].EXC_DATETIME) : ''
        SelectExchangeData.value.EXC_REASON_FNAME = ExchangeListData.value[0].EXC_REASON_FNAME ? decrypt(ExchangeListData.value[0].EXC_REASON_FNAME) : ''
        SelectExchangeData.value.EXC_SEND_NAME_M = ExchangeListData.value[0].EXC_SEND_NAME_M ? decrypt(ExchangeListData.value[0].EXC_SEND_NAME_M) : ''
        SelectExchangeData.value.EXC_SEND_TEL_M = ExchangeListData.value[0].EXC_SEND_TEL_M ? decrypt(ExchangeListData.value[0].EXC_SEND_TEL_M) : ''
        SelectExchangeData.value.EXC_SEND_MOBILE_M = ExchangeListData.value[0].EXC_SEND_MOBILE_M ? decrypt(ExchangeListData.value[0].EXC_SEND_MOBILE_M) : ''
        SelectExchangeData.value.EXC_SEND_ADDR_1 = ExchangeListData.value[0].EXC_SEND_ADDR_1 ? decrypt(ExchangeListData.value[0].EXC_SEND_ADDR_1) : ''
        SelectExchangeData.value.EXC_PICKUP_TRACK_NO = ExchangeListData.value[0].EXC_PICKUP_TRACK_NO ? decrypt(ExchangeListData.value[0].EXC_PICKUP_TRACK_NO) : ''    
        SelectExchangeData.value.EXC_ORD_ID = ExchangeListData.value[0].EXC_ORD_ID ? decrypt(ExchangeListData.value[0].EXC_ORD_ID) : ''
        SelectExchangeData.value.ORD_TYPE_FNAME = ExchangeListData.value[0].ORD_TYPE_FNAME ? decrypt(ExchangeListData.value[0].ORD_TYPE_FNAME) : ''
        SelectExchangeData.value.ORD_DATETIME = ExchangeListData.value[0].ORD_DATETIME ? decrypt(ExchangeListData.value[0].ORD_DATETIME) : ''
        SelectExchangeData.value.ORD_STATUS_FNAME = ExchangeListData.value[0].ORD_STATUS_FNAME ? decrypt(ExchangeListData.value[0].ORD_STATUS_FNAME) : ''
        

        const INPUT_DATA = ref({
          FLT_STATION_USER_SID: Station.value?.value ?? '',
          FLT_BRAND_CODE: decrypt(ExchangeListData.value[0].EXC_BRAND_CODE),
          FLT_CHANNEL_CODE: decrypt(ExchangeListData.value[0].EXC_CHANNEL_CODE),
          FLT_EXCHANGE_SID: decrypt(ExchangeListData.value[0].EXC_SID),
        })
        await ExchangeInspection.fetchExchangeItemInputGet(INPUT_DATA.value)
        await fetchExchangeDetailInfoOperationNote()

      }
      else if (ExchangeListData.value.length > 1)
      {          
        openExchangeModal.value = true
      }
      
    }    

    isloading.isLoading = false
    if (showLoading) toggleLoading()
  }
}

const onRowDoubleClick = async (data) => {

  SelectExchangeData.value.EXC_SID = data.EXC_SID ? decrypt(data.EXC_SID) : ''
  SelectExchangeData.value.EXC_BRAND_CODE = data.EXC_BRAND_CODE ? decrypt(data.EXC_BRAND_CODE) : ''
  SelectExchangeData.value.EXC_BRAND_FNAME = data.EXC_BRAND_FNAME ? decrypt(data.EXC_BRAND_FNAME) : ''
  SelectExchangeData.value.EXC_CHANNEL_CODE = data.EXC_CHANNEL_CODE ? decrypt(data.EXC_CHANNEL_CODE) : ''
  SelectExchangeData.value.EXC_CHANNEL_DESCR = data.EXC_CHANNEL_DESCR ? decrypt(data.EXC_CHANNEL_DESCR) : ''
  SelectExchangeData.value.EXC_ID = data.EXC_ID ? decrypt(data.EXC_ID) : ''
  SelectExchangeData.value.EXC_STATUS_CODE = data.EXC_STATUS_CODE ? decrypt(data.EXC_STATUS_CODE) : ''
  SelectExchangeData.value.EXC_STATUS_FNAME = data.EXC_STATUS_FNAME ? decrypt(data.EXC_STATUS_FNAME) : ''
  SelectExchangeData.value.EXC_SUBSTATUS_CODE = data.EXC_SUBSTATUS_CODE ? decrypt(data.EXC_SUBSTATUS_CODE) : ''
  SelectExchangeData.value.EXC_SUBSTATUS_FNAME = data.EXC_SUBSTATUS_FNAME ? decrypt(data.EXC_SUBSTATUS_FNAME) : ''
  SelectExchangeData.value.EXC_DATETIME = data.EXC_DATETIME ? decrypt(data.EXC_DATETIME) : ''
  SelectExchangeData.value.EXC_REASON_FNAME = data.EXC_REASON_FNAME ? decrypt(data.EXC_REASON_FNAME) : ''
  SelectExchangeData.value.EXC_SEND_NAME_M = data.EXC_SEND_NAME_M ? decrypt(data.EXC_SEND_NAME_M) : ''
  SelectExchangeData.value.EXC_SEND_TEL_M = data.EXC_SEND_TEL_M ? decrypt(data.EXC_SEND_TEL_M) : ''
  SelectExchangeData.value.EXC_SEND_MOBILE_M = data.EXC_SEND_MOBILE_M ? decrypt(data.EXC_SEND_MOBILE_M) : ''
  SelectExchangeData.value.EXC_SEND_ADDR_1 = data.EXC_SEND_ADDR_1 ? decrypt(data.EXC_SEND_ADDR_1) : ''
  SelectExchangeData.value.EXC_PICKUP_TRACK_NO = data.EXC_PICKUP_TRACK_NO ? decrypt(data.EXC_PICKUP_TRACK_NO) : ''    
  SelectExchangeData.value.EXC_ORD_ID = data.EXC_ORD_ID ? decrypt(data.EXC_ORD_ID) : ''
  SelectExchangeData.value.ORD_TYPE_FNAME = data.ORD_TYPE_FNAME ? decrypt(data.ORD_TYPE_FNAME) : ''
  SelectExchangeData.value.ORD_DATETIME = data.ORD_DATETIME ? decrypt(data.ORD_DATETIME) : ''
  SelectExchangeData.value.ORD_STATUS_FNAME = data.ORD_STATUS_FNAME ? decrypt(data.ORD_STATUS_FNAME) : ''

  const INPUT_DATA = ref({
    FLT_STATION_USER_SID: Station.value?.value ?? '',
    FLT_BRAND_CODE: decrypt(data.EXC_BRAND_CODE),
    FLT_CHANNEL_CODE: decrypt(data.EXC_CHANNEL_CODE),
    FLT_EXCHANGE_SID: decrypt(data.EXC_SID),
  })
  await ExchangeInspection.fetchExchangeItemInputGet(INPUT_DATA.value)

  await fetchExchangeDetailInfoOperationNote()
  
  openExchangeModal.value = false
}

const onSKUEnter = async (showLoading = true) => {
  
  const newElement = ExchangeInspectionItemList.value?.find((item) => item.EXCHANGE_ITEM_CODE === encrypt(SKU_DATA.value))
  
  if(newElement)
  {

    if(SelectExchangeData.value.EXC_STATUS_CODE == '30')
    {
      const STATUS_DATA = ref({
        FLT_TO_STATUS_CODE: encrypt("31"),  
        FLT_EXCHANGES: [
          {"EXC_SID":encrypt(SelectExchangeData.value.EXC_SID)}
        ],  
      })

      if (showLoading) toggleLoading()
      isloading.isLoading = true
      const { success } = await ExchangeInspection.fetchExchangeStatusChange(STATUS_DATA.value)
      if (!success) {
        isloading.isLoading = false
        if (showLoading) toggleLoading()
        return
      }
      ExchangeReSearch()
      isloading.isLoading = false
      if (showLoading) toggleLoading()
    }
    else if(SelectExchangeData.value.EXC_STATUS_CODE != '31')
    {
      return
    }

    const INPUT_DATA = ref({
      FLT_STATION_USER_SID: Station.value?.value ?? '',
      FLT_BRAND_CODE: SelectExchangeData.value.EXC_BRAND_CODE,
      FLT_CHANNEL_CODE: SelectExchangeData.value.EXC_CHANNEL_CODE,
      FLT_EXCHANGE_SID: SelectExchangeData.value.EXC_SID,
      FLT_ITEM_CODE: SKU_DATA.value,
      FLT_INPUT_TYPE_CODE: '0020',
      FLT_STAFF_SID: WorkStaff.value?.value ?? '',
      FLT_QAVIEW_ID: '0',
    })
    if (showLoading) toggleLoading()
    isloading.isLoading = true
    await ExchangeInspection.fetchExchangeItemInputADDSet(INPUT_DATA.value)
    isloading.isLoading = false
    if (showLoading) toggleLoading()

  }  

  SKU_DATA.value = ''
}

const ExchangeReSearch = async () => {
  
  const INPUT_DATA = ref({
      FLT_STATION_USER_SID: Station.value?.value ?? '',
      FLT_CHANNEL_CODE: channel.value?.value ?? '',
      FLT_EXCHANGE_SID: SelectExchangeData.value.EXC_SID,
      FLT_KEY_WORD: '',
    })
    toggleLoading()
    isloading.isLoading = true
    const { success } = await ExchangeInspection.fetchExchangeList(INPUT_DATA.value)

    if (success)
    {
      if (ExchangeListData.value.length == 1)
      {
        SelectExchangeData.value.EXC_SID = ExchangeListData.value[0].EXC_SID ? decrypt(ExchangeListData.value[0].EXC_SID) : ''
        SelectExchangeData.value.EXC_BRAND_CODE = ExchangeListData.value[0].EXC_BRAND_CODE ? decrypt(ExchangeListData.value[0].EXC_BRAND_CODE) : ''
        SelectExchangeData.value.EXC_BRAND_FNAME = ExchangeListData.value[0].EXC_BRAND_FNAME ? decrypt(ExchangeListData.value[0].EXC_BRAND_FNAME) : ''
        SelectExchangeData.value.EXC_CHANNEL_CODE = ExchangeListData.value[0].EXC_CHANNEL_CODE ? decrypt(ExchangeListData.value[0].EXC_CHANNEL_CODE) : ''
        SelectExchangeData.value.EXC_CHANNEL_DESCR = ExchangeListData.value[0].EXC_CHANNEL_DESCR ? decrypt(ExchangeListData.value[0].EXC_CHANNEL_DESCR) : ''
        SelectExchangeData.value.EXC_ID = ExchangeListData.value[0].EXC_ID ? decrypt(ExchangeListData.value[0].EXC_ID) : ''
        SelectExchangeData.value.EXC_STATUS_CODE = ExchangeListData.value[0].EXC_STATUS_CODE ? decrypt(ExchangeListData.value[0].EXC_STATUS_CODE) : ''
        SelectExchangeData.value.EXC_STATUS_FNAME = ExchangeListData.value[0].EXC_STATUS_FNAME ? decrypt(ExchangeListData.value[0].EXC_STATUS_FNAME) : ''
        SelectExchangeData.value.EXC_SUBSTATUS_CODE = ExchangeListData.value[0].EXC_SUBSTATUS_CODE ? decrypt(ExchangeListData.value[0].EXC_SUBSTATUS_CODE) : ''
        SelectExchangeData.value.EXC_SUBSTATUS_FNAME = ExchangeListData.value[0].EXC_SUBSTATUS_FNAME ? decrypt(ExchangeListData.value[0].EXC_SUBSTATUS_FNAME) : ''
        SelectExchangeData.value.EXC_DATETIME = ExchangeListData.value[0].EXC_DATETIME ? decrypt(ExchangeListData.value[0].EXC_DATETIME) : ''
        SelectExchangeData.value.EXC_REASON_FNAME = ExchangeListData.value[0].EXC_REASON_FNAME ? decrypt(ExchangeListData.value[0].EXC_REASON_FNAME) : ''
        SelectExchangeData.value.EXC_SEND_NAME_M = ExchangeListData.value[0].EXC_SEND_NAME_M ? decrypt(ExchangeListData.value[0].EXC_SEND_NAME_M) : ''
        SelectExchangeData.value.EXC_SEND_TEL_M = ExchangeListData.value[0].EXC_SEND_TEL_M ? decrypt(ExchangeListData.value[0].EXC_SEND_TEL_M) : ''
        SelectExchangeData.value.EXC_SEND_MOBILE_M = ExchangeListData.value[0].EXC_SEND_MOBILE_M ? decrypt(ExchangeListData.value[0].EXC_SEND_MOBILE_M) : ''
        SelectExchangeData.value.EXC_SEND_ADDR_1 = ExchangeListData.value[0].EXC_SEND_ADDR_1 ? decrypt(ExchangeListData.value[0].EXC_SEND_ADDR_1) : ''
        SelectExchangeData.value.EXC_PICKUP_TRACK_NO = ExchangeListData.value[0].EXC_PICKUP_TRACK_NO ? decrypt(ExchangeListData.value[0].EXC_PICKUP_TRACK_NO) : ''    
        SelectExchangeData.value.EXC_ORD_ID = ExchangeListData.value[0].EXC_ORD_ID ? decrypt(ExchangeListData.value[0].EXC_ORD_ID) : ''
        SelectExchangeData.value.ORD_TYPE_FNAME = ExchangeListData.value[0].ORD_TYPE_FNAME ? decrypt(ExchangeListData.value[0].ORD_TYPE_FNAME) : ''
        SelectExchangeData.value.ORD_DATETIME = ExchangeListData.value[0].ORD_DATETIME ? decrypt(ExchangeListData.value[0].ORD_DATETIME) : ''
        SelectExchangeData.value.ORD_STATUS_FNAME = ExchangeListData.value[0].ORD_STATUS_FNAME ? decrypt(ExchangeListData.value[0].ORD_STATUS_FNAME) : ''

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
    FLT_TO_TRACKING_NO: SelectExchangeData.value.EXC_PICKUP_TRACK_NO,  
    FLT_EXCHANGE_SID: SelectExchangeData.value.EXC_SID
  })
  toggleLoading()
  isloading.isLoading = true
  const { success } = await ExchangeInspection.fetchExchangeTrackingChangeSet(TRACKING_DATA.value)
  if (!success) {
    isloading.isLoading = false
    toggleLoading()
    return
  }
  ExchangeReSearch()
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
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU050200_GRD00001')
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
          {{ getComponentData('EU050200_LBL00001', 'caption', 'Station Information') }}
        </p>
      </template>
      <div class="grid grid-cols-4 gap-x-3">
        <FormGroup
          :label="getComponentData('EU050200_LBL00002', 'caption', 'Station ID')"
          label-id="EU050200_LBL00002"
          label-for="EU050200_CMB00001"
          label-width="w-1/4"
          input-width="w-3/4"
          horizontal
        >
          <FormSelect
            id="EU050200_CMB00001"
            v-model="Station"
            :options="StationList.map((item) => ({
              name: decrypt(item.STATION_ID),
              value: decrypt(item.USER_SID),
            }))"
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU050200_LBL00003', 'caption', 'Warehouse')"
          label-id="EU050200_LBL00003"
          label-for="EU050200_TXT00001"
          label-width="w-1/4"
          input-width="w-3/4"
          horizontal
        >
          <FormTextInput
            id="EU050200_TXT00001"
            v-model="STATION_WH_FNAME"
            class="bg-gray-100"
            readonly
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU050200_LBL00004', 'caption', 'Inspection Staff')"
          label-id="EU050200_LBL00004"
          label-for="EU050200_CMB00002"
          label-width="w-1/4"
          input-width="w-3/4"
          horizontal
        >
          <FormSelect
            id="EU050200_CMB00002"
            v-model="WorkStaff"
            :options="WorkStaffList.map((item) => ({
              name: decrypt(item.STAFF_NAME),
              value: decrypt(item.STAFF_SID),
            }))"
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU050200_LBL00005', 'caption', 'Channel')"
          label-id="EU050200_LBL00005"
          label-for="EU050200_CMB00003"
          label-width="w-1/4"
          input-width="w-3/4"
          horizontal
        >
          <FormSelect
            id="EU050200_CMB00003"
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
            {{ "Exchange List" }}
          </span>
          <span
            class="text-2xl font-black text-white"
          >
            {{ decrypt(EXCHANGE_LIST_CNT) }}
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
          {{ getComponentData('EU050200_LBL00006', 'caption', 'Inspection Information') }}
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
                  :label="getComponentData('EU050200_LBL00007', 'caption', 'Barcode')"
                  label-id="EU050200_LBL00007"          
                  horizontal
                  label-width="w-1/6"
                  input-width="w-5/6"
                >
                  <FormTextInput
                    id="EU050200_TXT00002" 
                    v-model="Barcode"
                    style="font-size: 14px; height: 32px;" 
                    placeholder="Invoice No or Tracking No"
                    :disabled="SelectExchangeData.EXC_STATUS_CODE != '30' && SelectExchangeData.EXC_STATUS_CODE != ''" 
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
                  :label="getComponentData('EU050200_LBL00008', 'caption', 'Delivery ID')"
                  label-id="EU050200_LBL00008"          
                  horizontal
                  label-width="w-1/6"
                  input-width="w-5/6"
                >
                  <FormSelect
                    id="EU050200_CMB00004"
                    v-model="ExchangeData"
                    :options="ExchangeList.map((item) => ({ 
                      value: decrypt(item.EXC_SID), 
                      name: 'Exchange ID : ' + decrypt(item.EXC_ID) + 
                        '/Order ID : ' + decrypt(item.EXC_ORD_ID) + 
                        '/Name : ' + decrypt(item.EXC_SEND_NAME_M) + 
                        '/Mobile : ' + decrypt(item.EXC_SEND_MOBILE_M) 
                    }))"
                    :disabled="SelectExchangeData.EXC_STATUS_CODE != '30' && SelectExchangeData.EXC_STATUS_CODE != ''"
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
                    :label="getComponentData('EU050200_LBL00009', 'caption', 'Brand')"
                    label-id="EU050200_LBL00009"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU050200_TXT00003"
                      v-model="SelectExchangeData.EXC_BRAND_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU050200_LBL00010', 'caption', 'Channel')"
                    label-id="EU050200_LBL00010"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU050200_TXT00004"
                      v-model="SelectExchangeData.EXC_CHANNEL_DESCR"
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
                    :label="getComponentData('EU050200_LBL00011', 'caption', 'Exchange ID')"
                    label-id="EU050200_LBL00011"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU050200_TXT00005"
                      v-model="SelectExchangeData.EXC_ID"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU050200_LBL00012', 'caption', 'Exchange Reason')"
                    label-id="EU050200_LBL00012"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU050200_TXT00006"
                      v-model="SelectExchangeData.EXC_REASON_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU050200_LBL00013', 'caption', 'Exchange Req. Date')"
                    label-id="EU050200_LBL00013"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU050200_TXT00007"
                      v-model="SelectExchangeData.EXC_DATETIME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU050200_LBL00014', 'caption', 'Exchange Status')"
                    label-id="EU050200_LBL00014"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU050200_TXT00008"
                      v-model="SelectExchangeData.EXC_STATUS_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU050200_LBL00015', 'caption', 'Order ID')"
                    label-id="EU050200_LBL00015"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU050200_TXT00009"
                      v-model="SelectExchangeData.EXC_ORD_ID"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU050200_LBL00016', 'caption', 'Order Type')"
                    label-id="EU050200_LBL00016"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU050200_TXT00010"
                      v-model="SelectExchangeData.ORD_TYPE_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>   
                  <FormGroup
                    :label="getComponentData('EU050200_LBL00017', 'caption', 'Order Date')"
                    label-id="EU050200_LBL00017"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU050200_TXT00011"
                      v-model="SelectExchangeData.ORD_DATETIME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>      
                  <FormGroup
                    :label="getComponentData('EU050200_LBL00018', 'caption', 'Order Status')"
                    label-id="EU050200_LBL00018"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU050200_TXT00012"
                      v-model="SelectExchangeData.ORD_STATUS_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>           
                  <FormGroup
                    :label="getComponentData('EU050200_LBL00019', 'caption', 'Sender Name')"
                    label-id="EU050200_LBL00019"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU050200_TXT00013"
                      v-model="SelectExchangeData.EXC_SEND_NAME_M"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU050200_LBL00020', 'caption', 'Sender Mobile(Tel)')"
                    label-id="EU050200_LBL00020"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU050200_TXT00014"
                      v-model="SelectExchangeData.EXC_SEND_MOBILE_M"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU050200_LBL00021', 'caption', 'Sender Address')"
                    label-id="EU050200_LBL00021"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="EU050200_TXT00015"
                      v-model="SelectExchangeData.EXC_SEND_ADDR_1"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('EU050200_LBL00022', 'caption', 'Tracking No.')"
                    label-id="EU050200_LBL00022"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <div class="flex items-center gap-x-2">
                      <FormTextInput
                        id="EU050200_TXT00016"
                        v-model="SelectExchangeData.EXC_PICKUP_TRACK_NO"    
                        :readonly="SelectExchangeData.EXC_SID === ''"                     
                      /> 
                      <Button
                        id="EU050200_BTN00001"
                        rounded
                        variant="gray"
                        :disabled="SelectExchangeData.EXC_SID === ''" 
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
                id="EU050200_BTN00002"
                rounded
                class="w-32"
                variant="gray"
                :loading="loading"
                :disabled="SelectExchangeData.EXC_SID === '' || SelectExchangeData.EXC_SUBSTATUS_CODE == '0075'" 
                @click="updateExchangeSubStatus('0075')"
              >
                {{ getComponentData('EU050200_BTN00002', 'caption', 'Holding') }}
              </Button>  
              <Button
                id="EU050200_BTN00003"
                rounded
                class="w-32"
                variant="gray"
                :loading="loading"
                :disabled="SelectExchangeData.EXC_SID === '' || SelectExchangeData.EXC_SUBSTATUS_CODE != '0075'" 
                @click="updateExchangeSubStatus('0274')"
              >
                {{ getComponentData('EU050200_BTN00003', 'caption', 'UnHold') }}
              </Button>  
              <Button
                id="EU050200_BTN00004"
                rounded
                class="w-32"
                variant="gray"
                :loading="loading"
                :disabled="SelectExchangeData.EXC_SID === '' || SelectExchangeData.EXC_STATUS_CODE != '30'" 
                @click="fetchClearExchangeData"
              >
                {{ getComponentData('EU050200_BTN00004', 'caption', 'Reset') }}
              </Button>
            </div>    
          </Card>          
        </div> 
        <div class="col-1">
          <div class="grid grid-rows-1 grid-flow-col h-full">
            <ChatBox
              v-if="SelectExchangeData.EXC_SID != ''"
              id="EU030200_CHA00001"
              :items="ExchangeDetailInfoOperationNote"
              :title="getComponentData('EU030200_CHT00001', 'caption', 'Operation Note')"
              :reload="fetchExchangeDetailInfoOperationNote"
              @add="addExchangeOperationNote"
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
            {{ getComponentData('EU050200_LBL00023', 'caption', 'Inspection Items') }}
          </p>
          <div class="flex justify-between items-center gap-x-3">
            <FormCheckbox
              id="EU030200_CHK00001"
            />
            <p class="font-medium text-white">
              {{ getComponentData('EU050200_LBL00024', 'caption', 'Image Viewer') }}
            </p>
            <FormCheckbox
              id="EU030200_CHK00002"
            />
            <p class="font-medium text-white">
              {{ getComponentData('EU050200_LBL00025', 'caption', 'QA Viewer') }}
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
              :label="getComponentData('EU050200_LBL00026', 'caption', 'SKU')"
              label-id="EU030200_LBL00023"
              style="font-size: 15px;"
              horizontal
              label-width="w-3/12"
              input-width="w-9/12"
            >
              <FormTextInput
                id="EU050200_TXT00017"
                ref="SKURef"   
                v-model="SKU_DATA"
                :disabled="SelectExchangeData.EXC_SID === '' && SelectExchangeData.EXC_STATUS_CODE != '30' && SelectExchangeData.EXC_STATUS_CODE != '31'"
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
              :label="getComponentData('EU050200_LBL00027', 'caption', 'Serial No')"
              label-id="EU030200_LBL00024"
              style="font-size: 15px;"
              horizontal
              label-width="w-3/12"
              input-width="w-9/12"
            >
              <FormTextInput
                id="EU050200_TXT00018"
                :disabled="SelectExchangeData.EXC_SID === '' && SelectExchangeData.EXC_STATUS_CODE != '30' && SelectExchangeData.EXC_STATUS_CODE != '31'"
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
            {{ getComponentData('EU050200_LBL00028', 'caption', 'Inspection QTY / Exchange QTY : ') }}
            <span class="mx-1">
              {{ Inspection_QTY }}
            </span>
            /
            <span class="mx-1">
              {{ EXCHANGE_QTY }}
            </span>
          </p>
        </div>
        <div class="col-span-2">
          <div class="flex space-x-6 items-center justify-end py-3">
            <Button
              id="EU050200_BTN00005"
              rounded
              variant="gray"
              :loading="loading"
              :disabled="SelectExchangeData.EXC_STATUS_CODE != '31'" 
              @click="onInbound"
            >
              {{ getComponentData('EU050200_BTN00005', 'caption', 'Inspection Completed') }}
            </Button>
            <Button
              id="EU050200_BTN00006"
              rounded
              variant="gray"
              :loading="loading"
              :disabled="SelectExchangeData.EXC_STATUS_CODE != '31'" 
              @click="CancelInspection"
            >
              {{ getComponentData('EU050200_BTN00006', 'caption', 'Cancel Inspection') }}
            </Button>
          </div>
        </div>
      </div>
      <div class="grid">
        <Table
          id="EU050200_GRD00001"
          class="overflow-x-auto border-b max-h-90 h-90 overflow-y-auto"
          border
          header-variant="secondary"
          :items="ExchangeInspectionItemList"
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
      :show="openExchangeModal"
      divider
      size="6xl"
      @close="() => {
        openExchangeModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00400_LBL01001', 'caption', 'Select Exchange') }}
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
:deep(#EU050200_CMB00005 button) {
  font-size: 12px !important;
  height: 32px !important;
}
</style>
