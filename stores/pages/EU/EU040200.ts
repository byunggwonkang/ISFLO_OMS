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

export const useReturnInspection1Store = defineStore('return-inspection1', {
  state() {
    return {
      StationList: [] as any[],
      WorkStaffList: [] as any[],
      STATION_USER_SID: {} as any,
      filters: getDefaultFilters(),
      ReturnListData: [] as any[],
      ReturnInspectionItemList: [] as any[],
      
      returnStatusList: [] as any[],
      returnSummaryList: [] as any[],
      returnDetailList: [] as any[],
      returnDetailInfo: {} as any,
      returnDetailInfoOperationNote: [] as any[],
      currentReturnStatus: {} as any,
      userGroupBrandList: [] as any[],
      userGroupChannelList: [] as any[],
    }    
  },
  getters: {
    getReturnStatusList: (state) => state.returnStatusList,
    getReturnSummaryList: (state) => state.returnSummaryList,
    getReturnDetailList: (state) => state.returnDetailList,
    getReturnDetailInfo: (state) => state.returnDetailInfo,
    getUserGroupBrandList: (state) => state.userGroupBrandList,
    getUserGroupChannelList: (state) => state.userGroupChannelList,
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
    resetReturnDetailInfo() {
      this.returnDetailInfo = {};
    },
    resetReturnDetailInfoOperationNote() {
      this.returnDetailInfoOperationNote = [];
    },
    resetReturnItemInputGet() {
      this.ReturnInspectionItemList = [];
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
    async fetchReturnSummaryList() {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_SUMMARY_LIST_GET', {
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

      this.returnSummaryList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      }
    },
    async fetchReturnStatusList() {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_STATUS_LIST_GET', {
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

      this.returnStatusList = data.value.RESULT_DATA;

      this.setCurrentReturnStatus(this.returnStatusList[0]);

      return {
        success: true,
        message: data.value.MSG
      }
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
    async fetchReturnItemInputGet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_ITEM_INPUT_GET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(formData.FLT_STATION_USER_SID),
          FLT_BRAND_CODE: encrypt(formData.FLT_BRAND_CODE),
          FLT_CHANNEL_CODE: encrypt(formData.FLT_CHANNEL_CODE),
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
    async fetchReturnItemInputADDSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_ITEM_INPUT_ADD_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(formData.FLT_STATION_USER_SID),
          FLT_BRAND_CODE: encrypt(formData.FLT_BRAND_CODE),
          FLT_CHANNEL_CODE: encrypt(formData.FLT_CHANNEL_CODE),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
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
    async fetchReturnStatusChange(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_STATUS_CHANGE_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
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
    async fetchReturnSubStatusChange(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_SUBSTATUS_CHANGE_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
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
    async fetchReturnItemInputClearSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_ITEM_INPUT_CLEAR_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(formData.FLT_STATION_USER_SID),
          FLT_BRAND_CODE: encrypt(formData.FLT_BRAND_CODE),
          FLT_CHANNEL_CODE: encrypt(formData.FLT_CHANNEL_CODE),
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
    async fetchReturnDetailInfoOperationNote(returnId: string) {
      const { data }: any = await useAPIFetch('/IS_OU_RETURN_DETAIL_INFO_NOTE_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_RETURN_SID: returnId,
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

      this.returnDetailInfoOperationNote = this.overrideKeyNames(data.value.RESULT_DATA, keyMap);
      return {
        success: true,
        message: data.value.MSG,
        data: this.returnDetailInfoOperationNote
      };
    },
    async addReturnOperationNote(formData: any) {
      const { data }: any = await useAPIFetch('/IS_OU_RETURN_DETAIL_INFO_NOTE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_NOTE_TYPE: encrypt('O'),
          FLT_RETURN_SID: encrypt(formData.FLT_RETURN_SID),
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
