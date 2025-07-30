<script setup>

import VueFeather from 'vue-feather';
import ImageGallery from '@/components/common/form/ImageGallery.vue'
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
const emits = defineEmits(['btn-save','btn-cancel'])

const props = defineProps({  
  requestData: {    
    type: Object,
    default: () => {}
  },
})

const { user } = storeToRefs(useAuthStore());

const RequestImages = ref([]) 
const RequestImagesName = ref([]) 
const { getComponentData } = usePageLoaderComponent(['POP00420'])

const ReturnInspection = useReturnInspectionStore()
const commonData = useCommonDataStore()
const { ReturnInspectionItemList,returnInspectionOperationNote } = storeToRefs(ReturnInspection)
const pageLoader = usePageLoaderStore()

const { loading, toggleLoading } = useLoading()

const ReturnInspectionItem = ref([]) 

const INPUT_DATA = ref([]) 

const requestType = ref({})
const SELECT_INDEX = ref(0)
const requestComment = ref("")
const openMultyImageUploadModal = ref(false)
const openSingleImageUploadModal = ref(false)
const openCommentModal = ref(false)

const ITEM_COMMENT = ref("")
const COMMENT_ITEM = ref({})

/* Dialog Modal */
const openDialogModal = ref(false)

const DIALOG_TYPE = ref("")
const DIALOG_TITLE = ref("")
const DIALOG_TEXT = ref("")


