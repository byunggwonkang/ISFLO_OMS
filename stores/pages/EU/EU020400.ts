import { defineStore } from 'pinia'
import { encrypt, decrypt } from '@/stores/common/aes'
import {notify} from "notiwind";
import moment from "moment";
const { user } = storeToRefs(useAuthStore());


const defaultFilters = () => ({
  FLT_ADJUST_TRANS_CODE: '',
  FLT_ADJUST_TRANS_FROM_DATE: moment().format('YYYY-MM')+'-01',
  FLT_ADJUST_TRANS_TO_DATE: moment().format('YYYY-MM-DD'),
  FLT_ADJUST_WH_CODE: '',
  FLT_ADJUST_STATUS_CODE: '',
  FLT_ADJUST_BATCH_NO: '',
  FLT_ADJUST_TRANS_10_YN: '',
  FLT_ADJUST_TRANS_10_REASON_CODE: '',
  FLT_ADJUST_TRANS_20_YN: '',
  FLT_ADJUST_TRANS_20_REASON_CODE: '',
  FLT_ADJUST_TRANS_30_YN: '',
  FLT_ADJUST_TRANS_30_FROM_WH_CODE: '',
  FLT_ADJUST_TRANS_40_YN: '',
  FLT_ADJUST_TRANS_40_TO_WH_CODE: '',
  FLT_ADJUST_TRANS_50_YN: '',
  FLT_ADJUST_TRANS_50_FROM_STORE_SID: '',
  FLT_ADJUST_TRANS_60_YN: '',
  FLT_ADJUST_TRANS_60_FROM_VENDOR_SID: '',
  FLT_ADJUST_TRANS_70_YN: '',
  FLT_ADJUST_TRANS_70_TO_VENDOR_SID: '',
  FLT_ADJUST_BRAND_FNAME: '',
});

const defaultVendorfilters = () => ({
  FLT_VENDOR_SID: '',
  FLT_INCLUDE_PURCHASER_YN: '1',
  FLT_INCLUDE_SELLER_YN: '',
  FLT_INCLUDE_INACTIVE: '',
  FLT_KEY_WORD: '',
});

