import { defineStore } from 'pinia'
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());


const defaultFilters = () => ({
  USER_SID: encrypt(user.value?.USER_SID),
  FLT_WH_CODE: encrypt(''),
  FLT_INCLUDE_INACTIVE: encrypt('0')
});

export const useWaybillDesignStore = defineStore('Waybill-Design', {
  state() {
    return {
      filters: defaultFilters(),
      LogisticList: [] as any[],
    }
  },
  actions: {    
    async fetchLogisticList() {
      const { data }: any = await useAPIFetch('/IS_EU_CHANNEL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.LogisticList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    }
  }
})
