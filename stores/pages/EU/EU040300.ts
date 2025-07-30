import { defineStore } from 'pinia'
import {notify} from "notiwind";
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'

const { user } = storeToRefs(useAuthStore());

const getDefaultFilters = () => ({
  USER_SID: encrypt(user.value?.USER_SID),
  FLT_RETURN_SID: '',
  FLT_VIEW_OPT: '',
  FLT_SPLIT_OPT: '',
  FLT_RETURN_TYPES: [],
  FLT_CHANNELS: [],
  FLT_STATUS: [],
  FLT_REASON: [],
  FLT_DATE_TYPE: '',
  FLT_DATE_FROM: '',
  FLT_DATE_TO: '',
  FLT_KEY_WORD: '',
  FLT_INBOUND_TYPE: '',
  FLT_TRACKING_NO: '',
  FLT_LOGISTICS: '',
  FLT_ADDRESS: '',
  FLT_TEL_NO: '',
  FLT_INCLUDE_REQSUB: '',
});

export const useReturnInspectionStore = defineStore('return-inspection', {
  state() {
    return {
      StationList: [] as any[],
      WorkStaffList: [] as any[],
      STATION_USER_SID: {} as any,
      filters: getDefaultFilters(),
      ReturnListData: [] as any[],
      ReturnInspectionItemList: [] as any[],      
      returnInspectionStatusList: [] as any[],
      returnInspectionOperationNote: [] as any[],
      userGroupBrandList: [] as any[],
      courierList: [] as any,







      returnDetailList: [] as any[],
      returnDetailInfo: {} as any,
      currentReturnStatus: {} as any,
      userGroupChannelList: [] as any[],
    }    
  },
  getters: {
    getReturnInspectionStatusList: (state) => state.returnInspectionStatusList,
    getReturnDetailList: (state) => state.returnDetailList,
    getReturnDetailInfo: (state) => state.returnDetailInfo,
    getUserGroupBrandList: (state) => state.userGroupBrandList,
    getCourierList: (state: any) => state.courierList,
  },
  actions: {
    async fetchStationList() {
      const { data }: any = await useAPIFetch('/IS_EU_STATION_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_USER_SID:encrypt(''),
          FLT_INCLUDE_INACTIVE:encrypt('0'),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.StationList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchWorkStaffList() {
      const {data}: any = await useAPIFetch('/IS_EU_STAFF_DAILY_LIST_GET', {
        method: 'post',
        body: {
          FLT_WORK_DATE_FROM:encrypt( moment().format('YYYY-MM-DD')),
          FLT_WORK_DATE_TO: encrypt(moment().format('YYYY-MM-DD')),
          FLT_JOB_TYPE_CODE: encrypt('0010'),
          FLT_INCLUDE_INCATIVE: encrypt(''),
          FLT_KEY_WORD: encrypt(''),
          USER_SID: encrypt(user.value?.USER_SID)
        }
      });
       if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }
      if (data.value?.RESULT_DATA.length > 0){ this.WorkStaffList = data.value?.RESULT_DATA[0].STAFF_LIST || []; }
      else{this.WorkStaffList = [];}
      
       return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchReturnInspectionStatusList() {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_INSPECTION_STATUS_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.returnInspectionStatusList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      }
    },
    async fetchReturnInspectionList(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_INSPECTION_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_RETURN_SID : encrypt(formData.FLT_RETURN_SID),
          FLT_RETURN_TYPE : encrypt(formData.FLT_RETURN_TYPE),
          FLT_KEY_WORD : encrypt(formData.FLT_KEY_WORD)
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }
      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      }
    },
    SetReturnListData(formData: any) {
      this.ReturnListData = formData;
    },
     async fetchReturnInspectionHstSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_INSPECTION_HST_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
          FLT_RETURN_BRAND: encrypt(formData.FLT_RETURN_BRAND),
          FLT_RETURN_TYPE: encrypt(formData.FLT_RETURN_TYPE),
          FLT_RETURN_REASON: encrypt(formData.FLT_RETURN_REASON),
          FLT_RETURN_SENDER_FULL_NAME: encrypt(formData.FLT_RETURN_SENDER_FULL_NAME),
          FLT_RETURN_SENDER_MOBILE: encrypt(formData.FLT_RETURN_SENDER_MOBILE),
          FLT_RETURN_SENDER_TEL: encrypt(formData.FLT_RETURN_SENDER_TEL),
          FLT_RETURN_SENDER_POST: encrypt(formData.FLT_RETURN_SENDER_POST),
          FLT_RETURN_SENDER_ADDR1: encrypt(formData.FLT_RETURN_SENDER_ADDR1),
          FLT_RETURN_SENDER_ADDR2: encrypt(formData.FLT_RETURN_SENDER_ADDR2),
          FLT_RETURN_CURRIOR: encrypt(formData.FLT_RETURN_CURRIOR),
          FLT_RETURN_TRACKING_NO: encrypt(formData.FLT_RETURN_TRACKING_NO),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: data.value?.MSG || '',
        }, 4000)

        return {
          success: false,
          message: data.value.MSG,
          RETURN_SID: ''
        }
      }

      this.ReturnInspectionItemList = data.value.RESULT_DATA || [];

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || '',
        RETURN_SID: data.value.RETURN_SID
      };
    },
    async fetchReturnInspectionItemInputGet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_INSPECTION_ITEM_INPUT_GET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
          FLT_RETURN_TYPE: encrypt(formData.FLT_RETURN_TYPE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: data.value?.MSG || '',
        }, 4000)

        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.ReturnInspectionItemList = data.value.RESULT_DATA || [];

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchReturnInspectionItemInputSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_INSPECTION_ITEM_INPUT_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
          FLT_RETURN_TYPE: encrypt(formData.FLT_RETURN_TYPE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: data.value?.MSG || '',
        }, 4000)

        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.ReturnInspectionItemList = data.value.RESULT_DATA || [];

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchReturnInspectionItemInputADDSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_INSPECTION_ITEM_INPUT_ADD_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
          FLT_RETURN_TYPE: encrypt(formData.FLT_RETURN_TYPE),
          FLT_ITEM_CODE: encrypt(formData.FLT_ITEM_CODE),
          FLT_INPUT_TYPE_CODE: encrypt(formData.FLT_INPUT_TYPE_CODE),
          FLT_STAFF_SID: encrypt(formData.FLT_STAFF_SID),
          FLT_QAVIEW_ID: encrypt(formData.FLT_QAVIEW_ID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: data.value?.MSG || '',
        }, 4000)

        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.ReturnInspectionItemList = data.value.RESULT_DATA || [];

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchReturnInspectionStatusChange(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_INSPECTION_STATUS_CHANGE_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_TO_STATUS_CODE: encrypt(formData.FLT_TO_STATUS_CODE),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
          FLT_RETURN_TYPE: encrypt(formData.FLT_RETURN_TYPE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: data.value?.MSG || '',
        }, 4000)

        return {
          success: false,
          message: data.value.MSG
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
     async fetchReturnInspectionSubStatusChange(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_INSPECTION_SUBSTATUS_CHANGE_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_TO_SUBSTATUS_CODE: encrypt(formData.FLT_TO_SUBSTATUS_CODE),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
          FLT_RETURN_TYPE: encrypt(formData.FLT_RETURN_TYPE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: data.value?.MSG || '',
        }, 4000)

        return {
          success: false,
          message: data.value.MSG
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchReturnInspectionItemInputClearSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_INSPECTION_ITEM_INPUT_CLEAR_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
          FLT_RETURN_TYPE: encrypt(formData.FLT_RETURN_TYPE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: data.value?.MSG || '',
        }, 4000)

        return {
          success: false,
          message: data.value.MSG
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchReturnInspectionItemInputResetSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_INSPECTION_ITEM_INPUT_RESET_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
          FLT_RETURN_TYPE: encrypt(formData.FLT_RETURN_TYPE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: data.value?.MSG || '',
        }, 4000)

        return {
          success: false,
          message: data.value.MSG
        }
      }
      
      this.ReturnInspectionItemList = data.value.RESULT_DATA || [];

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchReturnInspectionItemInputActionSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_INSPECTION_ITEM_INPUT_ACTION_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
          FLT_RETURN_TYPE: encrypt(formData.FLT_RETURN_TYPE),
          FLT_RETURN_INPUT_ITEM_SEQ: encrypt(formData.FLT_RETURN_INPUT_ITEM_SEQ),
          FLT_RETURN_INPUT_ITEM_SEQ_LINE: encrypt(formData.FLT_RETURN_INPUT_ITEM_SEQ_LINE),
          FLT_RETURN_INPUT_ITEM_CODE: encrypt(formData.FLT_RETURN_INPUT_ITEM_CODE),
          FLT_ACTION_TYPE: encrypt(formData.FLT_ACTION_TYPE),
          FLT_ITEM_CODE: encrypt(formData.FLT_ITEM_CODE),
          FLT_INPUT_TYPE_CODE: encrypt(formData.FLT_INPUT_TYPE_CODE),
          FLT_STAFF_SID: encrypt(formData.FLT_STAFF_SID),
          FLT_QAVIEW_ID: encrypt(formData.FLT_QAVIEW_ID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: data.value?.MSG || '',
        }, 4000)

        return {
          success: false,
          message: data.value.MSG
        }
      }
      
      this.ReturnInspectionItemList = data.value.RESULT_DATA || [];

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
     resetReturnInspectionOperationNote() {
      this.returnInspectionOperationNote = [];
    },
    resetReturnItemInputGet() {
      this.ReturnInspectionItemList = [];
    },
    async fetchReturnInspectionOperationNote(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_INSPECTION_NOTE_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
          FLT_RETURN_TYPE: encrypt(formData.FLT_RETURN_TYPE),
          FLT_NOTE_TYPE: encrypt('O'),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      const keyMap = {
        RET_SID: 'ORD_SID',
        RET_NOTE_TYPE: 'ORD_NOTE_TYPE',
        RET_NOTE_ID: 'ORD_NOTE_ID',
        RET_NOTE_COUNT: 'ORD_NOTE_COUNT',
        RET_NOTE_SIDE: 'ORD_NOTE_SIDE',
        RET_NOTE_USER_NAME: 'ORD_NOTE_USER_NAME',
        RET_NOTE_DATETIME: 'ORD_NOTE_DATETIME',
        RET_NOTE: 'ORD_NOTE',
      };

      this.returnInspectionOperationNote = this.overrideKeyNames(data.value.RESULT_DATA, keyMap);
      return {
        success: true,
        message: data.value.MSG,
        data: this.returnInspectionOperationNote
      };
    },
    async addReturnInspectionOperationNote(formData: any) {
      const { data }: any = await useAPIFetch('/IS_OU_RETURN_DETAIL_INFO_NOTE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_NOTE_TYPE: encrypt('O'),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
          FLT_RETURN_TYPE: encrypt(formData.FLT_RETURN_TYPE),
          FLT_NOTE: encrypt(formData.FLT_NOTE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchUserGroupBrandList() {
      const { data }: any = await useAPIFetch('/IS_SA_USERGROUP_BRAND_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.userGroupBrandList = data.value.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG
      };
    },
    async fetchCourierList() {
      const {data}: any = await useAPIFetch('/IS_SA_COURIER_LIST_GET', {
        method: 'post',
        body: {
          FLT_BRAND_CODE : encrypt(''),
          FLT_CHANNEL_CODE : encrypt(''),
          FLT_INCLUDE_INACTIVE: encrypt(''),
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.courierList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchReturnRequestCreateSet(formData: any) {
      const {data}: any = await useAPIFetch('/IS_EU_RETURN_REQUEST_CREATE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_RETURN_REQ_SID: encrypt(formData.FLT_RETURN_REQ_SID),
          FLT_RETURN_REQ_TYPE: encrypt(formData.FLT_RETURN_REQ_TYPE),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
          FLT_RETURN_TYPE: encrypt(formData.FLT_RETURN_TYPE),
          FLT_RETURN_REQ_COMMENT: encrypt(formData.FLT_RETURN_REQ_COMMENT),
          FLT_RETURN_REQ_WH_CODE: encrypt(formData.FLT_RETURN_REQ_WH_CODE),
          FLT_RETURN_REQ_STAFF: encrypt(formData.FLT_RETURN_REQ_STAFF),
          FLT_RETURN_REQ_ITEMS: formData.FLT_RETURN_REQ_ITEMS,
          FLT_RETURN_REQ_IMAGES: formData.FLT_RETURN_REQ_IMAGES
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.courierList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },











    
    
   
    async fetchReturnDetailInfo(returnId: string) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_DETAIL_INFO_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_RETURN_SID: returnId,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.returnDetailInfo = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      }
    },
    async fetchUserGroupChannelList() {
      const { data }: any = await useAPIFetch('/IS_SA_USERGROUP_CHANNEL_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.userGroupChannelList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchReturnDetailList() {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_RETURN_SID: encrypt(this.filters.FLT_RETURN_SID),
          FLT_VIEW_OPT: encrypt(this.filters.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters.FLT_SPLIT_OPT),
          FLT_RETURN_TYPES: this.filters.FLT_RETURN_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_REASON: this.filters.FLT_REASON.map((REASON) => encrypt(REASON)),
          FLT_DATE_TYPE: encrypt(this.filters.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters.FLT_KEY_WORD),
          FLT_INBOUND_TYPE: encrypt(this.filters.FLT_INBOUND_TYPE),
          FLT_TRACKING_NO: encrypt(this.filters.FLT_TRACKING_NO),
          FLT_LOGISTICS: encrypt(this.filters.FLT_LOGISTICS),
          FLT_ADDRESS: encrypt(this.filters.FLT_ADDRESS),
          FLT_TEL_NO: encrypt(this.filters.FLT_TEL_NO),
          FLT_INCLUDE_REQSUB: encrypt(this.filters.FLT_INCLUDE_REQSUB),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.returnDetailList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      }
    },
    async fetchReturnList(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_LIST_GET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(formData.FLT_STATION_USER_SID),
          FLT_CHANNEL_CODE: encrypt(formData.FLT_CHANNEL_CODE),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
          FLT_KEY_WORD: encrypt(formData.FLT_KEY_WORD),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.ReturnListData = data.value.RESULT_DATA;      

      return {
        success: true,
        message: data.value.MSG,
      }
    },
    
    

   
    
    async fetchReturnTrackingChangeSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_TRACKING_CHANGE_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_TO_TRACKING_NO: encrypt(formData.FLT_TO_TRACKING_NO),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: data.value?.MSG || '',
        }, 4000)

        return {
          success: false,
          message: data.value.MSG
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },


    setCurrentReturnStatus(returnStatus: any) {
      this.currentReturnStatus = returnStatus;
    },
    resetReturnDetailList() {
      this.returnDetailList = [];
    },
    
   
    async updateReturnInfo(formData: object) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_DETAIL_INFO_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          ...formData
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async updateReturnStatus(formData: object) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_STATUS_CHANGE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          ...formData,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value.MSG
      };
    },
    overrideKeyNames(data: any, keyMap: any) {
      if (Array.isArray(data)) {
        return data.map((item: any) => this.renameKeys(item, keyMap));
      } else if (typeof data === 'object' && data !== null) {
        return this.renameKeys(data, keyMap);
      } else {
        throw new TypeError('Expected an array or object');
      }
    },
    renameKeys(item: any, keyMap: any) {
      const newItem: any = {};
      for (const key in item) {
        if (Array.isArray(item[key])) {
          newItem[keyMap[key] || key] = this.overrideKeyNames(item[key], keyMap);
        } else if (keyMap[key]) {
          newItem[keyMap[key]] = item[key];
        } else {
          newItem[key] = item[key];
        }
      }
      return newItem;
    }
  }
});