export const useStockAdjustment = defineStore('stock-adjust', {
  state() {
    return {
      WHList: [] as any,
      StoreList: [] as any,
      PopStoreList: [] as any,
      VendorList: [] as any,
      PopVendorList: [] as any,
      AdjustmentList: [] as any,
      AdjustmentDetail: {} as any,
      filters: defaultFilters(),
      Vendorfilters: defaultVendorfilters(),
    }
  },
  actions: {
    clearAdjustmentList() {
      this.AdjustmentList = [];
    },
    clearStoreList() {
      this.StoreList = [];
    },
    clearPopStoreList() {
      this.PopStoreList = [];
    },
    async fetchAdjustmentList() {
      const { data }: any = await useAPIFetch('/IS_EU_WH_STOCK_ADJUST_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_ADJUST_TRANS_CODE: encrypt(this.filters.FLT_ADJUST_TRANS_CODE),
          FLT_ADJUST_TRANS_FROM_DATE: encrypt(this.filters.FLT_ADJUST_TRANS_FROM_DATE),
          FLT_ADJUST_TRANS_TO_DATE: encrypt(this.filters.FLT_ADJUST_TRANS_TO_DATE),
          FLT_ADJUST_WH_CODE: encrypt(this.filters.FLT_ADJUST_WH_CODE),
          FLT_ADJUST_STATUS_CODE: encrypt(this.filters.FLT_ADJUST_STATUS_CODE),
          FLT_ADJUST_BATCH_NO: encrypt(this.filters.FLT_ADJUST_BATCH_NO),
          FLT_ADJUST_TRANS_10_YN: encrypt(this.filters.FLT_ADJUST_TRANS_10_YN),
          FLT_ADJUST_TRANS_10_REASON_CODE: encrypt(this.filters.FLT_ADJUST_TRANS_10_REASON_CODE),
          FLT_ADJUST_TRANS_20_YN: encrypt(this.filters.FLT_ADJUST_TRANS_20_YN),
          FLT_ADJUST_TRANS_20_REASON_CODE: encrypt(this.filters.FLT_ADJUST_TRANS_20_REASON_CODE),
          FLT_ADJUST_TRANS_30_YN: encrypt(this.filters.FLT_ADJUST_TRANS_30_YN),
          FLT_ADJUST_TRANS_30_FROM_WH_CODE: encrypt(this.filters.FLT_ADJUST_TRANS_30_FROM_WH_CODE),
          FLT_ADJUST_TRANS_40_YN: encrypt(this.filters.FLT_ADJUST_TRANS_40_YN),
          FLT_ADJUST_TRANS_40_TO_WH_CODE: encrypt(this.filters.FLT_ADJUST_TRANS_40_TO_WH_CODE),
          FLT_ADJUST_TRANS_50_YN: encrypt(this.filters.FLT_ADJUST_TRANS_50_YN),
          FLT_ADJUST_TRANS_50_FROM_STORE_SID: encrypt(this.filters.FLT_ADJUST_TRANS_50_FROM_STORE_SID),
          FLT_ADJUST_TRANS_60_YN: encrypt(this.filters.FLT_ADJUST_TRANS_60_YN),
          FLT_ADJUST_TRANS_60_FROM_VENDOR_SID: encrypt(this.filters.FLT_ADJUST_TRANS_60_FROM_VENDOR_SID),
          FLT_ADJUST_TRANS_70_YN: encrypt(this.filters.FLT_ADJUST_TRANS_70_YN),
          FLT_ADJUST_TRANS_70_TO_VENDOR_SID: encrypt(this.filters.FLT_ADJUST_TRANS_70_TO_VENDOR_SID),
          FLT_ADJUST_BRAND_FNAME: encrypt(this.filters.FLT_ADJUST_BRAND_FNAME),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.AdjustmentList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchWHList() {
      const { data }: any = await useAPIFetch('/IS_EU_WAREHOUSE_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.WHList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchStoreList(BRAND_CODE: any) {
      const { data }: any = await useAPIFetch('/IS_PA_STORE_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STORE_CODE: encrypt(''),
          FLT_BRAND_CODE: BRAND_CODE,
          FLT_STORE_SNAME: encrypt(''),
          FLT_INCLUDE_INACTIVE: encrypt('0'),
          FLT_OPEN_FROM_DATE: encrypt(''),
          FLT_OPEN_TO_DATE: encrypt('')
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.StoreList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchPopStoreList(BRAND_CODE: any) {
      const { data }: any = await useAPIFetch('/IS_PA_STORE_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STORE_CODE: encrypt(''),
          FLT_BRAND_CODE: BRAND_CODE,
          FLT_STORE_SNAME: encrypt(''),
          FLT_INCLUDE_INACTIVE: encrypt('0'),
          FLT_OPEN_FROM_DATE: encrypt(''),
          FLT_OPEN_TO_DATE: encrypt('')
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.PopStoreList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchVendorList() {
      const { data }: any = await useAPIFetch('/IS_WU_VENDOR_LIST_GET', {
        method: 'post',
        body: {
          ...this.Vendorfilters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_VENDOR_SID: encrypt(this.Vendorfilters.FLT_VENDOR_SID),
          FLT_INCLUDE_PURCHASER_YN: encrypt(this.Vendorfilters.FLT_INCLUDE_PURCHASER_YN),
          FLT_INCLUDE_SELLER_YN: encrypt(this.Vendorfilters.FLT_INCLUDE_SELLER_YN),
          FLT_INCLUDE_INACTIVE: encrypt(this.Vendorfilters.FLT_INCLUDE_INACTIVE),
          FLT_KEY_WORD: encrypt(this.Vendorfilters.FLT_KEY_WORD),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.VendorList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchPopVendorList() {
      const { data }: any = await useAPIFetch('/IS_WU_VENDOR_LIST_GET', {
        method: 'post',
        body: {
          ...this.Vendorfilters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_VENDOR_SID: encrypt(this.Vendorfilters.FLT_VENDOR_SID),
          FLT_INCLUDE_PURCHASER_YN: encrypt(this.Vendorfilters.FLT_INCLUDE_PURCHASER_YN),
          FLT_INCLUDE_SELLER_YN: encrypt(this.Vendorfilters.FLT_INCLUDE_SELLER_YN),
          FLT_INCLUDE_INACTIVE: encrypt(this.Vendorfilters.FLT_INCLUDE_INACTIVE),
          FLT_KEY_WORD: encrypt(this.Vendorfilters.FLT_KEY_WORD),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.PopVendorList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchAdjustmentDetail(ADJUST_DATA: any) {
      const { data }: any = await useAPIFetch('/IS_EU_WH_STOCK_ADJUST_DETAIL_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          ...ADJUST_DATA
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.AdjustmentDetail = data.value.RESULT_DATA[0];

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchAdjustmentDelete(ADJUST_DATA: any) {
      const { data }: any = await useAPIFetch('/IS_EU_WH_STOCK_ADJUST_DELETE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          ...ADJUST_DATA
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
    async fetchAdjustmentConfirm(ADJUST_DATA: any) {
      const { data }: any = await useAPIFetch('/IS_EU_WH_STOCK_ADJUST_CONFIRM_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          ...ADJUST_DATA
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
    async fetchAdjustmentSave(ADJUST_DATA: any) {
      const { data }: any = await useAPIFetch('/IS_EU_WH_STOCK_ADJUST_DETAIL_SET', {
        method: 'post',
        body: {
          ...ADJUST_DATA,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STOCK_ADJUST_SID: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_SID),
          FLT_STOCK_ADJUST_WORKING_SYS_CODE: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_WORKING_SYS_CODE),
          FLT_STOCK_ADJUST_WH_CODE: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_WH_CODE),
          FLT_STOCK_ADJUST_BRAND_CODE: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_BRAND_CODE),
          FLT_STOCK_ADJUST_BRAND_FNAME: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_BRAND_FNAME),
          FLT_STOCK_ADJUST_BATCH_NO: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_BATCH_NO),
          FLT_STOCK_ADJUST_ETC_DATA_01: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_ETC_DATA_01),
          FLT_STOCK_ADJUST_ETC_DATA_02: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_ETC_DATA_02),
          FLT_STOCK_ADJUST_REQ_DATE: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_REQ_DATE),
          FLT_STOCK_ADJUST_STATUS_CODE: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_STATUS_CODE),
          FLT_STOCK_ADJUST_STATUS_FNAME: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_STATUS_FNAME),
          FLT_STOCK_ADJUST_REMARK: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_REMARK),
          FLT_STOCK_ADJUST_TRANS_CODE: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_TRANS_CODE),
          FLT_STOCK_ADJUST_TRANS_DATA_01: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_TRANS_DATA_01),
          FLT_STOCK_ADJUST_TRANS_DATA_02: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_TRANS_DATA_02),
          FLT_STOCK_ADJUST_TRANS_DATA_03: encrypt(ADJUST_DATA.FLT_STOCK_ADJUST_TRANS_DATA_03),
          
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
    }
  }
})
