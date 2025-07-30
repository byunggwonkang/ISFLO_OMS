import { defineStore } from 'pinia'
const { user } = storeToRefs(useAuthStore());

export const useStockDetail = defineStore('stock-detail', {
  state() {
    return {
      StockDetailData: {} as any,
    }
  },
  actions: {
    async fetchStockDetail(filters: any) {
      const { data }: any = await useAPIFetch('/IS_WU_ITEM_STOCK_DETAIL_GET', {
        method: 'post',
        body: {
          ...filters,
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.StockDetailData = data.value.RESULT_DATA[0] || {};

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    }
  }
})
