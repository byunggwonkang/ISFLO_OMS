import { defineStore } from 'pinia'
import {notify} from "notiwind";

const { user } = storeToRefs(useAuthStore());

const getDefaultFilters = () => ({
  USER_SID: user.value?.USER_SID,
  FLT_CREATE_DATE_FROM: '',
  FLT_CREATE_DATE_TO: '',
  FLT_UPDATE_DATE_FROM: '',
  FLT_UPDATE_DATE_TO: '',
  FLT_BRAND_CODE: '',
  FLT_PROD_BRAND_CODE: '',
  FLT_CHANNEL_CODE: '',
  FLT_PROD_SNAME: '',
  FLT_PROD_CATEGORY_LVL1: '',
  FLT_PROD_CATEGORY_LVL2: '',
  FLT_PROD_STATUS_CODE: '',
  FLT_ITEM_SNAME: '',
  FLT_ITEM_CODE: '',
});

const getDefaultSummaryFilters = () => ({
  USER_SID: user.value?.USER_SID,
  FLT_PROD_STATUS_CODE: '',
  FLT_PROD_BRAND_CODE: '',
  FLT_PROD_CHANNEL_CODE: '',
  FLT_PROD_SNAME: '',
  FLT_ITEM_SNAME: '',
  FLT_ITEM_CODE: ''
});

export const useProductSettingByChannelStore = defineStore('product-setting-by-channel', {
  state:() => ({
    filters: getDefaultFilters(),
    summaryFilters: getDefaultSummaryFilters(),
    productSummaryList: [] as any[],
  }),
  getters: {
    getProductSummaryList: (state) => state.productSummaryList,
  },
  actions: {
    async fetchProductSummaryList() {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_SUMMARY_LIST_GET', {
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

      this.productSummaryList = data.value?.RESULT_DATA;

      return {
        success: true,
        message: data.value?.MSG,
        data: data.value?.RESULT_DATA
      }
    },
    async fetchProductSummaryDetailList() {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_SUMMARY_DETAIL_LIST_GET', {
        method: 'post',
        body: {
          ...this.summaryFilters
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG,
          data: null
        }
      }

      return {
        success: true,
        message: data.value?.MSG,
        data: data.value?.RESULT_DATA
      }
    },
    async productStatusChange(formData: object) {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_STATUS_CHANGE_SET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          ...formData
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG,
          data: null
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG,
        data: data.value?.RESULT_DATA
      }
    },
    resetFilters() {
      this.filters = getDefaultFilters();
    },
  }
});
