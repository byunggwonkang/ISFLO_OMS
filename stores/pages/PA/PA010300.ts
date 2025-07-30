import { defineStore } from 'pinia'
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'

const { user } = storeToRefs(useAuthStore());

export const useRetailCalenderSettingsStore = defineStore('retail-calender-settings', {
  state: () => ({
    retailCalenderList: [] as any,
    filters: {
      FLT_CALENDAR_YEAR: moment().format('YYYY'),
    }
  }),
  getters: {
    getRetailCalenderList: (state: any) => state.retailCalenderList,
  },
  actions: {
    async fetchRetailCalenderList() {
      const {data}: any = await useAPIFetch('/IS_PA_R_CALENDAR_LIST_GET', {
        method: 'post',
        body: {
          FLT_CALENDAR_YEAR: encrypt(this.filters.FLT_CALENDAR_YEAR.toString()),
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.retailCalenderList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    }
  }
});
