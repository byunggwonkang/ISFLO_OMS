import { defineStore } from 'pinia'
import {notify} from "notiwind";
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

export const useReturnListStore = defineStore('return-list', {
  state: () => ({
    returnStatusList: [] as any[],
    returnSummaryList: [] as any[],
    returnDetailList: [] as any[],
    returnDetailInfo: {} as any,
    returnDetailInfoOperationNote: [] as any[],
    returnDetailInfoCSNote: [] as any[],
    currentReturnStatus: {} as any,
    filters: getDefaultFilters(),
    filters10: getDefaultFilters(),
    filters20: getDefaultFilters(),
    filters30: getDefaultFilters(),
    filters40: getDefaultFilters(),
    filters50: getDefaultFilters(),
    filters60: getDefaultFilters(),
    userGroupBrandList: [] as any[],
    userGroupChannelList: [] as any[],
  }),
  getters: {
    getReturnStatusList: (state) => state.returnStatusList,
    getReturnSummaryList: (state) => state.returnSummaryList,
    getReturnDetailList: (state) => state.returnDetailList,
    getReturnDetailInfo: (state) => state.returnDetailInfo,
    getUserGroupBrandList: (state) => state.userGroupBrandList,
    getUserGroupChannelList: (state) => state.userGroupChannelList,
  },
  actions: {
    resetReturnDetailInfo() {
      this.returnDetailInfo = {};
    },
    resetReturnDetailInfoOperationNote() {
      this.returnDetailInfoOperationNote = [];
    },
    resetReturnDetailInfoCSNote() {
      this.returnDetailInfoCSNote = [];
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
    async fetchReturnDetailList10() {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters10,
          FLT_RETURN_SID: encrypt(this.filters10.FLT_RETURN_SID),
          FLT_VIEW_OPT: encrypt(this.filters10.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters10.FLT_SPLIT_OPT),
          FLT_RETURN_TYPES: this.filters10.FLT_RETURN_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_STATUS: this.filters10.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_REASON: this.filters10.FLT_REASON.map((REASON) => encrypt(REASON)),
          FLT_DATE_TYPE: encrypt(this.filters10.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters10.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters10.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters10.FLT_KEY_WORD),
          FLT_INBOUND_TYPE: encrypt(this.filters10.FLT_INBOUND_TYPE),
          FLT_TRACKING_NO: encrypt(this.filters10.FLT_TRACKING_NO),
          FLT_LOGISTICS: encrypt(this.filters10.FLT_LOGISTICS),
          FLT_ADDRESS: encrypt(this.filters10.FLT_ADDRESS),
          FLT_TEL_NO: encrypt(this.filters10.FLT_TEL_NO),
          FLT_INCLUDE_REQSUB: encrypt(this.filters10.FLT_INCLUDE_REQSUB),
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
    async fetchReturnDetailList20() {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters20,
          FLT_RETURN_SID: encrypt(this.filters20.FLT_RETURN_SID),
          FLT_VIEW_OPT: encrypt(this.filters20.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters20.FLT_SPLIT_OPT),
          FLT_RETURN_TYPES: this.filters20.FLT_RETURN_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters20.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters20.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_REASON: this.filters20.FLT_REASON.map((REASON) => encrypt(REASON)),
          FLT_DATE_TYPE: encrypt(this.filters20.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters20.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters20.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters20.FLT_KEY_WORD),
          FLT_INBOUND_TYPE: encrypt(this.filters20.FLT_INBOUND_TYPE),
          FLT_TRACKING_NO: encrypt(this.filters20.FLT_TRACKING_NO),
          FLT_LOGISTICS: encrypt(this.filters20.FLT_LOGISTICS),
          FLT_ADDRESS: encrypt(this.filters20.FLT_ADDRESS),
          FLT_TEL_NO: encrypt(this.filters20.FLT_TEL_NO),
          FLT_INCLUDE_REQSUB: encrypt(this.filters20.FLT_INCLUDE_REQSUB),
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
    async fetchReturnDetailList30() {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters30,
          FLT_RETURN_SID: encrypt(this.filters30.FLT_RETURN_SID),
          FLT_VIEW_OPT: encrypt(this.filters30.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters30.FLT_SPLIT_OPT),
          FLT_RETURN_TYPES: this.filters30.FLT_RETURN_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters30.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters30.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_REASON: this.filters30.FLT_REASON.map((REASON) => encrypt(REASON)),
          FLT_DATE_TYPE: encrypt(this.filters30.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters30.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters30.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters30.FLT_KEY_WORD),
          FLT_INBOUND_TYPE: encrypt(this.filters30.FLT_INBOUND_TYPE),
          FLT_TRACKING_NO: encrypt(this.filters30.FLT_TRACKING_NO),
          FLT_LOGISTICS: encrypt(this.filters30.FLT_LOGISTICS),
          FLT_ADDRESS: encrypt(this.filters30.FLT_ADDRESS),
          FLT_TEL_NO: encrypt(this.filters30.FLT_TEL_NO),
          FLT_INCLUDE_REQSUB: encrypt(this.filters30.FLT_INCLUDE_REQSUB),
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
    async fetchReturnDetailList40() {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters40,
          FLT_RETURN_SID: encrypt(this.filters40.FLT_RETURN_SID),
          FLT_VIEW_OPT: encrypt(this.filters40.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters40.FLT_SPLIT_OPT),
          FLT_RETURN_TYPES: this.filters40.FLT_RETURN_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters40.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters40.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_REASON: this.filters40.FLT_REASON.map((REASON) => encrypt(REASON)),
          FLT_DATE_TYPE: encrypt(this.filters40.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters40.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters40.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters40.FLT_KEY_WORD),
          FLT_INBOUND_TYPE: encrypt(this.filters40.FLT_INBOUND_TYPE),
          FLT_TRACKING_NO: encrypt(this.filters40.FLT_TRACKING_NO),
          FLT_LOGISTICS: encrypt(this.filters40.FLT_LOGISTICS),
          FLT_ADDRESS: encrypt(this.filters40.FLT_ADDRESS),
          FLT_TEL_NO: encrypt(this.filters40.FLT_TEL_NO),
          FLT_INCLUDE_REQSUB: encrypt(this.filters40.FLT_INCLUDE_REQSUB),
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
    async fetchReturnDetailList50() {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters50,
          FLT_RETURN_SID: encrypt(this.filters50.FLT_RETURN_SID),
          FLT_VIEW_OPT: encrypt(this.filters50.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters50.FLT_SPLIT_OPT),
          FLT_RETURN_TYPES: this.filters50.FLT_RETURN_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters50.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters50.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_REASON: this.filters50.FLT_REASON.map((REASON) => encrypt(REASON)),
          FLT_DATE_TYPE: encrypt(this.filters50.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters50.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters50.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters50.FLT_KEY_WORD),
          FLT_INBOUND_TYPE: encrypt(this.filters50.FLT_INBOUND_TYPE),
          FLT_TRACKING_NO: encrypt(this.filters50.FLT_TRACKING_NO),
          FLT_LOGISTICS: encrypt(this.filters50.FLT_LOGISTICS),
          FLT_ADDRESS: encrypt(this.filters50.FLT_ADDRESS),
          FLT_TEL_NO: encrypt(this.filters50.FLT_TEL_NO),
          FLT_INCLUDE_REQSUB: encrypt(this.filters50.FLT_INCLUDE_REQSUB),
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
    async fetchReturnDetailList60() {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters60,
          FLT_RETURN_SID: encrypt(this.filters60.FLT_RETURN_SID),
          FLT_VIEW_OPT: encrypt(this.filters60.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters60.FLT_SPLIT_OPT),
          FLT_RETURN_TYPES: this.filters60.FLT_RETURN_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters60.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters60.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_REASON: this.filters60.FLT_REASON.map((REASON) => encrypt(REASON)),
          FLT_DATE_TYPE: encrypt(this.filters60.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters60.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters60.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters60.FLT_KEY_WORD),
          FLT_INBOUND_TYPE: encrypt(this.filters60.FLT_INBOUND_TYPE),
          FLT_TRACKING_NO: encrypt(this.filters60.FLT_TRACKING_NO),
          FLT_LOGISTICS: encrypt(this.filters60.FLT_LOGISTICS),
          FLT_ADDRESS: encrypt(this.filters60.FLT_ADDRESS),
          FLT_TEL_NO: encrypt(this.filters60.FLT_TEL_NO),
          FLT_INCLUDE_REQSUB: encrypt(this.filters60.FLT_INCLUDE_REQSUB),
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
    setCurrentReturnStatus(returnStatus: any) {
      this.currentReturnStatus = returnStatus;
    },
    resetFilters() {
      this.filters = getDefaultFilters();
    },
    resetReturnDetailList() {
      this.returnDetailList = [];
    },
    async fetchReturnDetailInfoCSNote(returnId: string) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_DETAIL_INFO_NOTE_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_RETURN_SID: returnId,
          FLT_NOTE_TYPE: encrypt('C'),
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
        RET_NOTE_SIDE: 'ORD_NOTE_SIDE',
        RET_NOTE_COUNT: 'ORD_NOTE_COUNT',
        RET_NOTE_USER_NAME: 'ORD_NOTE_USER_NAME',
        RET_NOTE_DATETIME: 'ORD_NOTE_DATETIME',
        RET_NOTE: 'ORD_NOTE',
      };

      this.returnDetailInfoCSNote = this.overrideKeyNames(data.value.RESULT_DATA, keyMap);
      return {
        success: true,
        message: data.value.MSG,
        data: this.returnDetailInfoCSNote
      };
    },
    async fetchReturnDetailInfoOperationNote(returnId: string) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_DETAIL_INFO_NOTE_GET', {
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
    async addReturnOperationNote(formData: object) {
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_DETAIL_INFO_NOTE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_NOTE_TYPE: encrypt('O'),
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
    async addReturnCSNote(formData: object){
      const { data }: any = await useAPIFetch('/IS_EU_RETURN_DETAIL_INFO_NOTE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_NOTE_TYPE: encrypt('C'),
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
