import { defineStore } from 'pinia'
import moment from "moment";
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'

const { user } = storeToRefs(useAuthStore());

export const useHolidaySettingsStore = defineStore('holiday-settings', {
  state: () => ({
    holidayList: [] as any,
    filters: {
      FLT_HOLIDAY_YEAR: moment().format('YYYY'),
      FLT_HOLIDAY_DATE: '',
    }
  }),
  getters: {
    getHolidayList: (state: any) => state.holidayList,
  },
  actions: {
    async fetchHolidayList() {
      const {data}: any = await useAPIFetch('/IS_PA_HOLIDAY_HQ_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_HOLIDAY_YEAR: encrypt(this.filters.FLT_HOLIDAY_YEAR.toString()),
          FLT_HOLIDAY_DATE: encrypt(this.filters.FLT_HOLIDAY_DATE),
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.holidayList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async saveHolidaySettings(formData: any) {
      const {data}: any = await useAPIFetch('/IS_PA_HOLIDAY_HQ_SAVE_SET', {
        method: 'post',
        body: {
          FLT_HOLIDAY_YEAR: encrypt(formData.FLT_HOLIDAY_YEAR),
          FLT_HOLIDAY_MONTH: encrypt(formData.FLT_HOLIDAY_MONTH),
          FLT_HOLIDAY_DAY: encrypt(formData.FLT_HOLIDAY_DAY),
          FLT_HOLIDAY_TYPE_CODE: encrypt(formData.FLT_HOLIDAY_TYPE_CODE),
          FLT_HOLIDAY_TITLE: encrypt(formData.FLT_HOLIDAY_TITLE),
          FLT_HOLIDAY_REMARK: encrypt(formData.FLT_HOLIDAY_REMARK),
          USER_SID: encrypt(user.value?.USER_SID),
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
        message: data.value?.MSG || ''
      };
    },
    async deleteHolidaySettings(date: string) {
      const {data}: any = await useAPIFetch('/IS_PA_HOLIDAY_HQ_DELETE_SET', {
        method: 'post',
        body: {
          FLT_HOLIDAY_DATE: encrypt(date),
          USER_SID: encrypt(user.value?.USER_SID),
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
        message: data.value?.MSG || ''
      };
    }
  }
});
