import { defineStore } from 'pinia'
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

const defaultFilters = () => ({
  USER_SID: encrypt(user.value?.USER_SID),
  FLT_CUST_SID: '',
  FLT_CUST_KEYWORD: '',
  FLT_CUST_STATUS_CODE: '',
  FLT_REGIST_BRAND_CODE: [],
  FLT_REGIST_CHANNEL_CODE: [],
  FLT_CUST_CLASS_CODE: [],
  FLT_PROFLT_CUST_GENDER_CODE: '',
  FLT_CUST_NATIONAL_CODE: '',
  FLT_CUST_REGIST_FROM_DATE: '',
  FLT_CUST_REGIST_TO_DATE: '',
  FLT_CUST_L_ORDER_FROM_DATE: '',
  FLT_CUST_L_ORDER_TO_DATE: '',
});

export const useCustomerManagementStore = defineStore('customer-management', {
  state() {
    return {
      customerList: [] as any[],
      userGroupChannelList: [] as any[],
      filters: defaultFilters(),
    }
  },
  actions: {
    resetFilters() {
      this.filters = defaultFilters();
    },
    clearCustomerList() {
      this.customerList = [];
    },
    async fetchCustomerList() {
      const {data}: any = await useAPIFetch('/IS_OU_CUSTOMER_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_CUST_SID: encrypt(this.filters.FLT_CUST_SID),
          FLT_CUST_KEYWORD: encrypt(this.filters.FLT_CUST_KEYWORD),
          FLT_CUST_STATUS_CODE: encrypt(this.filters.FLT_CUST_STATUS_CODE),
          FLT_REGIST_BRAND_CODE: this.filters.FLT_REGIST_BRAND_CODE.map((BRAND) => encrypt(BRAND)),
          FLT_REGIST_CHANNEL_CODE: this.filters.FLT_REGIST_CHANNEL_CODE.map((CHANNEL) => encrypt(CHANNEL)),
          FLT_CUST_CLASS_CODE: this.filters.FLT_CUST_CLASS_CODE.map((CLASS) => encrypt(CLASS)),
          FLT_PROFLT_CUST_GENDER_CODE: encrypt(this.filters.FLT_PROFLT_CUST_GENDER_CODE),
          FLT_CUST_NATIONAL_CODE: encrypt(this.filters.FLT_CUST_NATIONAL_CODE),
          FLT_CUST_REGIST_FROM_DATE: encrypt(this.filters.FLT_CUST_REGIST_FROM_DATE),
          FLT_CUST_REGIST_TO_DATE: encrypt(this.filters.FLT_CUST_REGIST_TO_DATE),
          FLT_CUST_L_ORDER_FROM_DATE: encrypt(this.filters.FLT_CUST_L_ORDER_FROM_DATE),
          FLT_CUST_L_ORDER_TO_DATE: encrypt(this.filters.FLT_CUST_L_ORDER_TO_DATE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.customerList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG
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
  }
});
