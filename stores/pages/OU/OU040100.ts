import { defineStore } from 'pinia'
import {notify} from "notiwind";

const { user } = storeToRefs(useAuthStore());

const defaultFilters = () => ({
  USER_SID: user.value?.USER_SID,
  FLT_CS_SID: '',
  FLT_USER_ONLY_YN: '1',
  FLT_KEY_WORD: '',
  FLT_CS_STATUS_CODE: ["0010","0020"],
  FLT_RECEIPT_FROM_DATE: '',
  FLT_RECEIPT_TO_DATE: '',
});

const defaultCommentListFilters = () => ({
  USER_SID: user.value?.USER_SID,
  FLT_CS_SID: '',
  FLT_COMMENT_TYPE_CODE: '',
  FLT_KEY_WORD: '',
});

const defaultCustomerListFilters = () => ({
  USER_SID: user.value?.USER_SID,
  FLT_CUST_SID: '',
  FLT_CUST_KEYWORD: '',
  FLT_CUST_STATUS_CODE: '',
  FLT_REGIST_BRAND_CODE: [],
  FLT_REGIST_CHANNEL_CODE: [],
  FLT_CUST_CLASS_CODE: '',
  FLT_PROFLT_CUST_GENDER_CODE: '',
  FLT_CUST_NATIONAL_CODE: '',
  FLT_CUST_FROM_DATE: '',
  FLT_CUST_TO_DATE: '',
});

export const useClaimManagementStore = defineStore('claim-management', {
  state() {
    return {
      filters: defaultFilters(),
      commentListFilters: defaultCommentListFilters(),
      userGroupChannelList: [] as any[],
      summaryList: [] as any[],
      currentSummaryTab: {} as any,
      csList: [] as any[],
      commentList: [] as any[],
      orderDetails: {} as any,
      customerList: [] as any[],
      customerListFilters: defaultCustomerListFilters(),
    }
  },
  getters: {
    getSummaryList: (state) => state.summaryList,
  },
  actions: {
    clearCsList() {
      this.csList = [];
    },
    clearCommentList() {
      this.commentList = [];
    },
    clearSummaryList() {
      this.summaryList = [];
    },
    clearOrderDetails() {
      this.orderDetails = {};
    },
    clearCustomerList() {
      this.customerList = [];
    },
    async fetchCustomerList() {
      const { data }: any = await useAPIFetch('/IS_OU_CUSTOMER_LIST_GET', {
        method: 'post',
        body: {
          ...this.customerListFilters
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.customerList = data.value?.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchOrderDetail(orderData: any) {
      const {data}: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          FLT_VIEW_OPT : "0010",
          FLT_CHANNELS : [orderData.CHANNEL_CODE],
          FLT_ORDER_SID : orderData.ORDER_SID,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG,
          data: {}
        }
      }

      this.orderDetails = data.value?.RESULT_DATA[0] || {};

      return {
        success: true,
        message: data.value?.MSG || '',
        data: data.value?.RESULT_DATA[0] || {}
      };
    },
    async fetchUserGroupChannelList() {
      const { data }: any = await useAPIFetch('/IS_SA_USERGROUP_CHANNEL_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
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

    async fetchCommentList() {
      const {data}: any = await useAPIFetch('/IS_OU_CS_COMMENT_LIST_GET', {
        method: 'post',
        body: {
          ...this.commentListFilters
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.commentList = data.value?.RESULT_DATA?.COMMENTS || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchSummaryList(refresh: boolean = false) {
      const {data}: any = await useAPIFetch('/IS_OU_CS_SUMMARY_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_CS_STATUS_CODE: ["0010","0020"],
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.summaryList = data.value?.RESULT_DATA;

      if (!refresh) {
        this.setCurrentSummaryTab(this.summaryList[0]);
      }

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchCsList() {
      const {data}: any = await useAPIFetch('/IS_OU_CS_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.csList = data.value?.RESULT_DATA;

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async saveComment(formData: any) {
      const { data }: any = await useAPIFetch('/IS_OU_CS_COMMENT_ADD_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: user.value?.USER_SID,
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
    async saveCSDetail(formData: any, createNew: boolean = false) {
      const { data }: any = await useAPIFetch('/IS_OU_CS_DETAIL_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: user.value?.USER_SID,
          FLT_CS_TYPE_CODE: this.currentSummaryTab.CS_TYPE_CODE,
          FLT_CS_USER_SID: createNew ? user.value?.USER_SID : '',
          FLT_CS_REGIST_TIME: formData.FLT_CS_REGIST_TIME.substr(0, 8),
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
        message: data.value.MSG,
        data: data.value.RESULT_DATA[0] || {}
      };
    },
    setCurrentSummaryTab(tab: any) {
      this.currentSummaryTab = tab;
    },
    resetFilters() {
      this.filters = defaultFilters();
    },
    resetCommentListFilters() {
      this.commentListFilters = defaultCommentListFilters();
    }
  }
});
