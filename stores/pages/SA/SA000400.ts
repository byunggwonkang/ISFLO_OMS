import { defineStore } from 'pinia'
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

export const useCourierSettingsStore = defineStore('courier-settings', {
  state: () => ({
    courierList: [] as any,
    filters: {
      FLT_COURIER_SID: '',
      FLT_INCLUDE_INACTIVE: encrypt('1'),
    }
  }),
  getters: {
    getCourierList: (state: any) => state.courierList,
  },
  actions: {
    async fetchCourierList() {
      const {data}: any = await useAPIFetch('/IS_SA_COURIER_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_COURIER_SID: encrypt(this.filters.FLT_COURIER_SID)
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.courierList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async saveCourierDetail(courierData: any) {
      const { data }: any = await useAPIFetch('/IS_SA_COURIER_DETAIL_SET', {
        method: 'post',
        body: {
          ...courierData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_SAVE_TYPE: encrypt(courierData.FLT_SAVE_TYPE),
          FLT_COURIER_SID: encrypt(courierData.FLT_COURIER_SID),
          FLT_COURIER_SNAME_ENG: encrypt(courierData.FLT_COURIER_SNAME_ENG),
          FLT_COURIER_FNAME_ENG: encrypt(courierData.FLT_COURIER_FNAME_ENG),
          FLT_COURIER_SNAME_KOR: encrypt(courierData.FLT_COURIER_SNAME_KOR),
          FLT_COURIER_FNAME_KOR: encrypt(courierData.FLT_COURIER_FNAME_KOR),
          FLT_COURIER_SNAME_CHN: encrypt(courierData.FLT_COURIER_SNAME_CHN),
          FLT_COURIER_FNAME_CHN: encrypt(courierData.FLT_COURIER_FNAME_CHN),
          FLT_COURIER_SNAME_JPN: encrypt(courierData.FLT_COURIER_SNAME_JPN),
          FLT_COURIER_FNAME_JPN: encrypt(courierData.FLT_COURIER_FNAME_JPN),
          FLT_COURIER_ACTIVE_YN: courierData.FLT_COURIER_ACTIVE_YN ? encrypt('1') : encrypt('0'),
          FLT_COURIER_REMARK: encrypt(courierData.FLT_COURIER_REMARK),
          
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: data.value?.MSG || '',
        }, 4000)

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
