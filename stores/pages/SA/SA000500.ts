import { defineStore } from 'pinia'
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

export const useAgencySettingsStore = defineStore('sms-agency-settings', {
  state: () => ({
    agencyList: [] as any,
    filters: {
      FLT_SMS_AGENCY_SID: '',
      FLT_INCLUDE_INACTIVE: encrypt('1'),
    }
  }),
  getters: {
    getAgencyList: (state: any) => state.agencyList,
  },
  actions: {
    async fetchAgencyList() {
      const {data}: any = await useAPIFetch('/IS_SA_SMS_AGENCY_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_SMS_AGENCY_SID:  encrypt(this.filters.FLT_SMS_AGENCY_SID),
          USER_SID: encrypt(user.value?.USER_SID)
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.agencyList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async saveAgencyDetail(smsAgencyData: any) {
      const { data }: any = await useAPIFetch('/IS_SA_SMS_AGENCY_DETAIL_SET', {
        method: 'post',
        body: {
          ...smsAgencyData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_SAVE_TYPE: encrypt(smsAgencyData.FLT_SAVE_TYPE),
          FLT_AGENCY_SID: encrypt(smsAgencyData.FLT_AGENCY_SID),
          FLT_AGENCY_SNAME_ENG: encrypt(smsAgencyData.FLT_AGENCY_SNAME_ENG),
          FLT_AGENCY_FNAME_ENG: encrypt(smsAgencyData.FLT_AGENCY_FNAME_ENG),
          FLT_AGENCY_SNAME_KOR: encrypt(smsAgencyData.FLT_AGENCY_SNAME_KOR),
          FLT_AGENCY_FNAME_KOR: encrypt(smsAgencyData.FLT_AGENCY_FNAME_KOR),
          FLT_AGENCY_SNAME_CHN: encrypt(smsAgencyData.FLT_AGENCY_SNAME_CHN),
          FLT_AGENCY_FNAME_CHN: encrypt(smsAgencyData.FLT_AGENCY_FNAME_CHN),
          FLT_AGENCY_SNAME_JPN: encrypt(smsAgencyData.FLT_AGENCY_SNAME_JPN),
          FLT_AGENCY_FNAME_JPN: encrypt(smsAgencyData.FLT_AGENCY_FNAME_JPN),
          FLT_AGENCY_VALUE_01: encrypt(smsAgencyData.FLT_AGENCY_VALUE_01),
          FLT_AGENCY_VALUE_02: encrypt(smsAgencyData.FLT_AGENCY_VALUE_02),
          FLT_AGENCY_VALUE_03: encrypt(smsAgencyData.FLT_AGENCY_VALUE_03),
          FLT_AGENCY_VALUE_04: encrypt(smsAgencyData.FLT_AGENCY_VALUE_04),
          FLT_AGENCY_VALUE_05: encrypt(smsAgencyData.FLT_AGENCY_VALUE_05),
          FLT_AGENCY_VALUE_06: encrypt(smsAgencyData.FLT_AGENCY_VALUE_06),
          FLT_AGENCY_VALUE_07: encrypt(smsAgencyData.FLT_AGENCY_VALUE_07),
          FLT_AGENCY_VALUE_08: encrypt(smsAgencyData.FLT_AGENCY_VALUE_08),
          FLT_AGENCY_VALUE_09: encrypt(smsAgencyData.FLT_AGENCY_VALUE_09),
          FLT_AGENCY_VALUE_10: encrypt(smsAgencyData.FLT_AGENCY_VALUE_10),
          FLT_AGENCY_ACTIVE_YN: smsAgencyData.FLT_AGENCY_ACTIVE_YN ? encrypt('1') : encrypt('0'),
          FLT_AGENCY_REMARK: encrypt(smsAgencyData.FLT_AGENCY_REMARK),
          
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
    },
  }
})
