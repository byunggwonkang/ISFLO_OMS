import { defineStore } from 'pinia'
import { encrypt, decrypt } from '@/stores/common/aes'
import {notify} from "notiwind";
import moment from "moment";
const { user } = storeToRefs(useAuthStore());


const defaultFilters = () => ({
  FLT_OUTBOUND_SID: '',
  FLT_OUTBOUND_DATE_FROM: moment().format('YYYY-MM')+'-01',
  FLT_OUTBOUND_DATE_TO: moment().format('YYYY-MM-DD'),
  FLT_OUTBOUND_WH_CODE: '',
  FLT_OUTBOUND_BRAND_CODE: '',
  FLT_OUTBOUND_BRAND_NAME: '',
  FLT_OUTBOUND_STATUS_CODE: '',
  FLT_OUTBOUND_QTY_FROM: '',
  FLT_OUTBOUND_QTY_TO: '',
  FLT_OUTBOUND_VENDOR_SID: '',
  FLT_OUTBOUND_STORE_SID: '',
  FLT_KEY_WORD: '',
});

const defaultVendorfilters = () => ({
  FLT_VENDOR_SID: '',
  FLT_INCLUDE_PURCHASER_YN: '1',
  FLT_INCLUDE_SELLER_YN: '',
  FLT_INCLUDE_INACTIVE: '',
  FLT_KEY_WORD: '',
});

export const useStockOutbound = defineStore('stock-outbound', {
  state() {
    return {
      WHList: [] as any,
      StoreList: [] as any,
      VendorList: [] as any,
      OutboundList: [] as any,
      OutboundDetail: {} as any,
      filters: defaultFilters(),
      Vendorfilters: defaultVendorfilters(),
    }
  },
  actions: {
    clearOutboundList() {
      this.OutboundList = [];
    },
    clearStoreList() {
      this.StoreList = [];
    },
    async fetchOutboundList() {
      const { data }: any = await useAPIFetch('/IS_WU_OUTBOUND_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_OUTBOUND_SID: encrypt(this.filters.FLT_OUTBOUND_SID),
          FLT_OUTBOUND_DATE_FROM: encrypt(this.filters.FLT_OUTBOUND_DATE_FROM),
          FLT_OUTBOUND_DATE_TO: encrypt(this.filters.FLT_OUTBOUND_DATE_TO),
          FLT_OUTBOUND_WH_CODE: encrypt(this.filters.FLT_OUTBOUND_WH_CODE),
          FLT_OUTBOUND_BRAND_CODE: encrypt(this.filters.FLT_OUTBOUND_BRAND_CODE),
          FLT_OUTBOUND_BRAND_NAME: encrypt(this.filters.FLT_OUTBOUND_BRAND_NAME),
          FLT_OUTBOUND_STATUS_CODE: encrypt(this.filters.FLT_OUTBOUND_STATUS_CODE),
          FLT_OUTBOUND_QTY_FROM: encrypt(this.filters.FLT_OUTBOUND_QTY_FROM),
          FLT_OUTBOUND_QTY_TO: encrypt(this.filters.FLT_OUTBOUND_QTY_TO),
          FLT_OUTBOUND_VENDOR_SID: encrypt(this.filters.FLT_OUTBOUND_VENDOR_SID),
          FLT_OUTBOUND_STORE_SID: encrypt(this.filters.FLT_OUTBOUND_STORE_SID),
          FLT_KEY_WORD: encrypt(this.filters.FLT_KEY_WORD),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.OutboundList = data.value.RESULT_DATA;

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
    async fetchOutboundDetail(OUTBOUND_SID: any) {
      const { data }: any = await useAPIFetch('/IS_WU_OUTBOUND_DETAIL_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_OUTBOUND_SID: OUTBOUND_SID,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.OutboundDetail = data.value.RESULT_DATA[0];

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchOutboundDelete(OUTBOUND_SID: any) {
      const { data }: any = await useAPIFetch('/IS_EU_WH_OUTBOUND_DELETE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_OUTBOUND_SID: OUTBOUND_SID,
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
    async fetchOutboundConfirm(OUTBOUND_SID: any) {
      const { data }: any = await useAPIFetch('/IS_EU_WH_OUTBOUND_CONFIRM_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_OUTBOUND_SID: OUTBOUND_SID,
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
    async fetchOutboundSave(OUTBOUND_DATA: any) {
      const { data }: any = await useAPIFetch('/IS_EU_WH_OUTBOUND_DETAIL_SET', {
        method: 'post',
        body: {
          ...OUTBOUND_DATA,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_OUTBOUND_SID: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_SID),  
          FLT_OUTBOUND_WAVE_ID: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_WAVE_ID),  
          FLT_OUTBOUND_WORKING_SYS_CODE: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_WORKING_SYS_CODE),  
          FLT_OUTBOUND_SHIPPING_NO: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_SHIPPING_NO),  
          FLT_OUTBOUND_BATCH_NO: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_BATCH_NO),  
          FLT_OUTBOUND_REQ_DATE: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_REQ_DATE),  
          FLT_OUTBOUND_STORE_SID: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_STORE_SID),  
          FLT_OUTBOUND_VENDOR_SID: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_VENDOR_SID),  
          FLT_OUTBOUND_STATUS_CODE: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_STATUS_CODE),  
          FLT_OUTBOUND_STATUS_FNAME: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_STATUS_FNAME),  
          FLT_OUTBOUND_BRAND_CODE: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_BRAND_CODE),  
          FTL_OUTBOUND_BRAND_FNAME: encrypt(OUTBOUND_DATA.FTL_OUTBOUND_BRAND_FNAME),  
          FLT_OUTBOUND_WH_CODE: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_WH_CODE),  
          FLT_OUTBOUND_ETC_DATA_01: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_ETC_DATA_01),  
          FLT_OUTBOUND_ETC_DATA_02: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_ETC_DATA_02),  
          FLT_OUTBOUND_REMARK: encrypt(OUTBOUND_DATA.FLT_OUTBOUND_REMARK),  
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
