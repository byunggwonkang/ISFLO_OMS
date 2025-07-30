import { defineStore } from 'pinia'
import moment from "moment/moment";
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'

const { user } = storeToRefs(useAuthStore());

const getDefaultFilters = () => ({
  USER_SID: encrypt(user.value?.USER_SID),
  FLT_ORDER_SID: '',
  FLT_VIEW_OPT: '',
  FLT_SPLIT_OPT: '',
  FLT_ORDER_TYPES: [],
  FLT_CHANNELS: [],
  FLT_STATUS: [],
  FLT_DATE_TYPE: '',
  FLT_DATE_FROM: moment().format('YYYY-MM-DD'),
  FLT_DATE_TO: moment().format('YYYY-MM-DD'),
  FLT_KEY_WORD: '',
  FLT_INCLUDE_REQSUB: "0"
});

export const useOrderStatusStore = defineStore('order-status', {
  state: () => ({
    orderStatusList: [] as any[],
    orderSummaryList: [] as any[],
    orderDetailList: [] as any[],
    orderDetailInfo: {} as any,
    orderDetailInfoOperationNote: [] as any[],
    orderDetailInfoCSNote: [] as any[],
    currentOrderStatus: {} as any,
    userGroupChannelList: [] as any[],
    filters: getDefaultFilters(),
    filters10: getDefaultFilters(),
    filters20: getDefaultFilters(),
    filters30: getDefaultFilters(),
    filters40: getDefaultFilters(),
    filters50: getDefaultFilters(),
    filters60: getDefaultFilters()
  }),
  getters: {
    getOrderStatusList: (state) => state.orderStatusList,
    getOrderSummaryList: (state) => state.orderSummaryList,
    getOrderDetailList: (state) => state.orderDetailList,
    getCurrentOrderStatus: (state) => state.currentOrderStatus,
    getUserGroupChannelList: (state) => state.userGroupChannelList,
    getOrderDetailInfo: (state) => state.orderDetailInfo,
    getOrderDetailInfoOperationNote: (state) => state.orderDetailInfoOperationNote,
  },
  actions: {
    resetOrderDetailInfo() {
      this.orderDetailInfo = {};
    },
    resetOrderDetailInfoOperationNote() {
      this.orderDetailInfoOperationNote = [];
    },
    resetOrderDetailInfoCSNote() {
      this.orderDetailInfoCSNote = [];
    },
    async fetchOrderSummaryList() {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_SUMMARY_LIST_GET', {
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

      this.orderSummaryList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchOrderStatusList() {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_STATUS_LIST_GET', {
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

      this.orderStatusList = data.value.RESULT_DATA;

      this.setCurrentOrderStatus(this.orderStatusList[0]);

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchOrderDetailList() {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_ORDER_SID: encrypt(this.filters.FLT_ORDER_SID),
          FLT_VIEW_OPT: encrypt(this.filters.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters.FLT_SPLIT_OPT),
          FLT_ORDER_TYPES: this.filters.FLT_ORDER_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
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

      this.orderDetailList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchOrderDetailList10() {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters10,
          FLT_ORDER_SID: encrypt(this.filters10.FLT_ORDER_SID),
          FLT_VIEW_OPT: encrypt(this.filters10.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters10.FLT_SPLIT_OPT),
          FLT_ORDER_TYPES: this.filters10.FLT_ORDER_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_STATUS: this.filters10.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
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

      //this.orderDetailList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchOrderDetailList20() {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters20,
          FLT_ORDER_SID: encrypt(this.filters20.FLT_ORDER_SID),
          FLT_VIEW_OPT: encrypt(this.filters20.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters20.FLT_SPLIT_OPT),
          FLT_ORDER_TYPES: this.filters20.FLT_ORDER_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters20.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters20.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
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

      //this.orderDetailList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchOrderDetailList30() {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters30,
          FLT_ORDER_SID: encrypt(this.filters30.FLT_ORDER_SID),
          FLT_VIEW_OPT: encrypt(this.filters30.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters30.FLT_SPLIT_OPT),
          FLT_ORDER_TYPES: this.filters30.FLT_ORDER_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters30.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters30.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
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

      //this.orderDetailList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchOrderDetailList40() {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters40,
          FLT_ORDER_SID: encrypt(this.filters40.FLT_ORDER_SID),
          FLT_VIEW_OPT: encrypt(this.filters40.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters40.FLT_SPLIT_OPT),
          FLT_ORDER_TYPES: this.filters40.FLT_ORDER_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters40.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters40.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_DATE_TYPE: encrypt(this.filters40.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters40.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters40.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters40.FLT_KEY_WORD),
          FLT_INCLUDE_REQSUB: encrypt(this.filters40.FLT_INCLUDE_REQSUB),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      //this.orderDetailList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchOrderDetailList50() {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters50,
          FLT_ORDER_SID: encrypt(this.filters50.FLT_ORDER_SID),
          FLT_VIEW_OPT: encrypt(this.filters50.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters50.FLT_SPLIT_OPT),
          FLT_ORDER_TYPES: this.filters50.FLT_ORDER_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters50.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters50.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_DATE_TYPE: encrypt(this.filters50.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters50.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters50.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters50.FLT_KEY_WORD),
          FLT_INCLUDE_REQSUB: encrypt(this.filters50.FLT_INCLUDE_REQSUB),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      //this.orderDetailList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchOrderDetailList60() {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters60,
          FLT_ORDER_SID: encrypt(this.filters60.FLT_ORDER_SID),
          FLT_VIEW_OPT: encrypt(this.filters60.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.filters60.FLT_SPLIT_OPT),
          FLT_ORDER_TYPES: this.filters60.FLT_ORDER_TYPES.map((TYPES) => encrypt(TYPES)),
          FLT_CHANNELS: this.filters60.FLT_CHANNELS.map((CHANNELS) => encrypt(CHANNELS)),
          FLT_STATUS: this.filters60.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_DATE_TYPE: encrypt(this.filters60.FLT_DATE_TYPE),
          FLT_DATE_FROM: encrypt(this.filters60.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.filters60.FLT_DATE_TO),
          FLT_KEY_WORD: encrypt(this.filters60.FLT_KEY_WORD),
          FLT_INCLUDE_REQSUB: encrypt(this.filters60.FLT_INCLUDE_REQSUB),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      //this.orderDetailList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
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
    async fetchOrderDetailInfoOperationNote(orderId: string) {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_INFO_NOTE_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_ORDER_SID: encrypt(orderId),
          FLT_NOTE_TYPE: encrypt('O'),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.orderDetailInfoOperationNote = data.value.RESULT_DATA;
      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchOrderDetailInfoCSNote(orderId: string) {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_INFO_NOTE_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_ORDER_SID: encrypt(orderId),
          FLT_NOTE_TYPE: encrypt('C'),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.orderDetailInfoCSNote = data.value.RESULT_DATA;
      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchOrderDetailInfo(orderId: string) {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_INFO_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_ORDER_SID: encrypt(orderId)
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.orderDetailInfo = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async updateOrderInfo(formData: any) {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_INFO_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_ORDER_SID: encrypt(formData.FLT_ORDER_SID),
          FLT_ORD_RECVR_NAME: encrypt(formData.FLT_ORD_RECVR_NAME),
          FLT_ORD_RECVR_TEL: encrypt(formData.FLT_ORD_RECVR_TEL),
          FLT_ORD_RECVR_MOBILE: encrypt(formData.FLT_ORD_RECVR_MOBILE),
          FLT_ORD_RECVR_EMAIL: encrypt(formData.FLT_ORD_RECVR_EMAIL),
          FLT_ORD_RECVR_ADDR_POST: encrypt(formData.FLT_ORD_RECVR_ADDR_POST),
          FLT_ORD_RECVR_ADDR_STATE: encrypt(formData.FLT_ORD_RECVR_ADDR_STATE),
          FLT_ORD_RECVR_ADDR_CITY: encrypt(formData.FLT_ORD_RECVR_ADDR_CITY),
          FLT_ORD_RECVR_ADDR_1: encrypt(formData.FLT_ORD_RECVR_ADDR_1),
          FLT_ORD_RECVR_ADDR_2: encrypt(formData.FLT_ORD_RECVR_ADDR_2),
          FLR_ORD_REMARK: encrypt(formData.FLR_ORD_REMARK),
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
    async updateOrderStatus(formData: any) {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_STATUS_CHANGE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_ORDER_SID: encrypt(formData.FLT_ORDER_SID),
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
    async addOrderOperationNote(formData: any) {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_INFO_NOTE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_NOTE_TYPE: encrypt('O'),
          FLT_ORDER_SID: encrypt(formData.FLT_ORDER_SID),
          FLT_NOTE: encrypt(formData.FLT_NOTE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        };
      }

      this.orderDetailInfoOperationNote = data.value.RESULT_DATA;

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
    async addOrderCSNote(formData: any) {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_INFO_NOTE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_NOTE_TYPE: encrypt('C'),
          FLT_ORDER_SID: encrypt(formData.FLT_ORDER_SID),
          FLT_NOTE: encrypt(formData.FLT_NOTE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        };
      }

      this.orderDetailInfoCSNote = data.value.RESULT_DATA;

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
    setCurrentOrderStatus(orderStatus: any) {
      this.currentOrderStatus = orderStatus;
    },
    resetFilters() {
      this.filters = getDefaultFilters();
    },
    resetOrderDetailList() {
      this.orderDetailList = [];
    }
  }
});
