import { defineStore } from 'pinia'
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'

const { user } = storeToRefs(useAuthStore());

const getDefaultFilters = () => ({
  USER_SID: encrypt(user.value?.USER_SID),
  FLT_EXCHANGE_SID: '',
  FLT_VIEW_OPT: '0010',
  FLT_SPLIT_OPT: '',
  FLT_EXCHANGE_TYPES: [],
  FLT_CHANNELS: [],
  FLT_STATUS: [],
  FLT_REASON: [],
  FLT_DATE_TYPE: '',
  FLT_DATE_FROM: '',
  FLT_DATE_TO: '',
  FLT_KEY_WORD: '',
  FLT_INCLUDE_REQSUB: '',
});

export const useExchangeStatusStore = defineStore('exchange-status', {
  state: () => ({
    exchangeStatusList: [] as any[],
    exchangeSummaryList: [] as any[],
    exchangeDetailList: [] as any[],
    exchangeDetailInfo: {} as any,
    exchangeDetailInfoOperationNote: [] as any[],
    exchangeDetailInfoCSNote: [] as any[],
    currentExchangeStatus: {} as any,
    filters: getDefaultFilters(),
    filters10: getDefaultFilters(),
    filters20: getDefaultFilters(),
    filters30: getDefaultFilters(),
    userGroupBrandList: [] as any[],
    userGroupChannelList: [] as any[],
  }),
  getters: {
    getExchangeStatusList: (state) => state.exchangeStatusList,
    getExchangeSummaryList: (state) => state.exchangeSummaryList,
    getExchangeDetailList: (state) => state.exchangeDetailList,
    getExchangeDetailInfo: (state) => state.exchangeDetailInfo,
    getUserGroupBrandList: (state) => state.userGroupBrandList,
    getUserGroupChannelList: (state) => state.userGroupChannelList,
  },
  actions: {
    resetExchangeDetailInfo() {
      this.exchangeDetailInfo = {};
    },
    resetExchangeDetailInfoOperationNote() {
      this.exchangeDetailInfoOperationNote = [];
    },
    resetExchangeDetailInfoCSNote() {
      this.exchangeDetailInfoCSNote = [];
    },
    async fetchExchangeDetailInfo(exchangeId: any) {
      const { data }: any = await useAPIFetch('/IS_OU_EXCHANGE_DETAIL_INFO_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_EXCHANGE_SID: encrypt(exchangeId),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.exchangeDetailInfo = data.value.RESULT_DATA;

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
    async fetchExchangeSummaryList() {
      const { data }: any = await useAPIFetch('/IS_OU_EXCHANGE_SUMMARY_LIST_GET', {
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

      this.exchangeSummaryList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchExchangeStatusList() {
      const { data }: any = await useAPIFetch('/IS_OU_EXCHANGE_STATUS_LIST_GET', {
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

      this.exchangeStatusList = data.value.RESULT_DATA;

      this.setCurrentExchangeStatus(this.exchangeStatusList[0]);

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchExchangeDetailList() {
      const { data }: any = await useAPIFetch('/IS_OU_EXCHANGE_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_EXCHANGE_SID: encrypt(this.filters.FLT_EXCHANGE_SID),
          FLT_VIEW_OPT: encrypt(this.filters.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters.FLT_SPLIT_OPT),
          FLT_EXCHANGE_TYPES: this.filters.FLT_EXCHANGE_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_REASON: this.filters.FLT_REASON.map((REASON) => encrypt(REASON)),
          FLT_DATE_TYPE: encrypt(this.filters.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters.FLT_KEY_WORD),
          FLT_INCLUDE_REQSUB: encrypt(this.filters.FLT_INCLUDE_REQSUB),
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
      };
    },
    async fetchExchangeDetailList10() {
      const { data }: any = await useAPIFetch('/IS_OU_EXCHANGE_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters10,
          FLT_EXCHANGE_SID: encrypt(this.filters10.FLT_EXCHANGE_SID),
          FLT_VIEW_OPT: encrypt(this.filters10.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters10.FLT_SPLIT_OPT),
          FLT_EXCHANGE_TYPES: this.filters10.FLT_EXCHANGE_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_STATUS: this.filters10.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_REASON: this.filters10.FLT_REASON.map((REASON) => encrypt(REASON)),
          FLT_DATE_TYPE: encrypt(this.filters10.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters10.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters10.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters10.FLT_KEY_WORD),
          FLT_INCLUDE_REQSUB: encrypt(this.filters10.FLT_INCLUDE_REQSUB),
          
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
      };
    },
    async fetchExchangeDetailList20() {
      const { data }: any = await useAPIFetch('/IS_OU_EXCHANGE_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters20,
          FLT_EXCHANGE_SID: encrypt(this.filters20.FLT_EXCHANGE_SID),
          FLT_VIEW_OPT: encrypt(this.filters20.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters20.FLT_SPLIT_OPT),
          FLT_EXCHANGE_TYPES: this.filters20.FLT_EXCHANGE_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters20.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters20.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_REASON: this.filters20.FLT_REASON.map((REASON) => encrypt(REASON)),
          FLT_DATE_TYPE: encrypt(this.filters20.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters20.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters20.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters20.FLT_KEY_WORD),
          FLT_INCLUDE_REQSUB: encrypt(this.filters20.FLT_INCLUDE_REQSUB),
          
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
      };
    },
    async fetchExchangeDetailList30() {
      const { data }: any = await useAPIFetch('/IS_OU_EXCHANGE_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters30,
          FLT_EXCHANGE_SID: encrypt(this.filters30.FLT_EXCHANGE_SID),
          FLT_VIEW_OPT: encrypt(this.filters30.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters30.FLT_SPLIT_OPT),
          FLT_EXCHANGE_TYPES: this.filters30.FLT_EXCHANGE_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters30.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters30.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_REASON: this.filters30.FLT_REASON.map((REASON) => encrypt(REASON)),
          FLT_DATE_TYPE: encrypt(this.filters30.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters30.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters30.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters30.FLT_KEY_WORD),
          FLT_INCLUDE_REQSUB: encrypt(this.filters30.FLT_INCLUDE_REQSUB),
          
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
      };
    },
    setCurrentExchangeStatus(status: any) {
      this.currentExchangeStatus = status;
    },
    resetFilters() {
      this.filters = getDefaultFilters();
    },
    resetExchangeDetailList() {
      this.exchangeDetailList = [];
    },
    async fetchExchangeDetailInfoCSNote(exchangeId: string) {
      const { data }: any = await useAPIFetch('/IS_OU_EXCHANGE_DETAIL_INFO_NOTE_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_EXCHANGE_SID: encrypt(exchangeId),
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
        EXC_SID: 'ORD_SID',
        EXC_NOTE_TYPE: 'ORD_NOTE_TYPE',
        EXC_NOTE_ID: 'ORD_NOTE_ID',
        EXC_NOTE_SIDE: 'ORD_NOTE_SIDE',
        EXC_NOTE_COUNT: 'ORD_NOTE_COUNT',
        EXC_NOTE_USER_NAME: 'ORD_NOTE_USER_NAME',
        EXC_NOTE_DATETIME: 'ORD_NOTE_DATETIME',
        EXC_NOTE: 'ORD_NOTE',
      };

      this.exchangeDetailInfoCSNote = this.overrideKeyNames(data.value.RESULT_DATA, keyMap);
      return {
        success: true,
        message: data.value.MSG,
        data: this.exchangeDetailInfoCSNote
      };
    },
    async fetchExchangeDetailInfoOperationNote(exchangeId: string) {
      const { data }: any = await useAPIFetch('/IS_OU_EXCHANGE_DETAIL_INFO_NOTE_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_EXCHANGE_SID: encrypt(exchangeId),
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
        EXC_SID: 'ORD_SID',
        EXC_NOTE_TYPE: 'ORD_NOTE_TYPE',
        EXC_NOTE_ID: 'ORD_NOTE_ID',
        EXC_NOTE_COUNT: 'ORD_NOTE_COUNT',
        EXC_NOTE_SIDE: 'ORD_NOTE_SIDE',
        EXC_NOTE_USER_NAME: 'ORD_NOTE_USER_NAME',
        EXC_NOTE_DATETIME: 'ORD_NOTE_DATETIME',
        EXC_NOTE: 'ORD_NOTE',
      };

      this.exchangeDetailInfoOperationNote = this.overrideKeyNames(data.value.RESULT_DATA, keyMap);
      return {
        success: true,
        message: data.value.MSG,
        data: this.exchangeDetailInfoOperationNote
      };
    },
    async addExchangeOperationNote(formData: any) {
      const { data }: any = await useAPIFetch('/IS_OU_EXCHANGE_DETAIL_INFO_NOTE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_NOTE_TYPE: encrypt('O'),
          FLT_EXCHANGE_SID: encrypt(formData.FLT_EXCHANGE_SID),
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
    async addExchangeCSNote(formData: any){
      const { data }: any = await useAPIFetch('/IS_OU_EXCHANGE_DETAIL_INFO_NOTE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_NOTE_TYPE: encrypt('C'),
          FLT_EXCHANGE_SID: encrypt(formData.FLT_EXCHANGE_SID),
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
    async updateExchangeInfo(formData: any) {
      const { data }: any = await useAPIFetch('/IS_OU_EXCHANGE_DETAIL_INFO_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_EXCHANGE_SID: encrypt(formData.FLT_EXCHANGE_SID),
          FLT_EXT_PICKUP_NAME: encrypt(formData.FLT_EXT_PICKUP_NAME),
          FLT_EXT_PICKUP_TEL: encrypt(formData.FLT_EXT_PICKUP_TEL),
          FLT_EXT_PICKUP_MOBILE: encrypt(formData.FLT_EXT_PICKUP_MOBILE),
          FLT_EXT_PICKUP_ADDR_POST: encrypt(formData.FLT_EXT_PICKUP_ADDR_POST),
          FLT_EXT_PICKUP_ADDR_STATE: encrypt(formData.FLT_EXT_PICKUP_ADDR_STATE),
          FLT_EXT_PICKUP_ADDR_CITY: encrypt(formData.FLT_EXT_PICKUP_ADDR_CITY),
          FLT_EXT_PICKUP_ADDR_1: encrypt(formData.FLT_EXT_PICKUP_ADDR_1),
          FLT_EXT_PICKUP_ADDR_2: encrypt(formData.FLT_EXT_PICKUP_ADDR_2),
          FLT_EXT_REMARK: encrypt(formData.FLT_EXT_REMARK),
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
    async updateExchangeStatus(formData: any) {
      const { data }: any = await useAPIFetch('/IS_OU_EXCHANGE_STATUS_CHANGE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_EXCHANGE_SID: encrypt(formData.FLT_EXCHANGE_SID),
          FLT_TO_STATUS: encrypt(formData.FLT_TO_STATUS),
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