const ReturnReqeustData = ref({
  RET_SID : '',
  RET_WH_CODE : '',
  RET_WH_NAME : '',
  RET_REQ_DATE : moment().format('YYYY-MM-DD'),
  RET_USER_NAME : user.value?.USER_DISP_NAME,
  RET_STAFF_SID : '',
  RET_STAFF_NAME : '',
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

const imageAdded = (data) => {
  switch (data.imageFor) {
    case 'SINGLE_IMAGE':
      INPUT_DATA.value[SELECT_INDEX.value].IMAGE_NAME = data.files.IMAGE_NAME;
      INPUT_DATA.value[SELECT_INDEX.value].IMAGE_BASE64 = data.files.IMAGE_BASE64;
      break;
    case 'MULTY_IMAGES':
      data.files.forEach((file) => {
        RequestImages.value.push(file.IMAGE_BASE64)
        RequestImagesName.value.push(file.IMAGE_NAME)
      })
      break;
    default:
      break;
  }
  openMultyImageUploadModal.value = false;
  openSingleImageUploadModal.value = false;
};

const SaveComment = (data) => {
  
  INPUT_DATA.value[SELECT_INDEX.value].COMMENT = data

  ITEM_COMMENT.value = ""
  COMMENT_ITEM.value = []

  openCommentModal.value = false;
};



onMounted(async () => {
  await commonData.fetchPOP00420CommonData()

  requestType.value = 
  {
    name: commonData.getReturnRequestType[0].name,
    value: commonData.getReturnRequestType[0].value,
  }

  RequestDataSearch()

  
  //props.RequestData.


})

const RequestDataSearch = async () => {  
 
    toggleLoading()
    isloading.isLoading = true
    const { success,data } = await ReturnInspection.fetchReturnInspectionList({
      FLT_RETURN_SID : props.requestData.FLT_RET_SID,
      FLT_RETURN_TYPE : props.requestData.FLT_RET_TYPE_CODE,
      FLT_KEY_WORD : '',
    })

    if (success)
    {
      if (data.length == 1)
      {
        ReturnReqeustData.value.RET_SID = data[0].RET_SID ? decrypt(data[0]?.RET_SID) : ''
        ReturnReqeustData.value.RET_BRAND_CODE = data[0].RET_BRAND_CODE ? decrypt(data[0]?.RET_BRAND_CODE) : ''
        ReturnReqeustData.value.RET_BRAND_FNAME = data[0].RET_BRAND_FNAME ? decrypt(data[0]?.RET_BRAND_FNAME) : ''
        ReturnReqeustData.value.RET_CHANNEL_CODE = data[0].RET_CHANNEL_CODE ? decrypt(data[0]?.RET_CHANNEL_CODE) : ''
        ReturnReqeustData.value.RET_CHANNEL_FNAME = data[0].RET_CHANNEL_FNAME ? decrypt(data[0]?.RET_CHANNEL_FNAME) : ''
        ReturnReqeustData.value.RET_ID = data[0].RET_ID ? decrypt(data[0]?.RET_ID) : ''
        ReturnReqeustData.value.RET_STATUS_CODE = data[0].RET_STATUS_CODE ? decrypt(data[0]?.RET_STATUS_CODE) : ''
        ReturnReqeustData.value.RET_STATUS_FNAME = data[0].RET_STATUS_FNAME ? decrypt(data[0]?.RET_STATUS_FNAME) : ''
        ReturnReqeustData.value.RET_SUBSTATUS_CODE = data[0].RET_SUBSTATUS_CODE ? decrypt(data[0]?.RET_SUBSTATUS_CODE) : ''
        ReturnReqeustData.value.RET_SUBSTATUS_FNAME = data[0].RET_SUBSTATUS_FNAME ? decrypt(data[0]?.RET_SUBSTATUS_FNAME) : ''
        ReturnReqeustData.value.RET_DATETIME = data[0].RET_DATETIME ? decrypt(data[0]?.RET_DATETIME) : ''
        ReturnReqeustData.value.RET_TYPE_CODE = data[0].RET_TYPE_CODE ? decrypt(data[0]?.RET_TYPE_CODE) : ''
        ReturnReqeustData.value.RET_TYPE_FNAME = data[0].RET_TYPE_FNAME ? decrypt(data[0]?.RET_TYPE_FNAME) : ''
        ReturnReqeustData.value.RET_REASON_CODE = data[0].RET_REASON_CODE ? decrypt(data[0]?.RET_REASON_CODE) : ''      
        ReturnReqeustData.value.RET_REASON_FNAME = data[0].RET_REASON_FNAME ? decrypt(data[0]?.RET_REASON_FNAME) : ''
        ReturnReqeustData.value.RET_SEND_NAME_M = data[0].RET_SEND_NAME_M ? decrypt(data[0]?.RET_SEND_NAME_M) : ''
        ReturnReqeustData.value.RET_SEND_TEL_M = data[0].RET_SEND_TEL_M ? decrypt(data[0]?.RET_SEND_TEL_M) : ''
        ReturnReqeustData.value.RET_SEND_MOBILE_M = data[0].RET_SEND_MOBILE_M ? decrypt(data[0]?.RET_SEND_MOBILE_M) : ''
        ReturnReqeustData.value.RET_SEND_ADDR_1 = data[0].RET_SEND_ADDR_1 ? decrypt(data[0]?.RET_SEND_ADDR_1) : ''

        ReturnReqeustData.value.RETX_PICKUP_REQ_DATE = data[0].RETX_PICKUP_REQ_DATE ? decrypt(data[0]?.RETX_PICKUP_REQ_DATE) : ''    
        ReturnReqeustData.value.RET_PICKUP_CURRIOR_FNAME = data[0].RET_PICKUP_CURRIOR_FNAME ? decrypt(data[0]?.RET_PICKUP_CURRIOR_FNAME) : ''     
        ReturnReqeustData.value.RET_PICKUP_TRACK_NO = data[0].RET_PICKUP_TRACK_NO ? decrypt(data[0]?.RET_PICKUP_TRACK_NO) : ''
        ReturnReqeustData.value.RETX_PICKEDUP_DATE = data[0].RETX_PICKEDUP_DATE ? decrypt(data[0]?.RETX_PICKEDUP_DATE) : ''    

        ReturnReqeustData.value.RET_ORD_ID = data[0].RET_ORD_ID ? decrypt(data[0]?.RET_ORD_ID) : ''
        ReturnReqeustData.value.ORD_TYPE_FNAME = data[0].ORD_TYPE_FNAME ? decrypt(data[0]?.ORD_TYPE_FNAME) : ''
        ReturnReqeustData.value.ORD_DATETIME = data[0].ORD_DATETIME ? decrypt(data[0]?.ORD_DATETIME) : ''
        ReturnReqeustData.value.ORD_STATUS_FNAME = data[0].ORD_STATUS_FNAME ? decrypt(data[0]?.ORD_STATUS_FNAME) : ''
        
        ReturnReqeustData.value.ORD_DELIVERY_SDATE = data[0].ORD_DELIVERY_SDATE ? decrypt(data[0]?.ORD_DELIVERY_SDATE) : ''
        ReturnReqeustData.value.ORD_DELIVERY_CURRIOR_FNAME = data[0].ORD_DELIVERY_CURRIOR_FNAME ? decrypt(data[0]?.ORD_DELIVERY_CURRIOR_FNAME) : ''
        ReturnReqeustData.value.ORD_DELIVERY_TRACK_NO  = data[0].ORD_DELIVERY_TRACK_NO ? decrypt(data[0]?.ORD_DELIVERY_TRACK_NO ) : ''
        ReturnReqeustData.value.ORD_DELIVERY_EDATE = data[0].ORD_DELIVERY_EDATE ? decrypt(data[0]?.ORD_DELIVERY_EDATE) : ''

      }

      ReturnReqeustData.value.RET_WH_CODE = props.requestData.FLT_RET_WH_CODE
      ReturnReqeustData.value.RET_WH_NAME = props.requestData.FLT_RET_WH_NAME
      ReturnReqeustData.value.RET_STAFF_SID = props.requestData.FLT_RET_STAFF_SID
      ReturnReqeustData.value.RET_STAFF_NAME = props.requestData.FLT_RET_STAFF_NAME
      
      RequestItemData()
    }    

    isloading.isLoading = false
    toggleLoading()
}

const RequestItemData = async () => {  
 
    for (let i = 0; i < ReturnInspectionItemList.value.length; i++) 
    {
      INPUT_DATA.value.push(
        {
          COMMENT : "",
          IMAGE_NAME : "",
          IMAGE_BASE64 : ""
        }
      )
    }

    ReturnInspectionItem.value = ReturnInspectionItemList.value
}

const RequestItemImage = async (index) => {  
 
    SELECT_INDEX.value = index

    openSingleImageUploadModal.value = true;
}

const RequestItemComment= async (index,item) => {  
 
    SELECT_INDEX.value = index

    ITEM_COMMENT.value = INPUT_DATA.value[SELECT_INDEX.value].COMMENT

    COMMENT_ITEM.value = item

    openCommentModal.value = true;
}

const DeleteRequestItemImage = async (index) => {  
 
  INPUT_DATA.value[index].IMAGE_NAME = '';
  INPUT_DATA.value[index].IMAGE_BASE64 = '';
   
}

const DeleteRequestImage = async () => {  
 
  RequestImages.value = []
  RequestImagesName.value = []
   
}

const fetchReturnInspectionOperationNote = async () => {
  toggleLoading()
  isloading.isLoading = true
  await ReturnInspection.fetchReturnInspectionOperationNote({
    FLT_RETURN_SID : ReturnReqeustData.value.RET_SID,
    FLT_RETURN_TYPE : ReturnReqeustData.value.RET_TYPE_CODE
  })
  isloading.isLoading = false
  toggleLoading()
}

const addReturnInspectionOperationNote = async (note) => {
  toggleLoading()
  isloading.isLoading = true
  await ReturnInspection.addReturnInspectionOperationNote({
    FLT_RETURN_SID: ReturnReqeustData.value.RET_SID,
    FLT_RETURN_TYPE : ReturnReqeustData.value.RET_TYPE_CODE,
    FLT_NOTE: note,
  })
  await fetchReturnInspectionOperationNote()
  isloading.isLoading = false
  toggleLoading()
}

const InspectedItemTableColumns = computed(() => {
  //return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU040300_GRD00001')

  return [            
    {
      caption: 'No',
      dataFieldName: 'NO',
      display: 'Y',
    },{
      caption: 'SKU',
      dataFieldName: 'RETURN_INSPECTION_ITEM_CODE',
      display: 'Y',
    },
    {
      caption: 'Barcode',
      dataFieldName: 'RETURN_INSPECTION_ITEM_EAN',
      display: 'Y',
    },{
      caption: 'Item Desc',
      dataFieldName: 'RETURN_INSPECTION_ITEM_FNAME',
      display: 'Y',
    },
    {
      caption: 'Input Date',
      dataFieldName: 'RETURN_INPUT_DATE',
      display: 'Y',
    },
    {
      caption: 'Input Time',
      dataFieldName: 'RETURN_INPUT_TIME',
      display: 'Y',
    },{
      caption: 'Input Staff',
      dataFieldName: 'RETURN_INPUT_STAFF_NAME',
      display: 'Y',
    },
    {
      caption: 'Received Qty',
      dataFieldName: 'RETURN_INSPECTION_ITEM_QTY',
      display: 'Y',
    },
    {
      caption: 'Inspected Qty',
      dataFieldName: 'RETURN_INPUT_QTY',
      display: 'Y',
    },
    {
      caption: 'Comment',
      dataFieldName: 'COMMENT',
      display: 'Y',
    },{
      caption: 'Image',
      dataFieldName: 'IMAGE_NAME',
      display: 'Y',
    }
  ]
})

</script>

<template>
  <div class="relative space-y-3">
    <div class="grid grid-cols-5 gap-x-2">
      <div class="col-span-4 space-y-3">    
        <div class="grid grid-cols-4 gap-x-3 gap-y-3">      
          <div class="col-span-2">
            <Card
              divider
              shadow-size="none"
              card-header-class="px-3 py-2.5 space-y-1"
              class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
              card-body-class="p-2 space-y-3"
            >
              <template #header>
                <div class="flex justify-between items-center">
                  <p>
                    {{ getComponentData('POP00420_LBL00002', 'caption', 'Request Return Information') }}
                  </p>
                </div>        
              </template>
              <div class="grid grid-cols-2 gap-x-3 gap-y-3"> 
                <div class="col-span-1 space-y-2">
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00003', 'caption', 'Return SID')"
                    label-id="POP00420_LBL00003"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00001"
                      v-model="ReturnReqeustData.RET_SID"
                      class="bg-gray-100"
                      readonly
                    />             
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00004', 'caption', 'Request WH')"
                    label-id="POP00420_LBL00004"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00002"
                      v-model="ReturnReqeustData.RET_WH_NAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00005', 'caption', 'Request Date')"
                    label-id="POP00420_LBL00005"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00003"
                      v-model="ReturnReqeustData.RET_REQ_DATE"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00006', 'caption', 'Request User')"
                    label-id="POP00420_LBL00006"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00004"
                      v-model="ReturnReqeustData.RET_USER_NAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00007', 'caption', 'Request Staff')"
                    label-id="POP00420_LBL00007"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00005"
                      v-model="ReturnReqeustData.RET_STAFF_NAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                </div>
                <div class="col-span-1 space-y-2">
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00008', 'caption', 'Request Type')"
                    label-id="POP00420_LBL00008"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormSelect
                      id="EU040300_CMB00001"
                      v-model="requestType"
                      :options="commonData.getReturnRequestType"
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00009', 'caption', 'Request Commnet')"
                    label-id="POP00420_LBL00009"
                    horizontal
                  >
                    <FormTextareaInput
                      id="POP00420_TXT00006"
                      v-model="requestComment"
                      rows="7"
                    />
                  </FormGroup>
                </div>              
              </div>
            </Card>
          </div> 
          <div class="col-span-2">
            <Card
              divider
              shadow-size="none"
              card-header-class="px-3 py-2.5 space-y-1"
              class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
              card-body-class="p-2 space-y-3"
            >
              <template #header>                      
                <p>
                  {{ getComponentData('POP00420_LBL00010', 'caption', 'Return Information') }}
                </p>        
              </template>
              <div class="grid grid-cols-2 gap-x-3">
                <div class="col-span-1 space-y-2">
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00011', 'caption', 'Brand')"
                    label-id="POP00420_LBL00011"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00007"
                      v-model="ReturnReqeustData.RET_BRAND_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00012', 'caption', 'Channel')"
                    label-id="POP00420_LBL00012"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00008"
                      v-model="ReturnReqeustData.RET_CHANNEL_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>  

                  <FormGroup
                    :label="getComponentData('POP00420_LBL00013', 'caption', 'Return ID')"
                    label-id="POP00420_LBL00013"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00009"
                      v-model="ReturnReqeustData.RET_ID"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00014', 'caption', 'Return Status')"
                    label-id="POP00420_LBL00014"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <div class="flex items-center gap-x-2">
                      <FormTextInput
                        id="POP00420_TXT00010"
                        v-model="ReturnReqeustData.RET_STATUS_FNAME"
                        class="bg-gray-100"
                        readonly
                      />
                      <FormTextInput
                        id="POP00420_TXT00011"
                        v-model="ReturnReqeustData.RET_SUBSTATUS_FNAME"
                        class="bg-gray-100"
                        readonly
                      />
                    </div>                      
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00015', 'caption', 'Return Req. Date')"
                    label-id="POP00420_LBL00015"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00012"
                      v-model="ReturnReqeustData.RET_DATETIME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                </div>
                <div class="col-span-1 space-y-2"> 
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00016', 'caption', 'Return Type')"
                    label-id="POP00420_LBL00016"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00013"
                      v-model="ReturnReqeustData.RET_TYPE_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00017', 'caption', 'Return Reason')"
                    label-id="POP00420_LBL00017"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00014"
                      v-model="ReturnReqeustData.RET_REASON_FNAME"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00018', 'caption', 'Sender Name')"
                    label-id="POP00420_LBL00018"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00015"
                      v-model="ReturnReqeustData.RET_SEND_NAME_M"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00019', 'caption', 'Sender Mobile(Tel)')"
                    label-id="POP00420_LBL00019"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00016"
                      v-model="ReturnReqeustData.RET_SEND_MOBILE_M"
                      class="bg-gray-100"
                      readonly
                    />
                  </FormGroup>
                  <FormGroup
                    :label="getComponentData('POP00420_LBL00020', 'caption', 'Sender Address')"
                    label-id="POP00420_LBL00020"
                    horizontal
                    label-width="w-1/4"
                    input-width="w-3/4"
                  >
                    <FormTextInput
                      id="POP00420_TXT00017"
                      v-model="ReturnReqeustData.RET_SEND_ADDR_1"
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
            card-header-class="px-3 py-2.5 space-y-1"
            class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
            card-body-class="p-2 space-y-2"
          >
            <template #header>                      
              <p>
                {{ getComponentData('POP00420_LBL00021', 'caption', 'Order Information') }}
              </p>        
            </template>
            <FormGroup
              :label="getComponentData('POP00420_LBL00022', 'caption', 'Order ID')"
              label-id="POP00420_LBL00022"
              horizontal
              label-width="w-1/4"
              input-width="w-3/4"
            >
              <FormTextInput
                id="POP00420_TXT00018"
                v-model="ReturnReqeustData.RET_ORD_ID"
                class="bg-gray-100"
                readonly
              />
            </FormGroup>
            <FormGroup
              :label="getComponentData('POP00420_LBL00023', 'caption', 'Order Type')"
              label-id="POP00420_LBL00023"
              horizontal                      
              label-width="w-1/4"
              input-width="w-3/4"
            >
              <FormTextInput
                id="POP00420_TXT00019"
                v-model="ReturnReqeustData.ORD_TYPE_FNAME"
                class="bg-gray-100"
                readonly
              />
            </FormGroup>
            <FormGroup
              :label="getComponentData('POP00420_LBL00024', 'caption', 'Order Date')"
              label-id="POP00420_LBL00024"
              horizontal
              label-width="w-1/4"
              input-width="w-3/4"
            >
              <FormTextInput
                id="POP00420_TXT00020"
                v-model="ReturnReqeustData.ORD_DATETIME"
                class="bg-gray-100"
                readonly
              />
            </FormGroup>
            <FormGroup
              :label="getComponentData('POP00420_LBL00025', 'caption', 'Order Status')"
              label-id="POP00420_LBL00025"
              horizontal
              label-width="w-1/4"
              input-width="w-3/4"
            >
              <FormTextInput
                id="POP00420_TXT00021"
                v-model="ReturnReqeustData.ORD_STATUS_FNAME"
                class="bg-gray-100"
                readonly
              />
            </FormGroup>            
          </Card>
          <Card
            divider
            shadow-size="none"
            card-header-class="px-3 py-2.5 space-y-1"
            class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
            card-body-class="p-2 space-y-2"
          >
            <template #header>                      
              <p>
                {{ getComponentData('POP00420_LBL00026', 'caption', 'Shipping Information') }}
              </p>        
            </template>
            <FormGroup
              :label="getComponentData('POP00420_LBL00027', 'caption', 'Delivery Date')"
              label-id="POP00420_LBL00027"
              horizontal
              label-width="w-1/4"
              input-width="w-3/4"
            >
              <FormTextInput
                id="POP00420_TXT00022"
                v-model="ReturnReqeustData.ORD_DELIVERY_SDATE"
                class="bg-gray-100"
                readonly
              />
            </FormGroup>
            <FormGroup
              :label="getComponentData('POP00420_LBL00028', 'caption', 'Courier')"
              label-id="POP00420_LBL00028"
              horizontal
              label-width="w-1/4"
              input-width="w-3/4"
            >
              <FormTextInput
                id="POP00420_TXT00023"
                v-model="ReturnReqeustData.ORD_DELIVERY_CURRIOR_FNAME"
                class="bg-gray-100"
                readonly
              />
            </FormGroup>
            <FormGroup
              :label="getComponentData('POP00420_LBL00029', 'caption', 'Tracking No.')"
              label-id="POP00420_LBL00029"
              horizontal
              label-width="w-1/4"
              input-width="w-3/4"
            >
              <FormTextInput
                id="POP00420_TXT00024"
                v-model="ReturnReqeustData.ORD_DELIVERY_TRACK_NO"
                class="bg-gray-100"
                readonly
              />
            </FormGroup>
            <FormGroup
              :label="getComponentData('POP00420_LBL00030', 'caption', 'Delivered Date')"
              label-id="POP00420_LBL00030"
              horizontal
              label-width="w-1/4"
              input-width="w-3/4"
            >
              <FormTextInput
                id="POP00420_TXT00025"
                v-model="ReturnReqeustData.ORD_DELIVERY_EDATE"
                class="bg-gray-100"
                readonly
              />
            </FormGroup>             
          </Card>
          <Card
            divider
            shadow-size="none"
            card-header-class="px-3 py-2.5 space-y-1"
            class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
            card-body-class="p-2 space-y-2"
          >
            <template #header>                      
              <p>
                {{ getComponentData('POP00420_LBL00031', 'caption', 'Return Pickup Information') }}
              </p>        
            </template>
            <FormGroup
              :label="getComponentData('POP00420_LBL00032', 'caption', 'Req. Pick-up Date')"
              label-id="POP00420_LBL00032"
              horizontal
              label-width="w-1/4"
              input-width="w-3/4"
            >
              <FormTextInput
                id="POP00420_TXT00026"
                v-model="ReturnReqeustData.RETX_PICKUP_REQ_DATE"
                class="bg-gray-100"
                readonly
              />
            </FormGroup>
            <FormGroup
              :label="getComponentData('POP00420_LBL00033', 'caption', 'Courier')"
              label-id="POP00420_LBL00033"
              horizontal                      
              label-width="w-1/4"
              input-width="w-3/4"
            >
              <FormTextInput
                id="POP00420_TXT00027"
                v-model="ReturnReqeustData.RET_PICKUP_CURRIOR_FNAME"
                class="bg-gray-100"
                readonly
              />
            </FormGroup>
            <FormGroup
              :label="getComponentData('POP00420_LBL00034', 'caption', 'Tracking No.')"
              label-id="POP00420_LBL00034"
              horizontal
              label-width="w-1/4"
              input-width="w-3/4"
            >
              <FormTextInput
                id="POP00420_TXT00028"
                v-model="ReturnReqeustData.RET_PICKUP_TRACK_NO"
                class="bg-gray-100"
                readonly
              />                       
            </FormGroup>
            <FormGroup
              :label="getComponentData('POP00420_LBL00035', 'caption', 'Picked-up Date')"
              label-id="POP00420_LBL00035"
              horizontal
              label-width="w-1/4"
              input-width="w-3/4"
            >
              <FormTextInput
                id="POP00420_TXT00029"
                v-model="ReturnReqeustData.RETX_PICKEDUP_DATE"
                class="bg-gray-100"
                readonly
              />
            </FormGroup>            
          </Card>
          <Card
            divider
            shadow-size="none"
            card-header-class="px-3 py-2.5 space-y-1"
            class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
            card-body-class="p-2 space-y-3"
          >
            <template #header>
              <div class="flex justify-between items-center">
                <p>
                  {{ getComponentData('POP00420_LBL00036', 'caption', 'Request Image') }}
                </p>
                <div class="flex space-x-3 justify-end items-center">
                  <span
                    class="cursor-pointer hover:font-bold hover:text-blue-700 text-end"
                    @click="(e) => {
                      e.stopPropagation();
                      openMultyImageUploadModal = true
                    }"
                  >
                    <VueFeather
                      type="image"
                      class="h-5 w-5"
                    />
                  </span>
                  <span
                    v-if="RequestImages.length != 0"
                    class="cursor-pointer hover:font-bold hover:text-blue-700 text-end"
                    @click="(e) => {
                      e.stopPropagation();
                      DeleteRequestImage();
                    }"
                  >
                    <VueFeather
                      type="delete"
                      class="h-5 w-5"
                    />
                  </span>
                </div>                
              </div>        
            </template>
            <ImageGallery :images="RequestImages" />   
          </Card>
        </div>                  
      </div>   
      <div class="col-2">
        <div class="grid grid-rows-1 grid-flow-col h-full">
          <ChatBox
            id="POP040200_CHA00001"
            :items="returnInspectionOperationNote"
            :title="getComponentData('EU030200_CHT00001', 'caption', 'Operation Note')"
            :reload="fetchReturnInspectionOperationNote"
            @add="addReturnInspectionOperationNote"
          />
        </div>          
      </div>       
    </div>   
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-2.5 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-2 space-y-3"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <p>
            {{ getComponentData('POP00420_LBL00037', 'caption', 'Request Return Items') }}
          </p>
        </div>        
      </template>
      <Table
        id="POP00420_GRD00001"
        class="overflow-x-auto border-b max-h-90 h-90 overflow-y-auto"
        border
        header-variant="secondary" 
        :items="ReturnInspectionItem"          
        :columns="InspectedItemTableColumns" 
      >
        <template #cell(COMMENT)="{ item,index }"> 
          <div class="flex items-center gap-x-2">
            <div
              v-if="INPUT_DATA[index].COMMENT.length > 10"
              v-tooltip="{
                content: `<div class='p-2 border border-gray-300 rounded bg-gray-50 text-gray-700 font-mono text-md'
                          style='max-width: 300px; white-space: pre-wrap; word-break: break-all; overflow-wrap: break-word;'
                          >${INPUT_DATA[index].COMMENT}</div>`,
                placement: 'top',
                trigger: 'hover',
                html: true
              }"
            >
              {{ truncateText(INPUT_DATA[index].COMMENT, 10) }}
            </div> 
            <div v-else-if="INPUT_DATA[index].COMMENT.length <= 10">
              {{ INPUT_DATA[index].COMMENT }}
            </div> 
            <span
              class="cursor-pointer hover:font-bold hover:text-blue-700"
              @click="(e) => {
                e.stopPropagation();
                RequestItemComment(index,item)
              }"
            >
              <VueFeather
                type="edit"
                class="h-5 w-5"
              />
            </span>
          </div>          
        </template>
        <template #cell(IMAGE_NAME)="{ index }">       
          <div class="flex items-center gap-x-2">
            <div
              v-if="INPUT_DATA[index].IMAGE_NAME !== ''"
              v-tooltip="{
                content: `<img src='${INPUT_DATA[index].IMAGE_BASE64}' class='w-auto max-h-90 h-90' />`,
                placement: 'top',
                trigger: 'hover',
                html: true
              }"
            >
              {{ INPUT_DATA[index].IMAGE_NAME }}
            </div>
            <div v-else>
              {{ INPUT_DATA[index].IMAGE_NAME }}
            </div>
            <span
              v-if="INPUT_DATA[index].IMAGE_NAME == ''"
              class="cursor-pointer hover:font-bold hover:text-blue-700"
              @click="(e) => {
                e.stopPropagation();
                RequestItemImage(index)
              }"
            >
              <VueFeather
                type="image"
                class="h-5 w-5"
              />
            </span>
            <span
              v-if="INPUT_DATA[index].IMAGE_NAME !== ''"
              class="cursor-pointer hover:font-bold hover:text-blue-700"
              @click="(e) => {
                e.stopPropagation();
                DeleteRequestItemImage(index)
              }"
            >
              <VueFeather
                type="delete"
                class="h-5 w-5"
              />
            </span>
          </div>          
        </template>
      </Table>
    </Card> 
    <div class="flex space-x-6 items-center justify-end">
      <Button
        id="EU040300_BTN00002"
        rounded
        class="w-32"
        variant="gray"
        :loading="loading"
        @click="CreateUnverifiedReturn"
      >
        {{ getComponentData('EU040300_BTN00002', 'caption', 'SAVE') }}
      </Button>  
      <Button
        id="EU040300_BTN00003"
        rounded
        class="w-32"
        variant="gray"
        :loading="loading"
        @click="() => {
          emits('btn-cancel')
        }"
      >
        {{ getComponentData('EU040300_BTN00003', 'caption', 'CANCEL') }}
      </Button>  
    </div>
    <!-- Additional Image Upload Modal -->
    <Modal
      :show="openMultyImageUploadModal"
      body-class="px-3 py-1"
      @close="openMultyImageUploadModal = false"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00060_LBL01001', 'caption', 'Request Images') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00060`"
          multiple
          image-for="MULTY_IMAGES"
          @image-added="imageAdded"
        />
      </template>
    </Modal>

    <!-- Main Image Upload Modal -->
    <Modal
      :show="openSingleImageUploadModal"
      body-class="px-3 py-1"
      @close="openSingleImageUploadModal = false"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00060_LBL01001', 'caption', 'Item Image') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00060`"
          :multiple="false"
          image-for="SINGLE_IMAGE"
          @image-added="imageAdded"
        />
      </template>
    </Modal>   

    <Modal
      :show="openCommentModal"
      divider
      @close="() => {
        openCommentModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00001_LBL00001', 'caption', 'Request Return Items Comment') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00002'"
          :comment="ITEM_COMMENT"
          :commentItem="COMMENT_ITEM"
          @btn-save="SaveComment"
          @btn-cancel="() => {
            openCommentModal = false
          }"
        />
      </template>
    </Modal>  
  </div>
</template>
<script>
function truncateText(text, length) {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '...' : text
}
</script>
<style scoped>

</style>
