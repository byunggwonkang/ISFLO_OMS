import { defineStore } from 'pinia'
import {notify} from "notiwind";
const { user } = storeToRefs(useAuthStore());
import { encrypt, decrypt } from '@/stores/common/aes'

export const useGeneralCodeSettingsStore = defineStore('general-code-settings', {
  state: () => ({
    commonGroupList: [] as any,
    commonList: [] as any,
    filters: {
      FLT_GROUP_CODE: '',
      FLT_INCLUDE_INACTIVE: encrypt("1"),
    }
  }),
  getters: {
    getCommonGroupList: (state: any) => state.commonGroupList,
  },
  actions: {
    async fetchCommonGroupList() {
      const {data}: any = await useAPIFetch('/IS_PA_COMMON_GROUP_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_INCLUDE_INACCESSABLE : encrypt("0")
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.commonGroupList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchCommonList() {
      const {data}: any = await useAPIFetch('/IS_PA_COMMON_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_GROUP_CODE: encrypt(this.filters.FLT_GROUP_CODE),
          USER_SID: encrypt(user.value?.USER_SID)
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.commonList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async saveCommonData(commonData: any) {
      const { data }: any = await useAPIFetch('/IS_PA_COMMON_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),     
          FLT_SAVE_TYPE: encrypt(commonData.FLT_SAVE_TYPE),  
          FLT_GROUP_CODE: encrypt(commonData.FLT_GROUP_CODE),  
          FLT_COMM_CODE: encrypt(commonData.FLT_COMM_CODE),  
          FLT_COMM_SNAME_ENG: encrypt(commonData.FLT_COMM_SNAME_ENG),  
          FLT_COMM_FNAME_ENG: encrypt(commonData.FLT_COMM_FNAME_ENG),  
          FLT_COMM_SNAME_KOR: encrypt(commonData.FLT_COMM_SNAME_KOR),  
          FLT_COMM_FNAME_KOR: encrypt(commonData.FLT_COMM_FNAME_KOR),  
          FLT_COMM_SNAME_CHN: encrypt(commonData.FLT_COMM_SNAME_CHN),  
          FLT_COMM_FNAME_CHN: encrypt(commonData.FLT_COMM_FNAME_CHN),  
          FLT_COMM_SNAME_JPN: encrypt(commonData.FLT_COMM_SNAME_JPN),  
          FLT_COMM_FNAME_JPN: encrypt(commonData.FLT_COMM_FNAME_JPN),  
          FLT_GLOBAL_CODE: encrypt(commonData.FLT_GLOBAL_CODE),  
          FLT_COMM_ACTIVE: commonData.FLT_COMM_ACTIVE ? encrypt("1") : encrypt("0"),
          FLT_COMM_SEQ: encrypt(commonData.FLT_COMM_SEQ),  
          FLT_COMM_REMARK:  encrypt(commonData.FLT_COMM_REMARK),  
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: data.value?.MSG,
        }, 4000);

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
