import { defineStore } from 'pinia'
const { user } = storeToRefs(useAuthStore());
import moment from "moment";
import { encrypt } from '@/stores/common/aes'

const defaultFilters = () => ({
  USER_SID: encrypt(user.value?.USER_SID),
  FLT_PROM_SID: '',
  FLT_PROM_BRAND_CODE: '',
  FLT_PROM_CHANNEL_CODE: [],
  FLT_PROM_TYPE_CODE: [],
  FLT_PROM_DATE_START: moment().format('YYYY-MM-DD'),
  FLT_PROM_DATE_END: moment().format('YYYY-MM-DD'),
  FLT_PROM_STATUS_CODE: [],
  FLT_PROM_TITLE: '',
});

export const usePromotionStatusStore = defineStore('promotion-status', {
  state() {
    return {
      brandList: [] as any,
      promotionList: [] as any,
      filters: defaultFilters(),
      userGroupChannelList: [] as any[],
    }
  },
  getters: {
    getPromotionList: (state) => state.promotionList,
    getUserGroupChannelList: (state) => state.userGroupChannelList,
    getBrandList: (state) => state.brandList,
  },
  actions: {
    clearPromotionList() {
      this.promotionList = [];
    },
    async fetchBrandList() {
      const {data}: any = await useAPIFetch('/IS_PA_BRAND_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_INCLUDE_INACTIVE: encrypt("0"),
          FLT_BRAND_CODE: encrypt(""),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.brandList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchPromotionList() {
      const {data}: any = await useAPIFetch('/IS_OU_PROMOTION_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_PROM_SID: encrypt(this.filters.FLT_PROM_SID),
          FLT_PROM_BRAND_CODE: encrypt(this.filters.FLT_PROM_BRAND_CODE),
          FLT_PROM_CHANNEL_CODE: this.filters.FLT_PROM_CHANNEL_CODE.map((CHANNEL) => encrypt(CHANNEL)),
          FLT_PROM_TYPE_CODE: this.filters.FLT_PROM_TYPE_CODE.map((TYPE) => encrypt(TYPE)),
          FLT_PROM_DATE_START: encrypt(this.filters.FLT_PROM_DATE_START),
          FLT_PROM_DATE_END: encrypt(this.filters.FLT_PROM_DATE_END),
          FLT_PROM_STATUS_CODE: this.filters.FLT_PROM_STATUS_CODE.map((STATUS) => encrypt(STATUS)),
          FLT_PROM_TITLE: encrypt(this.filters.FLT_PROM_TITLE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.promotionList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
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
