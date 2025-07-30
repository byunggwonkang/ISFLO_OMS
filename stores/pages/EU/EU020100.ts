import { defineStore } from 'pinia'
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());


const defaultFilters = () => ({
  FLT_WH_CODE: '',
  FLT_ITEM_CODE: '',
  FLT_KEY_WORD: '',
  FLT_STOCK_FROM: '1',
  FLT_STOCK_TO: '',
  WH_BRAND_FNAME: '',
});

export const useStockManagement = defineStore('stock-management', {
  state() {
    return {
      WHList: [] as any,
      StockList: [] as any,
      filters: defaultFilters(),
    }
  },
  actions: {
    clearStockList() {
      this.StockList = [];
    },
    async fetchStockList() {
      const { data }: any = await useAPIFetch('/IS_EU_ITEM_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_WH_CODE: encrypt(this.filters.FLT_WH_CODE),
          FLT_ITEM_CODE: encrypt(this.filters.FLT_ITEM_CODE),
          FLT_KEY_WORD: encrypt(this.filters.FLT_KEY_WORD),
          FLT_STOCK_FROM: encrypt(this.filters.FLT_STOCK_FROM),
          FLT_STOCK_TO: encrypt(this.filters.FLT_STOCK_TO),
          WH_BRAND_FNAME: encrypt(this.filters.WH_BRAND_FNAME),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.StockList = data.value.RESULT_DATA;

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
    }
  }
})
