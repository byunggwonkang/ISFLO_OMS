import { defineStore } from 'pinia'
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

export const usePrintDetail = defineStore('print-detail', {
  state() {
    return {
      StockDetailData: {} as any,
    }
  },
  actions: {
    async fetchWaybillGet(filters: any) {
      const { data }: any = await useAPIFetch('/IS_WU_WAYBILL_GET', {
        method: 'post',
        body: {
          ...filters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(filters.FLT_STATION_USER_SID),
          FLT_REQUEST_COUNT: encrypt(filters.FLT_REQUEST_COUNT)
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }
      
      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchWaybillAddSet(filters: any) {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_WAYBILL_ADD_SET', {
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
      
      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchWaybillChange(filters: any) {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_WAYBILL_CHANGE_SET', {
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
      
      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    }
  }
})
