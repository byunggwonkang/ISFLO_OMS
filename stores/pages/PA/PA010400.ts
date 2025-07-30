import { defineStore } from 'pinia'
import {notify} from "notiwind";
const { user } = storeToRefs(useAuthStore());
import { encrypt, decrypt } from '@/stores/common/aes'

export const useSmsSettingsStore = defineStore('sms-settings', {
  state: () => ({
    userGroupBrandList: [] as any[],
    smsList: [] as any[],
    channelList: [] as any,
    smsAgencyList: [] as any,
  }),
  getters: {
    getSmsList: (state) => state.smsList,
    getUserGroupBrandList: (state) => state.userGroupBrandList,
    getChannelList: (state) => state.channelList,
    getSmsAgencyList: (state) => state.smsAgencyList,
  },
  actions: {
    async fetchUserGroupBrandList() {
      const { data }: any = await useAPIFetch('/IS_SA_USERGROUP_BRAND_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.userGroupBrandList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchSmsList() {
      const { data }: any = await useAPIFetch('/IS_PA_SMS_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.smsList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchChannelList() {
      const {data}: any = await useAPIFetch('/IS_PA_CHANNEL_LIST_GET', {
        method: 'post',
        body: {
          FLT_INCLUDE_INACTIVE: encrypt('0'),
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.channelList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchSmsAgencyList() {
      const {data}: any = await useAPIFetch('/IS_SA_SMS_AGENCY_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.smsAgencyList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async saveSmsSettingDetail(formData: any) {
      const { data }: any = await useAPIFetch('/IS_PA_SMS_DETAIL_SET', {
        method: 'post',
        body: {
          ...formData,
          FLT_SMS_SID: encrypt(formData.FLT_SMS_SID),
          FLT_SMS_BRAND_CODE: encrypt(formData.FLT_SMS_BRAND_CODE),
          FLT_SMS_CHANNEL_CODE: encrypt(formData.FLT_SMS_CHANNEL_CODE),
          FLT_SMS_AGENCY_CODE: encrypt(formData.FLT_SMS_AGENCY_CODE),
          FLT_SMS_SALES_TYPE_CODE: encrypt(formData.FLT_SMS_SALES_TYPE_CODE),
          FLT_SMS_SEND_STATUS_CODE: encrypt(formData.FLT_SMS_SEND_STATUS_CODE),
          FLT_SMS_SEND_TIME: encrypt(formData.FLT_SMS_SEND_TIME),
          FLT_SMS_ACTIVE_YN: encrypt(formData.FLT_SMS_ACTIVE_YN),
          FLT_SMS_TEXT: encrypt(formData.FLT_SMS_TEXT),
          FLT_SMS_REMARK: encrypt(formData.FLT_SMS_REMARK),
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
        message: data.value.MSG
      };
    }
  },
});
