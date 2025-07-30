import { defineStore } from 'pinia'
import { encrypt, decrypt } from '@/stores/common/aes'
import {notify} from "notiwind";
import moment from "moment";
const { user } = storeToRefs(useAuthStore());


const defaultFilters = () => ({
  FLT_INBOUND_SID: '',
  FLT_INBOUND_DATE_FROM: moment().format('YYYY-MM')+'-01',
  FLT_INBOUND_DATE_TO: moment().format('YYYY-MM-DD'),
  FLT_INBOUND_WH_CODE: '',
  FLT_INBOUND_BRAND_CODE: '',
  FLT_INBOUND_BRAND_FNAME: '',
  FLT_INBOUND_STATUS_CODE: '',
  FLT_INBOUND_QTY_FROM: '',
  FLT_INBOUND_QTY_TO: '',
  FLT_INBOUND_VENDOR_SID: '',
  FLT_KEY_WORD: '',
});

const defaultVendorfilters = () => ({
  FLT_VENDOR_SID: '',
  FLT_INCLUDE_PURCHASER_YN: '1',
  FLT_INCLUDE_SELLER_YN: '',
  FLT_INCLUDE_INACTIVE: '',
  FLT_KEY_WORD: '',
});

export const useStockInbound = defineStore('stock-inbound', {
  state() {
    return {
      WHList: [] as any,
      VendorList: [] as any,
      InboundList: [] as any,
      InboundDetail: {} as any,
      filters: defaultFilters(),
      Vendorfilters: defaultVendorfilters(),
    }
  },
  actions: {
    clearInboundList() {
      this.InboundList = [];
    },
    async fetchInboundList() {
      const { data }: any = await useAPIFetch('/IS_WU_INBOUND_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_INBOUND_SID: encrypt(this.filters.FLT_INBOUND_SID),
          FLT_INBOUND_DATE_FROM: encrypt(this.filters.FLT_INBOUND_DATE_FROM),
          FLT_INBOUND_DATE_TO: encrypt(this.filters.FLT_INBOUND_DATE_TO),
          FLT_INBOUND_WH_CODE: encrypt(this.filters.FLT_INBOUND_WH_CODE),
          FLT_INBOUND_BRAND_CODE: encrypt(this.filters.FLT_INBOUND_BRAND_CODE),
          FLT_INBOUND_BRAND_FNAME: encrypt(this.filters.FLT_INBOUND_BRAND_FNAME),
          FLT_INBOUND_STATUS_CODE: encrypt(this.filters.FLT_INBOUND_STATUS_CODE),
          FLT_INBOUND_QTY_FROM: encrypt(this.filters.FLT_INBOUND_QTY_FROM),
          FLT_INBOUND_QTY_TO: encrypt(this.filters.FLT_INBOUND_QTY_TO),
          FLT_INBOUND_VENDOR_SID: encrypt(this.filters.FLT_INBOUND_VENDOR_SID),
          FLT_KEY_WORD: encrypt(this.filters.FLT_KEY_WORD),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.InboundList = data.value.RESULT_DATA;

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
    async fetchInboundDetail(INBOUND_SID: any) {
      const { data }: any = await useAPIFetch('/IS_WU_INBOUND_DETAIL_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_INBOUND_SID: INBOUND_SID,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.InboundDetail = data.value.RESULT_DATA[0];

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchInboundDelete(INBOUND_SID: any) {
      const { data }: any = await useAPIFetch('/IS_EU_WH_INBOUND_DELETE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_INBOUND_SID: INBOUND_SID,
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
    async fetchInboundConfirm(INBOUND_SID: any) {
      const { data }: any = await useAPIFetch('/IS_EU_WH_INBOUND_CONFIRM_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_INBOUND_SID: INBOUND_SID,
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
    async fetchInboundSave(INBOUND_DATA: any) {
      const { data }: any = await useAPIFetch('/IS_EU_WH_INBOUND_DETAIL_SET', {
        method: 'post',
        body: {
          ...INBOUND_DATA,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_INBOUND_SID: encrypt(INBOUND_DATA.FLT_INBOUND_SID),  
          FLT_INBOUND_WAVE_ID: encrypt(INBOUND_DATA.FLT_INBOUND_WAVE_ID),  
          FLT_INBOUND_WORKING_SYS_CODE: encrypt(INBOUND_DATA.FLT_INBOUND_WORKING_SYS_CODE),  
          FLT_INBOUND_INVOICE_NO: encrypt(INBOUND_DATA.FLT_INBOUND_INVOICE_NO),  
          FLT_INBOUND_BATCH_NO: encrypt(INBOUND_DATA.FLT_INBOUND_BATCH_NO),  
          FLT_INBOUND_REQ_DATE: encrypt(INBOUND_DATA.FLT_INBOUND_REQ_DATE),  
          FLT_INBOUND_VENDOR_SID: encrypt(INBOUND_DATA.FLT_INBOUND_VENDOR_SID),  
          FLT_INBOUND_STATUS_CODE: encrypt(INBOUND_DATA.FLT_INBOUND_STATUS_CODE),  
          FLT_INBOUND_STATUS_FNAME: encrypt(INBOUND_DATA.FLT_INBOUND_STATUS_FNAME),  
          FLT_INBOUND_BRAND_CODE: encrypt(INBOUND_DATA.FLT_INBOUND_BRAND_CODE),  
          FTL_INBOUND_BRAND_FNAME: encrypt(INBOUND_DATA.FTL_INBOUND_BRAND_FNAME),  
          FLT_INBOUND_WH_CODE: encrypt(INBOUND_DATA.FLT_INBOUND_WH_CODE),  
          FLT_INBOUND_ETC_DATA_01: encrypt(INBOUND_DATA.FLT_INBOUND_ETC_DATA_01),  
          FLT_INBOUND_ETC_DATA_02: encrypt(INBOUND_DATA.FLT_INBOUND_ETC_DATA_02),  
          FLT_INBOUND_REMARK: encrypt(INBOUND_DATA.FLT_INBOUND_REMARK),  
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
